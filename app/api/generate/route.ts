import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { buildSystemPrompt } from '@/lib/prompt'
import type { EngagementContext } from '@/lib/context'

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

  const client = new Anthropic({ apiKey })

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 1500,
      system: buildSystemPrompt(context),
      messages: [
        {
          role: 'user',
          content: `Write the proposal section: "${heading}"`,
        },
      ],
    })

    const content = message.content[0]?.type === 'text' ? message.content[0].text : ''
    return NextResponse.json({ content })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Generation failed'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
