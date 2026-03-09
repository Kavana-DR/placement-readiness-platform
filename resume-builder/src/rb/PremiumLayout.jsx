import React from 'react'
import { useLocation } from 'react-router-dom'
import './rb.css'
import {
  getChecklistState,
  getStepStatuses,
  getStoredSubmission,
  isShippedState,
} from '../utils/proofSubmission'

function StatusBadge() {
  const shipped = isShippedState({
    stepStatuses: getStepStatuses(localStorage),
    checklistState: getChecklistState(localStorage),
    submission: getStoredSubmission(localStorage),
  })

  return (
    <div className="pn-status" role="status" aria-live="polite">
      <span className="pn-status-text">{shipped ? 'Shipped' : 'In Progress'}</span>
    </div>
  )
}

function BuildPanel() {
  return (
    <section className="pn-panel" aria-labelledby="build-panel-title">
      <h3 id="build-panel-title">Build Panel</h3>

      <div className="pn-section">
        <label htmlFor="lovable-input">Copy This Into Lovable</label>
        <textarea id="lovable-input" className="pn-textarea" defaultValue={"Describe artifact here..."} aria-label="Lovable content" />
      </div>

      <div className="pn-section">
        <div className="pn-actions">
          <button type="button" className="btn">Copy</button>
          <button type="button" className="btn primary">Build in Lovable</button>
        </div>
      </div>

      <div className="pn-section">
        <div className="pn-actions">
          <button type="button" className="btn">It Worked</button>
          <button type="button" className="btn">Error</button>
          <button type="button" className="btn">Add Screenshot</button>
        </div>
      </div>
    </section>
  )
}

export default function PremiumLayout({ children }) {
  const loc = useLocation()
  const match = loc.pathname.match(/\/rb\/(0[1-8])-/)
  const stepNum = match ? parseInt(match[1], 10) : null

  return (
    <div className="pn-root">
      <header className="pn-topbar">
        <div className="pn-left">AI Resume Builder</div>
        <div className="pn-center">{stepNum ? `Project 3 — Step ${stepNum} of 8` : 'Project 3 — Step X of 8'}</div>
        <div className="pn-right"><StatusBadge /></div>
      </header>

      <div className="pn-content">
        <main className="pn-primary">{children}</main>
        <aside className="pn-secondary">
          <BuildPanel />
        </aside>
      </div>

      <footer className="pn-footer">Proof Footer — Attach screenshots and notes here</footer>
    </div>
  )
}
