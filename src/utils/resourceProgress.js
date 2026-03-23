import { dispatchAppDataUpdated } from './appEvents'
import { resources } from '../data/resourcesData'

export const RESOURCE_PROGRESS_STORAGE_KEY = 'prp_resource_progress'

function safeJsonParse(raw, fallback) {
  if (!raw) return fallback
  try {
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

function clampPercent(value) {
  if (!Number.isFinite(value)) return 0
  return Math.max(0, Math.min(100, Math.round(value)))
}

export function getResourceCatalog() {
  return resources
}

export function getResourceProgress(storage = localStorage) {
  const parsed = safeJsonParse(storage.getItem(RESOURCE_PROGRESS_STORAGE_KEY), {})
  return Object.entries(parsed).reduce((acc, [id, pct]) => {
    acc[id] = clampPercent(Number(pct))
    return acc
  }, {})
}

export function updateResourceProgress(id, percent, storage = localStorage) {
  const current = getResourceProgress(storage)
  const next = { ...current, [id]: clampPercent(percent) }
  storage.setItem(RESOURCE_PROGRESS_STORAGE_KEY, JSON.stringify(next))
  dispatchAppDataUpdated({ scope: 'resources', key: RESOURCE_PROGRESS_STORAGE_KEY, action: 'save' })
  return next
}
