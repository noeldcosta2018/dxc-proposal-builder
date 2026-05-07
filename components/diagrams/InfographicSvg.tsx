'use client'

import { forwardRef } from 'react'

export interface StatItem {
  value: string
  unit: string
  label: string
}

export interface Pillar {
  title: string
  description: string
}

interface Props {
  title: string
  subtitle: string
  stats: StatItem[]
  pillars: Pillar[]
  clientName: string
}

const W = 800
const H = 1100
const PAD = 48

const InfographicSvg = forwardRef<SVGSVGElement, Props>(function InfographicSvg({ title, subtitle, stats, pillars, clientName }, ref) {
  return (
    <svg ref={ref} width={W} height={H} viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" fontFamily="Inter, sans-serif">
      <defs>
        <linearGradient id="infog-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FFB87E" />
          <stop offset="33%" stopColor="#FF7E51" />
          <stop offset="66%" stopColor="#B88A99" />
          <stop offset="100%" stopColor="#6399F0" />
        </linearGradient>
        <linearGradient id="infog-hero-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1d30" />
          <stop offset="100%" stopColor="#0E1020" />
        </linearGradient>
        <radialGradient id="infog-logo-g" cx="0" cy="0" r="1"
          gradientTransform="matrix(402.422 -113.55 49.0928 173.987 432 120.032)"
          gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFB87E" />
          <stop offset="0.558" stopColor="#FF7E51" />
          <stop offset="1" stopColor="#6399F0" />
        </radialGradient>
      </defs>

      {/* Page background */}
      <rect width={W} height={H} fill="#F6F3F0" />

      {/* Hero block */}
      <rect x="0" y="0" width={W} height="280" fill="url(#infog-hero-bg)" />
      <rect x="0" y="0" width={W} height="4" fill="url(#infog-grad)" />

      {/* Logo top-right */}
      <g transform={`translate(${W - 88}, 18) scale(${76 / 860})`}>
        <path d="M220.055 60.7583C252.905 60.7583 279.643 87.4387 279.644 120.247C279.644 153.055 252.905 179.735 220.055 179.735H61V155.455H220.055C239.522 155.455 255.362 139.657 255.362 120.247C255.362 100.836 239.522 85.0396 220.055 85.0396H61V60.7583H220.055ZM798 85.0386H638.945C619.478 85.0386 603.638 100.836 603.638 120.247C603.638 139.657 619.478 155.454 638.945 155.454H798V179.735H638.945C606.08 179.735 579.357 153.054 579.356 120.247C579.356 87.4387 606.095 60.7573 638.945 60.7573H798V85.0386ZM556.104 85.0386C530.11 85.0387 511.856 96.5366 492.531 108.706C486.261 112.662 479.906 116.647 473.278 120.204C479.905 123.76 486.261 127.744 492.531 131.701C511.856 143.87 530.11 155.368 556.104 155.368V179.649C523.097 179.649 499.987 165.095 479.591 152.254C462.637 141.585 447.997 132.358 430.058 132.358C412.118 132.358 397.478 141.571 380.524 152.254C360.128 165.095 337.018 179.649 304.011 179.649V155.368C330.006 155.368 348.259 143.87 367.584 131.701C373.854 127.744 380.211 123.76 386.838 120.204C380.211 116.647 373.854 112.662 367.584 108.706C348.259 96.5366 330.006 85.0386 304.011 85.0386V60.7573C337.018 60.7573 360.128 75.3119 380.524 88.1665C397.478 98.8358 412.118 108.063 430.058 108.063V108.048C447.997 108.048 462.637 98.8364 479.591 88.1528C499.987 75.3125 523.097 60.7575 556.104 60.7573V85.0386Z" fill="url(#infog-logo-g)" />
      </g>

      {/* Hero text */}
      <text x={PAD} y={70} fontFamily="Inter, sans-serif" fontSize="11" fontWeight="700" fill="rgba(255,126,81,0.85)" letterSpacing="2">DXC TECHNOLOGY</text>
      <text x={PAD} y={130} fontFamily="Epilogue, Inter, sans-serif" fontSize="34" fontWeight="800" fill="#fff" style={{ letterSpacing: '-0.02em' }}>{title || 'SAP S/4HANA Transformation'}</text>
      <text x={PAD} y={160} fontFamily="Epilogue, Inter, sans-serif" fontSize="34" fontWeight="800" fill="#fff" style={{ letterSpacing: '-0.02em' }}>{subtitle || ''}</text>
      <text x={PAD} y={200} fontFamily="Inter, sans-serif" fontSize="14" fill="rgba(255,255,255,0.5)">{clientName || '[Client]'} Proposal</text>
      <line x1={PAD} y1={218} x2={W - PAD} y2={218} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

      {/* Stats grid */}
      <text x={PAD} y={256} fontFamily="Inter, sans-serif" fontSize="10" fontWeight="700" fill="rgba(255,126,81,0.8)" letterSpacing="2">AT A GLANCE</text>
      {stats.slice(0, 4).map((stat, i) => {
        const colW = (W - PAD * 2) / 4
        const sx = PAD + i * colW
        return (
          <g key={i}>
            <text x={sx} y={284} fontFamily="Epilogue, Inter, sans-serif" fontSize="30" fontWeight="800" fill="#fff">{stat.value}</text>
            <text x={sx + String(stat.value).length * 16 + 2} y={280} fontFamily="Inter, sans-serif" fontSize="13" fontWeight="600" fill="rgba(255,255,255,0.5)">{stat.unit}</text>
          </g>
        )
      })}

      {/* Stats labels */}
      {stats.slice(0, 4).map((stat, i) => {
        const colW = (W - PAD * 2) / 4
        const sx = PAD + i * colW
        return (
          <text key={i} x={sx} y={300} fontFamily="Inter, sans-serif" fontSize="10" fill="rgba(255,255,255,0.35)" letterSpacing="0.3">{stat.label}</text>
        )
      })}

      {/* Content area - why DXC pillars */}
      <text x={PAD} y={352} fontFamily="Inter, sans-serif" fontSize="10" fontWeight="700" fill="#FF7E51" letterSpacing="2">WHY DXC FOR THIS PROGRAMME</text>

      {pillars.slice(0, 4).map((pillar, i) => {
        const row = Math.floor(i / 2)
        const col = i % 2
        const colW = (W - PAD * 2 - 16) / 2
        const px = PAD + col * (colW + 16)
        const py = 368 + row * 160
        const accentColors = ['#6399F0', '#FF7E51', '#00a864', '#B88A99']
        const color = accentColors[i % accentColors.length]
        return (
          <g key={i}>
            <rect x={px} y={py} width={colW} height={148} rx="12" fill="#fff" />
            <rect x={px} y={py} width={colW} height="4" rx="2" fill={color} />
            <rect x={px + 16} y={py + 20} width={28} height={28} rx="8" fill={color} fillOpacity="0.12" />
            <text x={px + 30} y={py + 40} textAnchor="middle" fontFamily="Epilogue, Inter, sans-serif" fontSize="14" fontWeight="800" fill={color}>{i + 1}</text>
            <text x={px + 16} y={py + 72} fontFamily="Epilogue, Inter, sans-serif" fontSize="14" fontWeight="800" fill="#0E1020">{pillar.title}</text>
            <text x={px + 16} y={py + 90} fontFamily="Inter, sans-serif" fontSize="11" fill="#44445a">
              {pillar.description.slice(0, 55)}
            </text>
            {pillar.description.length > 55 && (
              <text x={px + 16} y={py + 106} fontFamily="Inter, sans-serif" fontSize="11" fill="#44445a">
                {pillar.description.slice(55, 110)}
              </text>
            )}
          </g>
        )
      })}

      {/* Footer strip */}
      <rect x="0" y={H - 40} width={W} height="40" fill="#0E1020" />
      <text x={PAD} y={H - 14} fontFamily="Inter, sans-serif" fontSize="10" fill="rgba(255,255,255,0.3)">Confidential. Generated by DXC Proposal Builder. {new Date().getFullYear()}</text>
      <text x={W - PAD} y={H - 14} textAnchor="end" fontFamily="Inter, sans-serif" fontSize="10" fill="rgba(255,255,255,0.3)">{clientName || '[Client]'}</text>
    </svg>
  )
})

export default InfographicSvg
