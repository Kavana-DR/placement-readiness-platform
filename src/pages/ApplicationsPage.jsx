import React from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../design-system/components/Button'
import SectionCard from '../design-system/components/SectionCard'
import StatCard from '../design-system/components/StatCard'
import PageContainer from '../design-system/layout/PageContainer'
import PageHeader from '../design-system/layout/PageHeader'
import { getStoredApplications } from '../utils/internshipRecommendations'
import { APP_DATA_UPDATED_EVENT } from '../utils/appEvents'

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000
const NOW_TS = Date.now()

export default function ApplicationsPage() {
  const [applications, setApplications] = React.useState(() => getStoredApplications())
  const navigate = useNavigate()

  React.useEffect(() => {
    const syncFromStorage = () => setApplications(getStoredApplications())
    window.addEventListener('storage', syncFromStorage)
    window.addEventListener(APP_DATA_UPDATED_EVENT, syncFromStorage)
    return () => {
      window.removeEventListener('storage', syncFromStorage)
      window.removeEventListener(APP_DATA_UPDATED_EVENT, syncFromStorage)
    }
  }, [])

  const sorted = applications
    .slice()
    .sort((a, b) => new Date(b.dateApplied).getTime() - new Date(a.dateApplied).getTime())

  const thisWeekCount = sorted.filter((item) => {
    const applied = new Date(item.dateApplied).getTime()
    const weekAgo = NOW_TS - ONE_WEEK_MS
    return applied >= weekAgo
  }).length

  return (
    <PageContainer>
      <PageHeader
        title="Applied Internships"
        subtitle="Track all jobs and internships you have already applied to."
      />

      <div className="kpb-grid-stats" style={{ marginBottom: 16 }}>
        <StatCard label="Total Applied" value={sorted.length} />
        <StatCard label="Applied This Week" value={thisWeekCount} />
        <StatCard label="Most Recent" value={sorted[0] ? new Date(sorted[0].dateApplied).toLocaleDateString() : 'N/A'} />
        <StatCard label="Source" value="Local Data" />
      </div>

      {sorted.length === 0 ? (
        <SectionCard>
          <div className="kpb-empty-state">
            <p style={{ marginTop: 0, marginBottom: 10 }}>No applications yet. Apply from Job Recommendations on the dashboard.</p>
            <Button variant="primary" onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
          </div>
        </SectionCard>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {sorted.map((application) => (
            <SectionCard key={`${application.jobTitle}-${application.company}-${application.dateApplied}`}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
                <div>
                  <h3 className="kpb-card-title" style={{ marginBottom: 4 }}>{application.jobTitle}</h3>
                  <p className="kpb-text-muted" style={{ margin: 0 }}>Company: {application.company}</p>
                </div>
                <div className="kpb-text-muted">
                  Applied on: {new Date(application.dateApplied).toLocaleDateString()}
                </div>
              </div>
            </SectionCard>
          ))}
        </div>
      )}
    </PageContainer>
  )
}
