import React from 'react'
import '../styles/score-card.css'

function getScoreLevel(score) {
  if (score <= 40) return 'needs-work'
  if (score <= 70) return 'getting-there'
  return 'strong-resume'
}

function getScoreLabel(level) {
  if (level === 'needs-work') return 'Needs Work'
  if (level === 'getting-there') return 'Getting There'
  return 'Strong Resume'
}

export default function ScoreCard({ score, suggestions }) {
  const scoreLevel = getScoreLevel(score)
  const scoreLabel = getScoreLabel(scoreLevel)

  return (
    <div className="score-card">
      <div className="score-container">
        <div
          className={`score-ring ${scoreLevel}`}
          style={{ '--score': score }}
          role="img"
          aria-label={`ATS score ${score} out of 100`}
        >
          <div className="score-ring-inner">
            <span className="score-number">{score}</span>
            <span className="score-max">/100</span>
          </div>
        </div>

        <p className="score-label">ATS Resume Score</p>
        <p className={`score-status ${scoreLevel}`}>{scoreLabel}</p>
      </div>

      <div className="suggestions">
        <h3 className="suggestions-title">How to Improve</h3>
        {suggestions.length > 0 ? (
          <ul className="suggestions-list">
            {suggestions.map((suggestion, idx) => (
              <li key={idx} className="suggestion-item">
                <span className="suggestion-text">{suggestion}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="suggestion-empty">All major ATS items are covered.</p>
        )}
      </div>
    </div>
  )
}
