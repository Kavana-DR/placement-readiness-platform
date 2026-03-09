import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import '../styles/navigation.css'

export default function Navigation() {
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/'
  const isBuilder = location.pathname === '/builder'
  const isPreview = location.pathname === '/preview'
  const isProof = location.pathname === '/proof'

  return (
    <nav className="app-navigation">
      <div className="nav-container">
        <div className="nav-logo" onClick={() => navigate('/')}>
          AI Resume Builder
        </div>
        
        {!isHome && (
          <div className="nav-links">
            <button 
              className={`nav-link ${isBuilder ? 'active' : ''}`}
              onClick={() => navigate('/builder')}
            >
              Builder
            </button>
            <button 
              className={`nav-link ${isPreview ? 'active' : ''}`}
              onClick={() => navigate('/preview')}
            >
              Preview
            </button>
            <button 
              className={`nav-link ${isProof ? 'active' : ''}`}
              onClick={() => navigate('/proof')}
            >
              Proof
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
