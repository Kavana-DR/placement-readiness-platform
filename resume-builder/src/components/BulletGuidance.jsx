import React from 'react'
import '../styles/bullet-guidance.css'

export default function BulletGuidance({ suggestions }) {
  if (!suggestions || suggestions.length === 0) {
    return null
  }

  return (
    <div className="bullet-guidance">
      {suggestions.map((suggestion, idx) => (
        <div key={idx} className="guidance-item">
          <span className="guidance-text">{suggestion}</span>
        </div>
      ))}
    </div>
  )
}
