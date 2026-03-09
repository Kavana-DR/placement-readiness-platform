import React from 'react'
import '../styles/builder.css'
import ResumePreview from '../components/ResumePreview'
import ScoreCard from '../components/ScoreCard'
import TemplateSelector from '../components/TemplateSelector'
import ImprovementPanel from '../components/ImprovementPanel'
import BulletGuidance from '../components/BulletGuidance'
import { useResumeData } from '../hooks/useResumeData'
import { calculateATSScore, generateSuggestions } from '../utils/atsScoring'
import { getBulletSuggestions, getImprovementRecommendations } from '../utils/bulletGuidance'
import { getStoredTemplate, getStoredThemeColor } from '../utils/templates'

const SKILL_CATEGORIES = [
  { key: 'technical', label: 'Technical Skills' },
  { key: 'soft', label: 'Soft Skills' },
  { key: 'tools', label: 'Tools & Technologies' },
]

const SUGGESTED_SKILLS = {
  technical: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'GraphQL'],
  soft: ['Team Leadership', 'Problem Solving'],
  tools: ['Git', 'Docker', 'AWS'],
}

const defaultProject = { title: '', description: '', techStack: [], liveUrl: '', githubUrl: '', link: '' }

function categorySkillsToString(skillsByCategory) {
  return [
    ...(skillsByCategory.technical || []),
    ...(skillsByCategory.soft || []),
    ...(skillsByCategory.tools || []),
  ].join(', ')
}

function TagInput({ tags, inputValue, onInputChange, onAddTag, onRemoveTag, placeholder }) {
  return (
    <div className="tag-input-wrap">
      <div className="tag-list">
        {tags.map((tag, idx) => (
          <span key={`${tag}-${idx}`} className="tag-pill">
            <span>{tag}</span>
            <button type="button" className="tag-remove" onClick={() => onRemoveTag(idx)} aria-label={`Remove ${tag}`}>
              x
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => onInputChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            onAddTag()
          }
        }}
      />
    </div>
  )
}

