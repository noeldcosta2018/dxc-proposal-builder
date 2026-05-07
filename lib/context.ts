'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface EngagementContext {
  clientName: string
  clientShort: string
  projectName: string
  engagement: string
  researchUrl: string
  researchNotes: string
  differentiators: string
}

interface AppStore extends EngagementContext {
  apiKey: string
  setField: (key: keyof EngagementContext, value: string) => void
  setApiKey: (key: string) => void
}

export const useStore = create<AppStore>()(
  persist(
    (set) => ({
      clientName: '',
      clientShort: '',
      projectName: '',
      engagement: 'On-premise air-gapped SAP S/4HANA implementation',
      researchUrl: '',
      researchNotes: '',
      differentiators: '',
      apiKey: '',
      setField: (key, value) => set({ [key]: value }),
      setApiKey: (key) => set({ apiKey: key }),
    }),
    {
      name: 'dxc-proposal-context',
      partialize: (state) => ({
        clientName:     state.clientName,
        clientShort:    state.clientShort,
        projectName:    state.projectName,
        engagement:     state.engagement,
        researchUrl:    state.researchUrl,
        researchNotes:  state.researchNotes,
        differentiators: state.differentiators,
      }),
    }
  )
)
