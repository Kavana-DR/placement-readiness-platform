import React from 'react'
import {
  TEMPLATES,
  THEME_COLORS,
  getStoredTemplate,
  saveTemplate,
  getStoredThemeColor,
  saveThemeColor,
} from '../utils/templates'
import '../styles/template-selector.css'

function TemplateThumbnail({ templateId, active }) {
  return (
    <div className={`template-thumb template-thumb-${templateId}`}>
      {templateId === 'classic' && (
        <>
          <div className="thumb-line thumb-title" />
          <div className="thumb-rule" />
          <div className="thumb-line" />
          <div className="thumb-line short" />
          <div className="thumb-rule" />
          <div className="thumb-line" />
        </>
      )}
      {templateId === 'modern' && (
        <div className="thumb-modern">
          <div className="thumb-sidebar" />
          <div className="thumb-main">
            <div className="thumb-line thumb-title" />
            <div className="thumb-line" />
            <div className="thumb-line short" />
          </div>
        </div>
      )}
      {templateId === 'minimal' && (
        <>
          <div className="thumb-line thumb-title" />
          <div className="thumb-gap" />
          <div className="thumb-line" />
          <div className="thumb-line short" />
          <div className="thumb-gap" />
          <div className="thumb-line" />
        </>
      )}
      {active && <span className="template-check">✓</span>}
    </div>
  )
}

export default function TemplateSelector({ onTemplateChange, onColorChange, compact = false }) {
  const [selectedTemplate, setSelectedTemplate] = React.useState(getStoredTemplate())
  const [selectedColor, setSelectedColor] = React.useState(getStoredThemeColor())

  const handleTemplateChange = (templateId) => {
    setSelectedTemplate(templateId)
    saveTemplate(templateId)
    if (onTemplateChange) onTemplateChange(templateId)
  }

  const handleColorChange = (colorId) => {
    setSelectedColor(colorId)
    saveThemeColor(colorId)
    if (onColorChange) onColorChange(colorId)
  }

  return (
    <div className={`template-selector ${compact ? 'compact' : ''}`}>
      <label className="template-label">Template</label>
      <div className="template-grid">
        {Object.entries(TEMPLATES).map(([key, template]) => (
          <button
            key={key}
            type="button"
            className={`template-card ${selectedTemplate === key ? 'active' : ''}`}
            onClick={() => handleTemplateChange(key)}
            title={template.description}
          >
            <TemplateThumbnail templateId={key} active={selectedTemplate === key} />
            <span className="template-name">{template.name}</span>
          </button>
        ))}
      </div>

      <label className="template-label color-label">Color Theme</label>
      <div className="color-options">
        {THEME_COLORS.map((color) => (
          <button
            key={color.id}
            type="button"
            className={`color-dot ${selectedColor === color.id ? 'active' : ''}`}
            style={{ backgroundColor: color.value }}
            title={color.name}
            onClick={() => handleColorChange(color.id)}
            aria-label={`Select ${color.name} theme`}
          />
        ))}
      </div>
    </div>
  )
}
