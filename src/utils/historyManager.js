const HISTORY_KEY = 'placement_history'

export function getHistory() {
  try {
    const data = localStorage.getItem(HISTORY_KEY)
    return data ? JSON.parse(data) : []
  } catch (e) {
    console.error('Error reading history:', e)
    return []
  }
}

export function saveEntry(entry) {
  try {
    const history = getHistory()
    const newEntry = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      ...entry
    }
    history.unshift(newEntry) // newest first
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
    return newEntry.id
  } catch (e) {
    console.error('Error saving entry:', e)
    return null
  }
}

export function getEntryById(id) {
  try {
    const history = getHistory()
    return history.find(e => e.id === id)
  } catch (e) {
    console.error('Error fetching entry:', e)
    return null
  }
}

export function deleteEntry(id) {
  try {
    const history = getHistory()
    const filtered = history.filter(e => e.id !== id)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered))
  } catch (e) {
    console.error('Error deleting entry:', e)
  }
}

export function clearHistory() {
  try {
    localStorage.removeItem(HISTORY_KEY)
  } catch (e) {
    console.error('Error clearing history:', e)
  }
}
