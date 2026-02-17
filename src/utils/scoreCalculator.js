/**
 * Score Calculation
 * baseScore: computed only on initial analysis
 * finalScore: computed based on baseScore + skill confidence adjustments
 */

export function calculateBaseScore(analysis) {
  let score = 35 // base

  // +5 per detected category (max 30)
  const categoryBonus = Math.min(analysis.skills.allCategories.length * 5, 30)
  score += categoryBonus

  // +10 if company provided
  if (analysis.company && analysis.company.trim()) {
    score += 10
  }

  // +10 if role provided
  if (analysis.role && analysis.role.trim()) {
    score += 10
  }

  // +10 if JD length > 800 chars
  if (analysis.jdText && analysis.jdText.length > 800) {
    score += 10
  }

  return Math.min(score, 100)
}

export function calculateFinalScore(baseScore, skillConfidenceMap) {
  if (typeof baseScore !== 'number' || baseScore < 0 || baseScore > 100) {
    return 0
  }

  let adjustedScore = baseScore

  // Adjust based on skill confidence
  Object.values(skillConfidenceMap || {}).forEach(confidence => {
    if (confidence === 'know') {
      adjustedScore += 2
    } else if (confidence === 'practice') {
      adjustedScore -= 2
    }
  })

  return Math.max(0, Math.min(100, adjustedScore))
}

// Legacy function for backward compatibility
export function calculateReadinessScore(analysis) {
  return calculateBaseScore(analysis)
}
