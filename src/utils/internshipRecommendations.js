export const PARSED_RESUME_STORAGE_KEY = 'resumeBuilderParsedData'
export const INTERNSHIP_APPLICATIONS_STORAGE_KEY = 'internshipApplications'

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
      jobTitle: entry.jobTitle || entry.title || '',
      company: entry.company || '',
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
      dateApplied: new Date().toISOString(),
    },
  ]

  storage.setItem(INTERNSHIP_APPLICATIONS_STORAGE_KEY, JSON.stringify(next))
  return next
}
