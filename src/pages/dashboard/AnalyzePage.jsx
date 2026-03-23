import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../design-system/components/Button'
import SectionCard from '../../design-system/components/SectionCard'
import PageContainer from '../../design-system/layout/PageContainer'
import PageHeader from '../../design-system/layout/PageHeader'
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
  const [errorMessage, setErrorMessage] = useState('')
  const [jdValidation, setJdValidation] = useState({ valid: true, error: null, warning: null })

  const handleJDChange = (e) => {
    const text = e.target.value
    setJdText(text)
    const validation = validateJDText(text)
    setJdValidation(validation)
    setErrorMessage('')
  }

  const handleAnalyze = () => {
    const validation = validateJDText(jdText)
    if (!validation.valid) {
      setErrorMessage(validation.error)
      return
    }

    setLoading(true)

    try {
      const skills = extractSkills(jdText)
      const checklist = generateChecklist(skills.allCategories, skills.isEmpty)
      const plan = generate7DayPlan(skills.allCategories, skills.isEmpty)
      const questions = generateInterviewQuestions(skills.allCategories)

      const analysis = { company, role, jdText, skills }
      const baseScore = calculateBaseScore(analysis)
      const finalScore = baseScore

      const companyIntel = getCompanyIntel(company)
      const roundMapping = generateRoundMapping(companyIntel.size, skills.allCategories, jdText)

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

      if (entryId) {
        navigate(`/results/${entryId}`)
      } else {
        setErrorMessage('Failed to save analysis. Please try again.')
      }
    } catch (e) {
      console.error('Error during analysis:', e)
      setErrorMessage('An error occurred during analysis. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageContainer>
      <PageHeader
        title="Analyze Job Description"
        subtitle="Paste a JD to generate readiness score, interview rounds, and learning plan."
      />

      <div className="kpb-grid-2" style={{ gridTemplateColumns: '1fr', gap: 16, maxWidth: 900 }}>
        <SectionCard title="Company Details">
          <div style={{ display: 'grid', gap: 12 }}>
            <div>
              <label className="kpb-text-muted" style={{ display: 'block', marginBottom: 6 }}>Company Name (optional)</label>
              <input
                className="kpb-input"
                placeholder="e.g., Google, Amazon"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                maxLength={100}
              />
            </div>

            <div>
              <label className="kpb-text-muted" style={{ display: 'block', marginBottom: 6 }}>Role (optional)</label>
              <input
                className="kpb-input"
                placeholder="e.g., Software Engineer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                maxLength={100}
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Job Description">
          <div>
            <textarea
              className="kpb-input"
              style={{ minHeight: 260, resize: 'vertical' }}
              placeholder="Paste the complete job description here..."
              value={jdText}
              onChange={handleJDChange}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              <span className="kpb-text-muted">{jdText.length} characters</span>
              {jdText.length < 200 && jdText.length > 0 ? (
                <span className="kpb-text-muted">{200 - jdText.length} more characters for better results</span>
              ) : null}
            </div>

            {jdValidation.warning ? (
              <div style={{ marginTop: 12, display: 'flex', gap: 8, padding: 12, borderRadius: 8, border: '1px solid #fcd34d', background: '#fffbeb' }}>
                <AlertCircle size={16} className="text-amber-700" />
                <p style={{ margin: 0, fontSize: 13, color: '#92400e' }}>{jdValidation.warning}</p>
              </div>
            ) : null}

            {errorMessage ? (
              <div style={{ marginTop: 12, display: 'flex', gap: 8, padding: 12, borderRadius: 8, border: '1px solid #fecaca', background: '#fef2f2' }}>
                <AlertCircle size={16} className="text-red-700" />
                <p style={{ margin: 0, fontSize: 13, color: '#b91c1c' }}>{errorMessage}</p>
              </div>
            ) : null}
          </div>
        </SectionCard>

        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="primary" onClick={handleAnalyze} disabled={loading || !jdValidation.valid}>
            {loading ? 'Analyzing...' : 'Analyze JD'}
          </Button>
          <Button variant="secondary" onClick={() => navigate('/dashboard')}>
            Cancel
          </Button>
        </div>
      </div>
    </PageContainer>
  )
}
