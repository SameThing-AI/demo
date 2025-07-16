import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // Allow testing without authentication in development
    const isDevelopment = process.env.NODE_ENV === 'development'
    const isTest = request.headers.get('x-test-mode') === 'true'
    
    if (!isDevelopment && !isTest && !session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      message, 
      question, 
      jobRole, 
      jobDescription, 
      questionDifficulty,
      conversationHistory = [] 
    } = body

    if (!message || !question || !jobRole) {
      return NextResponse.json(
        { error: 'Missing required fields: message, question, jobRole' },
        { status: 400 }
      )
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        response: "I'm here to help you with this assessment question! However, the AI service is currently not available. Please try to solve the question based on your knowledge and experience.",
        remainingCredits: 1 // Return same credits since no actual usage
      })
    }

    // Create context-aware system prompt
    const systemPrompt = `You are an AI assistant helping a candidate during a job assessment. You must provide helpful guidance while ensuring the candidate still demonstrates their own problem-solving abilities.

IMPORTANT GUIDELINES:
1. Do NOT provide direct answers or complete solutions
2. Guide the candidate toward the solution through questions and hints
3. Help them understand the problem better, not solve it for them
4. Encourage critical thinking and self-discovery
5. Be supportive but not overly helpful
6. Keep responses concise and focused (max 150 words)
7. If asked for direct answers, politely decline and redirect to guidance

CONTEXT:
Job Role: ${jobRole}
Job Description: ${jobDescription || 'Not provided'}
Assessment Question: ${question}
Question Difficulty: ${questionDifficulty || 'Medium'}

Your role is to act as a mentor who helps the candidate think through the problem, not someone who gives them the answer. Focus on methodology, approach, and understanding rather than solutions.`

    // Build conversation messages
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: message }
    ]

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: messages as any,
        max_tokens: 200,
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
      })

      const response = completion.choices[0]?.message?.content || 
        "I'm here to help guide you through this question. What specific aspect would you like me to help you think through?"

      return NextResponse.json({
        response,
        usage: completion.usage,
        success: true
      })

    } catch (aiError: any) {
      console.error('OpenAI API error:', aiError)
      
      // Provide fallback response
      const fallbackResponse = getFallbackResponse(message, questionDifficulty)
      
      return NextResponse.json({
        response: fallbackResponse,
        success: true,
        fallback: true
      })
    }

  } catch (error) {
    console.error('Assessment chatbot error:', error)
    return NextResponse.json(
      { error: 'Failed to process chatbot request' },
      { status: 500 }
    )
  }
}

function getFallbackResponse(message: string, difficulty: string): string {
  const lowerMessage = message.toLowerCase()
  
  if (lowerMessage.includes('help') || lowerMessage.includes('stuck') || lowerMessage.includes('don\'t know')) {
    return "Let's break this down step by step. What do you understand about the problem so far? What's the first thing that comes to mind when you read the question?"
  }
  
  if (lowerMessage.includes('approach') || lowerMessage.includes('strategy')) {
    return "Good question! Consider: 1) What is the core problem asking? 2) What tools or concepts might be relevant? 3) Can you break it into smaller parts? What would be your first step?"
  }
  
  if (lowerMessage.includes('answer') || lowerMessage.includes('solution')) {
    return "I can't provide the direct answer, but I can help you think through it! What's your current thinking? What have you considered so far?"
  }
  
  if (lowerMessage.includes('correct') || lowerMessage.includes('right')) {
    return "Instead of looking for the 'right' answer, focus on your reasoning process. Can you walk me through your thinking? What led you to this conclusion?"
  }
  
  const difficultyResponses = {
    'Easy': "This question tests fundamental concepts. What basic principles do you think apply here?",
    'Medium': "This requires combining a few concepts. What different aspects of the problem can you identify?",
    'Hard': "Complex problems like this often have multiple layers. What's the most challenging part you're facing?"
  }
  
  return difficultyResponses[difficulty as keyof typeof difficultyResponses] || 
    "I'm here to guide you through your thinking process. What specific aspect of this question would you like to explore together?"
}
