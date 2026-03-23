import React from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../design-system/components/Card'
import {
  getRecommendedInternships,
  getResumeSkillsFromStorage,
  getStoredApplications,
  saveInternshipApplication,
} from '../utils/internshipRecommendations'
import { APP_DATA_UPDATED_EVENT } from '../utils/appEvents'

const jobs = [
  {
    id: 'frontend-intern-startupx',
    title: 'Frontend Developer Intern',
    company: 'StartupX',
    skills: ['JavaScript', 'React', 'HTML', 'CSS'],
  },
  {
    id: 'backend-intern-techcorp',
    title: 'Backend Developer Intern',
    company: 'TechCorp',
    skills: ['Java', 'Spring', 'SQL'],
  },
  {
    id: 'fullstack-intern-devlabs',
    title: 'Full Stack Intern',
    company: 'DevLabs',
    skills: ['React', 'Node.js', 'MongoDB'],
  },
  {
    id: 'qa-intern-shipfast',
    title: 'QA Automation Intern',
    company: 'ShipFast',
    skills: ['Java', 'Selenium', 'Git'],
  },
  {
    id: 'ml-intern-aimint',
    title: 'Machine Learning Intern',
    company: 'AIMint',
    skills: ['Python', 'Pandas', 'Scikit-learn'],
  },
  {
    id: 'data-intern-analytica',
    title: 'Data Analyst Intern',
    company: 'Analytica',
    skills: ['SQL', 'Python', 'Excel'],
  },
]

export default function JobRecommendations() {
  const navigate = useNavigate()
  const [resumeSkills, setResumeSkills] = React.useState(() => getResumeSkillsFromStorage())
  const [applications, setApplications] = React.useState(() => getStoredApplications())

  React.useEffect(() => {
    const syncFromStorage = () => {
      setResumeSkills(getResumeSkillsFromStorage())
      setApplications(getStoredApplications())
    }

    window.addEventListener('storage', syncFromStorage)
    window.addEventListener(APP_DATA_UPDATED_EVENT, syncFromStorage)
    return () => {
      window.removeEventListener('storage', syncFromStorage)
      window.removeEventListener(APP_DATA_UPDATED_EVENT, syncFromStorage)
    }
  }, [])

  const recommendations = React.useMemo(() => getRecommendedInternships(jobs, resumeSkills), [resumeSkills])
  const appliedJobKeys = React.useMemo(
    () => new Set(applications.map((item) => `${item.jobTitle}::${item.company}`)),
    [applications],
  )

  const handleApply = (job) => {
    const nextApplications = saveInternshipApplication(job)
    setApplications(nextApplications)
  }

  return (
    <Card>
      <div>
        <div className="flex items-center justify-between gap-3 mb-3">
          <h3 className="text-lg font-semibold">Recommended Internships</h3>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="text-xs text-primary underline"
              onClick={() => navigate('/applications')}
            >
              View Applications
            </button>
            <span className="text-xs text-gray-600">{resumeSkills.length} extracted skills</span>
          </div>
        </div>

        {resumeSkills.length === 0 ? (
          <div className="text-sm text-gray-600">
            <p className="mb-3">No parsed resume skills found yet.</p>
            <button
              type="button"
              className="bg-primary text-white px-3 py-2 rounded-md"
              onClick={() => navigate('/resume-builder/builder')}
            >
              Parse Resume First
            </button>
          </div>
        ) : (
          <ul className="space-y-3">
            {recommendations.map((job) => {
              const isApplied = appliedJobKeys.has(`${job.title}::${job.company}`)
              return (
                <li key={job.id} className="border border-gray-200 rounded-md p-3 bg-white">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-semibold">{job.title}</h4>
                      <p className="text-sm text-gray-600">Company: {job.company}</p>
                      <p className="text-sm text-gray-700 mt-1">Match Score: {job.matchScore}%</p>
                    </div>
                    <button
                      type="button"
                      className={`px-3 py-1 rounded-md text-sm ${
                        isApplied ? 'bg-gray-200 text-gray-700 cursor-not-allowed' : 'bg-primary text-white'
                      }`}
                      disabled={isApplied}
                      onClick={() => handleApply(job)}
                    >
                      {isApplied ? 'Applied' : 'Apply'}
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </Card>
  )
}
