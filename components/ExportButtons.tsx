'use client'

import { useRef } from 'react'
import { downloadSvg, downloadPng } from '@/lib/exportSvg'

interface ExportButtonsProps {
  svgRef: React.RefObject<SVGSVGElement>
  basename: string
}

export default function ExportButtons({ svgRef, basename }: ExportButtonsProps) {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <button
        className="btn btn-outline btn-sm"
        onClick={() => {
          if (svgRef.current) downloadSvg(svgRef.current, basename)
        }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        SVG
      </button>
      <button
        className="btn btn-primary btn-sm"
        onClick={() => {
          if (svgRef.current) downloadPng(svgRef.current, basename)
        }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        PNG 2x
      </button>
    </div>
  )
}
