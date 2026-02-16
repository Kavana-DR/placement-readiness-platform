import React from 'react'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts'
import Card from '../../../src/design-system/components/Card'

const readinessValue = 72

function ReadinessCircle({ value = readinessValue }){
  const size = 180
  const stroke = 12
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const dash = (value / 100) * circumference

  return (
    <Card>
      <div className="flex flex-col items-center">
        <svg width={size} height={size} className="mb-4">
          <defs />
          <g transform={`translate(${size/2}, ${size/2})`}>
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
        <div className="text-3xl font-semibold">{value}</div>
        <div className="text-sm text-gray-600">Readiness Score</div>
      </div>
    </Card>
  )
}

function SkillRadar(){
  const data = [
    { subject: 'DSA', A: 75, fullMark: 100 },
    { subject: 'System Design', A: 60, fullMark: 100 },
    { subject: 'Communication', A: 80, fullMark: 100 },
    { subject: 'Resume', A: 85, fullMark: 100 },
    { subject: 'Aptitude', A: 70, fullMark: 100 },
  ]

  return (
    <Card>
      <div style={{ height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} cx="50%" cy="50%" outerRadius="80%">
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis angle={30} domain={[0,100]} />
            <Radar name="You" dataKey="A" stroke="#6366F1" fill="#6366F1" fillOpacity={0.6} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

function ContinuePractice(){
  const completed = 3
  const total = 10
  const pct = Math.round((completed/total)*100)

  return (
    <Card>
      <div>
        <h3 className="text-lg font-semibold mb-2">Continue Practice</h3>
        <div className="text-sm text-gray-600 mb-2">Last topic: Dynamic Programming</div>
        <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
          <div className="bg-primary h-3 rounded-full" style={{ width: `${pct}%` }} />
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">{completed}/{total} completed</div>
          <button className="bg-primary text-white px-3 py-1 rounded-md">Continue</button>
        </div>
      </div>
    </Card>
  )
}

function WeeklyGoals(){
  const solved = 12
  const target = 20
  const pct = Math.round((solved/target)*100)
  const days = [true, true, true, false, true, false, false] // Mon-Sun activity

  return (
    <Card>
      <div>
        <h3 className="text-lg font-semibold mb-2">Weekly Goals</h3>
        <div className="text-sm text-gray-600 mb-2">Problems Solved: {solved}/{target} this week</div>
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div className="bg-primary h-3 rounded-full" style={{ width: `${pct}%` }} />
        </div>

        <div className="flex items-center gap-3">
          {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d,i)=> (
            <div key={d} className={`w-8 h-8 rounded-full flex items-center justify-center ${days[i] ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>{d.slice(0,1)}</div>
          ))}
        </div>
      </div>
    </Card>
  )
}

function UpcomingAssessments(){
  const items = [
    { title: 'DSA Mock Test', time: 'Tomorrow, 10:00 AM' },
    { title: 'System Design Review', time: 'Wed, 2:00 PM' },
    { title: 'HR Interview Prep', time: 'Friday, 11:00 AM' },
  ]

  return (
    <Card>
      <div>
        <h3 className="text-lg font-semibold mb-3">Upcoming Assessments</h3>
        <ul className="space-y-3">
          {items.map(it=> (
            <li key={it.title} className="flex items-start justify-between">
              <div>
                <div className="font-medium">{it.title}</div>
                <div className="text-sm text-gray-600">{it.time}</div>
              </div>
              <div className="text-sm text-gray-500">&gt;</div>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  )
}

export default function DashboardHome(){
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-semibold mb-8">Dashboard</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <ReadinessCircle />
          <ContinuePractice />
        </div>

        <div className="space-y-8">
          <SkillRadar />
          <WeeklyGoals />
        </div>
      </div>

      <div className="mt-8">
        <UpcomingAssessments />
      </div>
    </div>
  )
}
