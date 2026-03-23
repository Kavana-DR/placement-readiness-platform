import React from 'react'
import '../design-system.css'

export default function PageContainer({ children, className = '' }) {
  return (
    <div className="kpb-page">
      <div className={`kpb-page-container ${className}`.trim()}>
        {children}
      </div>
    </div>
  )
}

