import React from 'react'
import Card from './Card'

export default function SectionCard({ title, right = null, children, className = '' }) {
  return (
    <Card className={className}>
      {(title || right) ? (
        <div className="kpb-card-header">
          {title ? <h3 className="kpb-card-title">{title}</h3> : <span />}
          {right}
        </div>
      ) : null}
      <div className="kpb-card-content">{children}</div>
    </Card>
  )
}

