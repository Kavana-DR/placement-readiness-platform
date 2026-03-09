// Template and theme configuration
export const TEMPLATES = {
  classic: {
    name: 'Classic',
    description: 'Traditional single-column with serif headings and section rules.',
    id: 'classic',
  },
  modern: {
    name: 'Modern',
    description: 'Two-column layout with left sidebar and main content.',
    id: 'modern',
  },
  minimal: {
    name: 'Minimal',
    description: 'Clean single-column with generous whitespace and no rules.',
    id: 'minimal',
  },
}

export const THEME_COLORS = [
  { id: 'teal', name: 'Teal', value: 'hsl(168, 60%, 40%)' },
  { id: 'navy', name: 'Navy', value: 'hsl(220, 60%, 35%)' },
  { id: 'burgundy', name: 'Burgundy', value: 'hsl(345, 60%, 35%)' },
  { id: 'forest', name: 'Forest', value: 'hsl(150, 50%, 30%)' },
  { id: 'charcoal', name: 'Charcoal', value: 'hsl(0, 0%, 25%)' },
]

export const DEFAULT_TEMPLATE = 'classic'
export const DEFAULT_THEME_COLOR = 'teal'

const TEMPLATE_STORAGE_KEY = 'resumeTemplate'
const COLOR_STORAGE_KEY = 'resumeThemeColor'

export function getStoredTemplate() {
  const stored = localStorage.getItem(TEMPLATE_STORAGE_KEY)
  return stored && TEMPLATES[stored] ? stored : DEFAULT_TEMPLATE
}

export function saveTemplate(templateId) {
  if (TEMPLATES[templateId]) {
    localStorage.setItem(TEMPLATE_STORAGE_KEY, templateId)
  }
}

export function getStoredThemeColor() {
  const stored = localStorage.getItem(COLOR_STORAGE_KEY)
  return stored && THEME_COLORS.some((color) => color.id === stored) ? stored : DEFAULT_THEME_COLOR
}

export function saveThemeColor(colorId) {
  if (THEME_COLORS.some((color) => color.id === colorId)) {
    localStorage.setItem(COLOR_STORAGE_KEY, colorId)
  }
}

export function getThemeColorValue(colorId) {
  const found = THEME_COLORS.find((color) => color.id === colorId)
  return found ? found.value : THEME_COLORS[0].value
}
