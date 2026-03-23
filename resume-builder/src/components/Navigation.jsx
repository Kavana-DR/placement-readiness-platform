import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import '../styles/navigation.css'

export default function Navigation() {
  const location = useLocation()
  const navigate = useNavigate()
  const basePath = '/resume-builder'
  const normalizedPath = location.pathname.replace(/\/+$/, '') || '/'
  const isHome = normalizedPath === basePath
  const isBuilder = normalizedPath === `${basePath}/builder`
  const isPreview = normalizedPath === `${basePath}/preview`

  return (
    <nav className="app-navigation">
      <div className="nav-container">
        <div className="nav-logo" onClick={() => navigate(basePath)}>
          AI Resume Builder
        </div>
        
        {!isHome && (
          <div className="nav-links">
            <button 
              className={`nav-link ${isBuilder ? 'active' : ''}`}
              onClick={() => navigate(`${basePath}/builder`)}
            >
              Builder
            </button>
            <button 
              className={`nav-link ${isPreview ? 'active' : ''}`}
              onClick={() => navigate(`${basePath}/preview`)}
            >
              Preview
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
