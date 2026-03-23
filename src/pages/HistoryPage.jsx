import React from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle } from 'lucide-react'
import Button from '../design-system/components/Button'
import SectionCard from '../design-system/components/SectionCard'
import StatCard from '../design-system/components/StatCard'
import PageContainer from '../design-system/layout/PageContainer'
import PageHeader from '../design-system/layout/PageHeader'
import { getHistory, deleteEntry, clearHistory, getLoadError } from '../utils/historyManager'

export default function HistoryPage() {
  const [history, setHistory] = React.useState(() => getHistory())
  const loadError = getLoadError()
  const navigate = useNavigate()

  const handleDelete = (id) => {
    if (window.confirm('Delete this entry?')) {
      deleteEntry(id)
      setHistory((prev) => prev.filter((entry) => entry.id !== id))
    }
  }

  const handleClear = () => {
    if (window.confirm('Clear all history? This cannot be undone.')) {
      clearHistory()
      setHistory([])
    }
  }

  return (
    <PageContainer>
      <PageHeader
        title="Analysis History"
        subtitle="Review, revisit, and manage your previous JD analyses."
        right={history.length > 0 ? <Button variant="danger" onClick={handleClear}>Clear All</Button> : null}
      />

      <div className="kpb-grid-stats" style={{ marginBottom: 16 }}>
        <StatCard label="Total Analyses" value={history.length} />
        <StatCard label="Latest Score" value={history[0]?.finalScore || history[0]?.readinessScore || 0} />
        <StatCard label="Best Score" value={history.reduce((max, entry) => Math.max(max, entry.finalScore || entry.readinessScore || 0), 0)} />
        <StatCard label="Load Status" value={loadError ? 'Warning' : 'Healthy'} />
      </div>

      {loadError ? (
        <div style={{ marginBottom: 16 }}>
          <SectionCard>
            <div style={{ display: 'flex', gap: 10 }}>
              <AlertCircle size={18} style={{ color: '#d97706', marginTop: 2, flexShrink: 0 }} />
              <div>
                <h3 className="kpb-card-title" style={{ marginBottom: 4 }}>Data Loading Issue</h3>
                <p className="kpb-text-muted" style={{ margin: 0 }}>{loadError}</p>
              </div>
            </div>
          </SectionCard>
        </div>
      ) : null}

      {history.length === 0 ? (
        <SectionCard>
          <div className="kpb-empty-state">
            <p style={{ marginTop: 0, marginBottom: 10 }}>No analyses yet.</p>
            <Button variant="primary" onClick={() => navigate('/analyze')}>Create Your First Analysis</Button>
          </div>
        </SectionCard>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {history.map((entry) => (
            <SectionCard key={entry.id}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => navigate(`/results/${entry.id}`)} role="button" tabIndex={0}>
                  <h3 className="kpb-card-title" style={{ marginBottom: 4 }}>{entry.company || 'Unknown Company'}</h3>
                  <p className="kpb-text-muted" style={{ margin: 0 }}>{entry.role || 'Unknown Role'}</p>
                  <p className="kpb-text-muted" style={{ marginTop: 4 }}>{new Date(entry.createdAt).toLocaleDateString()}</p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ textAlign: 'center' }}>
                    <div className="kpb-stat-value" style={{ fontSize: 24 }}>{entry.finalScore || entry.readinessScore || 0}</div>
                    <div className="kpb-text-muted">Score</div>
                  </div>

                  <div style={{ display: 'grid', gap: 8 }}>
                    <Button variant="primary" size="small" onClick={() => navigate(`/results/${entry.id}`)}>View</Button>
                    <Button variant="danger" size="small" onClick={() => handleDelete(entry.id)}>Delete</Button>
                  </div>
                </div>
              </div>
            </SectionCard>
          ))}
        </div>
      )}
    </PageContainer>
  )
}
