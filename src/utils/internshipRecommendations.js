import { dispatchAppDataUpdated } from './appEvents'

export const PARSED_RESUME_STORAGE_KEY = 'resumeBuilderParsedData'
export const INTERNSHIP_APPLICATIONS_STORAGE_KEY = 'internshipApplications'
export const SAVED_JOBS_STORAGE_KEY = 'savedJobs'

function normalizeSkill(skill = '') {
  return skill.toLowerCase().trim()
}

function toSkillSet(skills = []) {
  return new Set((skills || []).map(normalizeSkill).filter(Boolean))
}

function safeJsonParse(rawValue, fallbackValue) {
  if (!rawValue) return fallbackValue
  try {
    return JSON.parse(rawValue)
  } catch {
    return fallbackValue
  }
}

export function getResumeSkillsFromStorage(storage = localStorage) {
  const parsedResume = safeJsonParse(storage.getItem(PARSED_RESUME_STORAGE_KEY), null)
  if (!parsedResume || !Array.isArray(parsedResume.skills)) return []
  return parsedResume.skills.filter(Boolean)
}

export function calculateMatchScore(jobSkills = [], resumeSkills = []) {
  const resumeSkillSet = toSkillSet(resumeSkills)
  const normalizedJobSkills = (jobSkills || []).map((skill) => skill.trim()).filter(Boolean)

  if (normalizedJobSkills.length === 0) {
    return { matchedSkills: [], matchedCount: 0, totalJobSkills: 0, matchScore: 0 }
  }

  const matchedSkills = normalizedJobSkills.filter((skill) => resumeSkillSet.has(normalizeSkill(skill)))
  const matchScore = Math.round((matchedSkills.length / normalizedJobSkills.length) * 100)

  return {
    matchedSkills,
    matchedCount: matchedSkills.length,
    totalJobSkills: normalizedJobSkills.length,
    matchScore,
  }
}

export function getRecommendedInternships(jobs = [], resumeSkills = []) {
  return jobs
    .map((job) => {
      const matching = calculateMatchScore(job.skills, resumeSkills)
      return { ...job, ...matching }
    })
    .sort((first, second) => second.matchScore - first.matchScore || second.matchedCount - first.matchedCount)
    .slice(0, 5)
}

export function getStoredApplications(storage = localStorage) {
  const parsed = safeJsonParse(storage.getItem(INTERNSHIP_APPLICATIONS_STORAGE_KEY), [])
  if (!Array.isArray(parsed)) return []

  return parsed
    .map((entry) => ({
      id: entry.id || '',
      jobTitle: entry.jobTitle || entry.title || '',
      company: entry.company || '',
      type: entry.type || '',
      workMode: entry.workMode || '',
      location: entry.location || '',
      applyLink: entry.applyLink || '',
      dateApplied: entry.dateApplied || entry.appliedAt || '',
    }))
    .filter((entry) => entry.jobTitle && entry.company)
}

export function saveInternshipApplication(job, storage = localStorage) {
  const existing = getStoredApplications(storage)
  const alreadyApplied = existing.some(
    (entry) => entry.jobTitle === job.title && entry.company === job.company,
  )
  if (alreadyApplied) return existing

  const next = [
    ...existing,
    {
      jobTitle: job.title,
      company: job.company,
      type: job.type || '',
      workMode: job.workMode || '',
      location: job.location || '',
      applyLink: job.applyLink || '',
      dateApplied: new Date().toISOString(),
    },
  ]

  storage.setItem(INTERNSHIP_APPLICATIONS_STORAGE_KEY, JSON.stringify(next))
  dispatchAppDataUpdated({ scope: 'applications', key: INTERNSHIP_APPLICATIONS_STORAGE_KEY, action: 'save' })
  return next
}

export function getSavedJobs(storage = localStorage) {
  const parsed = safeJsonParse(storage.getItem(SAVED_JOBS_STORAGE_KEY), [])
  if (!Array.isArray(parsed)) return []
  return parsed
    .map((entry) => ({
      id: entry.id || '',
      title: entry.title || entry.jobTitle || '',
      company: entry.company || '',
      dateSaved: entry.dateSaved || entry.savedAt || '',
    }))
    .filter((entry) => entry.title && entry.company)
}

export function toggleSavedJob(job, storage = localStorage) {
  const saved = getSavedJobs(storage)
  const exists = saved.some((entry) => entry.title === job.title && entry.company === job.company)

  const next = exists
    ? saved.filter((entry) => !(entry.title === job.title && entry.company === job.company))
    : [
        ...saved,
        {
          id: job.id || '',
          title: job.title,
          company: job.company,
          dateSaved: new Date().toISOString(),
        },
      ]

  storage.setItem(SAVED_JOBS_STORAGE_KEY, JSON.stringify(next))
  dispatchAppDataUpdated({ scope: 'saved-jobs', key: SAVED_JOBS_STORAGE_KEY, action: exists ? 'delete' : 'save' })
  return next
}
