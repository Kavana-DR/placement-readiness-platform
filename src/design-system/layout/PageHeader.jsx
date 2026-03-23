import React from 'react'
import '../design-system.css'

export default function PageHeader({ title, subtitle = '', right = null }) {
  return (
    <div className="kpb-page-header">
      <div>
        <h1 className="kpb-page-title">{title}</h1>
        {subtitle ? <p className="kpb-page-subtitle">{subtitle}</p> : null}
      </div>
      {right ? <div>{right}</div> : null}
    </div>
  )
}

