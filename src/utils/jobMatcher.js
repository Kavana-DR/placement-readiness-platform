import { PARSED_RESUME_STORAGE_KEY } from './internshipRecommendations'

const RESUME_FORM_STORAGE_KEY = 'resumeBuilderData'

function safeJsonParse(raw, fallback) {
  if (!raw) return fallback
  try {
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

function normalizeSkill(skill = '') {
  return String(skill).trim().toLowerCase()
}

function uniqueSkills(skills = []) {
  return [...new Set((skills || []).map(normalizeSkill).filter(Boolean))]
}

export function getUserSkillsFromStorage(storage = localStorage) {
  const parsedResume = safeJsonParse(storage.getItem(PARSED_RESUME_STORAGE_KEY), {})
  const resumeSkills = Array.isArray(parsedResume.skills) ? parsedResume.skills : []

  const form = safeJsonParse(storage.getItem(RESUME_FORM_STORAGE_KEY), {})
  const formSkillsByCategory = form.skillsByCategory || {}
  const formSkills = [
    ...(formSkillsByCategory.technical || []),
    ...(formSkillsByCategory.soft || []),
    ...(formSkillsByCategory.tools || []),
  ]
  const legacySkills = String(form.skills || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  return uniqueSkills([...resumeSkills, ...formSkills, ...legacySkills])
}

export function calculateMatchScore(userSkills = [], jobSkills = []) {
  const normalizedUserSkills = new Set(uniqueSkills(userSkills))
  const normalizedJobSkills = uniqueSkills(jobSkills)

  if (normalizedJobSkills.length === 0) {
    return {
      matchedSkills: [],
      matchedCount: 0,
      requiredCount: 0,
      score: 0,
    }
  }

  const matchedSkills = normalizedJobSkills.filter((skill) => normalizedUserSkills.has(skill))
  const score = Math.round((matchedSkills.length / normalizedJobSkills.length) * 100)

  return {
    matchedSkills,
    matchedCount: matchedSkills.length,
    requiredCount: normalizedJobSkills.length,
    score,
  }
}

export function formatPostedLabel(postedAt) {
  const postedTime = new Date(postedAt).getTime()
  if (!postedTime) return 'Recently'
  const now = Date.now()
  const diffHours = Math.max(1, Math.floor((now - postedTime) / (1000 * 60 * 60)))
  if (diffHours < 24) return `${diffHours}h ago`
  const days = Math.floor(diffHours / 24)
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  return `${months}mo ago`
}

export function getRecommendedJobs({
  jobs = [],
  userSkills = [],
  typeFilter = 'All',
  modeFilter = 'All',
  minMatch = 0,
  sortBy = 'highest_match',
  query = '',
  limit = 12,
} = {}) {
  const normalizedQuery = String(query || '').trim().toLowerCase()

  const matched = jobs.map((job) => {
    const match = calculateMatchScore(userSkills, job.skills || [])
    return {
      ...job,
      matchScore: match.score,
      matchedSkills: match.matchedSkills,
      matchedCount: match.matchedCount,
      requiredCount: match.requiredCount,
      postedLabel: formatPostedLabel(job.postedAt),
      recommended: match.score >= 50,
      highlyRecommended: match.score >= 70,
    }
  })

  const filtered = matched
    .filter((job) => typeFilter === 'All' || job.type === typeFilter)
    .filter((job) => modeFilter === 'All' || job.workMode === modeFilter)
    .filter((job) => job.matchScore >= minMatch)
    .filter((job) => {
      if (!normalizedQuery) return true
      return [job.title, job.company, job.location, ...(job.skills || [])]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery)
    })

  const sorted = filtered.sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
    }
    return b.matchScore - a.matchScore || new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
  })

  return sorted.slice(0, limit)
}

