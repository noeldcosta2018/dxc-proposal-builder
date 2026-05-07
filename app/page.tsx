'use client'

import { useStore, type EngagementContext } from '@/lib/context'

type CtxKey = keyof EngagementContext

interface FieldDef {
  key: CtxKey
  label: string
  type: 'text' | 'password' | 'textarea'
  rows?: number
  hint?: string
  placeholder?: string
}

const fields: FieldDef[] = [
  { key: 'clientName',      label: 'Client Name',         type: 'text',     placeholder: 'Ministry of Defence UAE' },
  { key: 'clientShort',     label: 'Client Short Name',   type: 'text',     placeholder: 'MOD UAE' },
  { key: 'projectName',     label: 'Project Name',        type: 'text',     placeholder: 'Project Fortress' },
  { key: 'engagement',      label: 'Engagement Type',     type: 'text',     placeholder: 'On-premise air-gapped SAP S/4HANA implementation' },
  { key: 'researchUrl',     label: 'Research Site URL',   type: 'text',     placeholder: 'https://...' },
  {
    key: 'researchNotes',
    label: 'Research Site Notes',
    type: 'textarea',
    rows: 6,
    placeholder: 'Paste key facts, org structure, technology context...',
  },
  {
    key: 'differentiators',
    label: 'DXC Differentiators',
    type: 'textarea',
    rows: 6,
    placeholder: 'Paste from dxc.com or internal sources. Used to ground section drafts.',
    hint: 'Paste from dxc.com or internal sources. Used to ground section drafts. Leave blank and the engine will mark gaps with [PLACEHOLDER].',
  },
]

export default function SetupPage() {
  const store = useStore()

  return (
    <>
      <div className="hero">
        <span className="hero-label">DXC Proposal Builder</span>
        <h1 className="hero-title">Engagement Setup</h1>
        <p className="hero-sub">
          Configure the engagement context. All fields except the API key persist across sessions.
        </p>
      </div>

      <div className="page-content">
        <div style={{ maxWidth: 720 }}>

          <div className="card" style={{ marginBottom: 24 }}>
            <span className="card-label">Engagement Details</span>
            <h2 className="card-title" style={{ marginBottom: 20 }}>Client and Project</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {fields.slice(0, 4).map((f) => (
                <div key={f.key}>
                  <label className="field-label">{f.label}</label>
                  <input
                    className="input"
                    type={f.type}
                    placeholder={f.placeholder}
                    value={(store[f.key] as string) || ''}
                    onChange={(e) => store.setField(f.key, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ marginBottom: 24 }}>
            <span className="card-label">Research Context</span>
            <h2 className="card-title" style={{ marginBottom: 20 }}>Client Research</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {fields.slice(4, 7).map((f) => (
                <div key={f.key}>
                  <label className="field-label">{f.label}</label>
                  {f.type === 'textarea' ? (
                    <textarea
                      className="input"
                      rows={f.rows || 4}
                      placeholder={f.placeholder}
                      value={(store[f.key] as string) || ''}
                      onChange={(e) => store.setField(f.key, e.target.value)}
                    />
                  ) : (
                    <input
                      className="input"
                      type={f.type}
                      placeholder={f.placeholder}
                      value={(store[f.key] as string) || ''}
                      onChange={(e) => store.setField(f.key, e.target.value)}
                    />
                  )}
                  {f.hint && <p className="field-hint">{f.hint}</p>}
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ marginBottom: 24 }}>
            <span className="card-label">API Access</span>
            <h2 className="card-title" style={{ marginBottom: 20 }}>Anthropic API Key</h2>

            <div>
              <label className="field-label">API Key</label>
              <input
                className="input"
                type="password"
                placeholder="sk-ant-..."
                value={store.apiKey}
                onChange={(e) => store.setApiKey(e.target.value)}
              />
              <p className="field-hint">
                Stored in browser memory only. Not written to localStorage or disk. Cleared on page refresh.
              </p>
            </div>
          </div>

          <div
            style={{
              padding: '16px 20px',
              background: 'rgba(99,153,240,.08)',
              borderRadius: 12,
              border: '1px solid rgba(99,153,240,.2)',
              fontSize: '.82rem',
              color: 'var(--text-mid)',
              lineHeight: 1.65,
            }}
          >
            <strong style={{ color: 'var(--blue)', display: 'block', marginBottom: 4 }}>Air-gapped deployment note</strong>
            This tool runs on a connected workstation. Exported PNG, SVG, and DOCX files are what travel to the air-gapped network. No client data is sent anywhere except to the Anthropic API for content generation.
          </div>
        </div>
      </div>
    </>
  )
}
