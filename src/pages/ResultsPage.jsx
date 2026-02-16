import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Card from '../design-system/components/Card'
import Button from '../design-system/components/Button'
import { getEntryById, deleteEntry } from '../utils/historyManager'

export default function ResultsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [entry] = useState(() => id ? getEntryById(id) : null)
  const [tab, setTab] = useState('overview')

  if (!entry) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-600">
          <p>Analysis not found.</p>
          <Button variant="primary" onClick={() => navigate('/analyze')} className="mt-4">
            Create New Analysis
          </Button>
        </div>
      </div>
    )
  }

  const handleDelete = () => {
    if (window.confirm('Delete this analysis?')) {
      deleteEntry(entry.id)
      navigate('/history')
    }
  }

  const skillCategories = {
    coreCS: 'Core CS',
    languages: 'Languages',
    web: 'Web',
    data: 'Data',
    cloudDevOps: 'Cloud/DevOps',
    testing: 'Testing'
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-8 max-w-6xl">
        <div>
          <h2 className="text-3xl font-semibold">{entry.company}</h2>
          <p className="text-gray-600">{entry.role}</p>
          <p className="text-xs text-gray-500">{new Date(entry.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => navigate('/analyze')}>
            New Analysis
          </Button>
          <Button variant="secondary" onClick={handleDelete} className="bg-red-100 text-red-700">
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">{entry.readinessScore}</div>
            <div className="text-sm text-gray-600">Readiness Score</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold">{entry.extractedSkills.allCategories.length}</div>
            <div className="text-sm text-gray-600">Skill Categories</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold">{entry.checklist.length}</div>
            <div className="text-sm text-gray-600">Rounds</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold">{entry.questions.length}</div>
            <div className="text-sm text-gray-600">Interview Q's</div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b">
        {['overview', 'checklist', 'plan', 'questions'].map(t => (
          <button
            key={t}
            className={`px-4 py-2 font-medium text-sm ${tab === t ? 'border-b-2 border-primary text-primary' : 'text-gray-600'}`}
            onClick={() => setTab(t)}
          >
            {t === 'overview' && 'Skills'}
            {t === 'checklist' && 'Checklist'}
            {t === 'plan' && '7-Day Plan'}
            {t === 'questions' && 'Interview Qs'}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === 'overview' && (
        <div className="space-y-4">
          <Card>
            <h3 className="font-semibold mb-3">Extracted Skills</h3>
            <div className="space-y-3">
              {Object.entries(entry.extractedSkills.categorized).map(([key, keywords]) => (
                <div key={key}>
                  <div className="font-medium text-sm text-primary">{skillCategories[key]}</div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {keywords.map(kw => (
                      <span key={kw} className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {tab === 'checklist' && (
        <div className="space-y-4">
          {entry.checklist.map(round => (
            <Card key={round.round}>
              <h3 className="font-semibold mb-2">Round {round.round}: {round.title}</h3>
              <ul className="space-y-2">
                {round.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <input type="checkbox" className="mt-1" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      )}

      {tab === 'plan' && (
        <div className="space-y-4">
          {entry.plan.map(day => (
            <Card key={day.day}>
              <h3 className="font-semibold mb-1">Day {day.day}: {day.title}</h3>
              <p className="text-xs text-gray-500 mb-2">Focus: {day.focus}</p>
              <ul className="space-y-1">
                {day.tasks.map((task, i) => (
                  <li key={i} className="text-sm flex gap-2">
                    <span>•</span> <span>{task}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      )}

      {tab === 'questions' && (
        <div className="space-y-3">
          {entry.questions.map((q, i) => (
            <Card key={i}>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </div>
                <p className="text-sm">{q}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
