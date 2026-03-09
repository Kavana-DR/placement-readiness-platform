import React from 'react'
import '../styles/resume-upload.css'
import { clearParsedResumeData, parseResumeFile } from '../utils/resumeParsing'

function SectionList({ title, values }) {
  return (
    <div className="parsed-section">
      <h4>{title}</h4>
      {values && values.length > 0 ? (
        <ul>
          {values.map((value, index) => (
            <li key={`${title}-${index}`}>{value}</li>
          ))}
        </ul>
      ) : (
        <p className="empty">No data extracted yet.</p>
      )}
    </div>
  )
}

export default function ResumeUploadPanel({ parsedData, onParsedDataChange, onApplyToForm, onClearAll }) {
  const [file, setFile] = React.useState(null)
  const [isParsing, setIsParsing] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState('')
  const fileInputRef = React.useRef(null)

  const handleParse = async () => {
    if (!file) {
      setErrorMessage('Please choose a PDF or DOCX file first.')
      return
    }

    setIsParsing(true)
    setErrorMessage('')

    try {
      const parsed = await parseResumeFile(file)
      onParsedDataChange(parsed)
    } catch (error) {
      setErrorMessage(error.message || 'Unable to parse this file.')
    } finally {
      setIsParsing(false)
    }
  }

  const handleClear = () => {
    setFile(null)
    setErrorMessage('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    clearParsedResumeData()
    if (typeof onParsedDataChange === 'function') {
      onParsedDataChange(null)
    }
    if (typeof onClearAll === 'function') {
      onClearAll()
    }
  }

  return (
    <section className="form-section resume-upload-panel">
      <h2>Upload Resume</h2>
      <p className="resume-upload-note">Supported formats: PDF and DOCX.</p>

      <div className="resume-upload-controls">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={(event) => setFile(event.target.files?.[0] || null)}
        />
        <button type="button" className="btn-secondary" onClick={handleParse} disabled={isParsing}>
          {isParsing ? 'Parsing...' : 'Parse Resume'}
        </button>
        <button type="button" className="btn-add" onClick={handleClear}>
          Clear Parsed Data
        </button>
        {parsedData && (
          <button type="button" className="btn-add" onClick={onApplyToForm}>
            Apply to Builder Form
          </button>
        )}
      </div>

      {errorMessage && <p className="resume-upload-error">{errorMessage}</p>}

      {parsedData && (
        <div className="parsed-preview">
          <div className="parsed-summary">
            <div>
              <span className="label">Name</span>
              <p>{parsedData.name || 'Not found'}</p>
            </div>
            <div>
              <span className="label">Email</span>
              <p>{parsedData.email || 'Not found'}</p>
            </div>
            <div>
              <span className="label">Phone</span>
              <p>{parsedData.phone || 'Not found'}</p>
            </div>
            <div>
              <span className="label">GitHub</span>
              <p>{parsedData.github || 'Not found'}</p>
            </div>
            <div>
              <span className="label">LinkedIn</span>
              <p>{parsedData.linkedin || 'Not found'}</p>
            </div>
          </div>

          <SectionList title="Extracted Skills" values={parsedData.skills} />
          <SectionList title="Education" values={parsedData.education} />
          <SectionList title="Experience" values={parsedData.experience} />
          <SectionList title="Projects" values={parsedData.projects} />
          <SectionList title="Project Tech Stack" values={parsedData.projectTechStack} />
        </div>
      )}
    </section>
  )
}
