import { useCallback, useEffect, useMemo, useState } from 'react'
import { APP_DATA_UPDATED_EVENT } from '../utils/appEvents'
import { getHistory } from '../utils/historyManager'
import {
  getRecommendedInternships,
  getResumeSkillsFromStorage,
  getStoredApplications,
  INTERNSHIP_APPLICATIONS_STORAGE_KEY,
  PARSED_RESUME_STORAGE_KEY,
} from '../utils/internshipRecommendations'
import { getPracticeProgress, PRACTICE_PROGRESS_STORAGE_KEY } from '../utils/practiceProgress'
import internshipsData from '../data/internships.json'
import { calculateATSScore } from '../../resume-builder/src/utils/atsScoring'

const RESUME_FORM_STORAGE_KEY = 'resumeBuilderData'
const HISTORY_STORAGE_KEY = 'placement_history'
const WATCHED_KEYS = new Set([
  HISTORY_STORAGE_KEY,
  RESUME_FORM_STORAGE_KEY,
  PARSED_RESUME_STORAGE_KEY,
  INTERNSHIP_APPLICATIONS_STORAGE_KEY,
  PRACTICE_PROGRESS_STORAGE_KEY,
])

function safeJsonParse(raw, fallback) {
  if (!raw) return fallback
  try {
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

function flattenExtractedSkills(skills = {}) {
  return Object.values(skills)
    .flat()
    .filter(Boolean)
}

function clampScore(value) {
  if (!Number.isFinite(value)) return 0
  return Math.max(0, Math.min(100, Math.round(value)))
}

function calculateCompositeReadiness({ analysisScore, atsScore, practiceCompletion, applicationsCount }) {
  const appMomentum = Math.min(100, applicationsCount * 10)
  const weighted = (
    (analysisScore * 0.55) +
    (atsScore * 0.25) +
    (practiceCompletion * 0.15) +
    (appMomentum * 0.05)
  )
  return clampScore(weighted)
}

function parsedResumeToFormShape(parsedResume = {}) {
  return {
    personalInfo: {
      name: parsedResume.name || '',
      email: parsedResume.email || '',
      phone: parsedResume.phone || '',
      location: '',
    },
    summary: '',
    education: (parsedResume.education || []).map((entry) => ({ school: entry, degree: '', field: '', year: '' })),
    experience: (parsedResume.experience || []).map((entry) => ({ company: '', position: entry, duration: '', description: '' })),
    projects: (parsedResume.projects || []).map((entry) => ({ title: entry, description: '', techStack: [], liveUrl: '', githubUrl: '', link: '' })),
    skillsByCategory: {
      technical: parsedResume.skills || [],
      soft: [],
      tools: parsedResume.projectTechStack || [],
    },
    skills: (parsedResume.skills || []).join(', '),
    links: {
      github: parsedResume.github || '',
      linkedin: parsedResume.linkedin || '',
    },
  }
}

function buildSkillRadarData(readinessScore, latestEntry, atsScore) {
  const extracted = latestEntry?.extractedSkills || {}
  const dsa = extracted.coreCS?.length ? Math.min(95, readinessScore + 10) : Math.max(35, readinessScore - 25)
  const web = extracted.web?.length ? Math.min(90, readinessScore + 8) : Math.max(30, readinessScore - 30)
  const data = extracted.data?.length ? Math.min(90, readinessScore + 5) : Math.max(30, readinessScore - 28)
  const testing = extracted.testing?.length ? Math.min(85, readinessScore + 3) : Math.max(30, readinessScore - 30)

  return [
    { subject: 'DSA', score: dsa, fullMark: 100 },
    { subject: 'Web', score: web, fullMark: 100 },
    { subject: 'Data', score: data, fullMark: 100 },
    { subject: 'Testing', score: testing, fullMark: 100 },
    { subject: 'Resume', score: atsScore, fullMark: 100 },
  ]
}

function loadDashboardState() {
  const history = getHistory()
  const latestEntry = history[0] || null
  const analysisScore = latestEntry
    ? latestEntry.finalScore || latestEntry.readinessScore || latestEntry.baseScore || 0
    : 0

  const parsedSkills = getResumeSkillsFromStorage()
  const fallbackSkills = flattenExtractedSkills(latestEntry?.extractedSkills)
  const extractedSkills = parsedSkills.length > 0 ? parsedSkills : [...new Set(fallbackSkills)]

  const applications = getStoredApplications()
  const practice = getPracticeProgress()
  const practiceCompletion = practice.total > 0
    ? (practice.completed / practice.total) * 100
    : 0

  const resumeForm = safeJsonParse(localStorage.getItem(RESUME_FORM_STORAGE_KEY), null)
  const parsedResume = safeJsonParse(localStorage.getItem(PARSED_RESUME_STORAGE_KEY), null)
  const atsInput = resumeForm || parsedResumeToFormShape(parsedResume || {})
  const atsScore = calculateATSScore(atsInput)
  const readinessScore = calculateCompositeReadiness({
    analysisScore,
    atsScore,
    practiceCompletion,
    applicationsCount: applications.length,
  })

  const recommendations = getRecommendedInternships(internshipsData, extractedSkills)
  const skillRadarData = buildSkillRadarData(readinessScore, latestEntry, atsScore)

  return {
    readinessScore,
    atsScore,
    extractedSkillsCount: extractedSkills.length,
    extractedSkills,
    applicationsCount: applications.length,
    applications,
    recommendations,
    latestEntryUpdatedAt: latestEntry?.updatedAt || latestEntry?.createdAt || null,
    analysisScore: clampScore(analysisScore),
    practice,
    skillRadarData,
    lastUpdatedAt: new Date().toISOString(),
  }
}

export function useDashboardMetrics() {
  const [state, setState] = useState({
    readinessScore: 0,
    analysisScore: 0,
    atsScore: 0,
    extractedSkillsCount: 0,
    extractedSkills: [],
    applicationsCount: 0,
    applications: [],
    recommendations: [],
    latestEntryUpdatedAt: null,
    practice: getPracticeProgress(),
    skillRadarData: [],
    lastUpdatedAt: null,
    isLoading: true,
    error: null,
  })

  const refresh = useCallback(() => {
    try {
      const next = loadDashboardState()
      setState((prev) => ({ ...prev, ...next, isLoading: false, error: null }))
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unable to refresh dashboard data.',
      }))
    }
  }, [])

  useEffect(() => {
    refresh()

    const onStorage = (event) => {
      if (!event.key || WATCHED_KEYS.has(event.key)) {
        refresh()
      }
    }

    const onCustomDataUpdate = () => refresh()
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') refresh()
    }

    window.addEventListener('storage', onStorage)
    window.addEventListener(APP_DATA_UPDATED_EVENT, onCustomDataUpdate)
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener(APP_DATA_UPDATED_EVENT, onCustomDataUpdate)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [refresh])

  const derived = useMemo(() => {
    const practicePercent = state.practice.total > 0
      ? Math.round((state.practice.completed / state.practice.total) * 100)
      : 0
    const weeklyGoalPercent = state.practice.weeklyTarget > 0
      ? Math.round((state.practice.weeklySolved / state.practice.weeklyTarget) * 100)
      : 0

    return {
      practicePercent: Math.min(100, practicePercent),
      weeklyGoalPercent: Math.min(100, weeklyGoalPercent),
    }
  }, [state.practice])

  return {
    ...state,
    ...derived,
    refresh,
  }
}
