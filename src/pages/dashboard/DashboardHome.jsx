import React from 'react'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts'
import { useNavigate } from 'react-router-dom'
import Card from '../../../src/design-system/components/Card'
import JobRecommendations from '../../components/JobRecommendations'
import { useDashboardMetrics } from '../../hooks/useDashboardMetrics'

function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-pulse">
      <div className="space-y-8">
        <div className="h-56 bg-white rounded-xl border border-gray-200" />
        <div className="h-48 bg-white rounded-xl border border-gray-200" />
      </div>
      <div className="space-y-8">
        <div className="h-56 bg-white rounded-xl border border-gray-200" />
        <div className="h-48 bg-white rounded-xl border border-gray-200" />
      </div>
    </div>
  )
}

function ReadinessCircle({ value = 0, label = 'Readiness Score' }) {
  const size = 180
  const stroke = 12
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const normalized = Math.max(0, Math.min(100, value))
  const dash = (normalized / 100) * circumference

  return (
    <Card>
      <div className="flex flex-col items-center">
        <svg width={size} height={size} className="mb-4">
          <g transform={`translate(${size / 2}, ${size / 2})`}>
            <circle r={radius} stroke="#eee" strokeWidth={stroke} fill="none" />
            <circle
              r={radius}
              stroke="#6366F1"
              strokeWidth={stroke}
              strokeLinecap="round"
              fill="none"
              strokeDasharray={`${dash} ${circumference - dash}`}
              style={{ transition: 'stroke-dasharray 800ms ease-in-out', transform: 'rotate(-90deg)', transformOrigin: 'center' }}
            />
          </g>
        </svg>
        <div className="text-3xl font-semibold transition-all duration-500">{normalized}</div>
        <div className="text-sm text-gray-600">{label}</div>
      </div>
    </Card>
  )
}

function SkillRadar({ data }) {
  return (
    <Card>
      <div style={{ height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} cx="50%" cy="50%" outerRadius="80%">
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} />
            <Radar name="Current" dataKey="score" stroke="#6366F1" fill="#6366F1" fillOpacity={0.6} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

function ContinuePractice({ completed, total, pct, lastTopic, onContinue }) {
  return (
    <Card>
      <div>
        <h3 className="text-lg font-semibold mb-2">Continue Practice</h3>
        <div className="text-sm text-gray-600 mb-2">Last topic: {lastTopic || 'Not started'}</div>
        <div className="w-full bg-gray-200 rounded-full h-3 mb-3 overflow-hidden">
          <div className="bg-primary h-3 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">{completed}/{total} completed</div>
          <button type="button" className="bg-primary text-white px-3 py-1 rounded-md" onClick={onContinue}>
            Continue
          </button>
        </div>
      </div>
    </Card>
  )
}

function WeeklyGoals({ solved, target, pct, days }) {
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  return (
    <Card>
      <div>
        <h3 className="text-lg font-semibold mb-2">Weekly Goals</h3>
        <div className="text-sm text-gray-600 mb-2">Problems Solved: {solved}/{target} this week</div>
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4 overflow-hidden">
          <div className="bg-primary h-3 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {dayLabels.map((d, i) => (
            <div
              key={d}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-500 ${days[i] ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}
            >
              {d.slice(0, 1)}
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

function DashboardStats({ atsScore, extractedSkillsCount, applicationsCount }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card>
        <div className="text-center">
          <p className="text-xs text-gray-500">ATS Score</p>
          <p className="text-2xl font-semibold transition-all duration-500">{atsScore}</p>
        </div>
      </Card>
      <Card>
        <div className="text-center">
          <p className="text-xs text-gray-500">Extracted Skills</p>
          <p className="text-2xl font-semibold transition-all duration-500">{extractedSkillsCount}</p>
        </div>
      </Card>
      <Card>
        <div className="text-center">
          <p className="text-xs text-gray-500">Applications</p>
          <p className="text-2xl font-semibold transition-all duration-500">{applicationsCount}</p>
        </div>
      </Card>
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

  const formattedUpdatedAt = React.useMemo(() => {
    if (!lastUpdatedAt) return 'Not available'
    return new Date(lastUpdatedAt).toLocaleString()
  }, [lastUpdatedAt])

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-semibold">Dashboard</h2>
        <div className="text-sm text-gray-500">Last updated: {formattedUpdatedAt}</div>
      </div>

      {error && (
        <Card>
          <div className="text-sm text-red-700">Unable to load some dashboard data. Showing last known values.</div>
        </Card>
      )}

      <div className="mb-6">
        <DashboardStats
          atsScore={atsScore || 0}
          extractedSkillsCount={extractedSkillsCount || 0}
          applicationsCount={applicationsCount || 0}
        />
      </div>

      {isLoading ? (
        <DashboardSkeleton />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <ReadinessCircle value={readinessScore || 0} />
            <ContinuePractice
              completed={practice.completed || 0}
              total={practice.total || 10}
              pct={practicePercent || 0}
              lastTopic={practice.lastTopic || 'Not started'}
              onContinue={() => navigate('/dashboard/practice')}
            />
          </div>

          <div className="space-y-8">
            <SkillRadar data={skillRadarData || []} />
            <WeeklyGoals
              solved={practice.weeklySolved || 0}
              target={practice.weeklyTarget || 20}
              pct={weeklyGoalPercent || 0}
              days={practice.activity || [false, false, false, false, false, false, false]}
            />
          </div>
        </div>
      )}

      <div className="mt-8">
        <Card>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-1">Build Resume</h3>
              <p className="text-sm text-gray-600">Create and optimize your resume inside the platform.</p>
            </div>
            <button
              type="button"
              className="bg-primary text-white px-4 py-2 rounded-md"
              onClick={() => navigate('/resume-builder/builder')}
            >
              Open Module
            </button>
          </div>
        </Card>
      </div>

      <div className="mt-8">
        <JobRecommendations />
      </div>
    </div>
  )
}
