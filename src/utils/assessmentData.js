import { dispatchAppDataUpdated } from './appEvents'

export const ASSESSMENTS_STORAGE_KEY = 'prp_assessments'

const DEFAULT_ASSESSMENTS = [
  {
    id: 'dsa-mock-1',
    name: 'DSA Mock Test 1',
    category: 'DSA',
    platform: 'LeetCode',
    type: 'Mock Test',
    difficulty: 'Intermediate',
    link: 'https://leetcode.com/problem-list/top-interview-questions/',
    description: 'Solve a timed set of top coding interview questions.',
    status: 'not_started',
    score: 0,
    accuracy: 0,
    weakTopics: ['Dynamic Programming', 'Graphs'],
    lastAttemptAt: null,
  },
  {
    id: 'aptitude-quant-1',
    name: 'Aptitude Quant Drill',
    category: 'Aptitude',
    platform: 'IndiaBix',
    type: 'Aptitude Test',
    difficulty: 'Beginner',
    link: 'https://www.indiabix.com/aptitude/questions-and-answers/',
    description: 'Practice placement aptitude questions by topic and difficulty.',
    status: 'not_started',
    score: 0,
    accuracy: 0,
    weakTopics: ['Percentages', 'Time and Work'],
    lastAttemptAt: null,
  },
  {
    id: 'system-design-lite',
    name: 'System Design Lite',
    category: 'System Design',
    platform: 'System Design Primer',
    type: 'Design Drill',
    difficulty: 'Advanced',
    link: 'https://github.com/donnemartin/system-design-primer',
    description: 'Attempt core design prompts and evaluate architecture trade-offs.',
    status: 'not_started',
    score: 0,
    accuracy: 0,
    weakTopics: ['Caching', 'Rate Limiting'],
    lastAttemptAt: null,
  },
  {
    id: 'interview-behavioral',
    name: 'Behavioral Interview Set',
    category: 'Interview Prep',
    platform: 'Pramp',
    type: 'Live Mock',
    difficulty: 'Intermediate',
    link: 'https://www.pramp.com/',
    description: 'Attend mock interviews and practice structured behavioral answers.',
    status: 'not_started',
    score: 0,
    accuracy: 0,
    weakTopics: ['STAR Method', 'Conflict Stories'],
    lastAttemptAt: null,
  },
]

const DEFAULT_ASSESSMENT_BY_ID = DEFAULT_ASSESSMENTS.reduce((acc, item) => {
  acc[item.id] = item
  return acc
}, {})

function safeJsonParse(raw, fallback) {
  if (!raw) return fallback
  try {
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

function normalizeStatus(status) {
  if (status === 'completed' || status === 'in_progress' || status === 'not_started') return status
  return 'not_started'
}

function normalizeAssessment(item = {}) {
  const defaults = DEFAULT_ASSESSMENT_BY_ID[item.id] || {}
  return {
    id: String(item.id || defaults.id || `assessment-${Math.random().toString(16).slice(2)}`),
    name: String(item.name || defaults.name || 'Untitled Assessment'),
    category: String(item.category || defaults.category || 'General'),
    platform: String(item.platform || defaults.platform || 'Assessment Platform'),
    type: String(item.type || defaults.type || 'Mock Test'),
    difficulty: String(item.difficulty || defaults.difficulty || 'Intermediate'),
    link: String(item.link || defaults.link || ''),
    description: String(item.description || defaults.description || ''),
    status: normalizeStatus(item.status),
    score: Number.isFinite(item.score) ? Math.max(0, Math.min(100, item.score)) : 0,
    accuracy: Number.isFinite(item.accuracy) ? Math.max(0, Math.min(100, item.accuracy)) : 0,
    weakTopics: Array.isArray(item.weakTopics) ? item.weakTopics.filter(Boolean) : [],
    lastAttemptAt: item.lastAttemptAt || null,
  }
}

export function getAssessments(storage = localStorage) {
  const parsed = safeJsonParse(storage.getItem(ASSESSMENTS_STORAGE_KEY), null)
  const source = Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_ASSESSMENTS
  return source.map(normalizeAssessment)
}

export function saveAssessments(assessments, storage = localStorage) {
  const normalized = (assessments || []).map(normalizeAssessment)
  storage.setItem(ASSESSMENTS_STORAGE_KEY, JSON.stringify(normalized))
  dispatchAppDataUpdated({ scope: 'assessments', key: ASSESSMENTS_STORAGE_KEY, action: 'save' })
  return normalized
}

export function updateAssessmentAttempt(id, updates = {}, storage = localStorage) {
  const current = getAssessments(storage)
  const next = current.map((item) => {
    if (item.id !== id) return item
    const updated = {
      ...item,
      ...updates,
      status: updates.status || 'completed',
      lastAttemptAt: new Date().toISOString(),
    }
    return normalizeAssessment(updated)
  })
  return saveAssessments(next, storage)
}

export function getAssessmentSummary(storage = localStorage) {
  const assessments = getAssessments(storage)
  const completed = assessments.filter((item) => item.status === 'completed').length
  const inProgress = assessments.filter((item) => item.status === 'in_progress').length
  const avgScore = assessments.length > 0
    ? Math.round(assessments.reduce((acc, item) => acc + item.score, 0) / assessments.length)
    : 0

  return {
    total: assessments.length,
    completed,
    inProgress,
    avgScore,
  }
}
