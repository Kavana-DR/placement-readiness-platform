import React from 'react'
import Button from '../../design-system/components/Button'
import SectionCard from '../../design-system/components/SectionCard'
import StatCard from '../../design-system/components/StatCard'
import PageContainer from '../../design-system/layout/PageContainer'
import PageHeader from '../../design-system/layout/PageHeader'
import { useProfileData } from '../../hooks/useProfileData'

function Field({ label, value, onChange, type = 'text', placeholder = '' }) {
  return (
    <div>
      <label className="kpb-text-muted" style={{ display: 'block', marginBottom: 6 }}>{label}</label>
      <input
        type={type}
        className="kpb-input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </div>
  )
}

export default function ProfilePage() {
  const {
    profile,
    setProfile,
    saveProfile,
    isSaving,
    profileCompletion,
    missingSuggestions,
    assessmentSummary,
    atsHistory,
    dashboard,
  } = useProfileData()

  const [status, setStatus] = React.useState('')

  const handleSave = () => {
    saveProfile(profile)
    setStatus('Profile updated successfully.')
    window.setTimeout(() => setStatus(''), 1800)
  }

  return (
    <PageContainer>
      <PageHeader
        title="Profile"
        subtitle="Maintain your personal profile, readiness stats, and score history in one place."
        right={<span className="kpb-text-muted">Last updated: {dashboard.lastUpdatedAt ? new Date(dashboard.lastUpdatedAt).toLocaleString() : 'N/A'}</span>}
      />

      <div className="kpb-grid-stats" style={{ marginBottom: 16 }}>
        <StatCard label="Profile Completeness" value={`${profileCompletion}%`} />
        <StatCard label="Readiness Score" value={dashboard.readinessScore} />
        <StatCard label="ATS Score" value={dashboard.atsScore} />
        <StatCard label="Applications" value={dashboard.applicationsCount} />
      </div>

      <div className="kpb-grid-2" style={{ marginBottom: 16 }}>
        <SectionCard title="User Info">
          <div style={{ display: 'grid', gap: 12 }}>
            <div className="kpb-kv-grid">
              <Field label="Name" value={profile.name} onChange={(value) => setProfile((prev) => ({ ...prev, name: value }))} />
              <Field label="Email" type="email" value={profile.email} onChange={(value) => setProfile((prev) => ({ ...prev, email: value }))} />
              <Field label="Phone" value={profile.phone} onChange={(value) => setProfile((prev) => ({ ...prev, phone: value }))} />
              <Field label="Location" value={profile.location} onChange={(value) => setProfile((prev) => ({ ...prev, location: value }))} />
              <Field label="GitHub" value={profile.github} onChange={(value) => setProfile((prev) => ({ ...prev, github: value }))} placeholder="github.com/username" />
              <Field label="LinkedIn" value={profile.linkedin} onChange={(value) => setProfile((prev) => ({ ...prev, linkedin: value }))} placeholder="linkedin.com/in/username" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Button variant="primary" onClick={handleSave} disabled={isSaving}>Save Profile</Button>
              {status ? <span style={{ fontSize: 13, color: '#15803d' }}>{status}</span> : null}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Missing Info Suggestions">
          {missingSuggestions.length === 0 ? (
            <p style={{ fontSize: 14, color: '#15803d', margin: 0 }}>Your core profile fields are complete.</p>
          ) : (
            <ul style={{ margin: 0, paddingLeft: 20, color: '#334155', display: 'grid', gap: 8, fontSize: 14 }}>
              {missingSuggestions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>

      <div className="kpb-grid-2" style={{ marginBottom: 16 }}>
        <SectionCard title="Stats">
          <div style={{ display: 'grid', gap: 8 }}>
            <div className="kpb-kv-item"><span className="kpb-kv-label">Problems Solved: </span><strong>{dashboard.practice.weeklySolved}</strong></div>
            <div className="kpb-kv-item"><span className="kpb-kv-label">Assessments Completed: </span><strong>{assessmentSummary.completed}</strong></div>
            <div className="kpb-kv-item"><span className="kpb-kv-label">Applications Submitted: </span><strong>{dashboard.applicationsCount}</strong></div>
            <div className="kpb-kv-item"><span className="kpb-kv-label">Readiness Score: </span><strong>{dashboard.readinessScore}</strong></div>
          </div>
        </SectionCard>

        <SectionCard title="Skills Summary">
          {dashboard.extractedSkills.length === 0 ? (
            <p className="kpb-empty-state">No extracted skills yet. Parse your resume to populate this section.</p>
          ) : (
            <div className="kpb-inline-list">
              {dashboard.extractedSkills.slice(0, 20).map((skill) => (
                <span key={skill} className="kpb-badge">{skill}</span>
              ))}
            </div>
          )}
        </SectionCard>
      </div>

      <SectionCard title="ATS Score History">
        {atsHistory.length === 0 ? (
          <p className="kpb-empty-state">No ATS/readiness history yet. Run at least one analysis.</p>
        ) : (
          <div style={{ display: 'grid', gap: 8 }}>
            {atsHistory.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 12px',
                  borderRadius: 8,
                  border: '1px solid #e2e8f0',
                  background: '#f8fafc',
                }}
              >
                <span className="kpb-text-muted">{new Date(item.date).toLocaleDateString()}</span>
                <strong>{item.score}</strong>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </PageContainer>
  )
}
