/**
 * sync-orcid.ts
 * Fetches publications from the ORCID public API and writes content/papers.yaml.
 * Run: npm run sync:orcid
 */

import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'

const ORCID_ID = '0000-0003-4820-7951'
const BASE_URL = `https://pub.orcid.org/v3.0/${ORCID_ID}`
const PAPERS_PATH = path.join(process.cwd(), 'content', 'papers.yaml')

// ---------------------------------------------------------------------------
// Types from ORCID API (v3.0)
// ---------------------------------------------------------------------------

interface OrcidTitle {
  title?: { value?: string }
}

interface OrcidExternalId {
  'external-id-type'?: string
  'external-id-value'?: string
  'external-id-url'?: { value?: string }
}

interface OrcidContributor {
  'credit-name'?: { value?: string }
}

interface OrcidWork {
  'put-code': number
  title?: OrcidTitle
  'journal-title'?: { value?: string }
  'publication-date'?: { year?: { value?: string } }
  'external-ids'?: { 'external-id'?: OrcidExternalId[] }
  contributors?: { contributor?: OrcidContributor[] }
  url?: { value?: string }
}

interface OrcidWorksResponse {
  group?: Array<{
    'work-summary'?: OrcidWork[]
  }>
}

// ---------------------------------------------------------------------------
// Schema for output papers.yaml
// ---------------------------------------------------------------------------

interface Paper {
  title: string
  authors: string[]
  journal: string
  year: number
  doi?: string
  url?: string
  orcid_put_code: number
  citation_count?: number
}

interface PapersFile {
  orcid: string
  last_synced: string
  works: Paper[]
}

// ---------------------------------------------------------------------------
// Fetch helpers
// ---------------------------------------------------------------------------

async function fetchWithRetry(url: string, retries = 3, delayMs = 1000): Promise<Response> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { Accept: 'application/json' },
      })
      if (res.status === 429) {
        const retryAfter = parseInt(res.headers.get('Retry-After') ?? '5', 10)
        console.warn(`Rate limited. Waiting ${retryAfter}s before retry…`)
        await sleep(retryAfter * 1000)
        continue
      }
      return res
    } catch (err) {
      if (attempt === retries) throw err
      console.warn(`Attempt ${attempt} failed. Retrying in ${delayMs}ms…`)
      await sleep(delayMs * attempt)
    }
  }
  throw new Error(`Failed to fetch ${url} after ${retries} retries`)
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// ---------------------------------------------------------------------------
// Parse ORCID work into our Paper schema
// ---------------------------------------------------------------------------

function parseWork(work: OrcidWork): Paper | null {
  const titleValue = work.title?.title?.value
  if (!titleValue) return null

  const year = parseInt(work['publication-date']?.year?.value ?? '0', 10)
  if (!year) return null

  const extIds = work['external-ids']?.['external-id'] ?? []
  const doiEntry = extIds.find((e) => e['external-id-type'] === 'doi')
  const doi = doiEntry?.['external-id-value']

  const url =
    work.url?.value ??
    (doi ? `https://doi.org/${doi}` : undefined)

  const contributors = work.contributors?.contributor ?? []
  const authors = contributors
    .map((c) => c['credit-name']?.value)
    .filter((name): name is string => Boolean(name))

  const journal = work['journal-title']?.value ?? ''

  return {
    title: titleValue,
    authors,
    journal,
    year,
    ...(doi ? { doi } : {}),
    ...(url ? { url } : {}),
    orcid_put_code: work['put-code'],
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log(`Fetching works for ORCID ${ORCID_ID}…`)

  const res = await fetchWithRetry(`${BASE_URL}/works`)
  if (!res.ok) {
    throw new Error(`ORCID API error: ${res.status} ${res.statusText}`)
  }

  const data: OrcidWorksResponse = (await res.json()) as OrcidWorksResponse
  const groups = data.group ?? []

  console.log(`Found ${groups.length} work groups. Parsing…`)

  const works: Paper[] = []
  for (const group of groups) {
    const summaries = group['work-summary'] ?? []
    // Take first summary per group (the preferred one)
    const first = summaries[0]
    if (!first) continue

    // Fetch full work details for richer contributor data
    try {
      const detailRes = await fetchWithRetry(`${BASE_URL}/work/${first['put-code']}`)
      if (!detailRes.ok) {
        // Fall back to summary
        const parsed = parseWork(first)
        if (parsed) works.push(parsed)
        continue
      }
      const detail: OrcidWork = (await detailRes.json()) as OrcidWork
      const parsed = parseWork(detail)
      if (parsed) works.push(parsed)

      // Be polite to the API
      await sleep(200)
    } catch {
      const parsed = parseWork(first)
      if (parsed) works.push(parsed)
    }
  }

  // Sort by year descending
  works.sort((a, b) => b.year - a.year)

  const papersFile: PapersFile = {
    orcid: ORCID_ID,
    last_synced: new Date().toISOString(),
    works,
  }

  const yamlComment =
    '# This file is managed by scripts/sync-orcid.ts\n# Run: npm run sync:orcid to update\n'
  const yamlContent = yamlComment + yaml.dump(papersFile, { lineWidth: 120 })

  fs.writeFileSync(PAPERS_PATH, yamlContent, 'utf-8')
  console.log(`\nSync complete. ${works.length} papers written to content/papers.yaml`)
  console.log(`Last synced: ${papersFile.last_synced}`)
}

main().catch((err) => {
  console.error('Error:', err)
  process.exit(1)
})
