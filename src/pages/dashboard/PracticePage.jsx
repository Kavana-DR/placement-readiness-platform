import React from 'react'
import Button from '../../design-system/components/Button'
import SectionCard from '../../design-system/components/SectionCard'
import StatCard from '../../design-system/components/StatCard'
import PageContainer from '../../design-system/layout/PageContainer'
import PageHeader from '../../design-system/layout/PageHeader'
import {
  completePracticeTopic,
  getPracticeProgress,
  resetPracticeProgress,
  savePracticeProgress,
} from '../../utils/practiceProgress'

const TOPICS = [
  'Arrays',
  'Dynamic Programming',
  'Graphs',
  'System Design',
  'Behavioral Interview',
]

export default function PracticePage() {
  const [progress, setProgress] = React.useState(() => getPracticeProgress())
  const [topic, setTopic] = React.useState(TOPICS[0])

  React.useEffect(() => {
    const sync = () => setProgress(getPracticeProgress())
    window.addEventListener('storage', sync)
    return () => window.removeEventListener('storage', sync)
  }, [])

  const handleComplete = () => {
    const next = completePracticeTopic(topic)
    setProgress(next)
  }

  const handleReset = () => {
    const next = resetPracticeProgress()
    setProgress(next)
  }

  const handleTargetChange = (value) => {
    const parsed = Number(value)
    if (!Number.isFinite(parsed) || parsed <= 0) return
    const next = savePracticeProgress({ ...progress, total: parsed })
    setProgress(next)
  }

  const pct = progress.total > 0 ? Math.round((progress.completed / progress.total) * 100) : 0

  return (
    <PageContainer>
      <PageHeader
        title="Practice"
        subtitle="Track topic completion, update weekly goals, and keep your readiness momentum."
      />

      <div className="kpb-grid-stats" style={{ marginBottom: 16 }}>
        <StatCard label="Completed" value={progress.completed} />
        <StatCard label="Target" value={progress.total} />
        <StatCard label="Weekly Solved" value={progress.weeklySolved} />
        <StatCard label="Progress %" value={Math.min(100, pct)} />
      </div>

      <div className="kpb-grid-2">
        <SectionCard title="Practice Tracker">
          <div style={{ display: 'grid', gap: 16 }}>
            <div>
              <label className="kpb-text-muted" style={{ display: 'block', marginBottom: 6 }}>Current Topic</label>
              <select
                className="kpb-input"
                value={topic}
                onChange={(event) => setTopic(event.target.value)}
              >
                {TOPICS.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="kpb-text-muted" style={{ display: 'block', marginBottom: 6 }}>Practice Target</label>
              <input
                className="kpb-input"
                type="number"
                min={1}
                value={progress.total}
                onChange={(event) => handleTargetChange(event.target.value)}
              />
            </div>

            <div className="kpb-progress-track">
              <div className="kpb-progress-fill" style={{ width: `${Math.min(100, pct)}%` }} />
            </div>

            <div className="kpb-text-muted">
              {progress.completed}/{progress.total} completed ({Math.min(100, pct)}%)
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Button variant="primary" onClick={handleComplete}>Mark Topic Complete</Button>
              <Button variant="secondary" onClick={handleReset}>Reset Progress</Button>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Current Snapshot">
          <div style={{ display: 'grid', gap: 8 }}>
            <div className="kpb-kv-item"><span className="kpb-kv-label">Last Topic: </span>{progress.lastTopic || 'Not started'}</div>
            <div className="kpb-kv-item"><span className="kpb-kv-label">Weekly Solved: </span>{progress.weeklySolved}/{progress.weeklyTarget}</div>
            <div className="kpb-kv-item"><span className="kpb-kv-label">Last Updated: </span>{progress.updatedAt ? new Date(progress.updatedAt).toLocaleString() : 'Not available'}</div>
          </div>
        </SectionCard>
      </div>
    </PageContainer>
  )
}
