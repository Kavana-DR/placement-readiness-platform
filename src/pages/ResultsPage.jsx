import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Card from '../design-system/components/Card'
import Button from '../design-system/components/Button'
import CompanyIntelCard from './CompanyIntelCard'
import RoundMappingTimeline from './RoundMappingTimeline'
import { getEntryById, deleteEntry, updateEntry } from '../utils/historyManager'
import { calculateFinalScore } from '../utils/scoreCalculator'
import { format7DayPlan, formatChecklist, formatQuestions, formatCompleteExport, copyToClipboard, downloadAsFile } from '../utils/exportUtils'
import { Download, Copy, Trash2 } from 'lucide-react'

export default function ResultsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [entry, setEntry] = useState(() => id ? getEntryById(id) : null)
  const [tab, setTab] = useState('overview')
  const [skillConfidence, setSkillConfidence] = useState(() => entry?.skillConfidenceMap || {})
  const [finalScore, setFinalScore] = useState(entry?.finalScore || entry?.readinessScore || 0)

  // Calculate final score based on skill confidence
  useEffect(() => {
    if (!entry) return

    const baseScore = entry.baseScore || entry.readinessScore || 0
    const newFinalScore = calculateFinalScore(baseScore, skillConfidence)
    setFinalScore(newFinalScore)
  }, [skillConfidence, entry])

  const handleSkillToggle = (skill, newConfidence) => {
    const updated = { ...skillConfidence, [skill]: newConfidence }
    setSkillConfidence(updated)

    // Save to history with updated finalScore
    if (id) {
      const baseScore = entry.baseScore || entry.readinessScore || 0
      const newFinalScore = calculateFinalScore(baseScore, updated)
      updateEntry(id, { skillConfidenceMap: updated, finalScore: newFinalScore })
    }
  }

  const handleDelete = () => {
    if (window.confirm('Delete this analysis?')) {
      deleteEntry(entry.id)
      navigate('/history')
    }
  }

  if (!entry) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="text-center text-gray-600">
          <p className="mb-4">Analysis not found.</p>
          <Button variant="primary" onClick={() => navigate('/analyze')}>
            Create New Analysis
          </Button>
        </div>
      </div>
    )
  }

  const skillCategories = {
    coreCS: 'Core CS',
    languages: 'Languages',
    web: 'Web',
    data: 'Data',
    cloudDevOps: 'Cloud/DevOps',
    testing: 'Testing'
  }

  // Get weak skills (marked as "practice")
  const weakSkills = Object.entries(skillConfidence)
    .filter(([_, conf]) => conf === 'practice')
    .map(([skill]) => skill)
    .slice(0, 3)

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
            <Trash2 size={16} className="mr-1" /> Delete
          </Button>
        </div>
      </div>

      {/* Score Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">{finalScore}</div>
            <div className="text-sm text-gray-600">Final Score</div>
            <div className="text-xs text-gray-500 mt-1">({entry.baseScore || entry.readinessScore || 0} base)</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {Object.values(entry.extractedSkills || {})
                .filter(arr => Array.isArray(arr) && arr.length > 0).length}
            </div>
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
        {['overview', 'intel', 'rounds', 'checklist', 'plan', 'questions'].map(t => (
          <button
            key={t}
            className={`px-4 py-2 font-medium text-sm ${tab === t ? 'border-b-2 border-primary text-primary' : 'text-gray-600'}`}
            onClick={() => setTab(t)}
          >
            {t === 'overview' && 'Skills'}
            {t === 'intel' && '🏢 Company Intel'}
            {t === 'rounds' && '📌 Interview Rounds'}
            {t === 'checklist' && 'Checklist'}
            {t === 'plan' && '7-Day Plan'}
            {t === 'questions' && 'Interview Qs'}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === 'overview' && (
        <div className="space-y-4 max-w-6xl">
          <Card>
            <h3 className="font-semibold mb-4">Extracted Skills — Mark your confidence level</h3>
            <p className="text-xs text-gray-500 mb-4">Hover over each skill to mark confidence. Your score updates in real-time.</p>
            <div className="space-y-4">
              {Object.entries(skillCategories).map(([key, label]) => {
                const keywords = entry.extractedSkills[key] || []
                return (
                <div key={key}>
                  <div className="font-medium text-sm text-primary mb-2">{label}</div>
                  <div className="flex flex-wrap gap-3">
                    {keywords.filter(kw => kw).map(kw => {
                      const confidence = skillConfidence[kw] || 'unknown'
                      const isKnow = confidence === 'know'
                      const isPractice = confidence === 'practice'

                      return (
                        <div
                          key={kw}
                          className="relative group"
                        >
                          <span
                            className={`px-3 py-2 rounded-full text-xs font-medium cursor-pointer transition-all ${
                              isKnow
                                ? 'bg-green-200 text-green-800'
                                : isPractice
                                ? 'bg-amber-200 text-amber-800'
                                : 'bg-indigo-100 text-indigo-700'
                            }`}
                          >
                            {kw}
                          </span>

                          {/* Floating toggle menu */}
                          <div className="hidden group-hover:block absolute bottom-full mb-2 bg-white border border-gray-200 rounded-md shadow-lg z-50 whitespace-nowrap">
                            <button
                              onClick={() => handleSkillToggle(kw, 'know')}
                              className={`block w-full text-left px-3 py-2 text-sm hover:bg-green-50 ${isKnow ? 'bg-green-100 font-semibold' : ''}`}
                            >
                              ✓ I know this
                            </button>
                            <button
                              onClick={() => handleSkillToggle(kw, 'practice')}
                              className={`block w-full text-left px-3 py-2 text-sm hover:bg-amber-50 border-t ${isPractice ? 'bg-amber-100 font-semibold' : ''}`}
                            >
                              ⟳ Need practice
                            </button>
                            <button
                              onClick={() => handleSkillToggle(kw, 'unknown')}
                              className={`block w-full text-left px-3 py-2 text-sm hover:bg-gray-50 border-t ${confidence === 'unknown' ? 'bg-gray-100 font-semibold' : ''}`}
                            >
                              ? Unsure
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
                )
              })}
            </div>

            {/* Export Buttons */}
            <div className="mt-8 pt-6 border-t space-y-3">
              <h4 className="font-medium text-sm mb-3">Export</h4>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => copyToClipboard(format7DayPlan(entry.plan))}
                >
                  <Copy size={14} className="mr-1" /> Copy 7-Day Plan
                </Button>
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => copyToClipboard(formatChecklist(entry.checklist))}
                >
                  <Copy size={14} className="mr-1" /> Copy Checklist
                </Button>
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => copyToClipboard(formatQuestions(entry.questions))}
                >
                  <Copy size={14} className="mr-1" /> Copy Questions
                </Button>
                <Button
                  variant="primary"
                  size="small"
                  onClick={() => downloadAsFile(formatCompleteExport(entry), `${entry.company}-analysis.txt`)}
                >
                  <Download size={14} className="mr-1" /> Download All
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {tab === 'intel' && (
        <div className="max-w-6xl">
          <CompanyIntelCard companyIntel={entry.companyIntel} />
        </div>
      )}

      {tab === 'rounds' && (
        <div className="max-w-6xl">
          <RoundMappingTimeline rounds={entry.roundMapping} />
        </div>
      )}

      {tab === 'checklist' && (
        <div className="space-y-4 max-w-6xl">
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
        <div className="space-y-4 max-w-6xl">
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
        <div className="space-y-3 max-w-6xl">
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

      {/* Action Next */}
      {weakSkills.length > 0 && (
        <div className="mt-12 max-w-6xl">
          <Card className="bg-blue-50 border border-blue-200">
            <div>
              <h3 className="font-semibold text-lg mb-3">📌 Next Action</h3>
              <p className="text-sm text-gray-700 mb-4">
                Focus on these weak areas first:
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {weakSkills.map(skill => (
                  <span key={skill} className="px-3 py-1 bg-amber-200 text-amber-800 text-xs rounded-full font-medium">
                    {skill}
                  </span>
                ))}
              </div>
              <p className="text-base font-semibold text-primary">
                💡 Start Day 1 plan now. Master fundamentals before diving into complex topics.
              </p>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
