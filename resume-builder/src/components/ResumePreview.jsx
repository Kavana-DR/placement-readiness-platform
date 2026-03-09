import React from 'react'
import '../styles/resume-preview.css'
import { getThemeColorValue } from '../utils/templates'

const SKILL_LABELS = {
  technical: 'Technical Skills',
  soft: 'Soft Skills',
  tools: 'Tools & Technologies',
}

function normalizeSkillGroups(data) {
  const skillsByCategory = data.skillsByCategory || { technical: [], soft: [], tools: [] }
  const flatSkills = data.skills ? data.skills.split(',').map((s) => s.trim()).filter((s) => s) : []
  return {
    technical: (skillsByCategory.technical || []).length > 0 ? skillsByCategory.technical : flatSkills,
    soft: skillsByCategory.soft || [],
    tools: skillsByCategory.tools || [],
  }
}

function SectionBlock({ title, children, className = '' }) {
  return (
    <section className={`resume-section ${className}`}>
      <h2 className="resume-section-title">{title}</h2>
      {children}
    </section>
  )
}

export default function ResumePreview({ data, template = 'classic', themeColor = 'teal', showHeader = true }) {
  const accentColor = getThemeColorValue(themeColor)
  const normalizedSkills = normalizeSkillGroups(data)
  const hasSummary = data.summary && data.summary.trim()
  const hasExperience = data.experience.some((exp) => exp.company || exp.position)
  const hasEducation = data.education.some((edu) => edu.school || edu.degree)
  const hasProjects = data.projects.some((proj) => proj.title)
  const hasSkills = Object.values(normalizedSkills).some((group) => group.length > 0)
  const hasLinks = data.links.github || data.links.linkedin

  const renderExperience = () =>
    hasExperience &&
    data.experience.map(
      (exp, idx) =>
        (exp.company || exp.position) && (
          <div key={idx} className="resume-entry">
            <div className="resume-entry-header">
              <strong className="resume-title">{exp.position || 'Position'}</strong>
              {exp.duration && <span className="resume-meta">{exp.duration}</span>}
            </div>
            {exp.company && <div className="resume-company">{exp.company}</div>}
            {exp.description && <p className="resume-text">{exp.description}</p>}
          </div>
        ),
    )

  const renderEducation = () =>
    hasEducation &&
    data.education.map(
      (edu, idx) =>
        (edu.school || edu.degree) && (
          <div key={idx} className="resume-entry">
            <div className="resume-entry-header">
              <strong className="resume-title">
                {edu.degree && `${edu.degree}`}
                {edu.field && ` in ${edu.field}`}
              </strong>
              {edu.year && <span className="resume-meta">{edu.year}</span>}
            </div>
            {edu.school && <div className="resume-company">{edu.school}</div>}
          </div>
        ),
    )

  const renderProjectCards = () =>
    hasProjects && (
      <div className="project-card-grid">
        {data.projects.map(
          (proj, idx) =>
            proj.title && (
              <article key={idx} className="project-card">
                <h3 className="project-card-title">{proj.title}</h3>
                {proj.description && <p className="resume-text">{proj.description}</p>}
                {(proj.techStack || []).length > 0 && (
                  <div className="resume-skills">
                    {proj.techStack.map((tech, techIdx) => (
                      <span key={`${proj.title}-${tech}-${techIdx}`} className="skill-badge">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                {(proj.liveUrl || proj.githubUrl || proj.link) && (
                  <div className="project-links">
                    {proj.liveUrl && (
                      <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="project-link-item">
                        [Live]
                      </a>
                    )}
                    {proj.githubUrl && (
                      <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="project-link-item">
                        [GitHub]
                      </a>
                    )}
                    {!proj.githubUrl && !proj.liveUrl && proj.link && <span className="resume-link">{proj.link}</span>}
                  </div>
                )}
              </article>
            ),
        )}
      </div>
    )

  const renderSkillGroups = () =>
    hasSkills && (
      <div className="skills-group-wrap">
        {Object.entries(normalizedSkills).map(([groupKey, items]) =>
          items.length > 0 ? (
            <div key={groupKey} className="skills-group">
              <p className="skills-group-label">{SKILL_LABELS[groupKey]}</p>
              <div className="resume-skills">
                {items.map((skill, idx) => (
                  <span key={`${groupKey}-${skill}-${idx}`} className="skill-badge">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ) : null,
        )}
      </div>
    )

  const renderContact = () =>
    (data.personalInfo.email || data.personalInfo.phone || data.personalInfo.location) && (
      <div className="resume-contact">
        {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
        {data.personalInfo.phone && <span>|</span>}
        {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
        {data.personalInfo.location && <span>|</span>}
        {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
      </div>
    )

  return (
    <div
      className={`resume-preview-panel template-${template} ${showHeader ? '' : 'standalone-preview'}`}
      style={{ '--accent-color': accentColor }}
    >
      {showHeader && (
        <div className="resume-preview-header">
          <p className="preview-label">Live Preview</p>
        </div>
      )}

      <div className="resume-content">
        {template === 'modern' ? (
          <div className="resume-modern-layout">
            <aside className="resume-modern-sidebar">
              {data.personalInfo.name && <h1 className="resume-name">{data.personalInfo.name}</h1>}
              {renderContact()}
              {hasSkills && (
                <SectionBlock title="Skills" className="sidebar-section">
                  {renderSkillGroups()}
                </SectionBlock>
              )}
              {hasLinks && (
                <SectionBlock title="Links" className="sidebar-section">
                  <div className="resume-links">
                    {data.links.github && <p className="resume-link-item">GitHub: {data.links.github}</p>}
                    {data.links.linkedin && <p className="resume-link-item">LinkedIn: {data.links.linkedin}</p>}
                  </div>
                </SectionBlock>
              )}
            </aside>

            <main className="resume-modern-main">
              {hasSummary && (
                <SectionBlock title="Summary">
                  <p className="resume-text">{data.summary}</p>
                </SectionBlock>
              )}
              {hasExperience && <SectionBlock title="Experience">{renderExperience()}</SectionBlock>}
              {hasProjects && <SectionBlock title="Projects">{renderProjectCards()}</SectionBlock>}
              {hasEducation && <SectionBlock title="Education">{renderEducation()}</SectionBlock>}
            </main>
          </div>
        ) : (
          <>
            <div className="resume-header">
              {data.personalInfo.name && <h1 className="resume-name">{data.personalInfo.name}</h1>}
              {renderContact()}
            </div>

            {hasSummary && (
              <SectionBlock title="Summary">
                <p className="resume-text">{data.summary}</p>
              </SectionBlock>
            )}
            {hasExperience && <SectionBlock title="Experience">{renderExperience()}</SectionBlock>}
            {hasEducation && <SectionBlock title="Education">{renderEducation()}</SectionBlock>}
            {hasProjects && <SectionBlock title="Projects">{renderProjectCards()}</SectionBlock>}
            {hasSkills && <SectionBlock title="Skills">{renderSkillGroups()}</SectionBlock>}
            {hasLinks && (
              <section className="resume-section">
                <div className="resume-links">
                  {data.links.github && <p className="resume-link-item">GitHub: {data.links.github}</p>}
                  {data.links.linkedin && <p className="resume-link-item">LinkedIn: {data.links.linkedin}</p>}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  )
}
