export const STEP_COUNT = 8
export const FINAL_SUBMISSION_STORAGE_KEY = 'rb_final_submission'
export const CHECKLIST_STORAGE_KEY = 'rb_checklist_tests'

export const STEP_LABELS = [
  'Step 1 - Problem',
  'Step 2 - Market',
  'Step 3 - Architecture',
  'Step 4 - HLD',
  'Step 5 - LLD',
  'Step 6 - Build',
  'Step 7 - Test',
  'Step 8 - Ship',
]

export const CHECKLIST_ITEMS = [
  'All form sections save to localStorage',
  'Live preview updates in real-time',
  'Template switching preserves data',
  'Color theme persists after refresh',
  'ATS score calculates correctly',
  'Score updates live on edit',
  'Export buttons work (copy/download)',
  'Empty states handled gracefully',
  'Mobile responsive layout works',
  'No console errors on any page',
]

export function getStepStorageKey(step) {
  return `rb_step_${step}_artifact`
}

export function isValidHttpUrl(value) {
  if (!value || !value.trim()) return false
  try {
    const parsed = new URL(value.trim())
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

export function getStepStatuses(storageLike) {
  return Array.from({ length: STEP_COUNT }, (_, index) => {
    const stepNumber = index + 1
    const done = !!storageLike.getItem(getStepStorageKey(stepNumber))
    return {
      step: stepNumber,
      label: STEP_LABELS[index],
      done,
    }
  })
}

export function getChecklistState(storageLike) {
  const raw = storageLike.getItem(CHECKLIST_STORAGE_KEY)
  if (!raw) return Array(CHECKLIST_ITEMS.length).fill(false)

  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return Array(CHECKLIST_ITEMS.length).fill(false)
    return CHECKLIST_ITEMS.map((_, index) => Boolean(parsed[index]))
  } catch {
    return Array(CHECKLIST_ITEMS.length).fill(false)
  }
}

export function getStoredSubmission(storageLike) {
  const raw = storageLike.getItem(FINAL_SUBMISSION_STORAGE_KEY)
  const empty = {
    lovableProject: '',
    githubRepository: '',
    deployedUrl: '',
  }

  if (!raw) return empty

  try {
    const parsed = JSON.parse(raw)
    return {
      lovableProject: parsed?.lovableProject || '',
      githubRepository: parsed?.githubRepository || '',
      deployedUrl: parsed?.deployedUrl || '',
    }
  } catch {
    return empty
  }
}

export function areProofLinksValid(submission) {
  return (
    isValidHttpUrl(submission.lovableProject) &&
    isValidHttpUrl(submission.githubRepository) &&
    isValidHttpUrl(submission.deployedUrl)
  )
}

export function isShippedState({ stepStatuses, checklistState, submission }) {
  const allStepsDone = stepStatuses.every((step) => step.done)
  const allChecklistPassed = checklistState.every(Boolean)
  const linksValid = areProofLinksValid(submission)
  return allStepsDone && allChecklistPassed && linksValid
}

export function buildFinalSubmissionText(submission) {
  return [
    '------------------------------------------',
    'AI Resume Builder — Final Submission',
    '',
    `Lovable Project: ${submission.lovableProject}`,
    `GitHub Repository: ${submission.githubRepository}`,
    `Live Deployment: ${submission.deployedUrl}`,
    '',
    'Core Capabilities:',
    '- Structured resume builder',
    '- Deterministic ATS scoring',
    '- Template switching',
    '- PDF export with clean formatting',
    '- Persistence + validation checklist',
    '------------------------------------------',
  ].join('\n')
}
