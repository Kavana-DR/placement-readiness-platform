import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../design-system/components/Card'
import Button from '../../design-system/components/Button'
import { extractSkills } from '../../utils/skillExtractor'
import { calculateBaseScore } from '../../utils/scoreCalculator'
import { generateChecklist, generate7DayPlan, generateInterviewQuestions } from '../../utils/contentGenerator'
import { getCompanyIntel } from '../../utils/companyIntel'
import { generateRoundMapping } from '../../utils/roundMapping'
import { saveEntry } from '../../utils/historyManager'
import { validateJDText } from '../../utils/validation'
import { AlertCircle } from 'lucide-react'

export default function AnalyzePage() {
  const navigate = useNavigate()
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [jdText, setJdText] = useState('')
  const [loading, setLoading] = useState(false)
  const [jdValidation, setJdValidation] = useState({ valid: true, error: null, warning: null })

  const handleJDChange = (e) => {
    const text = e.target.value
    setJdText(text)
    const validation = validateJDText(text)
    setJdValidation(validation)
  }

  const handleAnalyze = () => {
    // Validate JD
    const validation = validateJDText(jdText)
    if (!validation.valid) {
      alert(validation.error)
      return
    }

    setLoading(true)

    try {
      // Extract skills (with defaults for empty case)
      const skills = extractSkills(jdText)

      // Generate analysis content
      const checklist = generateChecklist(skills.allCategories, skills.isEmpty)
      const plan = generate7DayPlan(skills.allCategories, skills.isEmpty)
      const questions = generateInterviewQuestions(skills.allCategories)

      // Calculate base score
      const analysis = { company, role, jdText, skills }
      const baseScore = calculateBaseScore(analysis)
      const finalScore = baseScore // initially same as base

      // Generate company intel and round mapping
      const companyIntel = getCompanyIntel(company)
      const roundMapping = generateRoundMapping(companyIntel.size, skills.allCategories, jdText)

      // Save to history with normalized schema
      const entryId = saveEntry({
        company: company.trim() || '',
        role: role.trim() || '',
        jdText,
        extractedSkills: skills,
        checklist,
        plan,
        questions,
        baseScore,
        finalScore,
        companyIntel,
        roundMapping,
        skillConfidenceMap: {}
      })

      // Navigate to results
      if (entryId) {
        navigate(`/results/${entryId}`)
      } else {
        alert('Failed to save analysis. Please try again.')
      }
    } catch (e) {
      console.error('Error during analysis:', e)
      alert('An error occurred during analysis. Please try again.')
    } finally {
      setLoading(false)
    }
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
              maxLength={100}
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
              maxLength={100}
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
              onChange={handleJDChange}
            />
            <div className="flex items-center justify-between mt-2">
              <div className="text-xs text-gray-500">{jdText.length} characters</div>
              {jdText.length < 200 && jdText.length > 0 && (
                <div className="text-xs font-medium text-amber-600">
                  {200 - jdText.length} more characters for best results
                </div>
              )}
            </div>

            {/* Validation Warning */}
            {jdValidation.warning && (
              <div className="mt-3 flex gap-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
                <AlertCircle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-700">{jdValidation.warning}</p>
              </div>
            )}

            {/* Validation Error */}
            {jdValidation.error && (
              <div className="mt-3 flex gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                <AlertCircle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{jdValidation.error}</p>
              </div>
            )}
          </div>
        </Card>

        <div className="flex gap-3">
          <Button 
            variant="primary" 
            onClick={handleAnalyze} 
            disabled={loading || !jdValidation.valid}
          >
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
