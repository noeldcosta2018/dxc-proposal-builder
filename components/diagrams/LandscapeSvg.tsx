'use client'

import { forwardRef } from 'react'

export interface LandscapeSystem {
  name: string
  instances: Record<string, string>
}

interface Props {
  systems: LandscapeSystem[]
  environments: string[]
  title: string
  clientName: string
}

const ENVS_DEFAULT = ['DEV', 'QAS', 'PRD', 'DR']
const ROW_H = 64
const COL_W = 140
const LABEL_W = 180
const PAD = 32
const HEADER_H = 56
const W = LABEL_W + ENVS_DEFAULT.length * (COL_W + 8) + PAD * 2 + 60
const ARROW_COLOR = '#FF7E51'

const LandscapeSvg = forwardRef<SVGSVGElement, Props>(function LandscapeSvg({ systems, environments, title, clientName }, ref) {
  const envs = environments.length ? environments : ENVS_DEFAULT
  const totalW = LABEL_W + envs.length * (COL_W + 8) + PAD * 2 + 40
  const H = HEADER_H + PAD + systems.length * (ROW_H + 10) + 60 + 24

  return (
    <svg ref={ref} width={totalW} height={H} viewBox={`0 0 ${totalW} ${H}`} xmlns="http://www.w3.org/2000/svg" fontFamily="Inter, sans-serif">
      <defs>
        <linearGradient id="ls-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FFB87E" />
          <stop offset="100%" stopColor="#6399F0" />
        </linearGradient>
        <radialGradient id="ls-logo-g" cx="0" cy="0" r="1"
          gradientTransform="matrix(402.422 -113.55 49.0928 173.987 432 120.032)"
          gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFB87E" />
          <stop offset="0.558" stopColor="#FF7E51" />
          <stop offset="1" stopColor="#6399F0" />
        </radialGradient>
        <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill={ARROW_COLOR} />
        </marker>
      </defs>

      <rect width={totalW} height={H} fill="#0E1020" />
      <rect x="0" y="0" width={totalW} height="3" fill="url(#ls-grad)" />

      {/* Logo top-right */}
      <g transform={`translate(${totalW - 80}, 12) scale(${70 / 860})`}>
        <path d="M220.055 60.7583C252.905 60.7583 279.643 87.4387 279.644 120.247C279.644 153.055 252.905 179.735 220.055 179.735H61V155.455H220.055C239.522 155.455 255.362 139.657 255.362 120.247C255.362 100.836 239.522 85.0396 220.055 85.0396H61V60.7583H220.055ZM798 85.0386H638.945C619.478 85.0386 603.638 100.836 603.638 120.247C603.638 139.657 619.478 155.454 638.945 155.454H798V179.735H638.945C606.08 179.735 579.357 153.054 579.356 120.247C579.356 87.4387 606.095 60.7573 638.945 60.7573H798V85.0386ZM556.104 85.0386C530.11 85.0387 511.856 96.5366 492.531 108.706C486.261 112.662 479.906 116.647 473.278 120.204C479.905 123.76 486.261 127.744 492.531 131.701C511.856 143.87 530.11 155.368 556.104 155.368V179.649C523.097 179.649 499.987 165.095 479.591 152.254C462.637 141.585 447.997 132.358 430.058 132.358C412.118 132.358 397.478 141.571 380.524 152.254C360.128 165.095 337.018 179.649 304.011 179.649V155.368C330.006 155.368 348.259 143.87 367.584 131.701C373.854 127.744 380.211 123.76 386.838 120.204C380.211 116.647 373.854 112.662 367.584 108.706C348.259 96.5366 330.006 85.0386 304.011 85.0386V60.7573C337.018 60.7573 360.128 75.3119 380.524 88.1665C397.478 98.8358 412.118 108.063 430.058 108.063V108.048C447.997 108.048 462.637 98.8364 479.591 88.1528C499.987 75.3125 523.097 60.7575 556.104 60.7573V85.0386Z" fill="url(#ls-logo-g)" />
      </g>

      <text x={PAD} y={22} fontFamily="Epilogue, Inter, sans-serif" fontSize="10" fontWeight="700" fill="rgba(255,126,81,0.8)" letterSpacing="2">SYSTEM LANDSCAPE</text>
      <text x={PAD} y={42} fontFamily="Epilogue, Inter, sans-serif" fontSize="18" fontWeight="800" fill="#fff">{title || 'SAP System Landscape'}</text>
      <text x={PAD} y={58} fontFamily="Inter, sans-serif" fontSize="10" fill="rgba(255,255,255,0.4)">{clientName || '[Client]'}</text>

      {/* Column headers */}
      {envs.map((env, j) => {
        const x = PAD + LABEL_W + j * (COL_W + 8) + (COL_W + 8) / 2
        return (
          <g key={j}>
            <rect x={PAD + LABEL_W + j * (COL_W + 8)} y={HEADER_H + PAD - 4} width={COL_W} height={28} rx="6" fill="rgba(255,255,255,0.05)" />
            <text x={x} y={HEADER_H + PAD + 14} textAnchor="middle" fontFamily="Epilogue, Inter, sans-serif" fontSize="11" fontWeight="700" fill="rgba(255,255,255,0.6)">{env}</text>
          </g>
        )
      })}

      {/* Rows */}
      {systems.map((sys, i) => {
        const rowY = HEADER_H + PAD + 36 + i * (ROW_H + 10)
        return (
          <g key={i}>
            {/* Row label */}
            <rect x={PAD} y={rowY} width={LABEL_W - 8} height={ROW_H} rx="8" fill="rgba(255,255,255,0.04)" />
            <text x={PAD + 12} y={rowY + ROW_H / 2 + 5} fontFamily="Epilogue, Inter, sans-serif" fontSize="12" fontWeight="700" fill="rgba(255,255,255,0.8)">{sys.name}</text>

            {/* Cells */}
            {envs.map((env, j) => {
              const cellX = PAD + LABEL_W + j * (COL_W + 8)
              const instance = sys.instances[env] || ''
              const isPrd = env === 'PRD'
              return (
                <g key={j}>
                  <rect x={cellX} y={rowY} width={COL_W} height={ROW_H} rx="8"
                    fill={isPrd ? 'rgba(0,168,100,0.1)' : 'rgba(255,255,255,0.03)'}
                    stroke={isPrd ? 'rgba(0,168,100,0.4)' : 'rgba(255,255,255,0.08)'}
                    strokeWidth="1" />
                  {instance && (
                    <>
                      <circle cx={cellX + 14} cy={rowY + 18} r="4" fill="#00a864" />
                      <text x={cellX + 24} y={rowY + 22} fontFamily="Inter, sans-serif" fontSize="11" fontWeight="600" fill="rgba(255,255,255,0.8)">{instance}</text>
                    </>
                  )}
                  {!instance && (
                    <text x={cellX + COL_W / 2} y={rowY + ROW_H / 2 + 5} textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="10" fill="rgba(255,255,255,0.2)">--</text>
                  )}
                </g>
              )
            })}

            {/* Transport arrows DEV -> QAS -> PRD */}
            {envs.length >= 3 && envs.includes('DEV') && envs.includes('QAS') && (
              <>
                {(() => {
                  const dI = envs.indexOf('DEV')
                  const qI = envs.indexOf('QAS')
                  const pI = envs.indexOf('PRD')
                  const ax1 = PAD + LABEL_W + dI * (COL_W + 8) + COL_W + 4
                  const ax2 = PAD + LABEL_W + qI * (COL_W + 8) - 4
                  const ay = rowY + ROW_H / 2
                  const bx1 = PAD + LABEL_W + qI * (COL_W + 8) + COL_W + 4
                  const bx2 = pI >= 0 ? PAD + LABEL_W + pI * (COL_W + 8) - 4 : bx1 + 10
                  return (
                    <g>
                      <line x1={ax1} y1={ay} x2={ax2} y2={ay} stroke={ARROW_COLOR} strokeWidth="1.5" strokeOpacity="0.5" markerEnd="url(#arrow)" />
                      {pI >= 0 && <line x1={bx1} y1={ay} x2={bx2} y2={ay} stroke={ARROW_COLOR} strokeWidth="1.5" strokeOpacity="0.5" markerEnd="url(#arrow)" />}
                    </g>
                  )
                })()}
              </>
            )}
          </g>
        )
      })}

      <text x={PAD} y={H - 10} fontFamily="Inter, sans-serif" fontSize="9" fill="rgba(255,255,255,0.2)" letterSpacing="0.5">Confidential. Generated by DXC Proposal Builder.</text>
    </svg>
  )
})

export default LandscapeSvg
