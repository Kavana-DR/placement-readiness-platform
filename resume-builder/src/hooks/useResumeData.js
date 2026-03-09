// Hook to manage resume data with localStorage persistence
import { useState, useEffect } from 'react'

const STORAGE_KEY = 'resumeBuilderData'

const defaultFormData = {
  personalInfo: {
    name: '',
    email: '',
    phone: '',
    location: ''
  },
  summary: '',
  education: [{ school: '', degree: '', field: '', year: '' }],
  experience: [{ company: '', position: '', duration: '', description: '' }],
  projects: [{ title: '', description: '', techStack: [], liveUrl: '', githubUrl: '', link: '' }],
  skillsByCategory: {
    technical: [],
    soft: [],
    tools: []
  },
  skills: '',
  links: {
    github: '',
    linkedin: ''
  }
}

function normalizeProjects(projects) {
  const input = Array.isArray(projects) && projects.length > 0 ? projects : defaultFormData.projects
  return input.map((project) => ({
    title: project?.title || '',
    description: project?.description || '',
    techStack: Array.isArray(project?.techStack) ? project.techStack.filter(Boolean) : [],
    liveUrl: project?.liveUrl || '',
    githubUrl: project?.githubUrl || '',
    link: project?.link || '',
  }))
}

function skillsToString(skillsByCategory) {
  const merged = [
    ...(skillsByCategory?.technical || []),
    ...(skillsByCategory?.soft || []),
    ...(skillsByCategory?.tools || []),
  ]
  return merged.join(', ')
}

function normalizeSkills(parsedData) {
  if (parsedData?.skillsByCategory) {
    const normalized = {
      technical: Array.isArray(parsedData.skillsByCategory.technical) ? parsedData.skillsByCategory.technical : [],
      soft: Array.isArray(parsedData.skillsByCategory.soft) ? parsedData.skillsByCategory.soft : [],
      tools: Array.isArray(parsedData.skillsByCategory.tools) ? parsedData.skillsByCategory.tools : [],
    }
    return {
      skillsByCategory: normalized,
      skills: parsedData.skills && parsedData.skills.trim() ? parsedData.skills : skillsToString(normalized),
    }
  }

  const legacySkills = (parsedData?.skills || '')
    .split(',')
    .map((skill) => skill.trim())
    .filter(Boolean)

  return {
    skillsByCategory: { technical: legacySkills, soft: [], tools: [] },
    skills: legacySkills.join(', ')
  }
}

function normalizeFormData(parsedData = {}) {
  const normalizedSkills = normalizeSkills(parsedData)
  return {
    ...defaultFormData,
    ...parsedData,
    personalInfo: { ...defaultFormData.personalInfo, ...(parsedData.personalInfo || {}) },
    education: Array.isArray(parsedData.education) && parsedData.education.length > 0 ? parsedData.education : defaultFormData.education,
    experience: Array.isArray(parsedData.experience) && parsedData.experience.length > 0 ? parsedData.experience : defaultFormData.experience,
    projects: normalizeProjects(parsedData.projects),
    skillsByCategory: normalizedSkills.skillsByCategory,
    skills: normalizedSkills.skills,
    links: { ...defaultFormData.links, ...(parsedData.links || {}) },
  }
}

function isStoredSampleData(parsedData = {}) {
  const name = parsedData?.personalInfo?.name?.trim?.() || ''
  const email = parsedData?.personalInfo?.email?.trim?.() || ''
  const summary = parsedData?.summary?.trim?.() || ''
  const firstProject = parsedData?.projects?.[0]?.title?.trim?.() || ''
  const secondProject = parsedData?.projects?.[1]?.title?.trim?.() || ''

  return (
    name === 'Alex Johnson' &&
    email === 'alex@example.com' &&
    firstProject === 'AI Resume Builder' &&
    secondProject === 'Analytics Dashboard' &&
    summary.includes('Full-stack developer with 5+ years of experience')
  )
}

export function useResumeData() {
  const [formData, setFormData] = useState(defaultFormData)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY)
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        // Avoid auto-hydrating prefilled sample data; keep fresh form until user clicks load sample.
        if (isStoredSampleData(parsedData)) {
          localStorage.removeItem(STORAGE_KEY)
          setFormData(defaultFormData)
        } else {
          setFormData(normalizeFormData(parsedData))
        }
      } catch (error) {
        console.error('Failed to parse saved data:', error)
        setFormData(defaultFormData)
      }
    }
    setIsLoaded(true)
  }, [])

  // Save data to localStorage whenever it changes
  const updateFormData = (newDataOrUpdater) => {
    setFormData((prev) => {
      const resolvedData =
        typeof newDataOrUpdater === 'function'
          ? newDataOrUpdater(prev)
          : newDataOrUpdater

      const normalized = normalizeFormData(resolvedData)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized))
      return normalized
    })
  }

  const clearData = () => {
    setFormData(defaultFormData)
    localStorage.removeItem(STORAGE_KEY)
  }

  return {
    formData,
    setFormData: updateFormData,
    clearData,
    isLoaded
  }
}
