import { useCallback, useEffect, useMemo, useState } from 'react'
import { APP_DATA_UPDATED_EVENT } from '../utils/appEvents'
import {
  ASSESSMENTS_STORAGE_KEY,
  getAssessments,
  updateAssessmentAttempt,
} from '../utils/assessmentData'

export function useAssessmentData() {
  const [assessments, setAssessments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const refresh = useCallback(() => {
    try {
      const next = getAssessments()
      setAssessments(next)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load assessments')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()

    const onStorage = (event) => {
      if (!event.key || event.key === ASSESSMENTS_STORAGE_KEY) refresh()
    }
    const onAppUpdate = (event) => {
      if (!event?.detail?.key || event.detail.key === ASSESSMENTS_STORAGE_KEY) refresh()
    }

    window.addEventListener('storage', onStorage)
    window.addEventListener(APP_DATA_UPDATED_EVENT, onAppUpdate)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener(APP_DATA_UPDATED_EVENT, onAppUpdate)
    }
  }, [refresh])

  const summary = useMemo(() => {
    const completed = assessments.filter((item) => item.status === 'completed').length
    const inProgress = assessments.filter((item) => item.status === 'in_progress').length
    const avgScore = assessments.length > 0
      ? Math.round(assessments.reduce((acc, item) => acc + item.score, 0) / assessments.length)
      : 0

    return {
      total: assessments.length,
      completed,
      inProgress,
      avgScore,
    }
  }, [assessments])
  const weakTopics = useMemo(() => {
    const topics = assessments.flatMap((item) => item.weakTopics || [])
    const counts = topics.reduce((acc, topic) => {
      acc[topic] = (acc[topic] || 0) + 1
      return acc
    }, {})
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([topic]) => topic)
      .slice(0, 8)
  }, [assessments])

  const markAttempt = useCallback((id, updates) => {
    const next = updateAssessmentAttempt(id, updates)
    setAssessments(next)
  }, [])

  return {
    assessments,
    isLoading,
    error,
    summary,
    weakTopics,
    refresh,
    markAttempt,
  }
}
