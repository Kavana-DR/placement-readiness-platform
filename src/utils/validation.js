/**
 * Validation Utilities
 * Provides input and data validation for the analysis platform
 */

export function validateJDText(jdText) {
  if (!jdText || !jdText.trim()) {
    return {
      valid: false,
      error: 'Job Description is required.',
      warning: null
    }
  }

  const trimmed = jdText.trim()
  if (trimmed.length < 200) {
    return {
      valid: true,
      error: null,
      warning: 'This JD is too short to analyze deeply. Paste full JD for better output.'
    }
  }

  return {
    valid: true,
    error: null,
    warning: null
  }
}

export function validateCompanyName(company) {
  if (!company || !company.trim()) {
    return true // optional
  }
  if (company.trim().length > 100) {
    return false
  }
  return true
}

export function validateRole(role) {
  if (!role || !role.trim()) {
    return true // optional
  }
  if (role.trim().length > 100) {
    return false
  }
  return true
}

export function sanitizeString(str) {
  if (!str) return ''
  return str.trim().substring(0, 500) // cap at 500 chars
}

export function isValidEntry(entry) {
  // Basic schema validation
  if (!entry || typeof entry !== 'object') return false
  if (!entry.id || !entry.createdAt) return false
  if (!entry.jdText || typeof entry.jdText !== 'string') return false
  return true
}
