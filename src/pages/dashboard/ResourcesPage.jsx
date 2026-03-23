import React from 'react'
import Button from '../../design-system/components/Button'
import SectionCard from '../../design-system/components/SectionCard'
import StatCard from '../../design-system/components/StatCard'
import PageContainer from '../../design-system/layout/PageContainer'
import PageHeader from '../../design-system/layout/PageHeader'
import { useDashboardMetrics } from '../../hooks/useDashboardMetrics'
import { useAssessmentData } from '../../hooks/useAssessmentData'
import { APP_DATA_UPDATED_EVENT } from '../../utils/appEvents'
import {
  RESOURCE_PROGRESS_STORAGE_KEY,
  getResourceCatalog,
  getResourceProgress,
  updateResourceProgress,
} from '../../utils/resourceProgress'

const CATEGORIES = ['All', 'DSA', 'Aptitude', 'System Design', 'Resume', 'Interview']

function ResourcesSkeleton() {
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div className="kpb-card" style={{ height: 132, opacity: 0.55 }} />
      <div className="kpb-card" style={{ height: 132, opacity: 0.55 }} />
      <div className="kpb-card" style={{ height: 132, opacity: 0.55 }} />
    </div>
  )
}

function difficultyBadgeClass(difficulty) {
  if (difficulty === 'Advanced') return 'bg-red-100 text-red-700'
  if (difficulty === 'Intermediate') return 'bg-amber-100 text-amber-800'
  return 'bg-emerald-100 text-emerald-700'
}

function mapWeakSignalsToRecommendedIds({ weakTopics, extractedSkills }) {
  const weak = (weakTopics || []).map((item) => item.toLowerCase())
  const skills = (extractedSkills || []).map((item) => item.toLowerCase())
  const recommended = new Set()

  weak.forEach((topic) => {
    if (topic.includes('dynamic programming') || topic.includes('graph')) {
      recommended.add('dsa-leetcode-sheet')
      recommended.add('dsa-neetcode-roadmap')
    }
    if (topic.includes('percentage') || topic.includes('quant') || topic.includes('time and work')) {
      recommended.add('apt-indiabix')
      recommended.add('apt-prepinsta')
    }
    if (topic.includes('cache') || topic.includes('rate limiting') || topic.includes('system')) {
      recommended.add('sd-primer')
      recommended.add('sd-bytebytego')
    }
    if (topic.includes('story') || topic.includes('conflict') || topic.includes('behavior')) {
      recommended.add('interview-pramp')
      recommended.add('interview-interviewbit')
    }
  })

  if (skills.some((skill) => ['react', 'node.js', 'django', 'mysql', 'sql'].includes(skill))) {
    recommended.add('resume-impact-bullets')
    recommended.add('resume-gfg-tips')
  }

  if (recommended.size === 0) {
    recommended.add('dsa-leetcode-sheet')
    recommended.add('resume-gfg-tips')
  }

  return recommended
}

function ResourceCard({ resource, completion, recommended, onComplete, onProgressAdjust }) {
  return (
    <SectionCard>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div className="kpb-inline-list" style={{ marginBottom: 8 }}>
            <h3 className="kpb-card-title" style={{ marginRight: 6 }}>{resource.title}</h3>
            <span className="kpb-badge">{resource.platform}</span>
            <span className={`px-2 py-1 rounded-full text-xs ${difficultyBadgeClass(resource.difficulty)}`}>{resource.difficulty}</span>
            <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">{resource.type}</span>
            {recommended ? <span className="px-2 py-1 rounded-full text-xs bg-emerald-100 text-emerald-700">Recommended</span> : null}
          </div>

          <p className="kpb-text-muted" style={{ marginBottom: 8 }}>Category: {resource.category}</p>
          <p style={{ fontSize: 14, color: '#334155', marginTop: 0, marginBottom: 12 }}>{resource.description}</p>

          <div className="kpb-progress-track" style={{ marginBottom: 8 }}>
            <div className="kpb-progress-fill" style={{ width: `${completion}%` }} />
          </div>
          <p className="kpb-text-muted">Progress: {completion}%</p>
        </div>

        <div style={{ display: 'grid', gap: 8, minWidth: 150 }}>
          <a href={resource.link} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', display: 'inline-flex' }}>
            <Button variant="primary" size="small">Open Resource</Button>
          </a>
          <Button variant="secondary" size="small" onClick={onComplete}>Mark Complete</Button>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="ghost" size="small" onClick={() => onProgressAdjust(-10)}>-10%</Button>
            <Button variant="ghost" size="small" onClick={() => onProgressAdjust(20)}>+20%</Button>
          </div>
        </div>
      </div>
    </SectionCard>
  )
}

