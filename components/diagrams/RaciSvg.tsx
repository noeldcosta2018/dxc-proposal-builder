'use client'

import { forwardRef } from 'react'

export type RaciValue = 'R' | 'A' | 'C' | 'I' | ''

export interface RaciActivity {
  name: string
  values: RaciValue[]
}

interface Props {
  activities: RaciActivity[]
  roles: string[]
  title: string
  clientName: string
}

const CELL_W = 72
const CELL_H = 44
const LABEL_W = 260
const PAD = 32
const HEADER_H = 80

const RACI_COLORS: Record<string, { fill: string; text: string }> = {
  R: { fill: '#5F249F', text: '#fff' },
  A: { fill: '#330072', text: '#fff' },
  C: { fill: '#00a864', text: '#fff' },
  I: { fill: '#969696', text: '#fff' },
}

const RaciSvg = forwardRef<SVGSVGElement, Props>(function RaciSvg({ activities, roles, title, clientName }, ref) {
  const totalW = PAD * 2 + LABEL_W + roles.length * CELL_W
  const H = HEADER_H + 36 + activities.length * CELL_H + 60 + PAD

  return (
    <svg ref={ref} width={totalW} height={H} viewBox={`0 0 ${totalW} ${H}`} xmlns="http://www.w3.org/2000/svg" fontFamily="Inter, sans-serif">
      <defs>
        <linearGradient id="raci-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FFB87E" />
          <stop offset="100%" stopColor="#6399F0" />
        </linearGradient>
        <radialGradient id="raci-logo-g" cx="0" cy="0" r="1"
          gradientTransform="matrix(402.422 -113.55 49.0928 173.987 432 120.032)"
          gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFB87E" />
          <stop offset="0.558" stopColor="#FF7E51" />
          <stop offset="1" stopColor="#6399F0" />
        </radialGradient>
      </defs>

      <rect width={totalW} height={H} fill="#0E1020" />
      <rect x="0" y="0" width={totalW} height="3" fill="url(#raci-grad)" />

      {/* Logo */}
      <g transform={`translate(${totalW - 80}, 12) scale(${70 / 860})`}>
        <path d="M220.055 60.7583C252.905 60.7583 279.643 87.4387 279.644 120.247C279.644 153.055 252.905 179.735 220.055 179.735H61V155.455H220.055C239.522 155.455 255.362 139.657 255.362 120.247C255.362 100.836 239.522 85.0396 220.055 85.0396H61V60.7583H220.055ZM798 85.0386H638.945C619.478 85.0386 603.638 100.836 603.638 120.247C603.638 139.657 619.478 155.454 638.945 155.454H798V179.735H638.945C606.08 179.735 579.357 153.054 579.356 120.247C579.356 87.4387 606.095 60.7573 638.945 60.7573H798V85.0386ZM556.104 85.0386C530.11 85.0387 511.856 96.5366 492.531 108.706C486.261 112.662 479.906 116.647 473.278 120.204C479.905 123.76 486.261 127.744 492.531 131.701C511.856 143.87 530.11 155.368 556.104 155.368V179.649C523.097 179.649 499.987 165.095 479.591 152.254C462.637 141.585 447.997 132.358 430.058 132.358C412.118 132.358 397.478 141.571 380.524 152.254C360.128 165.095 337.018 179.649 304.011 179.649V155.368C330.006 155.368 348.259 143.87 367.584 131.701C373.854 127.744 380.211 123.76 386.838 120.204C380.211 116.647 373.854 112.662 367.584 108.706C348.259 96.5366 330.006 85.0386 304.011 85.0386V60.7573C337.018 60.7573 360.128 75.3119 380.524 88.1665C397.478 98.8358 412.118 108.063 430.058 108.063V108.048C447.997 108.048 462.637 98.8364 479.591 88.1528C499.987 75.3125 523.097 60.7575 556.104 60.7573V85.0386Z" fill="url(#raci-logo-g)" />
      </g>

      <text x={PAD} y={22} fontFamily="Epilogue, Inter, sans-serif" fontSize="10" fontWeight="700" fill="rgba(255,126,81,0.8)" letterSpacing="2">RACI MATRIX</text>
      <text x={PAD} y={42} fontFamily="Epilogue, Inter, sans-serif" fontSize="18" fontWeight="800" fill="#fff">{title || 'Responsibility Assignment'}</text>
      <text x={PAD} y={58} fontFamily="Inter, sans-serif" fontSize="10" fill="rgba(255,255,255,0.4)">{clientName || '[Client]'}</text>

      {/* Column headers */}
      <rect x={PAD} y={HEADER_H} width={LABEL_W - 8} height={CELL_H - 4} rx="6" fill="rgba(255,255,255,0.05)" />
      <text x={PAD + 12} y={HEADER_H + 28} fontFamily="Epilogue, Inter, sans-serif" fontSize="11" fontWeight="700" fill="rgba(255,255,255,0.5)">Activity / Deliverable</text>

      {roles.map((role, j) => {
        const cx = PAD + LABEL_W + j * CELL_W + CELL_W / 2
        return (
          <g key={j}>
            <rect x={PAD + LABEL_W + j * CELL_W} y={HEADER_H} width={CELL_W - 4} height={CELL_H - 4} rx="6" fill="rgba(255,255,255,0.05)" />
            <text x={cx} y={HEADER_H + 28} textAnchor="middle" fontFamily="Epilogue, Inter, sans-serif" fontSize="10" fontWeight="700" fill="rgba(255,255,255,0.65)">{role}</text>
          </g>
        )
      })}

      {/* Rows */}
      {activities.map((act, i) => {
        const rowY = HEADER_H + CELL_H + i * CELL_H
        const bg = i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent'
        return (
          <g key={i}>
            <rect x={PAD} y={rowY} width={totalW - PAD * 2} height={CELL_H} fill={bg} />
            <text x={PAD + 12} y={rowY + CELL_H / 2 + 5} fontFamily="Inter, sans-serif" fontSize="11" fontWeight="500" fill="rgba(255,255,255,0.75)">{act.name}</text>
            {roles.map((_, j) => {
              const val = act.values[j] || ''
              const cx = PAD + LABEL_W + j * CELL_W + CELL_W / 2
              const cy = rowY + CELL_H / 2
              const style = RACI_COLORS[val]
              if (!style || !val) return (
                <text key={j} x={cx} y={cy + 5} textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="10" fill="rgba(255,255,255,0.15)">-</text>
              )
              return (
                <g key={j}>
                  <rect x={PAD + LABEL_W + j * CELL_W + 8} y={cy - 12} width={CELL_W - 20} height={24} rx="6" fill={style.fill} fillOpacity="0.9" />
                  <text x={cx} y={cy + 5} textAnchor="middle" fontFamily="Epilogue, Inter, sans-serif" fontSize="12" fontWeight="800" fill={style.text}>{val}</text>
                </g>
              )
            })}
          </g>
        )
      })}

      {/* Legend */}
      {(() => {
        const legendY = HEADER_H + CELL_H + activities.length * CELL_H + 20
        const items = [
          { key: 'R', label: 'Responsible', color: '#5F249F' },
          { key: 'A', label: 'Accountable', color: '#330072' },
          { key: 'C', label: 'Consulted', color: '#00a864' },
          { key: 'I', label: 'Informed', color: '#969696' },
        ]
        return (
          <g>
            {items.map((it, k) => {
              const lx = PAD + k * 140
              return (
                <g key={k}>
                  <rect x={lx} y={legendY} width={22} height={22} rx="5" fill={it.color} />
                  <text x={lx + 28} y={legendY + 15} fontFamily="Inter, sans-serif" fontSize="11" fontWeight="600" fill="rgba(255,255,255,0.6)"><tspan fontWeight="800" fill="rgba(255,255,255,0.85)">{it.key}</tspan> {it.label}</text>
                </g>
              )
            })}
          </g>
        )
      })()}

      <text x={PAD} y={H - 10} fontFamily="Inter, sans-serif" fontSize="9" fill="rgba(255,255,255,0.2)" letterSpacing="0.5">Confidential. Generated by DXC Proposal Builder.</text>
    </svg>
  )
})

export default RaciSvg
