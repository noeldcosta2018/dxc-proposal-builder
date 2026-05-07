'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import DxcLogo from './DxcLogo'
import { useStore } from '@/lib/context'

const nav = [
  { href: '/',         label: 'Setup' },
  { href: '/sections', label: 'Section Builder' },
  { href: '/images',   label: 'Image Builder' },
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
          {nav.map((link) => {
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
