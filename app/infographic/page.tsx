'use client'

import { useRef, useState } from 'react'
import InfographicSvg, { type StatItem, type Pillar } from '@/components/diagrams/InfographicSvg'
import ExportButtons from '@/components/ExportButtons'
import { useStore } from '@/lib/context'

const DEFAULT_STATS: StatItem[] = [
  { value: '30', unit: 'yrs', label: 'SAP Experience' },
  { value: '500+', unit: '', label: 'SAP Programs Delivered' },
  { value: '12', unit: '', label: 'Gulf Implementations' },
  { value: '99%', unit: '', label: 'Data Quality SLA' },
]

const DEFAULT_PILLARS: Pillar[] = [
  { title: 'Air-Gapped Expertise', description: 'Delivered S/4HANA in classified and isolated environments. Full lifecycle from design to hypercare without internet egress.' },
  { title: 'On-Premise Infrastructure', description: 'Physical server sizing, HANA landscape design, storage architecture, and DR configuration. No cloud assumptions.' },
  { title: 'Security and GRC', description: 'SOD framework, role design, GRC integration, and identity management from day one. Not bolted on after go-live.' },
  { title: 'Regional Delivery', description: '[PLACEHOLDER: Regional reference - Gulf or MENA delivery experience]' },
]

export default function InfographicPage() {
  const svgRef = useRef<SVGSVGElement>(null)
  const { clientName, projectName } = useStore()
  const [title, setTitle] = useState(projectName || 'SAP S/4HANA Transformation')
  const [subtitle, setSubtitle] = useState('On-Premise Air-Gapped Deployment')
  const [stats, setStats] = useState<StatItem[]>(DEFAULT_STATS)
  const [pillars, setPillars] = useState<Pillar[]>(DEFAULT_PILLARS)

  const updateStat = (i: number, field: keyof StatItem, value: string) => {
    setStats((prev) => prev.map((s, idx) => idx === i ? { ...s, [field]: value } : s))
  }

  const updatePillar = (i: number, field: keyof Pillar, value: string) => {
    setPillars((prev) => prev.map((p, idx) => idx === i ? { ...p, [field]: value } : p))
  }

  return (
    <>
      <div className="hero" style={{ padding: '40px 56px 36px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24 }}>
          <div>
            <span className="hero-label">Diagrams</span>
            <h1 className="hero-title" style={{ fontSize: '1.8rem', marginBottom: 8 }}>Executive Infographic</h1>
            <p className="hero-sub" style={{ fontSize: '.9rem' }}>Single-page executive summary with stats and differentiators. Export PNG or SVG.</p>
          </div>
          <div style={{ flexShrink: 0, paddingTop: 8 }}>
            <ExportButtons svgRef={svgRef} basename="infographic" />
          </div>
        </div>
      </div>

      <div className="diagram-shell">
        <div className="diagram-controls">
          <div style={{ marginBottom: 16 }}>
            <label className="field-label">Title Line 1</label>
            <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label className="field-label">Title Line 2 / Subtitle</label>
            <input className="input" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
          </div>

          <div style={{ marginBottom: 8 }}>
            <span className="section-label">At-a-Glance Stats (4 max)</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
            {stats.map((stat, i) => (
              <div key={i} className="card" style={{ padding: 12 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px', gap: 6, marginBottom: 6 }}>
                  <div>
                    <label style={{ fontSize: '.65rem', fontWeight: 700, color: 'var(--text-light)', display: 'block', marginBottom: 3 }}>Value</label>
                    <input className="input" value={stat.value} onChange={(e) => updateStat(i, 'value', e.target.value)}
                      style={{ fontSize: '.82rem' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '.65rem', fontWeight: 700, color: 'var(--text-light)', display: 'block', marginBottom: 3 }}>Unit</label>
                    <input className="input" value={stat.unit} onChange={(e) => updateStat(i, 'unit', e.target.value)}
                      style={{ fontSize: '.82rem' }} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '.65rem', fontWeight: 700, color: 'var(--text-light)', display: 'block', marginBottom: 3 }}>Label</label>
                  <input className="input" value={stat.label} onChange={(e) => updateStat(i, 'label', e.target.value)}
                    style={{ fontSize: '.82rem' }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: 8 }}>
            <span className="section-label">Why DXC Pillars (4 max)</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {pillars.map((pillar, i) => (
              <div key={i} className="card" style={{ padding: 12 }}>
                <div style={{ marginBottom: 8 }}>
                  <label style={{ fontSize: '.65rem', fontWeight: 700, color: 'var(--text-light)', display: 'block', marginBottom: 3 }}>Title</label>
                  <input className="input" value={pillar.title} onChange={(e) => updatePillar(i, 'title', e.target.value)}
                    style={{ fontSize: '.82rem' }} />
                </div>
                <div>
                  <label style={{ fontSize: '.65rem', fontWeight: 700, color: 'var(--text-light)', display: 'block', marginBottom: 3 }}>Description (2 lines)</label>
                  <textarea className="input" rows={2} value={pillar.description} onChange={(e) => updatePillar(i, 'description', e.target.value)}
                    style={{ fontSize: '.8rem' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="diagram-preview">
          <div style={{ background: '#F6F3F0', borderRadius: 12, overflow: 'hidden', display: 'inline-block', maxWidth: '100%', boxShadow: '0 4px 32px rgba(14,16,32,.15)' }}>
            <InfographicSvg ref={svgRef} title={title} subtitle={subtitle} stats={stats} pillars={pillars} clientName={clientName} />
          </div>
        </div>
      </div>
    </>
  )
}
