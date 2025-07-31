import { NextRequest, NextResponse } from 'next/server'
import { aiContentGenerator, AIGenerationRequest } from '@/lib/ai-content-generator-openai'

export async function POST(request: NextRequest) {
  try {
    const body: AIGenerationRequest = await request.json()
    
    // Validate request
    if (!body.type || !body.context) {
      return NextResponse.json(
        { error: 'Missing required fields: type and context' },
        { status: 400 }
      )
    }

    // Generate AI content
    const result = await aiContentGenerator.generateContent(body)
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('AI API Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate AI content' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const type = searchParams.get('type')
  const context = searchParams.get('context')
  
  if (!type) {
    return NextResponse.json(
      { error: 'Type parameter required' },
      { status: 400 }
    )
  }

  try {
    const parsedContext = context ? JSON.parse(context) : {}
    const result = await aiContentGenerator.generateContent({
      type: type as any,
      context: parsedContext
    })
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('AI API Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate AI content' },
      { status: 500 }
    )
  }
}
