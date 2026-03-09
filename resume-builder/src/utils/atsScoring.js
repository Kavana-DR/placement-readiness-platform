const ACTION_VERBS = [
  'built',
  'led',
  'designed',
  'improved',
  'created',
  'developed',
  'implemented',
  'optimized',
  'managed',
  'delivered',
]

function hasText(value) {
  return typeof value === 'string' && value.trim().length > 0
}

function parseSkills(formData) {
  const categorySkills = Object.values(formData.skillsByCategory || {}).flat()
  const legacySkills = (formData.skills || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

  const deduped = new Set([...categorySkills, ...legacySkills].map((item) => item.toLowerCase()))
  return deduped.size
}

function hasExperienceWithBullets(formData) {
  return (formData.experience || []).some((exp) => {
    if (!hasText(exp?.description)) return false
    const description = exp.description.trim()
    const bulletPrefixPattern = /(^|\n)\s*[-*\u2022]\s+\S+/m
    const multilinePattern = /\n\s*\S+/
    return bulletPrefixPattern.test(description) || multilinePattern.test(description)
  })
}

function hasEducationEntry(formData) {
  return (formData.education || []).some(
    (edu) => hasText(edu?.school) || hasText(edu?.degree) || hasText(edu?.field) || hasText(edu?.year),
  )
}

function hasProjectEntry(formData) {
  return (formData.projects || []).some((proj) => hasText(proj?.title) || hasText(proj?.description))
}

function hasActionVerb(summary) {
  if (!hasText(summary)) return false
  return ACTION_VERBS.some((verb) => new RegExp(`\\b${verb}\\b`, 'i').test(summary))
}

export function calculateATSScore(formData) {
  let score = 0

  if (hasText(formData.personalInfo?.name)) score += 10
  if (hasText(formData.personalInfo?.email)) score += 10
  if ((formData.summary || '').trim().length > 50) score += 10
  if (hasExperienceWithBullets(formData)) score += 15
  if (hasEducationEntry(formData)) score += 10
  if (parseSkills(formData) >= 5) score += 10
  if (hasProjectEntry(formData)) score += 10
  if (hasText(formData.personalInfo?.phone)) score += 5
  if (hasText(formData.links?.linkedin)) score += 5
  if (hasText(formData.links?.github)) score += 5
  if (hasActionVerb(formData.summary || '')) score += 10

  return Math.min(score, 100)
}

export function generateSuggestions(formData) {
  const suggestions = []

  if (!hasText(formData.personalInfo?.name)) suggestions.push('Add your full name (+10 points)')
  if (!hasText(formData.personalInfo?.email)) suggestions.push('Add your email address (+10 points)')
  if ((formData.summary || '').trim().length <= 50) suggestions.push('Add a professional summary over 50 characters (+10 points)')
  if (!hasExperienceWithBullets(formData)) suggestions.push('Add at least one experience entry with bullet points (+15 points)')
  if (!hasEducationEntry(formData)) suggestions.push('Add at least one education entry (+10 points)')
  if (parseSkills(formData) < 5) suggestions.push('Add at least 5 skills (+10 points)')
  if (!hasProjectEntry(formData)) suggestions.push('Add at least one project (+10 points)')
  if (!hasText(formData.personalInfo?.phone)) suggestions.push('Add your phone number (+5 points)')
  if (!hasText(formData.links?.linkedin)) suggestions.push('Add your LinkedIn profile (+5 points)')
  if (!hasText(formData.links?.github)) suggestions.push('Add your GitHub profile (+5 points)')
  if (!hasActionVerb(formData.summary || '')) suggestions.push('Use action verbs in your summary like built, led, or improved (+10 points)')

  return suggestions
}
