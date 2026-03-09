import React from 'react'
import '../styles/preview.css'
import ResumePreview from '../components/ResumePreview'
import TemplateSelector from '../components/TemplateSelector'
import ScoreCard from '../components/ScoreCard'
import { useResumeData } from '../hooks/useResumeData'
import { getStoredTemplate, getStoredThemeColor } from '../utils/templates'
import { calculateATSScore, generateSuggestions } from '../utils/atsScoring'
import { generateResumePlainText, isResumePotentiallyIncomplete } from '../utils/resumeExport'

export default function Preview() {
  const { formData, isLoaded } = useResumeData()
  const [selectedTemplate, setSelectedTemplate] = React.useState(getStoredTemplate())
  const [selectedColor, setSelectedColor] = React.useState(getStoredThemeColor())
  const [exportWarning, setExportWarning] = React.useState('')
  const [copyStatus, setCopyStatus] = React.useState('')
  const [pdfToast, setPdfToast] = React.useState('')

  const atsScore = React.useMemo(() => calculateATSScore(formData), [formData])
  const suggestions = React.useMemo(() => generateSuggestions(formData), [formData])

  const showCompletenessWarningIfNeeded = () => {
    if (isResumePotentiallyIncomplete(formData)) {
      setExportWarning('Your resume may look incomplete.')
    } else {
      setExportWarning('')
    }
  }

  const handleDownloadPdf = () => {
    showCompletenessWarningIfNeeded()
    setPdfToast('Opening print dialog for PDF download...')
    window.setTimeout(() => setPdfToast(''), 2200)
    window.print()
  }

  const handleCopyText = async () => {
    showCompletenessWarningIfNeeded()
    const plainText = generateResumePlainText(formData)

    try {
      await navigator.clipboard.writeText(plainText)
      setCopyStatus('Resume text copied to clipboard.')
    } catch {
      setCopyStatus('Unable to copy automatically. Please copy manually.')
    }
  }

  if (!isLoaded) {
    return (
      <div className="preview-container">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="preview-container">
      <div className="preview-header">
        <h1>Resume Preview</h1>
        <p className="preview-subtitle">Clean, professional layout optimized for ATS</p>
      </div>

      <div className="preview-content">
        <div className="preview-top-grid no-print">
          <div className="preview-template-selector">
            <TemplateSelector onTemplateChange={setSelectedTemplate} onColorChange={setSelectedColor} />
          </div>
          <ScoreCard score={atsScore} suggestions={suggestions} />
        </div>

        <div className="preview-actions no-print">
          <button type="button" className="preview-action-btn" onClick={handleDownloadPdf}>
            Download PDF
          </button>
          <button type="button" className="preview-action-btn" onClick={handleCopyText}>
            Copy Resume as Text
          </button>
        </div>
        {exportWarning && <p className="preview-warning no-print">{exportWarning}</p>}
        {copyStatus && <p className="preview-copy-status no-print">{copyStatus}</p>}
        {pdfToast && <div className="preview-toast no-print">{pdfToast}</div>}

        <ResumePreview data={formData} template={selectedTemplate} themeColor={selectedColor} showHeader={false} />
      </div>

      <div className="preview-footer">
        <p>Navigate to Builder to customize your resume</p>
      </div>
    </div>
  )
}
