/**
 * content-agent.ts
 * Claude-powered CLI for managing CV content files.
 * Run: npm run agent
 * Requires: ANTHROPIC_API_KEY environment variable
 */

import fs from 'fs'
import path from 'path'
import readline from 'readline'
import yaml from 'js-yaml'
import Anthropic from '@anthropic-ai/sdk'

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const MODEL = 'claude-sonnet-4-6'
const CONTENT_DIR = path.join(process.cwd(), 'content')

const FILES = {
  talks: path.join(CONTENT_DIR, 'talks.yaml'),
  papers: path.join(CONTENT_DIR, 'papers.yaml'),
  experience: path.join(CONTENT_DIR, 'experience.yaml'),
  profile: path.join(CONTENT_DIR, 'profile.yaml'),
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function readFile(filePath: string): string {
  return fs.readFileSync(filePath, 'utf-8')
}

function writeFile(filePath: string, content: string): void {
  fs.writeFileSync(filePath, content, 'utf-8')
}

function colorize(str: string, code: number): string {
  return `\x1b[${code}m${str}\x1b[0m`
}

const cyan = (s: string) => colorize(s, 36)
const yellow = (s: string) => colorize(s, 33)
const green = (s: string) => colorize(s, 32)
const dim = (s: string) => colorize(s, 2)
const bold = (s: string) => colorize(s, 1)

function printDiff(original: string, updated: string): void {
  const origLines = original.split('\n')
  const updLines = updated.split('\n')

  // Find where lines diverge
  let firstDiff = 0
  const minLen = Math.min(origLines.length, updLines.length)
  while (firstDiff < minLen && origLines[firstDiff] === updLines[firstDiff]) {
    firstDiff++
  }

  if (firstDiff === minLen && origLines.length === updLines.length) {
    console.log(dim('(no changes)'))
    return
  }

  // Print context + diff (simplified: show added lines in green, removed in yellow)
  const contextStart = Math.max(0, firstDiff - 2)
  const newLines = updLines.slice(firstDiff)

  if (contextStart < firstDiff) {
    for (let i = contextStart; i < firstDiff; i++) {
      console.log(dim(`  ${origLines[i]}`))
    }
  }
  console.log(dim('  ...'))
  for (const line of newLines) {
    console.log(green(`+ ${line}`))
  }
}

// ---------------------------------------------------------------------------
// System prompt for Claude
// ---------------------------------------------------------------------------

function buildSystemPrompt(currentFiles: Record<string, string>): string {
  return `You are a content management assistant for Damien Huzard's personal CV website.
Your job is to parse natural language instructions and produce YAML to add or update CV content.

## Current Content Files

### content/profile.yaml
\`\`\`yaml
${currentFiles.profile}
\`\`\`

### content/experience.yaml
\`\`\`yaml
${currentFiles.experience}
\`\`\`

### content/talks.yaml
\`\`\`yaml
${currentFiles.talks}
\`\`\`

### content/papers.yaml (abbreviated)
\`\`\`yaml
orcid: "0000-0003-4820-7951"
last_synced: "${new Date().toISOString()}"
works: [...]
\`\`\`

## Your Task

When the user describes a change, you MUST respond with a JSON object in this exact format:

{
  "intent": "Brief description of what you understood",
  "file": "talks|papers|experience|profile",
  "action": "append|update|replace",
  "yaml_entry": "The complete YAML snippet to append or replace",
  "explanation": "What this change does"
}

Rules:
- "append": adds a new entry to an array at the end of the file
- "update": replaces an existing entry (by id/orcid_put_code)
- "replace": replaces the entire file content (use only for profile)
- For talks: generate a unique kebab-case id like "talk-neurips-2025"
- For experience: generate a unique kebab-case id
- Dates must be ISO format: "YYYY-MM-DD"
- Talk types must be: keynote, talk, or poster
- Tags should be concise strings in a YAML array: [Tag1, Tag2]
- Do NOT include markdown code fences in yaml_entry - just the raw YAML
- Always include all required fields for the target schema

If the request is unclear or not about CV content, respond with:
{ "error": "reason why the request cannot be processed" }

Always respond with valid JSON only. No extra text.`
}

// ---------------------------------------------------------------------------
// Ask Claude to parse the user's intent
// ---------------------------------------------------------------------------

interface AgentResponse {
  intent: string
  file: keyof typeof FILES
  action: 'append' | 'update' | 'replace'
  yaml_entry: string
  explanation: string
}

interface AgentError {
  error: string
}

async function parseIntent(
  client: Anthropic,
  userMessage: string,
  currentFiles: Record<string, string>
): Promise<AgentResponse | AgentError> {
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 2048,
    system: buildSystemPrompt(currentFiles),
    messages: [{ role: 'user', content: userMessage }],
  })

  const textBlock = response.content.find((b) => b.type === 'text')
  if (!textBlock || textBlock.type !== 'text') {
    return { error: 'No response from model' }
  }

  try {
    const parsed = JSON.parse(textBlock.text)
    return parsed as AgentResponse | AgentError
  } catch {
    return { error: `Could not parse model response: ${textBlock.text.slice(0, 200)}` }
  }
}

// ---------------------------------------------------------------------------
// Apply a change to a file
// ---------------------------------------------------------------------------

