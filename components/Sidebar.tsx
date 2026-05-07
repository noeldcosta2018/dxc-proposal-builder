'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import DxcLogo from './DxcLogo'
import { useStore } from '@/lib/context'

const nav = [
  {
    label: 'Configure',
    links: [
      { href: '/',           label: 'Setup' },
    ],
  },
  {
    label: 'Content',
    links: [
      { href: '/sections',   label: 'Proposal Sections' },
    ],
  },
  {
    label: 'Diagrams',
    links: [
      { href: '/architecture', label: 'SAP Solution Architecture' },
      { href: '/landscape',    label: 'System Landscape' },
      { href: '/timeline',     label: 'Project Timeline' },
      { href: '/raci',         label: 'RACI Matrix' },
      { href: '/network',      label: 'Network and Security' },
      { href: '/infographic',  label: 'Executive Infographic' },
    ],
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { clientName, clientShort, projectName } = useStore()

  const displayName = clientShort || clientName || 'New Engagement'
  const displayProject = projectName || 'SAP S/4HANA'

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Link href="/" className="sidebar-logo">
          <DxcLogo width={80} height={22} id="sidebar-logo" />
        </Link>
        <div>
          <div className="client-badge">Proposal, Confidential</div>
          <div className="client-name">{displayName}</div>
          <span className="client-sub">{displayProject}</span>
        </div>
      </div>

      <div className="sidebar-nav-wrapper">
        <nav className="sidebar-nav">
          {nav.map((group) => (
            <div key={group.label}>
              <div className="nav-section-label">{group.label}</div>
              {group.links.map((link) => {
                const active = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`nav-link${active ? ' active' : ''}`}
                  >
                    <span className="nav-icon" />
                    {link.label}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>
      </div>

      <div className="sidebar-footer">
        <Link href="/sections" className="sidebar-cta">
          Generate Content
        </Link>
        <div className="sidebar-confidential">Confidential · DXC Technology</div>
      </div>
    </aside>
  )
}
