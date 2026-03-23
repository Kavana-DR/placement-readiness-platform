import React from 'react'
import Card from './Card'

export default function StatCard({ label, value, subtext = '', icon = null }) {
  return (
    <Card>
      <div className="kpb-card-header">
        <span className="kpb-stat-label">{label}</span>
        {icon}
      </div>
      <div className="kpb-stat-value">{value}</div>
      {subtext ? <div className="kpb-text-muted">{subtext}</div> : null}
    </Card>
  )
}