function applyChange(
  filePath: string,
  result: AgentResponse
): { original: string; updated: string } {
  const original = readFile(filePath)

  if (result.action === 'replace') {
    return { original, updated: result.yaml_entry }
  }

  if (result.action === 'append') {
    // Parse current content to validate it's valid YAML
    yaml.load(original) // throws if invalid

    // Parse the new entry
    const newEntry = yaml.load(result.yaml_entry)

    // Parse original as array
    const currentArray = yaml.load(original)
    if (!Array.isArray(currentArray)) {
      throw new Error(`Expected array in ${path.basename(filePath)}, got ${typeof currentArray}`)
    }

    const newArray = [...currentArray, newEntry]
    const header = original.match(/^(#[^\n]*\n)*/)?.[0] ?? ''
    const updated = header + yaml.dump(newArray, { lineWidth: 120 })
    return { original, updated }
  }

  if (result.action === 'update') {
    // Parse and replace matching entry
    const currentArray = yaml.load(original)
    if (!Array.isArray(currentArray)) {
      throw new Error(`Expected array in ${path.basename(filePath)}`)
    }

    const newEntry = yaml.load(result.yaml_entry) as Record<string, unknown>
    const id = newEntry.id ?? newEntry.orcid_put_code

    const updated_array = currentArray.map((entry: Record<string, unknown>) => {
      const entryId = entry.id ?? entry.orcid_put_code
      return entryId === id ? newEntry : entry
    })

    const header = original.match(/^(#[^\n]*\n)*/)?.[0] ?? ''
    const updated = header + yaml.dump(updated_array, { lineWidth: 120 })
    return { original, updated }
  }

  return { original, updated: original }
}

// ---------------------------------------------------------------------------
// Interactive prompt
// ---------------------------------------------------------------------------

function prompt(rl: readline.Interface, question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, resolve)
  })
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    console.error('Error: ANTHROPIC_API_KEY environment variable is not set.')
    console.error('Copy .env.example to .env and add your key.')
    process.exit(1)
  }

  const client = new Anthropic({ apiKey })

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  console.log()
  console.log(bold(cyan('  CV Content Agent')))
  console.log(dim('  Powered by Claude ' + MODEL))
  console.log()
  console.log('  Supported actions:')
  console.log(dim('    • add a talk:      "I gave a keynote at EuroBioc 2025 in Vienna on Oct 3rd"'))
  console.log(dim('    • add experience:  "I started a new role as CTO at Metadatapp in 2025"'))
  console.log(dim('    • update profile:  "Update my title to Neuroscientist & Serial Founder"'))
  console.log(dim('    • Type "exit" to quit'))
  console.log()

  while (true) {
    const userInput = await prompt(rl, cyan('> '))

    if (!userInput.trim()) continue
    if (userInput.trim().toLowerCase() === 'exit') break

    console.log()
    process.stdout.write(dim('  Thinking... '))

    // Load current file contents
    const currentFiles: Record<string, string> = {
      profile: readFile(FILES.profile),
      experience: readFile(FILES.experience),
      talks: readFile(FILES.talks),
    }

    let result: AgentResponse | AgentError
    try {
      result = await parseIntent(client, userInput, currentFiles)
    } catch (err) {
      process.stdout.write('\n')
      console.error(yellow(`  Error calling Claude: ${(err as Error).message}`))
      console.log()
      continue
    }

    process.stdout.write('\r' + ' '.repeat(20) + '\r') // clear "Thinking..."

    if ('error' in result) {
      console.log(yellow(`  Could not process: ${result.error}`))
      console.log()
      continue
    }

    // Display what Claude understood
    console.log(bold(`  Intent: `) + result.intent)
    console.log(dim(`  File:   content/${result.file}.yaml (${result.action})`))
    console.log()
    console.log(bold('  Proposed change:'))
    console.log()

    // Show preview of the YAML entry
    const previewLines = result.yaml_entry.split('\n').slice(0, 20)
    for (const line of previewLines) {
      console.log('    ' + green(line))
    }
    if (result.yaml_entry.split('\n').length > 20) {
      console.log(dim('    ... (truncated)'))
    }
    console.log()
    console.log(dim(`  ${result.explanation}`))
    console.log()

    // Confirm
    const answer = await prompt(rl, `  Confirm? ${dim('(y/n)')} `)
    console.log()

    if (answer.trim().toLowerCase() !== 'y') {
      console.log(dim('  Skipped.'))
      console.log()
      continue
    }

    // Apply the change
    const targetFile = FILES[result.file]
    if (!targetFile) {
      console.log(yellow(`  Unknown file: ${result.file}`))
      console.log()
      continue
    }

    try {
      const { original, updated } = applyChange(targetFile, result)

      if (original === updated) {
        console.log(dim('  No changes detected.'))
        console.log()
        continue
      }

      // Show diff
      console.log(bold('  Diff:'))
      printDiff(original, updated)
      console.log()

      writeFile(targetFile, updated)
      console.log(green(`  Saved to content/${result.file}.yaml`))
    } catch (err) {
      console.log(yellow(`  Error applying change: ${(err as Error).message}`))
    }

    console.log()
  }

  rl.close()
  console.log()
  console.log(dim('  Goodbye!'))
  console.log()
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
