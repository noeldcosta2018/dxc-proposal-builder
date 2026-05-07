'use client'

import { useState, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import { useStore } from '@/lib/context'
import { exportSectionDocx, exportAllDocx } from '@/lib/exportDocx'
import type { EngagementContext } from '@/lib/context'

interface Section {
  id: string
  heading: string
  content: string
  editing: boolean
  loading: boolean
  error: string
}

function uid() {
  return Math.random().toString(36).slice(2, 9)
}

const DEFAULT_SECTIONS = [
  'Executive Summary',
  'Our Understanding of the Requirement',
  'Proposed Approach and Methodology',
  'SAP Solution Architecture',
  'Air-Gapped Infrastructure Design',
  'Security and Compliance Framework',
  'Data Migration Strategy',
  'Integration Architecture',
  'Change Management and Training',
  'Project Governance and PMO',
  'Risk Register',
  'Why DXC',
]

export default function SectionsPage() {
  const store = useStore()
  const [sections, setSections] = useState<Section[]>([])

  const addSection = useCallback((heading = '') => {
    setSections((prev) => [
      ...prev,
      { id: uid(), heading, content: '', editing: false, loading: false, error: '' },
    ])
  }, [])

  const updateHeading = useCallback((id: string, heading: string) => {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, heading } : s)))
  }, [])

  const updateContent = useCallback((id: string, content: string) => {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, content } : s)))
  }, [])

  const toggleEdit = useCallback((id: string) => {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, editing: !s.editing } : s)))
  }, [])

  const deleteSection = useCallback((id: string) => {
    setSections((prev) => prev.filter((s) => s.id !== id))
  }, [])

  const generate = useCallback(
    async (id: string) => {
      const sec = sections.find((s) => s.id === id)
      if (!sec || !sec.heading.trim()) return
      if (!store.apiKey) {
        setSections((prev) =>
          prev.map((s) =>
            s.id === id ? { ...s, error: 'API key not set. Go to Setup and enter your Anthropic API key.' } : s
          )
        )
        return
      }

      setSections((prev) => prev.map((s) => (s.id === id ? { ...s, loading: true, error: '' } : s)))

      const ctx: EngagementContext = {
        clientName:    store.clientName,
        clientShort:   store.clientShort,
        projectName:   store.projectName,
        engagement:    store.engagement,
        researchUrl:   store.researchUrl,
        researchNotes: store.researchNotes,
        differentiators: store.differentiators,
      }

      try {
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': store.apiKey,
          },
          body: JSON.stringify({ heading: sec.heading, context: ctx }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Generation failed')
        setSections((prev) =>
          prev.map((s) => (s.id === id ? { ...s, content: data.content, loading: false, editing: false } : s))
        )
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Generation failed'
        setSections((prev) => prev.map((s) => (s.id === id ? { ...s, loading: false, error: msg } : s)))
      }
    },
    [sections, store]
  )

  const exportOne = useCallback(
    (sec: Section) => {
      exportSectionDocx(
        { heading: sec.heading, content: sec.content },
        store.clientName || 'Client',
        store.projectName || 'Proposal'
      )
    },
    [store]
  )

  const exportAll = useCallback(() => {
    const ready = sections.filter((s) => s.content.trim())
    if (!ready.length) return
    exportAllDocx(
      ready.map((s) => ({ heading: s.heading, content: s.content })),
      store.clientName || 'Client',
      store.projectName || 'Proposal'
    )
  }, [sections, store])

  const filledCount = sections.filter((s) => s.content.trim()).length

  return (
    <>
      <div className="hero">
        <span className="hero-label">Content Generation</span>
        <h1 className="hero-title">Proposal Sections</h1>
        <p className="hero-sub">
          Each section is drafted by Claude acting as a senior DXC SAP architect. Edit inline after generation.
        </p>
      </div>

      <div className="page-content">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 28,
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => addSection()}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Section
            </button>
            {DEFAULT_SECTIONS.slice(0, 4).map((h) => (
              <button
                key={h}
                className="btn btn-outline btn-sm"
                onClick={() => addSection(h)}
                style={{ fontSize: '.75rem' }}
              >
                + {h}
              </button>
            ))}
          </div>

          {filledCount > 0 && (
            <button className="btn btn-ghost" onClick={exportAll}
              style={{ background: 'var(--primary)', border: '1px solid rgba(255,255,255,.12)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Export All as DOCX ({filledCount})
            </button>
          )}
        </div>

        {sections.length === 0 && (
          <div
            style={{
              textAlign: 'center', padding: '80px 32px',
              background: 'var(--white)', borderRadius: 'var(--r-lg)',
              border: '1px dashed var(--border)',
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--border)" strokeWidth="1.5" style={{ margin: '0 auto' }}>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="12" y1="18" x2="12" y2="12"/>
                <line x1="9" y1="15" x2="15" y2="15"/>
              </svg>
            </div>
            <p style={{ color: 'var(--text-light)', fontSize: '.9rem', marginBottom: 20 }}>
              No sections yet. Add a section or pick a common heading above.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              {DEFAULT_SECTIONS.map((h) => (
                <button
                  key={h}
                  className="btn btn-outline btn-sm"
                  onClick={() => addSection(h)}
                  style={{ fontSize: '.75rem' }}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {sections.map((sec, i) => (
            <SectionCard
              key={sec.id}
              section={sec}
              index={i}
              onHeadingChange={(v) => updateHeading(sec.id, v)}
              onContentChange={(v) => updateContent(sec.id, v)}
              onGenerate={() => generate(sec.id)}
              onToggleEdit={() => toggleEdit(sec.id)}
              onDelete={() => deleteSection(sec.id)}
              onExport={() => exportOne(sec)}
            />
          ))}
        </div>
      </div>
    </>
  )
}

interface CardProps {
  section: Section
  index: number
  onHeadingChange: (v: string) => void
  onContentChange: (v: string) => void
  onGenerate: () => void
  onToggleEdit: () => void
  onDelete: () => void
  onExport: () => void
}

function SectionCard({
  section, index,
  onHeadingChange, onContentChange,
  onGenerate, onToggleEdit, onDelete, onExport,
}: CardProps) {
  const num = String(index + 1).padStart(2, '0')
  const hasContent = section.content.trim().length > 0

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 16,
          padding: '20px 24px',
          borderBottom: hasContent || section.loading ? '1px solid var(--border)' : 'none',
        }}
      >
        <div
          style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'rgba(255,126,81,.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            fontFamily: "'Epilogue','Inter',sans-serif",
            fontWeight: 800, fontSize: '.78rem', color: 'var(--accent)',
          }}
        >
          {num}
        </div>

        <input
          className="input"
          style={{ flex: 1, border: 'none', padding: '0 0', fontSize: '1rem', fontWeight: 700, color: 'var(--text)', background: 'transparent', boxShadow: 'none' }}
          placeholder="Section heading..."
          value={section.heading}
          onChange={(e) => onHeadingChange(e.target.value)}
        />

        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <button
            className="btn btn-primary btn-sm"
            onClick={onGenerate}
            disabled={section.loading || !section.heading.trim()}
            style={{ opacity: section.loading || !section.heading.trim() ? .6 : 1, cursor: section.loading ? 'wait' : 'pointer' }}
          >
            {section.loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Spinner /> Generating...
              </span>
            ) : hasContent ? 'Regenerate' : 'Generate'}
          </button>

          {hasContent && (
            <>
              <button className="btn btn-outline btn-sm" onClick={onToggleEdit} title={section.editing ? 'Preview' : 'Edit'}>
                {section.editing ? (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                ) : (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                )}
              </button>
              <button className="btn btn-outline btn-sm" onClick={onExport} title="Export as DOCX">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              </button>
            </>
          )}

          <button className="btn btn-sm" onClick={onDelete}
            style={{ background: 'rgba(220,38,38,.08)', color: '#dc2626', border: '1px solid rgba(220,38,38,.15)' }}
            title="Delete section"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
          </button>
        </div>
      </div>

      {section.error && (
        <div style={{ padding: '12px 24px', background: 'rgba(220,38,38,.06)', borderBottom: '1px solid rgba(220,38,38,.12)' }}>
          <p style={{ fontSize: '.82rem', color: '#dc2626' }}>{section.error}</p>
        </div>
      )}

      {section.loading && (
        <div style={{ padding: '32px 24px', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, color: 'var(--text-light)', fontSize: '.88rem' }}>
            <Spinner />
            Claude is drafting this section...
          </div>
        </div>
      )}

      {!section.loading && hasContent && (
        <div style={{ padding: '24px 28px' }}>
          {section.editing ? (
            <textarea
              className="input"
              rows={18}
              value={section.content}
              onChange={(e) => onContentChange(e.target.value)}
              style={{ fontFamily: 'monospace', fontSize: '.83rem', lineHeight: 1.65 }}
            />
          ) : (
            <div className="md-content">
              <ReactMarkdown>{section.content}</ReactMarkdown>
            </div>
          )}
        </div>
      )}
    </div>
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
