import { dispatchAppDataUpdated } from './appEvents'

export const PRACTICE_PROGRESS_STORAGE_KEY = 'prp_practice_progress'

const DEFAULT_PROGRESS = {
  completed: 0,
  total: 10,
  lastTopic: 'Not started',
  weeklySolved: 0,
  weeklyTarget: 20,
  activity: [false, false, false, false, false, false, false], // Mon-Sun
  updatedAt: null,
}

function safeJsonParse(raw, fallback) {
  if (!raw) return fallback
  try {
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

function normalizeProgress(progress = {}) {
  const activity = Array.isArray(progress.activity) ? progress.activity.slice(0, 7) : []
  while (activity.length < 7) activity.push(false)

  return {
    ...DEFAULT_PROGRESS,
    ...progress,
    completed: Number.isFinite(progress.completed) ? Math.max(0, progress.completed) : DEFAULT_PROGRESS.completed,
    total: Number.isFinite(progress.total) && progress.total > 0 ? progress.total : DEFAULT_PROGRESS.total,
    weeklySolved: Number.isFinite(progress.weeklySolved) ? Math.max(0, progress.weeklySolved) : DEFAULT_PROGRESS.weeklySolved,
    weeklyTarget: Number.isFinite(progress.weeklyTarget) && progress.weeklyTarget > 0 ? progress.weeklyTarget : DEFAULT_PROGRESS.weeklyTarget,
    activity: activity.map(Boolean),
  }
}

export function getPracticeProgress(storage = localStorage) {
  const parsed = safeJsonParse(storage.getItem(PRACTICE_PROGRESS_STORAGE_KEY), DEFAULT_PROGRESS)
  return normalizeProgress(parsed)
}

export function savePracticeProgress(progress, storage = localStorage) {
  const normalized = normalizeProgress(progress)
  const next = { ...normalized, updatedAt: new Date().toISOString() }
  storage.setItem(PRACTICE_PROGRESS_STORAGE_KEY, JSON.stringify(next))
  dispatchAppDataUpdated({ scope: 'practice-progress', key: PRACTICE_PROGRESS_STORAGE_KEY })
  return next
}

export function completePracticeTopic(topic = 'General Practice', storage = localStorage) {
  const current = getPracticeProgress(storage)
  const now = new Date()
  const sundayFirst = now.getDay() // Sun = 0
  const mondayFirstIndex = sundayFirst === 0 ? 6 : sundayFirst - 1

  const next = {
    ...current,
    completed: Math.min(current.completed + 1, current.total),
    weeklySolved: current.weeklySolved + 1,
    lastTopic: topic || current.lastTopic,
    activity: current.activity.map((day, index) => (index === mondayFirstIndex ? true : day)),
  }

  return savePracticeProgress(next, storage)
}

export function resetPracticeProgress(storage = localStorage) {
  return savePracticeProgress(DEFAULT_PROGRESS, storage)
}

