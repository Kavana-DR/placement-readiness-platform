// Hook to manage resume data with localStorage persistence
import { useState } from 'react'
import { dispatchAppDataUpdated } from '../../../src/utils/appEvents'

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

function getInitialFormData() {
  const savedData = localStorage.getItem(STORAGE_KEY)
  if (!savedData) return defaultFormData

  try {
    const parsedData = JSON.parse(savedData)
    if (isStoredSampleData(parsedData)) {
      localStorage.removeItem(STORAGE_KEY)
      return defaultFormData
    }
    return normalizeFormData(parsedData)
  } catch (error) {
    console.error('Failed to parse saved data:', error)
    return defaultFormData
  }
}

export function useResumeData() {
  const [formData, setFormData] = useState(() => getInitialFormData())
  const isLoaded = true

  // Save data to localStorage whenever it changes
  const updateFormData = (newDataOrUpdater) => {
    setFormData((prev) => {
      const resolvedData =
        typeof newDataOrUpdater === 'function'
          ? newDataOrUpdater(prev)
          : newDataOrUpdater

      const normalized = normalizeFormData(resolvedData)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized))
      dispatchAppDataUpdated({ scope: 'resume-form', key: STORAGE_KEY, action: 'save' })
      return normalized
    })
  }

  const clearData = () => {
    setFormData(defaultFormData)
    localStorage.removeItem(STORAGE_KEY)
    dispatchAppDataUpdated({ scope: 'resume-form', key: STORAGE_KEY, action: 'clear' })
  }

  return {
    formData,
    setFormData: updateFormData,
    clearData,
    isLoaded
  }
}
