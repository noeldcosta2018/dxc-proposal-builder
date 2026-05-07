'use client'

import { useRef, useState } from 'react'
import NetworkSvg, { type NetworkZone } from '@/components/diagrams/NetworkSvg'
import ExportButtons from '@/components/ExportButtons'
import { useStore } from '@/lib/context'

const DEFAULT_ZONES: NetworkZone[] = [
  { name: 'Air-Gap Boundary',      color: '#FF7E51', components: ['Physical Isolation', 'Approved Media Transfer', 'Jump Servers'] },
  { name: 'Management Zone',       color: '#6399F0', components: ['Bastion Host', 'Monitoring', 'SolMan', 'Backup Server'] },
  { name: 'SAP Production',        color: '#00a864', components: ['S/4HANA PRD', 'HANA DB PRD', 'Web Dispatcher', 'SAP Router'] },
  { name: 'SAP Non-Production',    color: '#FFA962', components: ['S/4HANA DEV', 'S/4HANA QAS', 'HANA DB DEV/QAS'] },
  { name: 'DR Site',               color: '#B88A99', components: ['S/4HANA DR', 'HANA System Replication', 'Storage Replication'] },
]

const DEFAULT_CONTROLS = ['NGFW', 'IDS/IPS', 'SIEM', 'PAM', 'MFA', 'DLP', 'Backup', 'Patch Bastion']

export default function NetworkPage() {
  const svgRef = useRef<SVGSVGElement>(null)
  const { clientName } = useStore()
  const [title, setTitle] = useState('Network and Security Architecture')
  const [zones, setZones] = useState<NetworkZone[]>(DEFAULT_ZONES)
  const [controls, setControls] = useState<string[]>(DEFAULT_CONTROLS)

  const updateZone = (i: number, field: keyof NetworkZone, value: string) => {
    setZones((prev) => prev.map((z, idx) => idx === i ? { ...z, [field]: value } : z))
  }

  const updateComponent = (zi: number, ci: number, value: string) => {
    setZones((prev) => prev.map((z, idx) => {
      if (idx !== zi) return z
      const components = [...z.components]
      components[ci] = value
      return { ...z, components }
    }))
  }

  const addComponent = (zi: number) => {
    setZones((prev) => prev.map((z, idx) => idx === zi ? { ...z, components: [...z.components, 'Component'] } : z))
  }

  const removeComponent = (zi: number, ci: number) => {
    setZones((prev) => prev.map((z, idx) => idx === zi ? { ...z, components: z.components.filter((_, j) => j !== ci) } : z))
  }

  const addZone = () => {
    setZones((prev) => [...prev, { name: 'New Zone', color: '#6399F0', components: ['Component'] }])
  }

  const removeZone = (i: number) => setZones((prev) => prev.filter((_, idx) => idx !== i))

  return (
    <>
      <div className="hero" style={{ padding: '40px 56px 36px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24 }}>
          <div>
            <span className="hero-label">Diagrams</span>
            <h1 className="hero-title" style={{ fontSize: '1.8rem', marginBottom: 8 }}>Network and Security</h1>
            <p className="hero-sub" style={{ fontSize: '.9rem' }}>Secure perimeter with zone layers. Export PNG or SVG.</p>
          </div>
          <div style={{ flexShrink: 0, paddingTop: 8 }}>
            <ExportButtons svgRef={svgRef} basename="network" />
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
            <label className="field-label">Security Controls (comma-separated)</label>
            <input className="input" value={controls.join(', ')}
              onChange={(e) => setControls(e.target.value.split(',').map((s) => s.trim()).filter(Boolean))} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <span className="section-label" style={{ margin: 0 }}>Zones</span>
            <button className="btn btn-outline btn-sm" onClick={addZone}>+ Add Zone</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {zones.map((zone, i) => (
              <div key={i} className="card" style={{ padding: 14, borderLeft: `3px solid ${zone.color}` }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                  <input className="input" value={zone.name} onChange={(e) => updateZone(i, 'name', e.target.value)}
                    style={{ flex: 1, fontSize: '.82rem' }} />
                  <input type="color" value={zone.color} onChange={(e) => updateZone(i, 'color', e.target.value)}
                    style={{ width: 32, height: 32, border: 'none', padding: 2, borderRadius: 6, cursor: 'pointer', background: 'none' }} />
                  <button className="btn btn-sm" onClick={() => removeZone(i)}
                    style={{ background: 'rgba(220,38,38,.08)', color: '#dc2626', border: 'none', padding: '4px 8px' }}>x</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {zone.components.map((comp, ci) => (
                    <div key={ci} style={{ display: 'flex', gap: 6 }}>
                      <input className="input" value={comp} onChange={(e) => updateComponent(i, ci, e.target.value)}
                        style={{ fontSize: '.8rem', padding: '6px 10px', flex: 1 }} />
                      <button onClick={() => removeComponent(i, ci)}
                        style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', fontSize: '14px' }}>x</button>
                    </div>
                  ))}
                  <button className="btn btn-outline btn-sm" onClick={() => addComponent(i)} style={{ fontSize: '.75rem', marginTop: 4 }}>+ Component</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="diagram-preview">
          <div style={{ background: '#0E1020', borderRadius: 12, overflow: 'hidden', display: 'inline-block', maxWidth: '100%' }}>
            <NetworkSvg ref={svgRef} zones={zones} controls={controls} title={title} clientName={clientName} />
          </div>
        </div>
      </div>
    </>
  )
}
