import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/home.css'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-headline">Build a Resume That Gets Read.</h1>
        <p className="home-subheadline">Craft your resume with AI precision, get real-time feedback, and boost your chances of landing an interview.</p>
        <button 
          className="btn-cta"
          onClick={() => navigate('/builder')}
        >
          Start Building
        </button>
      </div>
    </div>
  )
}
