'use client'

import { forwardRef } from 'react'

export interface ArchLayer {
  name: string
  color: string
  items: string[]
}

interface Props {
  layers: ArchLayer[]
  title: string
  clientName: string
}

const LAYER_HEIGHT = 80
const LABEL_W = 140
const PAD = 32
const W = 900
const FOOTER_H = 32
const LOGO_H = 28

const ArchitectureSvg = forwardRef<SVGSVGElement, Props>(function ArchitectureSvg({ layers, title, clientName }, ref) {
  const contentH = layers.length * (LAYER_HEIGHT + 12) + PAD
  const H = LOGO_H + PAD + contentH + FOOTER_H + 16

  return (
    <svg
      ref={ref}
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      xmlns="http://www.w3.org/2000/svg"
      fontFamily="Inter, sans-serif"
    >
      {/* Background */}
      <rect width={W} height={H} fill="#0E1020" rx="0" />

      {/* Gradient bar */}
      <defs>
        <linearGradient id="arch-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FFB87E" />
          <stop offset="33%" stopColor="#FF7E51" />
          <stop offset="66%" stopColor="#B88A99" />
          <stop offset="100%" stopColor="#6399F0" />
        </linearGradient>
        <radialGradient id="arch-logo-g" cx="0" cy="0" r="1"
          gradientTransform="matrix(402.422 -113.55 49.0928 173.987 432 120.032)"
          gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFB87E" />
          <stop offset="0.558" stopColor="#FF7E51" />
          <stop offset="1" stopColor="#6399F0" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width={W} height="3" fill="url(#arch-grad)" />

      {/* Logo top-right */}
      <g transform={`translate(${W - 80}, 12) scale(${70 / 860})`}>
        <path d="M220.055 60.7583C252.905 60.7583 279.643 87.4387 279.644 120.247C279.644 153.055 252.905 179.735 220.055 179.735H61V155.455H220.055C239.522 155.455 255.362 139.657 255.362 120.247C255.362 100.836 239.522 85.0396 220.055 85.0396H61V60.7583H220.055ZM798 85.0386H638.945C619.478 85.0386 603.638 100.836 603.638 120.247C603.638 139.657 619.478 155.454 638.945 155.454H798V179.735H638.945C606.08 179.735 579.357 153.054 579.356 120.247C579.356 87.4387 606.095 60.7573 638.945 60.7573H798V85.0386ZM556.104 85.0386C530.11 85.0387 511.856 96.5366 492.531 108.706C486.261 112.662 479.906 116.647 473.278 120.204C479.905 123.76 486.261 127.744 492.531 131.701C511.856 143.87 530.11 155.368 556.104 155.368V179.649C523.097 179.649 499.987 165.095 479.591 152.254C462.637 141.585 447.997 132.358 430.058 132.358C412.118 132.358 397.478 141.571 380.524 152.254C360.128 165.095 337.018 179.649 304.011 179.649V155.368C330.006 155.368 348.259 143.87 367.584 131.701C373.854 127.744 380.211 123.76 386.838 120.204C380.211 116.647 373.854 112.662 367.584 108.706C348.259 96.5366 330.006 85.0386 304.011 85.0386V60.7573C337.018 60.7573 360.128 75.3119 380.524 88.1665C397.478 98.8358 412.118 108.063 430.058 108.063V108.048C447.997 108.048 462.637 98.8364 479.591 88.1528C499.987 75.3125 523.097 60.7575 556.104 60.7573V85.0386Z" fill="url(#arch-logo-g)" />
      </g>

      {/* Title block */}
      <text x={PAD} y={22} fontFamily="Epilogue, Inter, sans-serif" fontSize="11" fontWeight="700" fill="rgba(255,126,81,0.8)" letterSpacing="2">SAP SOLUTION ARCHITECTURE</text>
      <text x={PAD} y={44} fontFamily="Epilogue, Inter, sans-serif" fontSize="20" fontWeight="800" fill="#fff">{title || 'Target Architecture'}</text>
      <text x={PAD} y={62} fontFamily="Inter, sans-serif" fontSize="11" fill="rgba(255,255,255,0.4)">{clientName || '[Client]'}</text>

      {/* Layers */}
      {layers.map((layer, i) => {
        const y = LOGO_H + PAD + 40 + i * (LAYER_HEIGHT + 12)
        const itemW = (W - PAD * 2 - LABEL_W - 16) / Math.max(layer.items.length, 1)
        return (
          <g key={i}>
            {/* Layer band */}
            <rect x={PAD} y={y} width={W - PAD * 2} height={LAYER_HEIGHT} rx="8" fill="rgba(255,255,255,0.04)" stroke={layer.color} strokeWidth="1" strokeOpacity="0.3" />
            {/* Layer label */}
            <rect x={PAD} y={y} width={LABEL_W} height={LAYER_HEIGHT} rx="8" fill={layer.color} fillOpacity="0.15" />
            <text x={PAD + LABEL_W / 2} y={y + LAYER_HEIGHT / 2 + 5} textAnchor="middle" fontFamily="Epilogue, Inter, sans-serif" fontSize="11" fontWeight="700" fill={layer.color}>{layer.name}</text>
            {/* Items */}
            {layer.items.filter(Boolean).map((item, j) => {
              const ix = PAD + LABEL_W + 16 + j * (itemW + 8)
              return (
                <g key={j}>
                  <rect x={ix} y={y + 12} width={itemW - 8} height={LAYER_HEIGHT - 24} rx="6" fill={layer.color} fillOpacity="0.12" stroke={layer.color} strokeOpacity="0.35" strokeWidth="1" />
                  <text x={ix + (itemW - 8) / 2} y={y + LAYER_HEIGHT / 2 + 5} textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="11" fontWeight="600" fill="rgba(255,255,255,0.85)">{item}</text>
                </g>
              )
            })}
          </g>
        )
      })}

      {/* Footer */}
      <text x={PAD} y={H - 10} fontFamily="Inter, sans-serif" fontSize="9" fill="rgba(255,255,255,0.2)" letterSpacing="0.5">Confidential. Generated by DXC Proposal Builder.</text>
    </svg>
  )
})

export default ArchitectureSvg
