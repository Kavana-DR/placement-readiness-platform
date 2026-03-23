import { useCallback, useEffect, useMemo, useState } from 'react'
import { APP_DATA_UPDATED_EVENT, dispatchAppDataUpdated } from '../utils/appEvents'
import { useDashboardMetrics } from './useDashboardMetrics'
import { getHistory } from '../utils/historyManager'
import { ASSESSMENTS_STORAGE_KEY, getAssessmentSummary } from '../utils/assessmentData'

const RESUME_FORM_STORAGE_KEY = 'resumeBuilderData'

function safeJsonParse(raw, fallback) {
  if (!raw) return fallback
  try {
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

function getResumeFormData() {
  return safeJsonParse(localStorage.getItem(RESUME_FORM_STORAGE_KEY), {})
}

function calculateProfileCompleteness(profile) {
  const checks = [
    profile.name,
    profile.email,
    profile.phone,
    profile.github,
    profile.linkedin,
  ]
  const completed = checks.filter((item) => String(item || '').trim()).length
  return Math.round((completed / checks.length) * 100)
}

export function useProfileData() {
  const dashboard = useDashboardMetrics()
  const [profile, setProfile] = useState(() => {
    const form = getResumeFormData()
    return {
      name: form.personalInfo?.name || '',
      email: form.personalInfo?.email || '',
      phone: form.personalInfo?.phone || '',
      github: form.links?.github || '',
      linkedin: form.links?.linkedin || '',
      location: form.personalInfo?.location || '',
    }
  })
  const [isSaving, setIsSaving] = useState(false)

  const refreshFromStorage = useCallback(() => {
    const form = getResumeFormData()
    setProfile({
      name: form.personalInfo?.name || '',
      email: form.personalInfo?.email || '',
      phone: form.personalInfo?.phone || '',
      github: form.links?.github || '',
      linkedin: form.links?.linkedin || '',
      location: form.personalInfo?.location || '',
    })
  }, [])

  useEffect(() => {
    const onStorage = (event) => {
      if (!event.key || event.key === RESUME_FORM_STORAGE_KEY || event.key === ASSESSMENTS_STORAGE_KEY) {
        refreshFromStorage()
      }
    }
    const onAppUpdate = (event) => {
      const key = event?.detail?.key
      if (!key || key === RESUME_FORM_STORAGE_KEY || key === ASSESSMENTS_STORAGE_KEY) {
        refreshFromStorage()
      }
    }

    window.addEventListener('storage', onStorage)
    window.addEventListener(APP_DATA_UPDATED_EVENT, onAppUpdate)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener(APP_DATA_UPDATED_EVENT, onAppUpdate)
    }
  }, [refreshFromStorage])

  const saveProfile = useCallback((nextProfile) => {
    setIsSaving(true)
    const current = getResumeFormData()
    const updated = {
      ...current,
      personalInfo: {
        ...(current.personalInfo || {}),
        name: nextProfile.name || '',
        email: nextProfile.email || '',
        phone: nextProfile.phone || '',
        location: nextProfile.location || '',
      },
      links: {
        ...(current.links || {}),
        github: nextProfile.github || '',
        linkedin: nextProfile.linkedin || '',
      },
    }
    localStorage.setItem(RESUME_FORM_STORAGE_KEY, JSON.stringify(updated))
    dispatchAppDataUpdated({ scope: 'profile', key: RESUME_FORM_STORAGE_KEY, action: 'save' })
    setProfile(nextProfile)
    setIsSaving(false)
  }, [])

  const assessmentSummary = getAssessmentSummary()
  const history = getHistory()
  const atsHistory = useMemo(
    () => history.slice(0, 8).map((item) => ({
      id: item.id,
      date: item.createdAt,
      score: item.finalScore || item.baseScore || 0,
    })),
    [history],
  )

  const profileCompletion = useMemo(() => calculateProfileCompleteness(profile), [profile])
  const missingSuggestions = useMemo(() => {
    const suggestions = []
    if (!profile.name) suggestions.push('Add your full name')
    if (!profile.email) suggestions.push('Add your email')
    if (!profile.phone) suggestions.push('Add your phone number')
    if (!profile.github) suggestions.push('Add your GitHub profile')
    if (!profile.linkedin) suggestions.push('Add your LinkedIn profile')
    return suggestions
  }, [profile])

  return {
    profile,
    setProfile,
    saveProfile,
    isSaving,
    profileCompletion,
    missingSuggestions,
    assessmentSummary,
    atsHistory,
    dashboard,
  }
}
