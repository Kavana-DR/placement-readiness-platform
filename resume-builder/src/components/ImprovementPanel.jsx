import React from 'react'
import '../styles/improvement-panel.css'

export default function ImprovementPanel({ recommendations }) {
  return (
    <div className="improvement-panel">
      <h3 className="improvement-title">Top 3 Improvements</h3>
      {recommendations && recommendations.length > 0 ? (
        <ul className="improvement-list">
          {recommendations.map((rec, idx) => (
            <li key={idx} className="improvement-item">
              <span className="improvement-number">{idx + 1}</span>
              <span className="improvement-text">{rec}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="improvement-empty">No critical improvements right now.</p>
      )}
    </div>
  )
}
