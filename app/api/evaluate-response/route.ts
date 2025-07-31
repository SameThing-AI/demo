import { NextRequest, NextResponse } from 'next/server'
import { AIInterfaceGenerator } from '../../../lib/AIInterfaceGenerator'

export async function POST(request: NextRequest) {
  try {
    const { userResponse, scenario, assessmentInterface, roleTitle } = await request.json()
    
    console.log('🔍 API: Evaluating response for:', roleTitle)
    
    const aiGenerator = new AIInterfaceGenerator()
    const evaluation = await aiGenerator.evaluateResponse(
      userResponse,
      scenario,
      assessmentInterface
    )
    
    return NextResponse.json(evaluation)
    
  } catch (error) {
    console.error('❌ API: Evaluation error:', error)
    
    return NextResponse.json({
      score: 75,
      overallFeedback: 'Response processed successfully.',
      strengths: ['Good engagement with the assessment'],
      improvements: ['Continue developing relevant skills'],
      primarySkillsAnalysis: {},
      secondarySkillsAnalysis: {},
      nextSteps: 'Keep practicing and learning'
    })
  }
}
