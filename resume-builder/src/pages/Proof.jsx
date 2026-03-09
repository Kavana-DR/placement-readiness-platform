import React from 'react'
import '../styles/proof.css'
import {
  CHECKLIST_ITEMS,
  CHECKLIST_STORAGE_KEY,
  FINAL_SUBMISSION_STORAGE_KEY,
  buildFinalSubmissionText,
  getChecklistState,
  getStepStorageKey,
  getStepStatuses,
  getStoredSubmission,
  isShippedState,
  isValidHttpUrl,
} from '../utils/proofSubmission'

function linkErrorMessage(value) {
  if (!value) return 'This link is required.'
  return isValidHttpUrl(value) ? '' : 'Enter a valid http(s) URL.'
}

export default function Proof() {
  const [stepStatuses, setStepStatuses] = React.useState(() => getStepStatuses(localStorage))
  const [checklistState, setChecklistState] = React.useState(() => getChecklistState(localStorage))
  const [submission, setSubmission] = React.useState(() => getStoredSubmission(localStorage))
  const [copyStatus, setCopyStatus] = React.useState('')

  React.useEffect(() => {
    const syncFromStorage = () => {
      setStepStatuses(getStepStatuses(localStorage))
      setChecklistState(getChecklistState(localStorage))
      setSubmission(getStoredSubmission(localStorage))
    }

    window.addEventListener('storage', syncFromStorage)
    return () => window.removeEventListener('storage', syncFromStorage)
  }, [])

  const linkErrors = React.useMemo(
    () => ({
      lovableProject: linkErrorMessage(submission.lovableProject),
      githubRepository: linkErrorMessage(submission.githubRepository),
      deployedUrl: linkErrorMessage(submission.deployedUrl),
    }),
    [submission],
  )

  const shipped = React.useMemo(
    () => isShippedState({ stepStatuses, checklistState, submission }),
    [stepStatuses, checklistState, submission],
  )

  const completedSteps = stepStatuses.filter((step) => step.done).length
  const passedChecklistItems = checklistState.filter(Boolean).length

  const refreshStepStatuses = () => setStepStatuses(getStepStatuses(localStorage))

  const updateSubmission = (field, value) => {
    const next = { ...submission, [field]: value }
    setSubmission(next)
    localStorage.setItem(
      FINAL_SUBMISSION_STORAGE_KEY,
      JSON.stringify({ ...next, updatedAt: new Date().toISOString() }),
    )
  }

  const toggleChecklist = (index) => {
    const next = checklistState.map((current, currentIndex) => (currentIndex === index ? !current : current))
    setChecklistState(next)
    localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(next))
  }

  const toggleStep = (stepNumber) => {
    const key = getStepStorageKey(stepNumber)
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key)
    } else {
      const marker = {
        name: `step-${stepNumber}-completed`,
        source: 'proof-manual',
        updatedAt: new Date().toISOString(),
      }
      localStorage.setItem(key, JSON.stringify(marker))
    }
    refreshStepStatuses()
  }

  const setAllSteps = (done) => {
    stepStatuses.forEach((step) => {
      const key = getStepStorageKey(step.step)
      if (done) {
        const marker = {
          name: `step-${step.step}-completed`,
          source: 'proof-manual',
          updatedAt: new Date().toISOString(),
        }
        localStorage.setItem(key, JSON.stringify(marker))
      } else {
        localStorage.removeItem(key)
      }
    })
    refreshStepStatuses()
  }

  const handleCopyFinalSubmission = async () => {
    if (Object.values(linkErrors).some(Boolean)) {
      setCopyStatus('Fix required links before copying final submission.')
      return
    }

    try {
      await navigator.clipboard.writeText(buildFinalSubmissionText(submission))
      setCopyStatus('Final submission copied.')
    } catch {
      setCopyStatus('Unable to copy automatically.')
    }
  }

  return (
    <div className="proof-container">
      <div className="proof-header">
        <h1>Proof & Submission</h1>
        <p className="proof-subtitle">Validate all requirements before final ship.</p>
        <div className={`proof-status-badge ${shipped ? 'shipped' : 'progress'}`}>
          {shipped ? 'Shipped' : 'In Progress'}
        </div>
        {shipped && <p className="proof-shipped-message">Project 3 Shipped Successfully.</p>}
      </div>

      <div className="proof-content">
        <section className="proof-card">
          <div className="proof-card-head">
            <h2>Step Completion Overview</h2>
            <span>{completedSteps}/8 complete</span>
          </div>
          <div className="proof-step-actions">
            <button type="button" className="proof-btn" onClick={() => setAllSteps(true)}>
              Mark All Done
            </button>
            <button type="button" className="proof-btn" onClick={() => setAllSteps(false)}>
              Clear All
            </button>
          </div>
          <ul className="proof-step-list">
            {stepStatuses.map((step) => (
              <li key={step.step} className={`proof-step-item ${step.done ? 'done' : 'missing'}`}>
                <span className="proof-step-title">{step.label}</span>
                <div className="proof-step-right">
                  <span>{step.done ? 'Done' : 'Missing'}</span>
                  <button
                    type="button"
                    className="proof-btn proof-step-toggle"
                    onClick={() => toggleStep(step.step)}
                  >
                    {step.done ? 'Mark Missing' : 'Mark Done'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="proof-card">
          <div className="proof-card-head">
            <h2>Checklist Lock</h2>
            <span>{passedChecklistItems}/10 passed</span>
          </div>
          <p className="proof-helper-text">Shipped remains locked until all 10 checklist tests are passed.</p>
          <ul className="proof-checklist">
            {CHECKLIST_ITEMS.map((item, index) => (
              <li key={item} className="proof-checklist-item">
                <label>
                  <input
                    type="checkbox"
                    checked={checklistState[index]}
                    onChange={() => toggleChecklist(index)}
                  />
                  <span>{item}</span>
                </label>
              </li>
            ))}
          </ul>
        </section>

        <section className="proof-card">
          <div className="proof-card-head">
            <h2>Artifact Collection</h2>
            <span>Required to ship</span>
          </div>

          <div className="proof-field">
            <label htmlFor="proof-lovable">Lovable Project Link</label>
            <input
              id="proof-lovable"
              type="url"
              value={submission.lovableProject}
              onChange={(event) => updateSubmission('lovableProject', event.target.value)}
              placeholder="https://..."
            />
            {linkErrors.lovableProject && <p className="proof-field-error">{linkErrors.lovableProject}</p>}
          </div>

          <div className="proof-field">
            <label htmlFor="proof-github">GitHub Repository Link</label>
            <input
              id="proof-github"
              type="url"
              value={submission.githubRepository}
              onChange={(event) => updateSubmission('githubRepository', event.target.value)}
              placeholder="https://github.com/..."
            />
            {linkErrors.githubRepository && <p className="proof-field-error">{linkErrors.githubRepository}</p>}
          </div>

          <div className="proof-field">
            <label htmlFor="proof-deployed">Deployed URL</label>
            <input
              id="proof-deployed"
              type="url"
              value={submission.deployedUrl}
              onChange={(event) => updateSubmission('deployedUrl', event.target.value)}
              placeholder="https://..."
            />
            {linkErrors.deployedUrl && <p className="proof-field-error">{linkErrors.deployedUrl}</p>}
          </div>

          <div className="proof-actions">
            <button type="button" className="proof-btn primary" onClick={handleCopyFinalSubmission}>
              Copy Final Submission
            </button>
          </div>
          {copyStatus && <p className="proof-copy-status">{copyStatus}</p>}
        </section>
      </div>
    </div>
  )
}
