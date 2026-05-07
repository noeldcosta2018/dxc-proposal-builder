'use client'

import { useState, useRef } from 'react'
import { useStore } from '@/lib/context'

function downloadSvg(svgString: string, filename: string) {
  const blob = new Blob([svgString], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function downloadPng(svgString: string, filename: string, scale = 2) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(svgString, 'image/svg+xml')
  const svg = doc.documentElement as unknown as SVGSVGElement
  const w = parseFloat(svg.getAttribute('width') || '900')
  const h = parseFloat(svg.getAttribute('height') || '560')

  const img = new Image()
  const blob = new Blob([svgString], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  img.onload = () => {
    const canvas = document.createElement('canvas')
    canvas.width = w * scale
    canvas.height = h * scale
    const ctx = canvas.getContext('2d')!
    ctx.scale(scale, scale)
    ctx.fillStyle = '#0E1020'
    ctx.fillRect(0, 0, w, h)
    ctx.drawImage(img, 0, 0, w, h)
    URL.revokeObjectURL(url)
    canvas.toBlob((b) => {
      if (!b) return
      const a = document.createElement('a')
      a.href = URL.createObjectURL(b)
      a.download = filename
      a.click()
    }, 'image/png')
  }
  img.src = url
}

export default function ImagesPage() {
  const store = useStore()
  const [prompt, setPrompt] = useState('')
  const [svg, setSvg] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const promptRef = useRef<HTMLTextAreaElement>(null)

  const generate = async () => {
    if (!prompt.trim()) return
    if (!store.apiKey) {
      setError('API key not set. Go to Setup and enter your Anthropic API key.')
      return
    }

    setLoading(true)
    setError('')
    setSvg('')

    try {
      const res = await fetch('/api/image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': store.apiKey,
        },
        body: JSON.stringify({ prompt }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Generation failed')
      setSvg(data.svg || '')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Generation failed')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) generate()
  }

  const slugPrompt = prompt.trim().slice(0, 40).replace(/\s+/g, '-').replace(/[^a-z0-9-]/gi, '').toLowerCase() || 'diagram'

  return (
    <>
      <div className="hero">
        <span className="hero-label">Visual Assets</span>
        <h1 className="hero-title">Image Builder</h1>
        <p className="hero-sub">
          Describe the diagram you need. Claude generates a professional SVG ready for export.
        </p>
      </div>

      <div className="page-content">
        <div style={{ maxWidth: 900 }}>

          <div className="card" style={{ marginBottom: 24 }}>
            <span className="card-label">Diagram Prompt</span>
            <h2 className="card-title" style={{ marginBottom: 16 }}>Describe Your Diagram</h2>

            <div style={{ marginBottom: 16 }}>
              <label className="field-label">What should this diagram show?</label>
              <textarea
                ref={promptRef}
                className="input"
                rows={4}
                placeholder="e.g. SAP S/4HANA architecture diagram showing the integration between ECC, BTP, and the air-gapped on-premise infrastructure with data flows"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <p className="field-hint">Ctrl+Enter to generate. Be specific: mention layers, components, flows, and any labels you need.</p>
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
              {[
                'SAP S/4HANA system architecture with RISE with SAP layers',
                'Data migration timeline from Oracle EBS to SAP S/4HANA over 18 months',
                'Integration landscape showing SAP BTP middleware connecting legacy systems',
                'RACI matrix for SAP go-live readiness',
                'Air-gapped network topology for on-premise SAP deployment',
              ].map((s) => (
                <button
                  key={s}
                  className="btn btn-outline btn-sm"
                  style={{ fontSize: '.75rem' }}
                  onClick={() => setPrompt(s)}
                >
                  {s.length > 50 ? s.slice(0, 50) + '…' : s}
                </button>
              ))}
            </div>

            <button
              className="btn btn-primary"
              onClick={generate}
              disabled={loading || !prompt.trim()}
              style={{ opacity: loading || !prompt.trim() ? .6 : 1, cursor: loading ? 'wait' : 'pointer' }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Spinner /> Generating diagram...
                </span>
              ) : svg ? 'Regenerate' : 'Generate Diagram'}
            </button>
          </div>

          {error && (
            <div style={{ padding: '14px 20px', background: 'rgba(220,38,38,.08)', borderRadius: 10, border: '1px solid rgba(220,38,38,.15)', marginBottom: 20 }}>
              <p style={{ fontSize: '.85rem', color: '#dc2626' }}>{error}</p>
            </div>
          )}

          {svg && (
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: '.85rem', fontWeight: 600, color: 'var(--text)' }}>Generated Diagram</span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => downloadSvg(svg, `${slugPrompt}.svg`)}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Export SVG
                  </button>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => downloadPng(svg, `${slugPrompt}.png`)}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Export PNG
                  </button>
                </div>
              </div>
              <div
                style={{ padding: 24, background: '#0E1020', overflowX: 'auto' }}
                dangerouslySetInnerHTML={{ __html: svg }}
              />
            </div>
          )}

        </div>
      </div>
    </>
  )
}

function Spinner() {
  return (
    <svg
      width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5"
      style={{ animation: 'spin 1s linear infinite' }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  )
}
