import React from 'react'
import { Link } from 'react-router-dom'
import Button from '../design-system/components/Button'
import Card from '../design-system/components/Card'
import ThemeToggleButton from '../components/ThemeToggleButton'

const FEATURES = [
  {
    title: 'Practice Problems',
    description: 'A curated set of coding tracks to build problem-solving speed and confidence.',
  },
  {
    title: 'Mock Assessments',
    description: 'Track test status, score, and weak topics with readiness contribution insights.',
  },
  {
    title: 'Progress Analytics',
    description: 'See ATS score, readiness trend, and recommendations in one clean dashboard.',
  },
]

export default function LandingPage() {
  return (
    <div className="kpb-page" style={{ minHeight: '100vh' }}>
      <header style={{ borderBottom: '1px solid var(--kpb-border)', background: 'var(--kpb-surface)' }}>
        <div className="kpb-page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 20, paddingBottom: 20 }}>
          <div className="kpb-brand">Placement Prep</div>
          <div style={{ display: 'flex', gap: 10 }}>
            <ThemeToggleButton />
            <Link to="/" style={{ textDecoration: 'none' }}>
              <Button variant="ghost">Home</Button>
            </Link>
            <Link to="/dashboard" style={{ textDecoration: 'none' }}>
              <Button variant="primary">Open Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="kpb-page-container" style={{ paddingTop: 48, paddingBottom: 24 }}>
          <div className="kpb-grid-2" style={{ alignItems: 'center' }}>
            <div>
              <h1 className="kpb-page-title" style={{ marginBottom: 12 }}>Placement readiness, built like a real SaaS product</h1>
              <p className="kpb-page-subtitle" style={{ maxWidth: 620, marginBottom: 18 }}>
                Parse resume, track assessments, manage applications, and improve interview readiness with a consistent workflow.
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                  <Button variant="primary">Get Started</Button>
                </Link>
                <Link to="/analyze" style={{ textDecoration: 'none' }}>
                  <Button variant="secondary">Analyze JD</Button>
                </Link>
              </div>
            </div>

            <Card>
              <div style={{ display: 'grid', gap: 10 }}>
                <div className="kpb-kv-item"><span className="kpb-kv-label">ATS Score:</span> 82</div>
                <div className="kpb-kv-item"><span className="kpb-kv-label">Readiness:</span> 74</div>
                <div className="kpb-kv-item"><span className="kpb-kv-label">Assessments Completed:</span> 6/10</div>
                <div className="kpb-progress-track" style={{ marginTop: 6 }}>
                  <div className="kpb-progress-fill" style={{ width: '74%' }} />
                </div>
                <p className="kpb-text-muted" style={{ margin: 0 }}>Live progress preview from your dashboard metrics.</p>
              </div>
            </Card>
          </div>
        </section>

        <section className="kpb-page-container" style={{ paddingTop: 8, paddingBottom: 40 }}>
          <div style={{ marginBottom: 12 }}>
            <h2 className="kpb-card-title" style={{ fontSize: '20px' }}>Core Features</h2>
          </div>
          <div className="kpb-grid-3">
            {FEATURES.map((feature) => (
              <Card key={feature.title}>
                <h3 className="kpb-card-title" style={{ marginBottom: 8 }}>{feature.title}</h3>
                <p className="kpb-text-muted" style={{ fontSize: 14 }}>{feature.description}</p>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <footer style={{ borderTop: '1px solid var(--kpb-border)', background: 'var(--kpb-surface)' }}>
        <div className="kpb-page-container" style={{ paddingTop: 16, paddingBottom: 16 }}>
          <p className="kpb-text-muted" style={{ margin: 0, textAlign: 'center' }}>
            Copyright {new Date().getFullYear()} Placement Readiness Platform
          </p>
        </div>
      </footer>
    </div>
  )
}
