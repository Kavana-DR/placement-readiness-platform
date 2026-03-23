import React from 'react'
import SectionCard from './SectionCard'

export default function ProgressCard({ title, valueLabel, percent = 0, children, right = null }) {
  const safePercent = Math.max(0, Math.min(100, percent))

  return (
    <SectionCard title={title} right={right}>
      {valueLabel ? <div className="kpb-text-muted" style={{ marginBottom: 8 }}>{valueLabel}</div> : null}
      <div className="kpb-progress-track" style={{ marginBottom: 8 }}>
        <div className="kpb-progress-fill" style={{ width: `${safePercent}%` }} />
      </div>
      {children}
    </SectionCard>
  )
}

