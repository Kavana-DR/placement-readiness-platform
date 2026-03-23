import { normalizeEntry, safeGetEntry } from './entrySchema'
import { dispatchAppDataUpdated } from './appEvents'

const HISTORY_KEY = 'placement_history'
let loadError = null

export function getLoadError() {
  return loadError
}

export function clearLoadError() {
  loadError = null
}

export function getHistory() {
  try {
    const data = localStorage.getItem(HISTORY_KEY)
    if (!data) return []

    const parsed = JSON.parse(data)
    if (!Array.isArray(parsed)) return []

    // Filter and normalize entries
    const validEntries = parsed
      .map(entry => safeGetEntry(entry))
      .filter(entry => entry !== null)

    // If some entries were corrupted, set notification
    if (validEntries.length < parsed.length) {
      loadError = `${parsed.length - validEntries.length} corrupted entry(ies) were skipped. Create a new analysis to continue.`
    }

    return validEntries
  } catch (e) {
    console.error('Error reading history:', e)
    loadError = 'Error loading analysis history. Some data may be lost.'
    return []
  }
}

export function saveEntry(entry) {
  try {
    if (!entry || typeof entry !== 'object') {
      console.error('Invalid entry provided to saveEntry')
      return null
    }

    const history = getHistory()
    const newEntry = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      skillConfidenceMap: {},
      baseScore: entry.baseScore || 0,
      finalScore: entry.finalScore || entry.readinessScore || 0,
      ...entry
    }

    // Normalize before saving
    const normalized = normalizeEntry(newEntry)
    if (!normalized) {
      console.error('Failed to normalize entry before saving')
      return null
    }

    history.unshift(normalized) // newest first
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
    dispatchAppDataUpdated({ scope: 'history', key: HISTORY_KEY, action: 'save' })
    return normalized.id
  } catch (e) {
    console.error('Error saving entry:', e)
    return null
  }
}

export function getEntryById(id) {
  try {
    const history = getHistory()
    const entry = history.find(e => e.id === id)
    return entry || null
  } catch (e) {
    console.error('Error fetching entry:', e)
    return null
  }
}

export function updateEntry(id, updates) {
  try {
    const history = getHistory()
    const index = history.findIndex(e => e.id === id)
    if (index === -1) {
      console.error('Entry not found:', id)
      return null
    }

    const updated = {
      ...history[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }

    // Normalize before saving
    const normalized = normalizeEntry(updated)
    if (!normalized) {
      console.error('Failed to normalize entry during update')
      return null
    }

    history[index] = normalized
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
    dispatchAppDataUpdated({ scope: 'history', key: HISTORY_KEY, action: 'update' })
    return normalized
  } catch (e) {
    console.error('Error updating entry:', e)
    return null
  }
}

export function deleteEntry(id) {
  try {
    const history = getHistory()
    const filtered = history.filter(e => e.id !== id)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered))
    dispatchAppDataUpdated({ scope: 'history', key: HISTORY_KEY, action: 'delete' })
  } catch (e) {
    console.error('Error deleting entry:', e)
  }
}

export function clearHistory() {
  try {
    localStorage.removeItem(HISTORY_KEY)
    clearLoadError()
    dispatchAppDataUpdated({ scope: 'history', key: HISTORY_KEY, action: 'clear' })
  } catch (e) {
    console.error('Error clearing history:', e)
  }
}