export default function Builder() {
  const { formData, setFormData, isLoaded } = useResumeData()
  const atsScore = React.useMemo(() => calculateATSScore(formData), [formData])
  const suggestions = React.useMemo(() => generateSuggestions(formData), [formData])
  const improvements = React.useMemo(() => getImprovementRecommendations(formData), [formData])
  const [selectedTemplate, setSelectedTemplate] = React.useState(getStoredTemplate())
  const [selectedColor, setSelectedColor] = React.useState(getStoredThemeColor())
  const [skillsExpanded, setSkillsExpanded] = React.useState(true)
  const [projectsExpanded, setProjectsExpanded] = React.useState(true)
  const [projectOpenMap, setProjectOpenMap] = React.useState({})
  const [suggestSkillsLoading, setSuggestSkillsLoading] = React.useState(false)
  const [skillInputs, setSkillInputs] = React.useState({ technical: '', soft: '', tools: '' })
  const [projectStackInputs, setProjectStackInputs] = React.useState({})

  const handlePersonalInfoChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }))
  }

  const handleSummaryChange = (value) => {
    setFormData((prev) => ({ ...prev, summary: value }))
  }

  const handleEducationChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.map((edu, i) => (i === index ? { ...edu, [field]: value } : edu)),
    }))
  }

  const addEducation = () => {
    setFormData((prev) => ({
      ...prev,
      education: [...prev.education, { school: '', degree: '', field: '', year: '' }],
    }))
  }

  const removeEducation = (index) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }))
  }

  const handleExperienceChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp, i) => (i === index ? { ...exp, [field]: value } : exp)),
    }))
  }

  const addExperience = () => {
    setFormData((prev) => ({
      ...prev,
      experience: [...prev.experience, { company: '', position: '', duration: '', description: '' }],
    }))
  }

  const removeExperience = (index) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }))
  }

  const handleLinksChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      links: { ...prev.links, [field]: value },
    }))
  }

  const syncSkills = (nextCategories) => {
    setFormData((prev) => ({
      ...prev,
      skillsByCategory: nextCategories,
      skills: categorySkillsToString(nextCategories),
    }))
  }

  const addCategorySkill = (categoryKey) => {
    const value = (skillInputs[categoryKey] || '').trim()
    if (!value) return
    const existing = formData.skillsByCategory[categoryKey] || []
    if (existing.some((skill) => skill.toLowerCase() === value.toLowerCase())) {
      setSkillInputs((prev) => ({ ...prev, [categoryKey]: '' }))
      return
    }
    const nextCategories = {
      ...formData.skillsByCategory,
      [categoryKey]: [...existing, value],
    }
    syncSkills(nextCategories)
    setSkillInputs((prev) => ({ ...prev, [categoryKey]: '' }))
  }

  const removeCategorySkill = (categoryKey, idx) => {
    const nextCategories = {
      ...formData.skillsByCategory,
      [categoryKey]: (formData.skillsByCategory[categoryKey] || []).filter((_, i) => i !== idx),
    }
    syncSkills(nextCategories)
  }

  const handleSuggestSkills = () => {
    setSuggestSkillsLoading(true)
    window.setTimeout(() => {
      const nextCategories = {
        technical: [...SUGGESTED_SKILLS.technical],
        soft: [...SUGGESTED_SKILLS.soft],
        tools: [...SUGGESTED_SKILLS.tools],
      }
      syncSkills(nextCategories)
      setSuggestSkillsLoading(false)
    }, 1000)
  }

  const handleProjectsChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.map((proj, i) => {
        if (i !== index) return proj
        const next = { ...proj, [field]: value }
        if (field === 'liveUrl' || field === 'githubUrl') {
          next.link = next.githubUrl || next.liveUrl || ''
        }
        return next
      }),
    }))
  }

  const addProject = () => {
    const newIndex = formData.projects.length
    setFormData((prev) => ({
      ...prev,
      projects: [...prev.projects, { ...defaultProject }],
    }))
    setProjectOpenMap((prev) => ({ ...prev, [newIndex]: true }))
  }

  const removeProject = (index) => {
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }))
    setProjectOpenMap((prev) => {
      const next = {}
      formData.projects.forEach((_, i) => {
        if (i === index) return
        const nextIndex = i > index ? i - 1 : i
        next[nextIndex] = prev[i] ?? false
      })
      return next
    })
    setProjectStackInputs((prev) => {
      const next = {}
      formData.projects.forEach((_, i) => {
        if (i === index) return
        const nextIndex = i > index ? i - 1 : i
        next[nextIndex] = prev[i] || ''
      })
      return next
    })
  }

  const addProjectTechTag = (index) => {
    const value = (projectStackInputs[index] || '').trim()
    if (!value) return
    const existing = formData.projects[index]?.techStack || []
    if (existing.some((skill) => skill.toLowerCase() === value.toLowerCase())) {
      setProjectStackInputs((prev) => ({ ...prev, [index]: '' }))
      return
    }
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.map((proj, i) => (i === index ? { ...proj, techStack: [...(proj.techStack || []), value] } : proj)),
    }))
    setProjectStackInputs((prev) => ({ ...prev, [index]: '' }))
  }

  const removeProjectTechTag = (index, tagIndex) => {
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.map((proj, i) => {
        if (i !== index) return proj
        return { ...proj, techStack: (proj.techStack || []).filter((_, idx) => idx !== tagIndex) }
      }),
    }))
  }

  const toggleProjectOpen = (index) => {
    setProjectOpenMap((prev) => ({ ...prev, [index]: !(prev[index] ?? true) }))
  }

  const isProjectOpen = (index) => projectOpenMap[index] ?? true

  const loadSampleData = () => {
    const sampleSkills = {
      technical: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'GraphQL'],
      soft: ['Team Leadership', 'Problem Solving'],
      tools: ['Git', 'Docker', 'AWS'],
    }
    setFormData({
      personalInfo: {
        name: 'Alex Johnson',
        email: 'alex@example.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
      },
      summary:
        'Full-stack developer with 5+ years of experience building scalable web applications. Passionate about clean code and user experience.',
      education: [{ school: 'Stanford University', degree: 'BS', field: 'Computer Science', year: '2019' }],
      experience: [
        {
          company: 'Tech Corp',
          position: 'Senior Software Engineer',
          duration: '2021 - Present',
          description:
            'Led development of microservices architecture serving 1M+ users.\nImproved system performance by 40% resulting in 2x faster response times.',
        },
        {
          company: 'StartupXYZ',
          position: 'Full-Stack Developer',
          duration: '2019 - 2021',
          description:
            'Built and maintained React and Node.js applications.\nReduced deployment time from 30m to 5m through CI/CD optimization.',
        },
      ],
      projects: [
        {
          title: 'AI Resume Builder',
          description: 'Smart resume generation tool with real-time ATS scoring feedback and parsing accuracy improvements.',
          techStack: ['React', 'Node.js', 'PostgreSQL'],
          liveUrl: 'https://example.com/resume-builder',
          githubUrl: 'https://github.com/alexjohnson/ai-resume-builder',
          link: 'https://github.com/alexjohnson/ai-resume-builder',
        },
        {
          title: 'Analytics Dashboard',
          description: 'Real-time data visualization platform processing 10k+ events/sec.',
          techStack: ['TypeScript', 'GraphQL', 'Docker'],
          liveUrl: 'https://example.com/analytics',
          githubUrl: 'https://github.com/alexjohnson/analytics-dashboard',
          link: 'https://github.com/alexjohnson/analytics-dashboard',
        },
      ],
      skillsByCategory: sampleSkills,
      skills: categorySkillsToString(sampleSkills),
      links: {
        github: 'github.com/alexjohnson',
        linkedin: 'linkedin.com/in/alexjohnson',
      },
    })
  }

  if (!isLoaded) {
    return (
      <div className="builder-container">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="builder-container">
      <div className="builder-header">
        <h1>Resume Builder</h1>
        <button className="btn-secondary" onClick={loadSampleData}>
          Load Sample Data
        </button>
      </div>

      <div className="builder-layout">
        <div className="builder-form">
          <section className="form-section">
            <h2>Personal Information</h2>
            <div className="form-row">
              <input
                type="text"
                placeholder="Full Name"
                value={formData.personalInfo.name}
                onChange={(e) => handlePersonalInfoChange('name', e.target.value)}
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.personalInfo.email}
                onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
              />
            </div>
            <div className="form-row">
              <input
                type="tel"
                placeholder="Phone"
                value={formData.personalInfo.phone}
                onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
              />
              <input
                type="text"
                placeholder="Location"
                value={formData.personalInfo.location}
                onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
              />
            </div>
          </section>

          <section className="form-section">
            <h2>Professional Summary</h2>
            <textarea
              placeholder="Write a brief professional summary..."
              rows="4"
              value={formData.summary}
              onChange={(e) => handleSummaryChange(e.target.value)}
            />
          </section>

          <section className="form-section">
            <h2>Education</h2>
            {formData.education.map((edu, index) => (
              <div key={index} className="form-group">
                <input
                  type="text"
                  placeholder="School/University"
                  value={edu.school}
                  onChange={(e) => handleEducationChange(index, 'school', e.target.value)}
                />
                <div className="form-row">
                  <input
                    type="text"
                    placeholder="Degree (e.g., BS, MA)"
                    value={edu.degree}
                    onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Field of Study"
                    value={edu.field}
                    onChange={(e) => handleEducationChange(index, 'field', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Year"
                    value={edu.year}
                    onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
                  />
                </div>
                {formData.education.length > 1 && (
                  <button className="btn-remove" onClick={() => removeEducation(index)}>
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button className="btn-add" onClick={addEducation}>
              + Add Education
            </button>
          </section>

          <section className="form-section">
            <h2>Experience</h2>
            {formData.experience.map((exp, index) => (
              <div key={index} className="form-group">
                <input
                  type="text"
                  placeholder="Company"
                  value={exp.company}
                  onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                />
                <div className="form-row">
                  <input
                    type="text"
                    placeholder="Position"
                    value={exp.position}
                    onChange={(e) => handleExperienceChange(index, 'position', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Duration (e.g., 2021 - 2023)"
                    value={exp.duration}
                    onChange={(e) => handleExperienceChange(index, 'duration', e.target.value)}
                  />
                </div>
                <textarea
                  placeholder="Job description and achievements..."
                  rows="3"
                  value={exp.description}
                  onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                />
                <BulletGuidance suggestions={getBulletSuggestions(exp.description)} />
                {formData.experience.length > 1 && (
                  <button className="btn-remove" onClick={() => removeExperience(index)}>
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button className="btn-add" onClick={addExperience}>
              + Add Experience
            </button>
          </section>

          <section className="form-section accordion-section">
            <button type="button" className="accordion-header" onClick={() => setProjectsExpanded((prev) => !prev)}>
              <h2>Projects</h2>
              <span>{projectsExpanded ? 'Hide' : 'Show'}</span>
            </button>
            {projectsExpanded && (
              <div className="accordion-body">
                {formData.projects.map((project, index) => {
                  const currentLength = project.description.length
                  const remaining = Math.max(0, 200 - currentLength)
                  return (
                    <div key={index} className="project-accordion-item">
                      <div className="project-item-header">
                        <button
                          type="button"
                          className="project-toggle"
                          onClick={() => toggleProjectOpen(index)}
                          aria-expanded={isProjectOpen(index)}
                        >
                          {project.title.trim() ? project.title : `Project ${index + 1}`}
                        </button>
                        <button type="button" className="btn-remove" onClick={() => removeProject(index)}>
                          Delete
                        </button>
                      </div>

                      {isProjectOpen(index) && (
                        <div className="project-item-body">
                          <input
                            type="text"
                            placeholder="Project Title"
                            value={project.title}
                            onChange={(e) => handleProjectsChange(index, 'title', e.target.value)}
                          />
                          <div className="project-description-wrap">
                            <textarea
                              placeholder="Project description..."
                              rows="3"
                              maxLength={200}
                              value={project.description}
                              onChange={(e) => handleProjectsChange(index, 'description', e.target.value)}
                            />
                            <div className="char-counter">{remaining} characters remaining</div>
                          </div>
                          <BulletGuidance suggestions={getBulletSuggestions(project.description)} />

                          <div className="tag-group">
                            <label className="category-label">Tech Stack ({(project.techStack || []).length})</label>
                            <TagInput
                              tags={project.techStack || []}
                              inputValue={projectStackInputs[index] || ''}
                              onInputChange={(value) => setProjectStackInputs((prev) => ({ ...prev, [index]: value }))}
                              onAddTag={() => addProjectTechTag(index)}
                              onRemoveTag={(tagIndex) => removeProjectTechTag(index, tagIndex)}
                              placeholder="Type technology and press Enter"
                            />
                          </div>

                          <input
                            type="text"
                            placeholder="Live URL (optional)"
                            value={project.liveUrl || ''}
                            onChange={(e) => handleProjectsChange(index, 'liveUrl', e.target.value)}
                          />
                          <input
                            type="text"
                            placeholder="GitHub URL (optional)"
                            value={project.githubUrl || ''}
                            onChange={(e) => handleProjectsChange(index, 'githubUrl', e.target.value)}
                          />
                        </div>
                      )}
                    </div>
                  )
                })}

                <button className="btn-add" onClick={addProject}>
                  + Add Project
                </button>
              </div>
            )}
          </section>

          <section className="form-section accordion-section">
            <button type="button" className="accordion-header" onClick={() => setSkillsExpanded((prev) => !prev)}>
              <h2>Skills</h2>
              <span>{skillsExpanded ? 'Hide' : 'Show'}</span>
            </button>
            {skillsExpanded && (
              <div className="accordion-body">
                <div className="skills-actions">
                  <button type="button" className="btn-secondary skills-suggest-btn" onClick={handleSuggestSkills} disabled={suggestSkillsLoading}>
                    {suggestSkillsLoading ? '✨ Suggesting Skills...' : '✨ Suggest Skills'}
                  </button>
                </div>
                {SKILL_CATEGORIES.map((category) => (
                  <div key={category.key} className="tag-group">
                    <label className="category-label">
                      {category.label} ({(formData.skillsByCategory[category.key] || []).length})
                    </label>
                    <TagInput
                      tags={formData.skillsByCategory[category.key] || []}
                      inputValue={skillInputs[category.key] || ''}
                      onInputChange={(value) => setSkillInputs((prev) => ({ ...prev, [category.key]: value }))}
                      onAddTag={() => addCategorySkill(category.key)}
                      onRemoveTag={(idx) => removeCategorySkill(category.key, idx)}
                      placeholder="Type skill and press Enter"
                    />
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="form-section">
            <h2>Links</h2>
            <input
              type="url"
              placeholder="GitHub URL"
              value={formData.links.github}
              onChange={(e) => handleLinksChange('github', e.target.value)}
            />
            <input
              type="url"
              placeholder="LinkedIn URL"
              value={formData.links.linkedin}
              onChange={(e) => handleLinksChange('linkedin', e.target.value)}
            />
          </section>
        </div>

        <div className="builder-sidebar">
          <ScoreCard score={atsScore} suggestions={suggestions} />
          <ImprovementPanel recommendations={improvements} />
          <TemplateSelector onTemplateChange={setSelectedTemplate} onColorChange={setSelectedColor} compact />
          <div className="builder-preview">
            <ResumePreview data={formData} template={selectedTemplate} themeColor={selectedColor} />
          </div>
        </div>
      </div>
    </div>
  )
}

