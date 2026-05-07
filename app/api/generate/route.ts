import { NextRequest, NextResponse } from 'next/server'
import { buildSystemPrompt } from '@/lib/prompt'
import type { EngagementContext } from '@/lib/context'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get('x-api-key') || process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'API key missing' }, { status: 401 })
  }

  let body: { heading: string; context: EngagementContext }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { heading, context } = body
  if (!heading?.trim()) {
    return NextResponse.json({ error: 'Heading is required' }, { status: 400 })
  }

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1500,
        system: buildSystemPrompt(context),
        messages: [{ role: 'user', content: `Write the proposal section: "${heading}"` }],
      }),
    })

    const data = await res.json()
    if (!res.ok) {
      const detail = data?.error?.message || JSON.stringify(data)
      return NextResponse.json({ error: `Anthropic ${res.status}: ${detail}` }, { status: res.status })
    }

    const block = Array.isArray(data?.content) ? data.content[0] : null
    const content = block?.type === 'text' ? block.text : ''
    return NextResponse.json({ content })
  } catch (err: unknown) {
    const msg = err instanceof Error ? `${err.name}: ${err.message}` : 'Generation failed'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
