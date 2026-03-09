// Utility for bullet structure guidance
const ACTION_VERBS = [
  'built',
  'developed',
  'designed',
  'implemented',
  'led',
  'improved',
  'created',
  'optimized',
  'automated',
]

const NUMBER_PATTERN = /(\d+\%|\d+(?:\.\d+)?[xk]?|\d)/i

export function checkBulletStructure(bullet) {
  if (!bullet || !bullet.trim()) {
    return { hasActionVerb: false, hasMetrics: false, suggestions: [] }
  }

  const suggestions = []
  const firstWord = bullet.trim().split(/\s+/)[0].toLowerCase()
  const hasActionVerb = ACTION_VERBS.includes(firstWord)
  const hasMetrics = NUMBER_PATTERN.test(bullet)

  if (!hasActionVerb) {
    suggestions.push('Start with a strong action verb.')
  }

  if (!hasMetrics) {
    suggestions.push('Add measurable impact (numbers).')
  }

  return { hasActionVerb, hasMetrics, suggestions }
}

export function getBulletSuggestions(text) {
  if (!text || !text.trim()) {
    return []
  }

  const bullets = text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  return bullets.flatMap((bullet, index) => {
    const { suggestions } = checkBulletStructure(bullet)
    return suggestions.map((message) => `Bullet ${index + 1}: ${message}`)
  })
}

// Get overall improvement recommendations
export function getImprovementRecommendations(formData) {
  const recommendations = []

  const projectsWithContent = formData.projects.filter((p) => p.title && p.title.trim())
  if (projectsWithContent.length < 2) {
    recommendations.push('Add at least one more project to strengthen your profile.')
  }

  const allBullets = [
    ...formData.experience.map((e) => e.description),
    ...formData.projects.map((p) => p.description),
  ].join(' ')
  if (!NUMBER_PATTERN.test(allBullets)) {
    recommendations.push('Add measurable impact with numbers in experience or projects.')
  }

  const summaryWords = formData.summary
    ? formData.summary.trim().split(/\s+/).filter(Boolean).length
    : 0
  if (summaryWords < 40) {
    recommendations.push('Expand your summary to at least 40 words.')
  }

  const skillsArray = formData.skills.split(',').map((s) => s.trim()).filter((s) => s)
  if (skillsArray.length < 8) {
    recommendations.push('Expand your skills section to include at least 8 skills.')
  }

  const experienceWithContent = formData.experience.filter((e) => e.company && e.company.trim())
  if (experienceWithContent.length === 0) {
    recommendations.push('Add internship or project work in your experience section.')
  }

  return recommendations.slice(0, 3)
}
