import React from 'react'
import Button from '../../design-system/components/Button'
import SectionCard from '../../design-system/components/SectionCard'
import StatCard from '../../design-system/components/StatCard'
import PageContainer from '../../design-system/layout/PageContainer'
import PageHeader from '../../design-system/layout/PageHeader'
import { useAssessmentData } from '../../hooks/useAssessmentData'

function StatusBadge({ status }) {
  const map = {
    not_started: 'bg-gray-100 text-gray-700',
    in_progress: 'bg-amber-100 text-amber-800',
    completed: 'bg-green-100 text-green-800',
  }

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${map[status] || map.not_started}`}>
      {status.replace('_', ' ')}
    </span>
  )
}

function DifficultyBadge({ difficulty }) {
  const map = {
    Beginner: 'bg-emerald-100 text-emerald-700',
    Intermediate: 'bg-amber-100 text-amber-800',
    Advanced: 'bg-red-100 text-red-700',
  }

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${map[difficulty] || map.Intermediate}`}>
      {difficulty}
    </span>
  )
}

function AssessmentsSkeleton() {
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div className="kpb-card" style={{ height: 110, opacity: 0.55 }} />
      <div className="kpb-card" style={{ height: 110, opacity: 0.55 }} />
      <div className="kpb-card" style={{ height: 110, opacity: 0.55 }} />
    </div>
  )
}

export default function AssessmentsPage() {
  const { assessments, isLoading, error, summary, weakTopics, markAttempt } = useAssessmentData()

  const readinessContribution = React.useMemo(() => {
    if (assessments.length === 0) return 0
    const weighted = assessments.reduce((acc, item) => acc + item.score * 0.25 + item.accuracy * 0.75, 0) / assessments.length
    return Math.round(weighted * 0.2)
  }, [assessments])

  const handleStart = (assessmentId) => {
    markAttempt(assessmentId, { status: 'in_progress' })
  }

  const handleOpenMock = (assessment) => {
    if (!assessment.link) return
    handleStart(assessment.id)
    window.open(assessment.link, '_blank', 'noopener,noreferrer')
  }

  const handleComplete = (assessment) => {
    const nextScore = assessment.score > 0 ? assessment.score : 78
    const nextAccuracy = assessment.accuracy > 0 ? assessment.accuracy : 74
    markAttempt(assessment.id, {
      status: 'completed',
      score: nextScore,
      accuracy: nextAccuracy,
    })
  }

  return (
    <PageContainer>
      <PageHeader
        title="Assessments"
        subtitle="Track mock test progress, weak topics, and readiness impact."
        right={<span className="kpb-text-muted">Readiness Contribution: +{readinessContribution} pts</span>}
      />

      {error && (
        <SectionCard>
          <div className="text-sm text-red-700">Could not load assessments. Try refreshing the page.</div>
        </SectionCard>
      )}

      <div className="kpb-grid-stats" style={{ marginBottom: 16 }}>
        <StatCard label="Total" value={summary.total} />
        <StatCard label="Completed" value={summary.completed} />
        <StatCard label="In Progress" value={summary.inProgress} />
        <StatCard label="Avg Score" value={summary.avgScore} />
      </div>

      <div style={{ marginBottom: 16 }}>
        <SectionCard title="Weak Topics Detection">
          <div>
            {weakTopics.length === 0 ? (
              <p className="kpb-empty-state">No weak topics detected yet. Complete at least one assessment.</p>
            ) : (
              <div className="kpb-inline-list">
                {weakTopics.map((topic) => (
                  <span key={topic} className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">{topic}</span>
                ))}
              </div>
            )}
          </div>
        </SectionCard>
      </div>

      {isLoading ? (
        <AssessmentsSkeleton />
      ) : assessments.length === 0 ? (
        <SectionCard>
          <div className="kpb-empty-state">No assessments found. Start your first mock test to track progress.</div>
        </SectionCard>
      ) : (
        <div style={{ display: 'grid', gap: 14 }}>
          {assessments.map((assessment) => {
            const progress = Math.round((assessment.score + assessment.accuracy) / 2)
            return (
              <SectionCard key={assessment.id}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">{assessment.name}</h3>
                      <StatusBadge status={assessment.status} />
                      <span className="px-2 py-1 rounded-full text-xs bg-indigo-100 text-indigo-700">{assessment.platform}</span>
                      <DifficultyBadge difficulty={assessment.difficulty} />
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Category: {assessment.category} | {assessment.type}</p>
                    <p className="text-sm text-gray-700 mb-2">{assessment.description}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-3">
                      <div>Score: <span className="font-semibold">{assessment.score || 0}</span></div>
                      <div>Accuracy: <span className="font-semibold">{assessment.accuracy || 0}%</span></div>
                      <div className="sm:col-span-2">
                        Weak topics: {(assessment.weakTopics || []).length > 0 ? assessment.weakTopics.join(', ') : 'None detected'}
                      </div>
                      <div className="sm:col-span-2 text-gray-500">
                        Last attempt: {assessment.lastAttemptAt ? new Date(assessment.lastAttemptAt).toLocaleString() : 'Not attempted'}
                      </div>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div className="bg-primary h-2 rounded-full transition-all duration-700" style={{ width: `${Math.min(100, progress)}%` }} />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button variant="primary" size="small" onClick={() => handleOpenMock(assessment)}>
                      Open Mock Test
                    </Button>
                    {assessment.status === 'not_started' && (
                      <Button variant="primary" size="small" onClick={() => handleStart(assessment.id)}>Start</Button>
                    )}
                    {assessment.status !== 'completed' && (
                      <Button variant="secondary" size="small" onClick={() => handleComplete(assessment)}>Complete</Button>
                    )}
                    {assessment.status === 'completed' && (
                      <Button variant="secondary" size="small" onClick={() => handleComplete(assessment)}>Retake</Button>
                    )}
                  </div>
                </div>
              </SectionCard>
            )
          })}
        </div>
      )}
    </PageContainer>
  )
}
