'use client'

import { useRef, useState } from 'react'
import ArchitectureSvg, { type ArchLayer } from '@/components/diagrams/ArchitectureSvg'
import ExportButtons from '@/components/ExportButtons'
import { useStore } from '@/lib/context'

const DEFAULT_LAYERS: ArchLayer[] = [
  { name: 'Channels and Users',  color: '#6399F0', items: ['Web Browser', 'SAP GUI', 'Mobile', 'Fiori Launchpad'] },
  { name: 'Integration',         color: '#FF7E51', items: ['SAP PI/PO', 'BTP Integration', 'RFC/BAPI', 'APIs'] },
  { name: 'Application Suite',   color: '#FFA962', items: ['FI/CO', 'MM/WM', 'SD/PP', 'HR/Payroll', 'GRC/Security'] },
  { name: 'Database',            color: '#00a864', items: ['SAP HANA', 'HANA System Replication', 'Backup'] },
  { name: 'Infrastructure',      color: '#B88A99', items: ['Physical Servers', 'SAN Storage', 'Network', 'Management Zone'] },
]

export default function ArchitecturePage() {
  const svgRef = useRef<SVGSVGElement>(null)
  const { clientName } = useStore()
  const [title, setTitle] = useState('Target SAP S/4HANA Architecture')
  const [layers, setLayers] = useState<ArchLayer[]>(DEFAULT_LAYERS)

  const updateLayer = (i: number, field: keyof ArchLayer, value: string) => {
    setLayers((prev) => prev.map((l, idx) => idx === i ? { ...l, [field]: value } : l))
  }

  const updateItem = (li: number, ii: number, value: string) => {
    setLayers((prev) => prev.map((l, idx) => {
      if (idx !== li) return l
      const items = [...l.items]
      items[ii] = value
      return { ...l, items }
    }))
  }

  const addItem = (li: number) => {
    setLayers((prev) => prev.map((l, idx) => idx === li ? { ...l, items: [...l.items, 'Component'] } : l))
  }

  const removeItem = (li: number, ii: number) => {
    setLayers((prev) => prev.map((l, idx) => idx === li ? { ...l, items: l.items.filter((_, j) => j !== ii) } : l))
  }

  const addLayer = () => {
    setLayers((prev) => [...prev, { name: 'New Layer', color: '#6399F0', items: ['Component'] }])
  }

  const removeLayer = (i: number) => {
    setLayers((prev) => prev.filter((_, idx) => idx !== i))
  }

  return (
    <>
      <div className="hero" style={{ padding: '40px 56px 36px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24 }}>
          <div>
            <span className="hero-label">Diagrams</span>
            <h1 className="hero-title" style={{ fontSize: '1.8rem', marginBottom: 8 }}>SAP Solution Architecture</h1>
            <p className="hero-sub" style={{ fontSize: '.9rem' }}>Layered stack diagram. Edit layers and components. Export PNG or SVG.</p>
          </div>
          <div style={{ flexShrink: 0, paddingTop: 8 }}>
            <ExportButtons svgRef={svgRef} basename="architecture" />
          </div>
        </div>
      </div>

      <div className="diagram-shell">
        <div className="diagram-controls">
          <div style={{ marginBottom: 20 }}>
            <label className="field-label">Diagram Title</label>
            <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <span className="section-label" style={{ margin: 0 }}>Layers</span>
            <button className="btn btn-outline btn-sm" onClick={addLayer}>+ Add Layer</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {layers.map((layer, i) => (
              <div key={i} className="card" style={{ padding: 16, borderLeft: `3px solid ${layer.color}` }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                  <input className="input" value={layer.name} onChange={(e) => updateLayer(i, 'name', e.target.value)} style={{ flex: 1, fontSize: '.82rem' }} />
                  <input type="color" value={layer.color} onChange={(e) => updateLayer(i, 'color', e.target.value)}
                    style={{ width: 36, height: 36, border: 'none', padding: 2, borderRadius: 6, cursor: 'pointer', background: 'none' }} />
                  <button className="btn btn-sm" onClick={() => removeLayer(i)}
                    style={{ background: 'rgba(220,38,38,.08)', color: '#dc2626', border: 'none', padding: '4px 8px' }}>x</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {layer.items.map((item, j) => (
                    <div key={j} style={{ display: 'flex', gap: 6 }}>
                      <input className="input" value={item} onChange={(e) => updateItem(i, j, e.target.value)}
                        style={{ fontSize: '.8rem', padding: '6px 10px' }} />
                      <button onClick={() => removeItem(i, j)}
                        style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', fontSize: '14px' }}>x</button>
                    </div>
                  ))}
                  <button className="btn btn-outline btn-sm" onClick={() => addItem(i)} style={{ fontSize: '.75rem', marginTop: 4 }}>+ Item</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="diagram-preview">
          <div style={{ background: '#0E1020', borderRadius: 12, overflow: 'hidden', display: 'inline-block', maxWidth: '100%' }}>
            <ArchitectureSvg ref={svgRef} layers={layers} title={title} clientName={clientName} />
          </div>
        </div>
      </div>
    </>
  )
}
