import React from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../design-system/components/Button'
import Card from '../design-system/components/Card'
import { useJobRecommendations } from '../hooks/useJobRecommendations'

function badgeClassForMatch(score) {
  if (score >= 70) return 'bg-emerald-100 text-emerald-700'
  if (score >= 50) return 'bg-amber-100 text-amber-800'
  return 'bg-gray-100 text-gray-700'
}

function JobsSkeleton() {
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div className="kpb-card" style={{ height: 102, opacity: 0.55 }} />
      <div className="kpb-card" style={{ height: 102, opacity: 0.55 }} />
      <div className="kpb-card" style={{ height: 102, opacity: 0.55 }} />
    </div>
  )
}

function PanelContent({ title }) {
  const navigate = useNavigate()
  const {
    isLoading,
    userSkills,
    recommendations,
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
  } = useJobRecommendations()

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        {title ? <h3 className="kpb-card-title">{title}</h3> : <span />}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button type="button" className="kpb-link" onClick={() => navigate('/applications')}>View Applications</button>
          <span className="kpb-text-muted">{userSkills.length} extracted skills</span>
        </div>
      </div>

      <div className="kpb-toolbar" style={{ marginBottom: 16 }}>
        <input
          type="text"
          className="kpb-input"
          style={{ maxWidth: 260 }}
          placeholder="Search role, company, skills..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <select className="kpb-input" style={{ maxWidth: 160 }} value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
          <option value="All">All Types</option>
          <option value="Internship">Internship</option>
          <option value="Full time">Full time</option>
        </select>
        <select className="kpb-input" style={{ maxWidth: 140 }} value={modeFilter} onChange={(event) => setModeFilter(event.target.value)}>
          <option value="All">All Modes</option>
          <option value="Remote">Remote</option>
          <option value="Hybrid">Hybrid</option>
          <option value="Onsite">Onsite</option>
        </select>
        <label className="kpb-text-muted" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <input type="checkbox" checked={minMatch >= 50} onChange={(event) => setMinMatch(event.target.checked ? 50 : 0)} />
          Match 50%+
        </label>
        <select className="kpb-input" style={{ maxWidth: 170 }} value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
          <option value="highest_match">Highest match</option>
          <option value="newest">Newest jobs</option>
        </select>
      </div>

      {userSkills.length === 0 ? (
        <div className="kpb-empty-state">
          <p style={{ marginTop: 0, marginBottom: 10 }}>No parsed resume skills found yet.</p>
          <Button variant="primary" onClick={() => navigate('/resume-builder/builder')}>Parse Resume First</Button>
        </div>
      ) : isLoading ? (
        <JobsSkeleton />
      ) : recommendations.length === 0 ? (
        <div className="kpb-empty-state">No matching jobs found. Improve skills or lower filters.</div>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {recommendations.map((job) => {
            const applyKey = `${job.title}::${job.company}`
            const isApplied = appliedJobKeys.has(applyKey)
            const isSaved = savedJobKeys.has(applyKey)
            return (
              <div key={job.id} className="kpb-card" style={{ padding: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'flex-start' }}>
                  <div>
                    <div className="kpb-inline-list" style={{ marginBottom: 4 }}>
                      <h4 className="kpb-card-title" style={{ margin: 0, marginRight: 6 }}>{job.title}</h4>
                      {job.recommended ? <span className="kpb-badge">Recommended</span> : null}
                      {job.highlyRecommended ? <span className="px-2 py-1 rounded-full text-xs bg-emerald-100 text-emerald-700">High match</span> : null}
                    </div>
                    <p className="kpb-text-muted" style={{ marginTop: 0, marginBottom: 4 }}>{job.company} | {job.location}</p>
                    <p className="kpb-text-muted" style={{ marginTop: 0, marginBottom: 8 }}>{job.type} | {job.workMode} | Posted {job.postedLabel}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${badgeClassForMatch(job.matchScore)}`}>
                      Match: {job.matchScore}%
                    </span>
                    <p className="kpb-text-muted" style={{ marginTop: 8, marginBottom: 4 }}>Skills: {(job.skills || []).join(', ')}</p>
                    <p className="kpb-text-muted" style={{ margin: 0 }}>
                      Matched: {job.matchedSkills.length > 0 ? job.matchedSkills.join(', ') : 'No direct skill overlap'}
                    </p>
                  </div>

                  <div style={{ display: 'grid', gap: 8, minWidth: 128 }}>
                    <a href={job.applyLink} target="_blank" rel="noreferrer" onClick={() => applyToJob(job)} style={{ textDecoration: 'none' }}>
                      <Button variant="primary" size="small">Apply Now</Button>
                    </a>
                    <Button
                      variant="secondary"
                      size="small"
                      disabled={isApplied}
                      onClick={() => applyToJob(job)}
                    >
                      {isApplied ? 'Applied' : 'Mark Applied'}
                    </Button>
                    <Button variant={isSaved ? 'ghost' : 'secondary'} size="small" onClick={() => saveJob(job)}>
                      {isSaved ? 'Saved' : 'Save'}
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function JobRecommendationsPanel({ title = 'Recommended Jobs & Internships', withCard = true }) {
  if (!withCard) {
    return <PanelContent title={title} />
  }
  return (
    <Card>
      <PanelContent title={title} />
    </Card>
  )
}
