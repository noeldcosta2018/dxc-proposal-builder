'use client'

import { forwardRef } from 'react'

export interface GanttPhase {
  name: string
  start: number
  duration: number
  color: string
  milestone?: boolean
}

interface Props {
  phases: GanttPhase[]
  totalMonths: number
  title: string
  clientName: string
}

const PHASE_COLORS = ['#6399F0', '#FF7E51', '#FFA962', '#00a864', '#B88A99', '#FFB87E']

const ROW_H = 44
const LABEL_W = 160
const CELL_W = 36
const PAD = 32
const HEADER_H = 80
const FOOTER_H = 36

const TimelineSvg = forwardRef<SVGSVGElement, Props>(function TimelineSvg({ phases, totalMonths, title, clientName }, ref) {
  const months = Math.max(totalMonths, 6)
  const totalW = PAD * 2 + LABEL_W + months * CELL_W
  const H = HEADER_H + phases.length * (ROW_H + 8) + FOOTER_H + 32

  return (
    <svg ref={ref} width={totalW} height={H} viewBox={`0 0 ${totalW} ${H}`} xmlns="http://www.w3.org/2000/svg" fontFamily="Inter, sans-serif">
      <defs>
        <linearGradient id="tl-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FFB87E" />
          <stop offset="100%" stopColor="#6399F0" />
        </linearGradient>
        <radialGradient id="tl-logo-g" cx="0" cy="0" r="1"
          gradientTransform="matrix(402.422 -113.55 49.0928 173.987 432 120.032)"
          gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFB87E" />
          <stop offset="0.558" stopColor="#FF7E51" />
          <stop offset="1" stopColor="#6399F0" />
        </radialGradient>
      </defs>

      <rect width={totalW} height={H} fill="#0E1020" />
      <rect x="0" y="0" width={totalW} height="3" fill="url(#tl-grad)" />

      {/* Logo */}
      <g transform={`translate(${totalW - 80}, 12) scale(${70 / 860})`}>
        <path d="M220.055 60.7583C252.905 60.7583 279.643 87.4387 279.644 120.247C279.644 153.055 252.905 179.735 220.055 179.735H61V155.455H220.055C239.522 155.455 255.362 139.657 255.362 120.247C255.362 100.836 239.522 85.0396 220.055 85.0396H61V60.7583H220.055ZM798 85.0386H638.945C619.478 85.0386 603.638 100.836 603.638 120.247C603.638 139.657 619.478 155.454 638.945 155.454H798V179.735H638.945C606.08 179.735 579.357 153.054 579.356 120.247C579.356 87.4387 606.095 60.7573 638.945 60.7573H798V85.0386ZM556.104 85.0386C530.11 85.0387 511.856 96.5366 492.531 108.706C486.261 112.662 479.906 116.647 473.278 120.204C479.905 123.76 486.261 127.744 492.531 131.701C511.856 143.87 530.11 155.368 556.104 155.368V179.649C523.097 179.649 499.987 165.095 479.591 152.254C462.637 141.585 447.997 132.358 430.058 132.358C412.118 132.358 397.478 141.571 380.524 152.254C360.128 165.095 337.018 179.649 304.011 179.649V155.368C330.006 155.368 348.259 143.87 367.584 131.701C373.854 127.744 380.211 123.76 386.838 120.204C380.211 116.647 373.854 112.662 367.584 108.706C348.259 96.5366 330.006 85.0386 304.011 85.0386V60.7573C337.018 60.7573 360.128 75.3119 380.524 88.1665C397.478 98.8358 412.118 108.063 430.058 108.063V108.048C447.997 108.048 462.637 98.8364 479.591 88.1528C499.987 75.3125 523.097 60.7575 556.104 60.7573V85.0386Z" fill="url(#tl-logo-g)" />
      </g>

      <text x={PAD} y={22} fontFamily="Epilogue, Inter, sans-serif" fontSize="10" fontWeight="700" fill="rgba(255,126,81,0.8)" letterSpacing="2">PROJECT TIMELINE</text>
      <text x={PAD} y={42} fontFamily="Epilogue, Inter, sans-serif" fontSize="18" fontWeight="800" fill="#fff">{title || 'Programme Timeline'}</text>
      <text x={PAD} y={58} fontFamily="Inter, sans-serif" fontSize="10" fill="rgba(255,255,255,0.4)">{clientName || '[Client]'}</text>

      {/* Month axis */}
      {Array.from({ length: months }).map((_, m) => {
        const x = PAD + LABEL_W + m * CELL_W
        return (
          <g key={m}>
            <line x1={x} y1={HEADER_H - 8} x2={x} y2={H - FOOTER_H} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <text x={x + CELL_W / 2} y={HEADER_H - 14} textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="10" fill="rgba(255,255,255,0.35)">M{m + 1}</text>
          </g>
        )
      })}

      {/* Phase rows */}
      {phases.map((ph, i) => {
        const rowY = HEADER_H + i * (ROW_H + 8)
        const barX = PAD + LABEL_W + (ph.start - 1) * CELL_W
        const barW = ph.duration * CELL_W - 4
        const color = ph.color || PHASE_COLORS[i % PHASE_COLORS.length]
        const midX = barX + barW / 2

        return (
          <g key={i}>
            {/* Row bg */}
            <rect x={PAD} y={rowY + 6} width={LABEL_W - 8} height={ROW_H - 8} rx="6" fill="rgba(255,255,255,0.03)" />
            <text x={PAD + 10} y={rowY + ROW_H / 2 + 5} fontFamily="Epilogue, Inter, sans-serif" fontSize="12" fontWeight="700" fill="rgba(255,255,255,0.75)">{ph.name}</text>

            {/* Bar */}
            <rect x={barX} y={rowY + 10} width={Math.max(barW, 4)} height={ROW_H - 16} rx="5"
              fill={color} fillOpacity="0.85" />

            {/* Duration label */}
            {barW > 36 && (
              <text x={midX} y={rowY + ROW_H / 2 + 5} textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="11" fontWeight="600" fill="rgba(0,0,0,0.7)">{ph.duration}m</text>
            )}

            {/* Milestone diamond */}
            {ph.milestone && (
              <rect
                x={barX + barW - 6}
                y={rowY + ROW_H - 2}
                width={12} height={12} rx="2"
                fill="#FFB87E"
                transform={`rotate(45, ${barX + barW}, ${rowY + ROW_H + 4})`}
              />
            )}
          </g>
        )
      })}

      <text x={PAD} y={H - 10} fontFamily="Inter, sans-serif" fontSize="9" fill="rgba(255,255,255,0.2)" letterSpacing="0.5">Confidential. Generated by DXC Proposal Builder.</text>
    </svg>
  )
})

export default TimelineSvg
