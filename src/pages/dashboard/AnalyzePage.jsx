import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../design-system/components/Card'
import Button from '../../design-system/components/Button'
import { extractSkills } from '../../utils/skillExtractor'
import { calculateReadinessScore } from '../../utils/scoreCalculator'
import { generateChecklist, generate7DayPlan, generateInterviewQuestions } from '../../utils/contentGenerator'
import { saveEntry } from '../../utils/historyManager'

export default function AnalyzePage() {
  const navigate = useNavigate()
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [jdText, setJdText] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAnalyze = () => {
    if (!jdText.trim()) {
      alert('Please enter JD text to analyze.')
      return
    }

    setLoading(true)

    // Extract skills
    const skills = extractSkills(jdText)

    // Generate analysis content
    const checklist = generateChecklist(skills.allCategories, skills.isEmpty)
    const plan = generate7DayPlan(skills.allCategories, skills.isEmpty)
    const questions = generateInterviewQuestions(skills.allCategories)

    // Calculate score
    const analysis = { company, role, jdText, skills }
    const readinessScore = calculateReadinessScore(analysis)

    // Save to history
    const entryId = saveEntry({
      company: company || 'Unknown Company',
      role: role || 'Unknown Role',
      jdText,
      extractedSkills: skills,
      checklist,
      plan,
      questions,
      readinessScore
    })

    // Navigate to results
    if (entryId) {
      navigate(`/results/${entryId}`)
    }

    setLoading(false)
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-semibold mb-8">Analyze Job Description</h2>

      <div className="max-w-3xl space-y-6">
        <Card>
          <div>
            <label className="block text-sm font-medium mb-2">Company Name (optional)</label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g., Google, Amazon"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>
        </Card>

        <Card>
          <div>
            <label className="block text-sm font-medium mb-2">Role (optional)</label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g., Software Engineer, Full Stack Developer"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </div>
        </Card>

        <Card>
          <div>
            <label className="block text-sm font-medium mb-2">Job Description *</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md h-64"
              placeholder="Paste the complete job description here..."
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
            />
            <div className="text-xs text-gray-500 mt-2">{jdText.length} characters</div>
          </div>
        </Card>

        <div className="flex gap-3">
          <Button variant="primary" onClick={handleAnalyze} disabled={loading}>
            {loading ? 'Analyzing...' : 'Analyze'}
          </Button>
          <Button variant="secondary" onClick={() => navigate('/dashboard')}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}
