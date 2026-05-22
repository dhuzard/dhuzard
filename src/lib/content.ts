import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'

// ---------------------------------------------------------------------------
// Type definitions
// ---------------------------------------------------------------------------

export interface ProfileLinks {
  website: string
  linkedin: string
  twitter: string
  orcid: string
  github: string
}

export interface Profile {
  name: string
  degree: string
  title: string
  tagline: string
  bio: string
  links: ProfileLinks
}

export interface Experience {
  id: string
  role: string
  company: string
  url?: string
  period: string
  description: string
  tags: string[]
}

export interface ExpertiseDomain {
  domain: string
  icon: string
  skills: string[]
}

export interface Talk {
  id: string
  title: string
  event: string
  date: string
  location: string
  type: 'keynote' | 'talk' | 'poster' | string
  abstract: string
  slides_url: string
  recording_url: string
  tags: string[]
}

export interface Paper {
  title: string
  authors: string[]
  journal: string
  year: number
  doi?: string
  url?: string
  orcid_put_code?: number
  citation_count?: number
}

export interface PapersFile {
  orcid: string
  last_synced: string
  works: Paper[]
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const contentDir = path.join(process.cwd(), 'content')

function readYaml<T>(filename: string): T {
  const filePath = path.join(contentDir, filename)
  const raw = fs.readFileSync(filePath, 'utf-8')
  return yaml.load(raw) as T
}

// ---------------------------------------------------------------------------
// Exported content accessors
// ---------------------------------------------------------------------------

export function getProfile(): Profile {
  return readYaml<Profile>('profile.yaml')
}

export function getExperience(): Experience[] {
  return readYaml<Experience[]>('experience.yaml')
}

export function getExpertise(): ExpertiseDomain[] {
  return readYaml<ExpertiseDomain[]>('expertise.yaml')
}

export function getTalks(): Talk[] {
  const talks = readYaml<Talk[]>('talks.yaml')
  return talks.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

export function getPapers(): Paper[] {
  const data = readYaml<PapersFile>('papers.yaml')
  const works = data.works ?? []
  return works.sort((a, b) => b.year - a.year)
}
