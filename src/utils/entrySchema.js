/**
 * Entry Schema Normalizer
 * Ensures all history entries conform to the standardized schema
 */

/**
 * Standardized Analysis Entry Schema
 */
export function createEmptyEntry() {
  return {
    id: '', // will be set by caller
    createdAt: '', // will be set by caller
    company: '',
    role: '',
    jdText: '',
    extractedSkills: {
      coreCS: [],
      languages: [],
      web: [],
      data: [],
      cloudDevOps: [],
      testing: [],
      other: []
    },
    checklist: [],
    plan: [],
    questions: [],
    companyIntel: null,
    roundMapping: [],
    baseScore: 0,
    finalScore: 0,
    skillConfidenceMap: {},
    updatedAt: ''
  }
}

/**
 * Normalize old or incomplete entries to new schema
 */
export function normalizeEntry(entry) {
  if (!entry || typeof entry !== 'object') {
    return null
  }

  try {
    const normalized = {
      // Identity
      id: entry.id || '',
      createdAt: entry.createdAt || new Date().toISOString(),
      updatedAt: entry.updatedAt || entry.createdAt || new Date().toISOString(),

      // Input data
      company: entry.company ? String(entry.company).trim() : '',
      role: entry.role ? String(entry.role).trim() : '',
      jdText: entry.jdText ? String(entry.jdText).trim() : '',

      // Extracted skills - normalize to standard format
      extractedSkills: normalizeExtractedSkills(entry.extractedSkills),

      // Generated content
      checklist: Array.isArray(entry.checklist) ? entry.checklist : [],
      plan: normalizeArray(entry.plan),
      questions: Array.isArray(entry.questions) ? entry.questions : [],
      companyIntel: entry.companyIntel || null,
      roundMapping: Array.isArray(entry.roundMapping) ? entry.roundMapping : [],

      // Scores
      baseScore: typeof entry.baseScore === 'number' ? entry.baseScore : 0,
      finalScore: typeof entry.finalScore === 'number' ? entry.finalScore : entry.readinessScore || 0,

      // User confidence tracking
      skillConfidenceMap: entry.skillConfidenceMap && typeof entry.skillConfidenceMap === 'object'
        ? entry.skillConfidenceMap
        : {}
    }

    return normalized
  } catch (e) {
    console.error('Error normalizing entry:', e)
    return null
  }
}

/**
 * Normalize extractedSkills to standard format
 */
function normalizeExtractedSkills(skills) {
  const normalized = {
    coreCS: [],
    languages: [],
    web: [],
    data: [],
    cloudDevOps: [],
    testing: [],
    other: []
  }

  if (!skills || typeof skills !== 'object') {
    return normalized
  }

  // Handle old format: { categorized: { coreCS: [...], ... } }
  const source = skills.categorized || skills

  Object.entries(source).forEach(([key, value]) => {
    if (normalized.hasOwnProperty(key) && Array.isArray(value)) {
      normalized[key] = value.map(v => String(v).toLowerCase().trim())
    }
  })

  return normalized
}

/**
 * Normalize array fields
 */
function normalizeArray(arr) {
  if (!Array.isArray(arr)) return []
  return arr.filter(item => item !== null && item !== undefined)
}

/**
 * Ensure entry has all required fields
 */
export function validateEntrySchema(entry) {
  if (!entry || typeof entry !== 'object') return false

  const requiredFields = ['id', 'createdAt', 'jdText', 'extractedSkills']
  return requiredFields.every(field => field in entry)
}

/**
 * Migrate old extractedSkills format to new format
 */
export function migrateExtractedSkills(oldFormat) {
  const normalized = {
    coreCS: [],
    languages: [],
    web: [],
    data: [],
    cloudDevOps: [],
    testing: [],
    other: []
  }

  if (oldFormat.categorized) {
    Object.assign(normalized, oldFormat.categorized)
  } else {
    Object.assign(normalized, oldFormat)
  }

  return normalized
}

/**
 * Safety wrapper for entry retrieval
 */
export function safeGetEntry(entry) {
  const normalized = normalizeEntry(entry)
  if (!normalized) return null
  if (!validateEntrySchema(normalized)) return null
  return normalized
}
