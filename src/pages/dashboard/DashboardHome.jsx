import React from 'react'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts'
import { useNavigate } from 'react-router-dom'
import SectionCard from '../../design-system/components/SectionCard'
import StatCard from '../../design-system/components/StatCard'
import ProgressCard from '../../design-system/components/ProgressCard'
import PageContainer from '../../design-system/layout/PageContainer'
import PageHeader from '../../design-system/layout/PageHeader'
import JobRecommendationsPanel from '../../components/JobRecommendationsPanel'
import { useDashboardMetrics } from '../../hooks/useDashboardMetrics'

function DashboardSkeleton() {
  return (
    <div className="kpb-grid-2" style={{ marginTop: 16 }}>
      <div className="kpb-card" style={{ height: 220, opacity: 0.5 }} />
      <div className="kpb-card" style={{ height: 220, opacity: 0.5 }} />
    </div>
  )
}

function ReadinessCircle({ value = 0 }) {
  const size = 180
  const stroke = 12
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const normalized = Math.max(0, Math.min(100, value))
  const dashOffset = circumference * (1 - normalized / 100)

  let scoreColor = '#dc2626'
  if (normalized >= 70) scoreColor = '#16a34a'
  else if (normalized >= 40) scoreColor = '#d97706'

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 8, position: 'relative' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <g transform={`translate(${size / 2}, ${size / 2})`}>
          <circle r={radius} stroke="#e2e8f0" strokeWidth={stroke} fill="none" />
          <circle
            r={radius}
            stroke={scoreColor}
            strokeWidth={stroke}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            transform="rotate(-90)"
            style={{ transition: 'stroke-dashoffset 700ms ease, stroke 400ms ease' }}
          />
        </g>
      </svg>
      <div style={{ position: 'absolute', textAlign: 'center' }}>
        <div className="kpb-stat-value" style={{ fontSize: 30 }}>{normalized}</div>
        <div className="kpb-text-muted">Readiness</div>
      </div>
    </div>
  )
}

function SkillRadar({ data }) {
  return (
    <div style={{ height: 280 }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="80%">
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />
          <Radar name="Current" dataKey="score" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.35} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default function DashboardHome() {
  const navigate = useNavigate()
  const {
    readinessScore,
    atsScore,
    extractedSkillsCount,
    applicationsCount,
    practice,
    practicePercent,
    weeklyGoalPercent,
    skillRadarData,
    lastUpdatedAt,
    isLoading,
    error,
  } = useDashboardMetrics()

  const updatedLabel = React.useMemo(() => {
    if (!lastUpdatedAt) return 'Not available'
    return new Date(lastUpdatedAt).toLocaleString()
  }, [lastUpdatedAt])

  return (
    <PageContainer>
      <PageHeader title="Dashboard" subtitle="Track readiness, practice momentum, and opportunities in one place." right={<span className="kpb-text-muted">Last updated: {updatedLabel}</span>} />

      {error ? (
        <SectionCard>
          <span style={{ color: '#b91c1c', fontSize: 13 }}>Unable to load some dashboard metrics. Showing latest available values.</span>
        </SectionCard>
      ) : null}

      <div className="kpb-grid-stats" style={{ marginBottom: 16 }}>
        <StatCard label="ATS Score" value={atsScore || 0} subtext="Resume quality signal" />
        <StatCard label="Skills" value={extractedSkillsCount || 0} subtext="Extracted from resume" />
        <StatCard label="Applications" value={applicationsCount || 0} subtext="Submitted jobs/internships" />
        <StatCard label="Practice" value={`${practice.completed || 0}/${practice.total || 10}`} subtext="Completed modules" />
      </div>

      {isLoading ? <DashboardSkeleton /> : (
        <>
          <div className="kpb-grid-2" style={{ marginBottom: 16 }}>
            <SectionCard title="Readiness Score" right={<span className="kpb-badge">Live</span>}>
              <div style={{ position: 'relative', minHeight: 200 }}>
                <ReadinessCircle value={readinessScore || 0} />
              </div>
            </SectionCard>

            <SectionCard title="Skills Radar">
              <SkillRadar data={skillRadarData || []} />
            </SectionCard>
          </div>

          <div className="kpb-grid-2" style={{ marginBottom: 16 }}>
            <ProgressCard
              title="Continue Practice"
              valueLabel={`Last topic: ${practice.lastTopic || 'Not started'}`}
              percent={practicePercent || 0}
              right={<button className="kpb-btn kpb-btn-primary kpb-btn-small" onClick={() => navigate('/dashboard/practice')}>Continue</button>}
            >
              <div className="kpb-text-muted">{practice.completed || 0}/{practice.total || 10} completed</div>
            </ProgressCard>

            <ProgressCard
              title="Weekly Goals"
              valueLabel={`Solved: ${practice.weeklySolved || 0}/${practice.weeklyTarget || 20}`}
              percent={weeklyGoalPercent || 0}
            >
              <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                {(practice.activity || [false, false, false, false, false, false, false]).map((day, idx) => (
                  <span key={idx} className={`kpb-badge ${day ? '' : ''}`} style={{ background: day ? '#4f46e5' : '#e2e8f0', color: day ? '#fff' : '#64748b' }}>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][idx]}</span>
                ))}
              </div>
            </ProgressCard>
          </div>
        </>
      )}

      <SectionCard title="Job Recommendations">
        <JobRecommendationsPanel title="" withCard={false} />
      </SectionCard>
    </PageContainer>
  )
}
