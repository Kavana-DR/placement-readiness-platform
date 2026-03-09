function withFallback(value) {
  return value && String(value).trim() ? String(value).trim() : 'Not provided'
}

function formatList(items) {
  if (!items || items.length === 0) {
    return '- Not provided'
  }
  return items.map((item) => `- ${item}`).join('\n')
}

export function isResumePotentiallyIncomplete(formData) {
  const hasName = formData.personalInfo?.name && formData.personalInfo.name.trim()
  const hasProject = formData.projects?.some(
    (project) => project.title?.trim() || project.description?.trim(),
  )
  const hasExperience = formData.experience?.some(
    (experience) => experience.company?.trim() || experience.position?.trim() || experience.description?.trim(),
  )

  return !hasName || (!hasProject && !hasExperience)
}

export function generateResumePlainText(formData) {
  const personalInfo = formData.personalInfo || {}
  const education = formData.education || []
  const experience = formData.experience || []
  const projects = formData.projects || []
  const skills = formData.skills
    ? formData.skills.split(',').map((skill) => skill.trim()).filter(Boolean)
    : []

  const educationLines = education
    .filter((entry) => entry.school || entry.degree || entry.field || entry.year)
    .map((entry) =>
      [
        withFallback(entry.degree),
        entry.field ? `in ${entry.field.trim()}` : '',
        entry.school ? `| ${entry.school.trim()}` : '',
        entry.year ? `| ${entry.year.trim()}` : '',
      ]
        .join(' ')
        .replace(/\s+\|/g, ' |')
        .trim(),
    )

  const experienceLines = experience
    .filter((entry) => entry.company || entry.position || entry.duration || entry.description)
    .map((entry) => {
      const header = [withFallback(entry.position), entry.company ? `| ${entry.company.trim()}` : '', entry.duration ? `| ${entry.duration.trim()}` : '']
        .join(' ')
        .replace(/\s+\|/g, ' |')
        .trim()
      const bullets = entry.description
        ? entry.description
            .split('\n')
            .map((line) => line.trim())
            .filter(Boolean)
            .map((line) => `  - ${line}`)
            .join('\n')
        : '  - Not provided'
      return `${header}\n${bullets}`
    })

  const projectLines = projects
    .filter((entry) => entry.title || entry.description || entry.link)
    .map((entry) => {
      const header = [withFallback(entry.title), entry.link ? `| ${entry.link.trim()}` : '']
        .join(' ')
        .replace(/\s+\|/g, ' |')
        .trim()
      const bullets = entry.description
        ? entry.description
            .split('\n')
            .map((line) => line.trim())
            .filter(Boolean)
            .map((line) => `  - ${line}`)
            .join('\n')
        : '  - Not provided'
      return `${header}\n${bullets}`
    })

  const contactParts = [
    personalInfo.email && personalInfo.email.trim(),
    personalInfo.phone && personalInfo.phone.trim(),
    personalInfo.location && personalInfo.location.trim(),
  ].filter(Boolean)

  const links = [
    formData.links?.github ? `GitHub: ${formData.links.github.trim()}` : '',
    formData.links?.linkedin ? `LinkedIn: ${formData.links.linkedin.trim()}` : '',
  ].filter(Boolean)

  return [
    `Name\n${withFallback(personalInfo.name)}`,
    `Contact\n${contactParts.length ? contactParts.join(' | ') : 'Not provided'}`,
    `Summary\n${withFallback(formData.summary)}`,
    `Education\n${formatList(educationLines)}`,
    `Experience\n${formatList(experienceLines)}`,
    `Projects\n${formatList(projectLines)}`,
    `Skills\n${skills.length ? skills.join(', ') : 'Not provided'}`,
    `Links\n${links.length ? links.join('\n') : 'Not provided'}`,
  ].join('\n\n')
}
