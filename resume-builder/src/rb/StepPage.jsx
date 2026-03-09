import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const stepTitles = {
  1: 'Problem',
  2: 'Market',
  3: 'Architecture',
  4: 'HLD',
  5: 'LLD',
  6: 'Build',
  7: 'Test',
  8: 'Ship',
}

function storageKey(step) {
  return `rb_step_${step}_artifact`
}

export default function StepPage({ step = 1 }) {
  const navigate = useNavigate()
  const [artifact, setArtifact] = useState(null)
  const [uploaded, setUploaded] = useState(false)

  useEffect(() => {
    // gating: ensure previous steps done
    for (let i = 1; i < step; i++) {
      const k = storageKey(i)
      if (!localStorage.getItem(k)) {
        navigate(`/rb/${String(i).padStart(2, '0')}-${stepTitles[i].toLowerCase()}`)
        return
      }
    }
    // load this step's artifact if already present
    const existing = localStorage.getItem(storageKey(step))
    if (existing) {
      setArtifact(JSON.parse(existing))
      setUploaded(true)
    }
  }, [])

  function handleFile(e) {
    const f = e.target.files[0]
    if (!f) return
    const reader = new FileReader()
    reader.onload = () => {
      const data = { name: f.name, dataUrl: reader.result }
      localStorage.setItem(storageKey(step), JSON.stringify(data))
      setArtifact(data)
      setUploaded(true)
    }
    reader.readAsDataURL(f)
  }

  function goNext() {
    if (!uploaded) return
    if (step < 8) {
      const next = step + 1
      navigate(`/rb/${String(next).padStart(2, '0')}-${stepTitles[next].toLowerCase()}`)
    } else {
      navigate('/rb/proof')
    }
  }

  function goPrev() {
    if (step > 1) {
      const prev = step - 1
      navigate(`/rb/${String(prev).padStart(2, '0')}-${stepTitles[prev].toLowerCase()}`)
    }
  }

  return (
    <div>
      <h2>Step {step}: {stepTitles[step]}</h2>

      <section>
        <label htmlFor="artifact-input">Upload artifact (required to proceed)</label>
        <div>
          <input id="artifact-input" type="file" onChange={handleFile} aria-describedby={uploaded ? 'artifact-status' : 'artifact-required'} />
        </div>
        <div id="artifact-required" className="sr-only">Uploading an artifact is required to enable Next</div>
        {uploaded && artifact && (
          <div id="artifact-status" className="artifact-box" aria-live="polite">
            <strong>Uploaded:</strong> {artifact.name}
            <div className="sr-only">Artifact uploaded for assistive technologies</div>
          </div>
        )}
      </section>

      <div style={{ marginTop: 20 }}>
        <button type="button" onClick={goPrev} className="btn">Previous</button>
        <button type="button" onClick={goNext} className="btn primary" disabled={!uploaded} aria-disabled={!uploaded} aria-describedby={!uploaded ? 'artifact-required' : undefined} style={{ marginLeft: 8 }}>Next</button>
      </div>
    </div>
  )
}