export default function ResourcesPage() {
  const { extractedSkills, isLoading: dashboardLoading } = useDashboardMetrics()
  const { weakTopics, isLoading: assessmentLoading } = useAssessmentData()

  const [selectedCategory, setSelectedCategory] = React.useState('All')
  const [searchTerm, setSearchTerm] = React.useState('')
  const [progress, setProgress] = React.useState(() => getResourceProgress())

  React.useEffect(() => {
    const sync = () => setProgress(getResourceProgress())
    const onStorage = (event) => {
      if (!event.key || event.key === RESOURCE_PROGRESS_STORAGE_KEY) sync()
    }

    window.addEventListener('storage', onStorage)
    window.addEventListener(APP_DATA_UPDATED_EVENT, sync)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener(APP_DATA_UPDATED_EVENT, sync)
    }
  }, [])

  const recommendedIds = React.useMemo(
    () => mapWeakSignalsToRecommendedIds({ weakTopics, extractedSkills }),
    [weakTopics, extractedSkills],
  )

  const resources = React.useMemo(() => {
    const query = searchTerm.toLowerCase().trim()
    const all = getResourceCatalog().map((resource) => ({
      ...resource,
      completion: progress[resource.id] || 0,
      recommended: recommendedIds.has(resource.id),
    }))

    return all
      .filter((item) => selectedCategory === 'All' || item.category === selectedCategory)
      .filter((item) => {
        if (!query) return true
        return [item.title, item.platform, item.category, item.description]
          .join(' ')
          .toLowerCase()
          .includes(query)
      })
      .sort((a, b) => Number(b.recommended) - Number(a.recommended) || b.completion - a.completion)
  }, [progress, recommendedIds, searchTerm, selectedCategory])

  const completionStats = React.useMemo(() => {
    const catalog = getResourceCatalog()
    const completed = catalog.filter((resource) => (progress[resource.id] || 0) >= 100).length
    return {
      total: catalog.length,
      completed,
      percent: catalog.length > 0 ? Math.round((completed / catalog.length) * 100) : 0,
    }
  }, [progress])

  const learningPath = React.useMemo(
    () => getResourceCatalog().filter((resource) => recommendedIds.has(resource.id)).slice(0, 4),
    [recommendedIds],
  )

  const handleProgressAdjust = (id, delta) => {
    const nextPct = Math.max(0, Math.min(100, (progress[id] || 0) + delta))
    const next = updateResourceProgress(id, nextPct)
    setProgress(next)
  }

  const handleMarkComplete = (id) => {
    const next = updateResourceProgress(id, 100)
    setProgress(next)
  }

  const isLoading = dashboardLoading || assessmentLoading

  return (
    <PageContainer>
      <PageHeader
        title="Resources"
        subtitle="Curated learning hub with progress, weak-topic recommendations, and completion tracking."
        right={<span className="kpb-text-muted">Completion: {completionStats.completed}/{completionStats.total} ({completionStats.percent}%)</span>}
      />

      <div className="kpb-grid-stats" style={{ marginBottom: 16 }}>
        <StatCard label="Total Resources" value={completionStats.total} />
        <StatCard label="Completed" value={completionStats.completed} />
        <StatCard label="Completion %" value={completionStats.percent} />
        <StatCard label="Recommended" value={learningPath.length} />
      </div>

      <div style={{ marginBottom: 16 }}>
        <SectionCard title="Suggested Learning Path">
          {learningPath.length === 0 ? (
            <p className="kpb-empty-state">Complete assessments to unlock targeted suggestions.</p>
          ) : (
            <ol style={{ margin: 0, paddingLeft: 20, color: '#334155', fontSize: 14, display: 'grid', gap: 6 }}>
              {learningPath.map((item) => (
                <li key={item.id}>
                  {item.title} ({item.platform})
                </li>
              ))}
            </ol>
          )}
        </SectionCard>
      </div>

      <div className="kpb-toolbar" style={{ marginBottom: 16 }}>
        <input
          type="text"
          className="kpb-input"
          style={{ maxWidth: 320 }}
          placeholder="Search resources, platform, topic..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
        {CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            className={`kpb-chip ${selectedCategory === category ? 'kpb-chip-active' : ''}`.trim()}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {isLoading ? (
        <ResourcesSkeleton />
      ) : resources.length === 0 ? (
        <SectionCard>
          <div className="kpb-empty-state">No resources match your current filter/search.</div>
        </SectionCard>
      ) : (
        <div style={{ display: 'grid', gap: 14 }}>
          {resources.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              completion={resource.completion}
              recommended={resource.recommended}
              onComplete={() => handleMarkComplete(resource.id)}
              onProgressAdjust={(delta) => handleProgressAdjust(resource.id, delta)}
            />
          ))}
        </div>
      )}
    </PageContainer>
  )
}
