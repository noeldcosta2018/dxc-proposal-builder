'use client'

import { useRef, useState } from 'react'
import TimelineSvg, { type GanttPhase } from '@/components/diagrams/TimelineSvg'
import ExportButtons from '@/components/ExportButtons'
import { useStore } from '@/lib/context'

const PHASE_COLORS = ['#6399F0', '#FF7E51', '#FFA962', '#00a864', '#B88A99', '#FFB87E']

const DEFAULT_PHASES: GanttPhase[] = [
  { name: 'Discover',  start: 1, duration: 2, color: '#6399F0', milestone: false },
  { name: 'Prepare',   start: 3, duration: 2, color: '#FF7E51', milestone: false },
  { name: 'Explore',   start: 4, duration: 3, color: '#FFA962', milestone: false },
  { name: 'Realize',   start: 7, duration: 6, color: '#00a864', milestone: true  },
  { name: 'Deploy',    start: 13, duration: 3, color: '#B88A99', milestone: true  },
  { name: 'Run / AMS', start: 16, duration: 12, color: '#FFB87E', milestone: false },
]

export default function TimelinePage() {
  const svgRef = useRef<SVGSVGElement>(null)
  const { clientName } = useStore()
  const [title, setTitle] = useState('Programme Timeline')
  const [phases, setPhases] = useState<GanttPhase[]>(DEFAULT_PHASES)
  const [totalMonths, setTotalMonths] = useState(28)

  const update = (i: number, field: keyof GanttPhase, value: string | number | boolean) => {
    setPhases((prev) => prev.map((p, idx) => idx === i ? { ...p, [field]: value } : p))
  }

  const addPhase = () => {
    const last = phases[phases.length - 1]
    const start = last ? last.start + last.duration : 1
    setPhases((prev) => [...prev, { name: 'New Phase', start, duration: 2, color: PHASE_COLORS[prev.length % PHASE_COLORS.length], milestone: false }])
  }

  const removePhase = (i: number) => setPhases((prev) => prev.filter((_, idx) => idx !== i))

  return (
    <>
      <div className="hero" style={{ padding: '40px 56px 36px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24 }}>
          <div>
            <span className="hero-label">Diagrams</span>
            <h1 className="hero-title" style={{ fontSize: '1.8rem', marginBottom: 8 }}>Project Timeline</h1>
            <p className="hero-sub" style={{ fontSize: '.9rem' }}>Gantt-style phase bars on a month axis. Export PNG or SVG.</p>
          </div>
          <div style={{ flexShrink: 0, paddingTop: 8 }}>
            <ExportButtons svgRef={svgRef} basename="timeline" />
          </div>
        </div>
      </div>

      <div className="diagram-shell">
        <div className="diagram-controls">
          <div style={{ marginBottom: 16 }}>
            <label className="field-label">Diagram Title</label>
            <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label className="field-label">Total Months</label>
            <input className="input" type="number" min={6} max={60} value={totalMonths}
              onChange={(e) => setTotalMonths(Number(e.target.value))} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <span className="section-label" style={{ margin: 0 }}>Phases</span>
            <button className="btn btn-outline btn-sm" onClick={addPhase}>+ Add Phase</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {phases.map((ph, i) => (
              <div key={i} className="card" style={{ padding: 14, borderLeft: `3px solid ${ph.color}` }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                  <input className="input" value={ph.name} onChange={(e) => update(i, 'name', e.target.value)}
                    style={{ flex: 1, fontSize: '.82rem' }} />
                  <input type="color" value={ph.color} onChange={(e) => update(i, 'color', e.target.value)}
                    style={{ width: 32, height: 32, border: 'none', padding: 2, borderRadius: 6, cursor: 'pointer', background: 'none' }} />
                  <button className="btn btn-sm" onClick={() => removePhase(i)}
                    style={{ background: 'rgba(220,38,38,.08)', color: '#dc2626', border: 'none', padding: '4px 8px' }}>x</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <div>
                    <label style={{ fontSize: '.65rem', fontWeight: 700, color: 'var(--text-light)', display: 'block', marginBottom: 3 }}>Start Month</label>
                    <input className="input" type="number" min={1} value={ph.start} onChange={(e) => update(i, 'start', Number(e.target.value))}
                      style={{ fontSize: '.82rem', padding: '6px 10px' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '.65rem', fontWeight: 700, color: 'var(--text-light)', display: 'block', marginBottom: 3 }}>Duration (months)</label>
                    <input className="input" type="number" min={1} value={ph.duration} onChange={(e) => update(i, 'duration', Number(e.target.value))}
                      style={{ fontSize: '.82rem', padding: '6px 10px' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                  <input type="checkbox" id={`ms-${i}`} checked={!!ph.milestone} onChange={(e) => update(i, 'milestone', e.target.checked)} />
                  <label htmlFor={`ms-${i}`} style={{ fontSize: '.78rem', color: 'var(--text-mid)', cursor: 'pointer' }}>Show milestone marker</label>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="diagram-preview" style={{ overflowX: 'auto' }}>
          <div style={{ background: '#0E1020', borderRadius: 12, overflow: 'hidden', display: 'inline-block' }}>
            <TimelineSvg ref={svgRef} phases={phases} totalMonths={totalMonths} title={title} clientName={clientName} />
          </div>
        </div>
      </div>
    </>
  )
}
