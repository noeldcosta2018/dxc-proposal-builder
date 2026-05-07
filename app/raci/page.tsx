'use client'

import { useRef, useState } from 'react'
import RaciSvg, { type RaciActivity, type RaciValue } from '@/components/diagrams/RaciSvg'
import ExportButtons from '@/components/ExportButtons'
import { useStore } from '@/lib/context'

const DEFAULT_ROLES = ['DXC PM', 'DXC Architect', 'DXC Dev', 'Client PM', 'Client IT', 'Steering']
const DEFAULT_ACTIVITIES: RaciActivity[] = [
  { name: 'Project Plan and Schedule',       values: ['R', 'C', '', 'A', '', 'I'] },
  { name: 'Solution Architecture Design',    values: ['C', 'R', 'C', 'I', 'A', ''] },
  { name: 'System Configuration',            values: ['I', 'A', 'R', '', 'C', ''] },
  { name: 'RICEFW Development',              values: ['I', 'A', 'R', '', 'C', ''] },
  { name: 'Data Migration Strategy',         values: ['C', 'R', 'C', 'A', 'I', ''] },
  { name: 'UAT Planning and Execution',      values: ['C', 'C', 'I', 'R', 'A', ''] },
  { name: 'Cutover Planning',                values: ['R', 'A', 'C', 'A', 'C', 'I'] },
  { name: 'Security and GRC Design',         values: ['I', 'R', 'C', 'C', 'A', ''] },
  { name: 'Training Delivery',               values: ['R', 'C', 'C', 'A', 'I', ''] },
  { name: 'Go-Live Approval',                values: ['C', 'C', '', 'R', 'C', 'A'] },
]

const RACI_OPTIONS: RaciValue[] = ['R', 'A', 'C', 'I', '']

export default function RaciPage() {
  const svgRef = useRef<SVGSVGElement>(null)
  const { clientName } = useStore()
  const [title, setTitle] = useState('RACI Matrix')
  const [roles, setRoles] = useState<string[]>(DEFAULT_ROLES)
  const [activities, setActivities] = useState<RaciActivity[]>(DEFAULT_ACTIVITIES)

  const updateRole = (i: number, value: string) => {
    setRoles((prev) => prev.map((r, idx) => idx === i ? value : r))
  }

  const addRole = () => setRoles((prev) => [...prev, `Role ${prev.length + 1}`])
  const removeRole = (i: number) => {
    setRoles((prev) => prev.filter((_, idx) => idx !== i))
    setActivities((prev) => prev.map((a) => ({ ...a, values: a.values.filter((_, idx) => idx !== i) })))
  }

  const updateActivity = (ai: number, field: 'name', value: string) => {
    setActivities((prev) => prev.map((a, idx) => idx === ai ? { ...a, [field]: value } : a))
  }

  const updateRaciValue = (ai: number, ri: number, value: RaciValue) => {
    setActivities((prev) => prev.map((a, idx) => {
      if (idx !== ai) return a
      const values = [...a.values]
      values[ri] = value
      return { ...a, values }
    }))
  }

  const addActivity = () => {
    setActivities((prev) => [...prev, { name: 'New Activity', values: roles.map(() => '' as RaciValue) }])
  }

  const removeActivity = (i: number) => setActivities((prev) => prev.filter((_, idx) => idx !== i))

  return (
    <>
      <div className="hero" style={{ padding: '40px 56px 36px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24 }}>
          <div>
            <span className="hero-label">Diagrams</span>
            <h1 className="hero-title" style={{ fontSize: '1.8rem', marginBottom: 8 }}>RACI Matrix</h1>
            <p className="hero-sub" style={{ fontSize: '.9rem' }}>Responsibility assignment matrix. Edit activities and roles. Export PNG or SVG.</p>
          </div>
          <div style={{ flexShrink: 0, paddingTop: 8 }}>
            <ExportButtons svgRef={svgRef} basename="raci" />
          </div>
        </div>
      </div>

      <div className="diagram-shell">
        <div className="diagram-controls">
          <div style={{ marginBottom: 16 }}>
            <label className="field-label">Diagram Title</label>
            <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span className="section-label" style={{ margin: 0 }}>Roles</span>
            <button className="btn btn-outline btn-sm" onClick={addRole}>+ Add Role</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 }}>
            {roles.map((r, i) => (
              <div key={i} style={{ display: 'flex', gap: 6 }}>
                <input className="input" value={r} onChange={(e) => updateRole(i, e.target.value)}
                  style={{ fontSize: '.82rem', flex: 1 }} />
                <button onClick={() => removeRole(i)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', fontSize: '14px' }}>x</button>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span className="section-label" style={{ margin: 0 }}>Activities</span>
            <button className="btn btn-outline btn-sm" onClick={addActivity}>+ Add Activity</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {activities.map((act, ai) => (
              <div key={ai} className="card" style={{ padding: 12 }}>
                <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                  <input className="input" value={act.name} onChange={(e) => updateActivity(ai, 'name', e.target.value)}
                    style={{ fontSize: '.8rem', flex: 1 }} />
                  <button onClick={() => removeActivity(ai)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', fontSize: '14px' }}>x</button>
                </div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {roles.map((role, ri) => (
                    <div key={ri} style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '.6rem', color: 'var(--text-light)', marginBottom: 2, maxWidth: 52, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{role}</div>
                      <select
                        value={act.values[ri] || ''}
                        onChange={(e) => updateRaciValue(ai, ri, e.target.value as RaciValue)}
                        style={{ width: 52, padding: '4px 2px', fontSize: '.8rem', borderRadius: 6, border: '1.5px solid var(--border)', textAlign: 'center', cursor: 'pointer' }}
                      >
                        {RACI_OPTIONS.map((v) => <option key={v} value={v}>{v || '-'}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="diagram-preview" style={{ overflowX: 'auto' }}>
          <div style={{ background: '#0E1020', borderRadius: 12, overflow: 'hidden', display: 'inline-block' }}>
            <RaciSvg ref={svgRef} activities={activities} roles={roles} title={title} clientName={clientName} />
          </div>
        </div>
      </div>
    </>
  )
}
