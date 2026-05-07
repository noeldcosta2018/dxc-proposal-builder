'use client'

import { useRef, useState } from 'react'
import LandscapeSvg, { type LandscapeSystem } from '@/components/diagrams/LandscapeSvg'
import ExportButtons from '@/components/ExportButtons'
import { useStore } from '@/lib/context'

const DEFAULT_SYSTEMS: LandscapeSystem[] = [
  { name: 'S/4HANA',    instances: { DEV: 'S4D 100', QAS: 'S4Q 100', PRD: 'S4P 100', DR: 'S4D-DR' } },
  { name: 'BW/4HANA',   instances: { DEV: 'BWD 100', QAS: 'BWQ 100', PRD: 'BWP 100', DR: '' } },
  { name: 'SolMan',     instances: { DEV: '',         QAS: '',         PRD: 'SMQ 001', DR: '' } },
  { name: 'GRC / IAM',  instances: { DEV: 'GRCD',    QAS: 'GRCQ',    PRD: 'GRCP',    DR: '' } },
]
const DEFAULT_ENVS = ['DEV', 'QAS', 'PRD', 'DR']

export default function LandscapePage() {
  const svgRef = useRef<SVGSVGElement>(null)
  const { clientName } = useStore()
  const [title, setTitle] = useState('SAP System Landscape')
  const [systems, setSystems] = useState<LandscapeSystem[]>(DEFAULT_SYSTEMS)
  const [envs, setEnvs] = useState<string[]>(DEFAULT_ENVS)

  const updateSystem = (i: number, field: 'name', value: string) => {
    setSystems((prev) => prev.map((s, idx) => idx === i ? { ...s, [field]: value } : s))
  }

  const updateInstance = (si: number, env: string, value: string) => {
    setSystems((prev) => prev.map((s, idx) => idx === si ? { ...s, instances: { ...s.instances, [env]: value } } : s))
  }

  const addSystem = () => {
    const blank: LandscapeSystem = { name: 'New System', instances: Object.fromEntries(envs.map((e) => [e, ''])) }
    setSystems((prev) => [...prev, blank])
  }

  const removeSystem = (i: number) => setSystems((prev) => prev.filter((_, idx) => idx !== i))

  return (
    <>
      <div className="hero" style={{ padding: '40px 56px 36px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24 }}>
          <div>
            <span className="hero-label">Diagrams</span>
            <h1 className="hero-title" style={{ fontSize: '1.8rem', marginBottom: 8 }}>System Landscape</h1>
            <p className="hero-sub" style={{ fontSize: '.9rem' }}>Systems x environments matrix with transport arrows. Export PNG or SVG.</p>
          </div>
          <div style={{ flexShrink: 0, paddingTop: 8 }}>
            <ExportButtons svgRef={svgRef} basename="landscape" />
          </div>
        </div>
      </div>

      <div className="diagram-shell">
        <div className="diagram-controls">
          <div style={{ marginBottom: 20 }}>
            <label className="field-label">Diagram Title</label>
            <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label className="field-label">Environments (comma-separated)</label>
            <input className="input" value={envs.join(', ')}
              onChange={(e) => setEnvs(e.target.value.split(',').map((s) => s.trim()).filter(Boolean))} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <span className="section-label" style={{ margin: 0 }}>Systems</span>
            <button className="btn btn-outline btn-sm" onClick={addSystem}>+ Add System</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {systems.map((sys, i) => (
              <div key={i} className="card" style={{ padding: 14 }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                  <input className="input" value={sys.name} onChange={(e) => updateSystem(i, 'name', e.target.value)}
                    style={{ flex: 1, fontSize: '.82rem' }} placeholder="System name" />
                  <button className="btn btn-sm" onClick={() => removeSystem(i)}
                    style={{ background: 'rgba(220,38,38,.08)', color: '#dc2626', border: 'none', padding: '4px 8px' }}>x</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                  {envs.map((env) => (
                    <div key={env}>
                      <label style={{ fontSize: '.65rem', fontWeight: 700, color: 'var(--text-light)', display: 'block', marginBottom: 3 }}>{env}</label>
                      <input className="input" value={sys.instances[env] || ''} onChange={(e) => updateInstance(i, env, e.target.value)}
                        style={{ fontSize: '.8rem', padding: '6px 10px' }} placeholder={`${sys.name} ${env}`} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="diagram-preview" style={{ overflowX: 'auto' }}>
          <div style={{ background: '#0E1020', borderRadius: 12, overflow: 'hidden', display: 'inline-block' }}>
            <LandscapeSvg ref={svgRef} systems={systems} environments={envs} title={title} clientName={clientName} />
          </div>
        </div>
      </div>
    </>
  )
}
