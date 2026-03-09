import * as mammoth from 'mammoth'
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist'
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

GlobalWorkerOptions.workerSrc = pdfWorker

export const PARSED_RESUME_STORAGE_KEY = 'resumeBuilderParsedData'

const SECTION_ALIASES = {
  skills: ['skills', 'technical skills', 'core skills', 'technologies'],
  education: ['education', 'academic background', 'academics'],
  experience: ['experience', 'work experience', 'employment history', 'professional experience'],
  projects: ['projects', 'project experience', 'personal projects'],
  certifications: ['certifications', 'certificates', 'licenses'],
  achievements: ['achievements', 'accomplishments', 'awards'],
}

const SKILL_DICTIONARY = [
  'Java',
  'Python',
  'JavaScript',
  'React',
  'Node.js',
  'SQL',
  'MongoDB',
  'Git',
  'HTML',
  'CSS',
  'Docker',
  'AWS',
]

const PROJECT_TECH_DICTIONARY = [
  'React',
  'Node.js',
  'Java',
  'Python',
  'MongoDB',
  'SQL',
  'Django',
  'Spring',
  'TensorFlow',
  'XGBoost',
  'Flask',
]

function unique(values = []) {
  const seen = new Set()
  return values.filter((value) => {
    const key = String(value).toLowerCase().trim()
    if (!key || seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function normalizeLine(line = '') {
  return line
    .replace(/\t/g, ' ')
    .replace(/\u2022/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
}

function normalizeText(rawText = '') {
  return rawText
    .replace(/\r/g, '\n')
    .replace(/\u00a0/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function extractEmail(text = '') {
  const match = text.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/)
  return match ? match[0] : ''
}

function extractPhone(text = '') {
  const match = text.match(/(?:\+?\d{1,3}[\s-]?)?(?:\(?\d{3}\)?[\s.-]?)\d{3}[\s.-]?\d{4}/)
  return match ? match[0] : ''
}

function normalizeUrl(url = '') {
  const cleaned = url.trim().replace(/[),.;]+$/, '')
  if (/^https?:\/\//i.test(cleaned)) return cleaned
  return `https://${cleaned}`
}

function extractGithub(text = '') {
  const match = text.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[A-Za-z0-9._-]+/i)
  return match ? normalizeUrl(match[0]) : ''
}

function extractLinkedIn(text = '') {
  const match = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[A-Za-z0-9_-]+/i)
  return match ? normalizeUrl(match[0]) : ''
}

function wordsOnlyLine(line = '') {
  return line
    .replace(/[^A-Za-z .'-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function isPotentialNameLine(line = '') {
  if (!line) return false
  if (/@/.test(line)) return false
  if (/\d/.test(line)) return false

  const cleaned = wordsOnlyLine(line)
  if (!cleaned) return false

  const words = cleaned.split(' ').filter(Boolean)
  if (words.length < 2 || words.length > 4) return false

  return words.every((word) => /^[A-Za-z][A-Za-z'-]*$/.test(word))
}

function detectName(lines = []) {
  const topLines = lines.slice(0, 12)
  for (const rawLine of topLines) {
    const line = normalizeLine(rawLine)
    if (!line) continue
    if (isHeadingLine(line)) continue
    if (isPotentialNameLine(line)) return wordsOnlyLine(line)
  }
  return ''
}

function canonicalizeHeading(line = '') {
  return line
    .toLowerCase()
    .replace(/[:|-]/g, ' ')
    .replace(/[^a-z ]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function resolveHeadingKey(line = '') {
  const normalized = canonicalizeHeading(line)
  for (const [key, aliases] of Object.entries(SECTION_ALIASES)) {
    if (aliases.some((alias) => normalized === alias)) {
      return key
    }
  }
  return null
}

function isHeadingLine(line = '') {
  return Boolean(resolveHeadingKey(line))
}

function splitIntoSections(lines = []) {
  const sections = {
    header: [],
    skills: [],
    education: [],
    experience: [],
    projects: [],
    certifications: [],
    achievements: [],
  }

  let activeSection = 'header'

  for (const rawLine of lines) {
    const line = normalizeLine(rawLine)
    if (!line) continue

    const headingKey = resolveHeadingKey(line)
    if (headingKey) {
      activeSection = headingKey
      continue
    }

    sections[activeSection].push(line)
  }

  return sections
}

function cleanupSectionLines(lines = []) {
  return unique(
    lines
      .map((line) => line.replace(/^[-*]\s*/, '').trim())
      .filter((line) => {
        if (!line) return false
        if (line.length < 2) return false
        if (/^page\s+\d+/i.test(line)) return false
        if (/^[|,:;]+$/.test(line)) return false
        return true
      }),
  )
}

function isLikelyDateLine(line = '') {
  return /(?:19|20)\d{2}/.test(line) || /\b(?:present|current)\b/i.test(line)
}

function mergeEducationLines(lines = []) {
  const merged = []
  for (const current of lines) {
    if (
      merged.length > 0 &&
      isLikelyDateLine(current) &&
      !isLikelyDateLine(merged[merged.length - 1]) &&
      merged[merged.length - 1].length < 140
    ) {
      merged[merged.length - 1] = `${merged[merged.length - 1]} (${current})`
    } else {
      merged.push(current)
    }
  }
  return merged
}

function extractSkillsFromText(text = '') {
  const matched = SKILL_DICTIONARY.filter((skill) => {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\\./g, '[.]?')
    const regex = new RegExp(`(^|[^A-Za-z])${escaped}([^A-Za-z]|$)`, 'i')
    return regex.test(text)
  })
  return unique(matched)
}

function extractProjectTechStack(projectLines = []) {
  const projectText = projectLines.join(' ')
  const matched = PROJECT_TECH_DICTIONARY.filter((tech) => {
    const escaped = tech.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\\./g, '[.]?')
    const regex = new RegExp(`(^|[^A-Za-z])${escaped}([^A-Za-z]|$)`, 'i')
    return regex.test(projectText)
  })
  return unique(matched)
}

function normalizeProjectEntries(lines = []) {
  return unique(
    lines
      .map((line) => {
        const withoutBullet = line.replace(/^[-*]\s*/, '').trim()
        const candidate = withoutBullet.split(/\s[-|:]\s/)[0].trim()
        const words = candidate.split(' ').filter(Boolean)
        if (words.length < 2 || words.length > 12) return ''
        return candidate
      })
      .filter(Boolean),
  )
}

function buildParsedObject(text = '', sections = {}, lines = []) {
  const skillsText = cleanupSectionLines(sections.skills).join(' ')
  const globalText = [skillsText, text].join(' ')

  const skills = extractSkillsFromText(globalText)
  const education = mergeEducationLines(cleanupSectionLines(sections.education))
  const experience = cleanupSectionLines(sections.experience)
  const projectSectionLines = cleanupSectionLines(sections.projects)
  const projects = normalizeProjectEntries(projectSectionLines)
  const projectTechStack = extractProjectTechStack(projectSectionLines)
  const mergedSkills = unique([...skills, ...projectTechStack])

  return {
    name: detectName(lines),
    email: extractEmail(text),
    phone: extractPhone(text),
    github: extractGithub(text),
    linkedin: extractLinkedIn(text),
    skills: mergedSkills,
    education,
    experience,
    projects,
    projectTechStack,
  }
}

export function parseResumeText(rawText = '') {
  const text = normalizeText(rawText)
  const lines = text
    .split('\n')
    .map((line) => normalizeLine(line))
    .filter(Boolean)

  const sections = splitIntoSections(lines)
  return buildParsedObject(text, sections, lines)
}

async function extractTextFromPdf(file) {
  const buffer = await file.arrayBuffer()
  const pdf = await getDocument({ data: buffer }).promise
  const pages = []

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber)
    const content = await page.getTextContent()
    const textItems = content.items
      .map((item) => ({
        text: String(item.str || '').trim(),
        x: item.transform?.[4] ?? 0,
        y: item.transform?.[5] ?? 0,
      }))
      .filter((item) => item.text)

    // Group items into visual lines using Y proximity.
    const rows = []
    for (const item of textItems) {
      const existingRow = rows.find((row) => Math.abs(row.y - item.y) < 2.5)
      if (existingRow) {
        existingRow.items.push(item)
      } else {
        rows.push({ y: item.y, items: [item] })
      }
    }

    const pageLines = rows
      .sort((first, second) => second.y - first.y)
      .map((row) =>
        row.items
          .sort((first, second) => first.x - second.x)
          .map((item) => item.text)
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim(),
      )
      .filter(Boolean)

    pages.push(pageLines.join('\n'))
  }

  return pages.join('\n')
}

async function extractTextFromDocx(file) {
  const buffer = await file.arrayBuffer()
  const result = await mammoth.extractRawText({ arrayBuffer: buffer })
  return result.value || ''
}

export async function parseResumeFile(file) {
  if (!file) throw new Error('Please choose a file to upload.')

  const extension = file.name.toLowerCase().split('.').pop()
  let extractedText = ''

  if (extension === 'pdf') {
    extractedText = await extractTextFromPdf(file)
  } else if (extension === 'docx') {
    extractedText = await extractTextFromDocx(file)
  } else {
    throw new Error('Unsupported file type. Please upload PDF or DOCX.')
  }

  const parsedData = parseResumeText(extractedText)
  saveParsedResumeData(parsedData)
  return parsedData
}

export function saveParsedResumeData(parsedData) {
  localStorage.setItem(PARSED_RESUME_STORAGE_KEY, JSON.stringify(parsedData))
}

export function loadParsedResumeData() {
  const raw = localStorage.getItem(PARSED_RESUME_STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function clearParsedResumeData() {
  localStorage.removeItem(PARSED_RESUME_STORAGE_KEY)
}

function safeArray(value) {
  return Array.isArray(value) ? value : []
}

export function applyParsedDataToFormData(previousFormData, parsedData) {
  if (!parsedData) return previousFormData

  const safeSkills = unique(safeArray(parsedData.skills))
  const safeProjectTechStack = unique(safeArray(parsedData.projectTechStack))
  const safeEducation = safeArray(parsedData.education)
  const safeExperience = safeArray(parsedData.experience)
  const safeProjects = safeArray(parsedData.projects)
  const mergedTechnicalSkills = unique([...safeSkills, ...safeProjectTechStack])
  const mergedToolSkills = unique([...(previousFormData.skillsByCategory?.tools || []), ...safeProjectTechStack])

  return {
    ...previousFormData,
    personalInfo: {
      ...previousFormData.personalInfo,
      name: parsedData.name || previousFormData.personalInfo.name,
      email: parsedData.email || previousFormData.personalInfo.email,
      phone: parsedData.phone || previousFormData.personalInfo.phone,
    },
    education:
      safeEducation.length > 0
        ? safeEducation.map((entry) => ({ school: entry, degree: '', field: '', year: '' }))
        : previousFormData.education,
    experience:
      safeExperience.length > 0
        ? safeExperience.map((entry) => ({ company: '', position: entry, duration: '', description: '' }))
        : previousFormData.experience,
    projects:
      safeProjects.length > 0
        ? safeProjects.map((entry) => ({
            title: entry,
            description: '',
            techStack: [],
            liveUrl: '',
            githubUrl: '',
            link: '',
          }))
        : previousFormData.projects,
    links: {
      ...previousFormData.links,
      github: parsedData.github || previousFormData.links.github,
      linkedin: parsedData.linkedin || previousFormData.links.linkedin,
    },
    skillsByCategory: {
      ...previousFormData.skillsByCategory,
      technical: mergedTechnicalSkills.length > 0 ? mergedTechnicalSkills : previousFormData.skillsByCategory.technical,
      tools: mergedToolSkills.length > 0 ? mergedToolSkills : previousFormData.skillsByCategory.tools,
    },
    skills: mergedTechnicalSkills.length > 0 ? mergedTechnicalSkills.join(', ') : previousFormData.skills,
  }
}
