/**
 * Test Checklist Manager
 * Manages the 10-point pre-ship test checklist with localStorage persistence
 */

const CHECKLIST_KEY = 'placement_test_checklist'

const DEFAULT_TESTS = [
  {
    id: 'test-1',
    name: 'JD required validation works',
    hint: 'Go to /analyze, leave JD empty, click Analyze → should see red error'
  },
  {
    id: 'test-2',
    name: 'Short JD warning shows for <200 chars',
    hint: 'Paste JD with ~50 chars → should see amber warning with character count'
  },
  {
    id: 'test-3',
    name: 'Skills extraction groups correctly',
    hint: 'Analyze a JD → check Results Skills tab shows 6+ categories with keywords'
  },
  {
    id: 'test-4',
    name: 'Round mapping changes based on company + skills',
    hint: 'Compare 2 analyses (different company/skills) → Round Mapping should differ'
  },
  {
    id: 'test-5',
    name: 'Score calculation is deterministic',
    hint: 'Analyze same JD twice → both should have same baseScore (±0 variation)'
  },
  {
    id: 'test-6',
    name: 'Skill toggles update score live',
    hint: 'On Results page, toggle skill confidence → finalScore updates immediately'
  },
  {
    id: 'test-7',
    name: 'Changes persist after refresh',
    hint: 'Toggle skill, refresh page → toggle state and score should persist'
  },
  {
    id: 'test-8',
    name: 'History saves and loads correctly',
    hint: 'Create 3 analyses → go to History → all should appear with correct scores'
  },
  {
    id: 'test-9',
    name: 'Export buttons copy the correct content',
    hint: 'On Results page, click "Copy 7-Day Plan" → paste into text editor, verify format'
  },
  {
    id: 'test-10',
    name: 'No console errors on core pages',
    hint: 'Press F12, go through /analyze, /results, /history → Console tab should be clean'
  }
]

/**
 * Initialize checklist from localStorage or create default
 */
export function initializeChecklist() {
  try {
    const stored = localStorage.getItem(CHECKLIST_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (e) {
    console.error('Error loading checklist:', e)
  }

  // Create default checklist with all items unchecked
  const checklist = DEFAULT_TESTS.map(test => ({
    ...test,
    completed: false
  }))

  saveChecklist(checklist)
  return checklist
}

/**
 * Save checklist to localStorage
 */
export function saveChecklist(checklist) {
  try {
    localStorage.setItem(CHECKLIST_KEY, JSON.stringify(checklist))
    return true
  } catch (e) {
    console.error('Error saving checklist:', e)
    return false
  }
}

/**
 * Get current checklist
 */
export function getChecklist() {
  const checklist = initializeChecklist()
  return checklist
}

/**
 * Toggle a test item completion status
 */
export function toggleTest(testId) {
  const checklist = getChecklist()
  const test = checklist.find(t => t.id === testId)
  if (test) {
    test.completed = !test.completed
    saveChecklist(checklist)
  }
  return checklist
}

/**
 * Get completion status
 */
export function getChecklistStatus() {
  const checklist = getChecklist()
  const completed = checklist.filter(t => t.completed).length
  const total = checklist.length
  const isComplete = completed === total

  return {
    completed,
    total,
    isComplete,
    percentage: Math.round((completed / total) * 100)
  }
}

/**
 * Check if all tests are passed (for ship lock)
 */
export function isReadyToShip() {
  const status = getChecklistStatus()
  return status.isComplete
}

/**
 * Reset all tests to unchecked
 */
export function resetChecklist() {
  const checklist = DEFAULT_TESTS.map(test => ({
    ...test,
    completed: false
  }))
  saveChecklist(checklist)
  return checklist
}

/**
 * Get individual test status
 */
export function getTestStatus(testId) {
  const checklist = getChecklist()
  const test = checklist.find(t => t.id === testId)
  return test ? test.completed : false
}
