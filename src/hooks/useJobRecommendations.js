import { useCallback, useEffect, useMemo, useState } from 'react'
import { APP_DATA_UPDATED_EVENT } from '../utils/appEvents'
import {
  INTERNSHIP_APPLICATIONS_STORAGE_KEY,
  PARSED_RESUME_STORAGE_KEY,
  SAVED_JOBS_STORAGE_KEY,
  getSavedJobs,
  getStoredApplications,
  saveInternshipApplication,
  toggleSavedJob,
} from '../utils/internshipRecommendations'
import { getRecommendedJobs, getUserSkillsFromStorage } from '../utils/jobMatcher'
import { jobs } from '../data/jobsData'

const RESUME_FORM_STORAGE_KEY = 'resumeBuilderData'

export function useJobRecommendations() {
  const [userSkills, setUserSkills] = useState(() => getUserSkillsFromStorage())
  const [applications, setApplications] = useState(() => getStoredApplications())
  const [savedJobs, setSavedJobs] = useState(() => getSavedJobs())
  const [isLoading, setIsLoading] = useState(false)
  const [typeFilter, setTypeFilter] = useState('All')
  const [modeFilter, setModeFilter] = useState('All')
  const [minMatch, setMinMatch] = useState(0)
  const [sortBy, setSortBy] = useState('highest_match')
  const [query, setQuery] = useState('')

  const refresh = useCallback(() => {
    setUserSkills(getUserSkillsFromStorage())
    setApplications(getStoredApplications())
    setSavedJobs(getSavedJobs())
    setIsLoading(false)
  }, [])

  useEffect(() => {
    const onStorage = (event) => {
      const key = event?.key
      if (!key || [PARSED_RESUME_STORAGE_KEY, RESUME_FORM_STORAGE_KEY, INTERNSHIP_APPLICATIONS_STORAGE_KEY, SAVED_JOBS_STORAGE_KEY].includes(key)) {
        refresh()
      }
    }

    const onAppDataUpdated = (event) => {
      const key = event?.detail?.key
      if (!key || [PARSED_RESUME_STORAGE_KEY, RESUME_FORM_STORAGE_KEY, INTERNSHIP_APPLICATIONS_STORAGE_KEY, SAVED_JOBS_STORAGE_KEY].includes(key)) {
        refresh()
      }
    }

    window.addEventListener('storage', onStorage)
    window.addEventListener(APP_DATA_UPDATED_EVENT, onAppDataUpdated)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener(APP_DATA_UPDATED_EVENT, onAppDataUpdated)
    }
  }, [refresh])

  const recommendations = useMemo(() => getRecommendedJobs({
    jobs,
    userSkills,
    typeFilter,
    modeFilter,
    minMatch,
    sortBy,
    query,
  }), [modeFilter, minMatch, query, sortBy, typeFilter, userSkills])

  const appliedJobKeys = useMemo(
    () => new Set(applications.map((item) => `${item.jobTitle}::${item.company}`)),
    [applications],
  )

  const savedJobKeys = useMemo(
    () => new Set(savedJobs.map((item) => `${item.title}::${item.company}`)),
    [savedJobs],
  )

  const applyToJob = useCallback((job) => {
    const next = saveInternshipApplication(job)
    setApplications(next)
  }, [])

  const saveJob = useCallback((job) => {
    const next = toggleSavedJob(job)
    setSavedJobs(next)
  }, [])

  return {
    isLoading,
    userSkills,
    recommendations,
    applications,
    savedJobs,
    appliedJobKeys,
    savedJobKeys,
    typeFilter,
    setTypeFilter,
    modeFilter,
    setModeFilter,
    minMatch,
    setMinMatch,
    sortBy,
    setSortBy,
    query,
    setQuery,
    applyToJob,
    saveJob,
  }
}
