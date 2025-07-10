import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface ResponseAnalysis {
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  competencyAreas: string[]
  strengths: string[]
  weaknesses: string[]
  confidenceLevel: number
  creativity: number
  problemSolvingApproach: string
  recommendedNextSkills: string[]
  adaptationStrategy: 'increase_difficulty' | 'decrease_difficulty' | 'explore_depth' | 'broaden_scope'
}

export async function POST(request: NextRequest) {
  try {
    const { 
      assessmentId,
      questionId,
      response,
      interactionData,
      candidateProfile,
      currentContext
    } = await request.json()

    if (!response) {
      return NextResponse.json({ error: 'Response is required' }, { status: 400 })
    }

    let analysis: ResponseAnalysis

    if (process.env.OPENAI_API_KEY) {
      try {
        const systemPrompt = `You are an advanced AI response analyzer for hiring assessments. Your job is to deeply analyze candidate responses and provide actionable insights for adaptive assessment modification.

ANALYSIS FRAMEWORK:
1. Technical competency level (beginner/intermediate/advanced/expert)
2. Problem-solving approach (systematic/creative/analytical/intuitive)
3. Communication clarity and structure
4. Creativity and innovation indicators
5. Confidence level in domain knowledge
6. Areas of strength and improvement
7. Recommended learning/assessment paths

RESPONSE FORMAT (JSON only):
{
  "skillLevel": "beginner|intermediate|advanced|expert",
  "competencyAreas": ["area1", "area2"],
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "confidenceLevel": 0-100,
  "creativity": 0-100,
  "problemSolvingApproach": "description",
  "recommendedNextSkills": ["skill1", "skill2"],
  "adaptationStrategy": "increase_difficulty|decrease_difficulty|explore_depth|broaden_scope"
}

CONTEXT:
- Assessment ID: ${assessmentId}
- Question ID: ${questionId}
- Interaction Data: ${JSON.stringify(interactionData)}
- Candidate Profile: ${JSON.stringify(candidateProfile)}
- Current Context: ${JSON.stringify(currentContext)}`

        const completion = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Analyze this candidate response: ${response}` }
          ],
          max_tokens: 1000,
          temperature: 0.3,
        })

        const responseText = completion.choices[0]?.message?.content || ''
        analysis = JSON.parse(responseText)
      } catch (error) {
        console.error('OpenAI analysis error:', error)
        analysis = generateMockAnalysis(response, interactionData)
      }
    } else {
      analysis = generateMockAnalysis(response, interactionData)
    }

    // Enhanced analysis with interaction data
    if (interactionData) {
      analysis = enhanceAnalysisWithInteractionData(analysis, interactionData)
    }

    const result = {
      analysis,
      timestamp: new Date().toISOString(),
      adaptationRecommendations: generateAdaptationRecommendations(analysis),
      nextQuestionSuggestions: generateNextQuestionSuggestions(analysis, currentContext)
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Response analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze response' },
      { status: 500 }
    )
  }
}

function generateMockAnalysis(response: string, interactionData?: any): ResponseAnalysis {
  const responseLength = response.length
  const hasCodeExample = /```|function|class|const|let|var/.test(response)
  const hasStructuredThinking = /first|second|third|step|approach|strategy/.test(response.toLowerCase())
  
  let skillLevel: ResponseAnalysis['skillLevel'] = 'intermediate'
  if (responseLength > 500 && hasCodeExample) skillLevel = 'advanced'
  if (responseLength > 1000 && hasCodeExample && hasStructuredThinking) skillLevel = 'expert'
  if (responseLength < 200) skillLevel = 'beginner'

  const competencyAreas = []
  if (hasCodeExample) competencyAreas.push('Technical Implementation')
  if (hasStructuredThinking) competencyAreas.push('Problem Solving')
  if (interactionData?.type === 'communication') competencyAreas.push('Communication')
  if (interactionData?.type === 'dashboard') competencyAreas.push('System Analysis')

  return {
    skillLevel,
    competencyAreas,
    strengths: generateStrengths(response, interactionData),
    weaknesses: generateWeaknesses(response, interactionData),
    confidenceLevel: Math.min(90, Math.max(30, responseLength / 10)),
    creativity: hasCodeExample ? 75 : 60,
    problemSolvingApproach: hasStructuredThinking ? 'Systematic and methodical' : 'Intuitive and exploratory',
    recommendedNextSkills: generateRecommendedSkills(skillLevel, competencyAreas),
    adaptationStrategy: determineAdaptationStrategy(skillLevel, responseLength, interactionData)
  }
}

function generateStrengths(response: string, interactionData?: any): string[] {
  const strengths = []
  
  if (response.length > 300) strengths.push('Detailed explanations')
  if (/example|for instance|such as/.test(response.toLowerCase())) strengths.push('Concrete examples')
  if (/consider|analyze|evaluate/.test(response.toLowerCase())) strengths.push('Critical thinking')
  if (interactionData?.timestamp) strengths.push('Quick decision making')
  if (/team|collaboration|stakeholder/.test(response.toLowerCase())) strengths.push('Team awareness')
  
  return strengths.slice(0, 3)
}

function generateWeaknesses(response: string, interactionData?: any): string[] {
  const weaknesses = []
  
  if (response.length < 150) weaknesses.push('Could provide more detail')
  if (!/example/.test(response.toLowerCase())) weaknesses.push('Could use more examples')
  if (!/step|approach|method/.test(response.toLowerCase())) weaknesses.push('Could be more structured')
  if (!interactionData?.completed) weaknesses.push('Could engage more with interactive elements')
  
  return weaknesses.slice(0, 2)
}

function generateRecommendedSkills(skillLevel: string, competencyAreas: string[]): string[] {
  const skillMap = {
    beginner: ['Problem decomposition', 'Basic communication', 'Structured thinking'],
    intermediate: ['Advanced problem solving', 'Leadership basics', 'Technical depth'],
    advanced: ['System design', 'Strategic thinking', 'Team leadership'],
    expert: ['Mentorship', 'Innovation leadership', 'Organizational impact']
  }
  
  return skillMap[skillLevel as keyof typeof skillMap] || skillMap.intermediate
}

function determineAdaptationStrategy(
  skillLevel: string, 
  responseLength: number, 
  interactionData?: any
): ResponseAnalysis['adaptationStrategy'] {
  if (skillLevel === 'expert' || (responseLength > 800 && interactionData?.completed)) {
    return 'increase_difficulty'
  }
  if (skillLevel === 'beginner' || responseLength < 100) {
    return 'decrease_difficulty'
  }
  if (skillLevel === 'advanced') {
    return 'explore_depth'
  }
  return 'broaden_scope'
}

function enhanceAnalysisWithInteractionData(analysis: ResponseAnalysis, interactionData: any): ResponseAnalysis {
  // Enhance confidence based on interaction speed
  if (interactionData.timestamp) {
    const interactionSpeed = Date.now() - interactionData.timestamp
    if (interactionSpeed < 30000) { // Quick response
      analysis.confidenceLevel = Math.min(100, analysis.confidenceLevel + 10)
    }
  }

  // Enhance creativity based on interaction type
  if (interactionData.type === 'creative' || interactionData.type === 'dashboard') {
    analysis.creativity = Math.min(100, analysis.creativity + 15)
  }

  return analysis
}

function generateAdaptationRecommendations(analysis: ResponseAnalysis) {
  return {
    difficultyAdjustment: analysis.adaptationStrategy,
    focusAreas: analysis.weaknesses,
    nextChallengeType: getNextChallengeType(analysis),
    estimatedTimeAdjustment: getTimeAdjustment(analysis)
  }
}

function generateNextQuestionSuggestions(analysis: ResponseAnalysis, currentContext?: any) {
  const suggestions = []
  
  if (analysis.adaptationStrategy === 'increase_difficulty') {
    suggestions.push({
      type: 'advanced_scenario',
      focus: 'Complex problem solving',
      difficulty: 'hard'
    })
  }
  
  if (analysis.weaknesses.includes('Could be more structured')) {
    suggestions.push({
      type: 'structured_challenge',
      focus: 'Systematic thinking',
      difficulty: 'medium'
    })
  }
  
  if (analysis.creativity > 70) {
    suggestions.push({
      type: 'creative_challenge',
      focus: 'Innovation and creativity',
      difficulty: analysis.skillLevel === 'expert' ? 'hard' : 'medium'
    })
  }
  
  return suggestions
}

function getNextChallengeType(analysis: ResponseAnalysis): string {
  if (analysis.competencyAreas.includes('Technical Implementation')) {
    return 'advanced-coding-challenge'
  }
  if (analysis.competencyAreas.includes('Communication')) {
    return 'stakeholder-presentation'
  }
  if (analysis.competencyAreas.includes('System Analysis')) {
    return 'complex-system-debugging'
  }
  return 'multi-faceted-problem'
}

function getTimeAdjustment(analysis: ResponseAnalysis): number {
  switch (analysis.adaptationStrategy) {
    case 'increase_difficulty': return 1.5
    case 'decrease_difficulty': return 0.8
    case 'explore_depth': return 1.3
    case 'broaden_scope': return 1.1
    default: return 1.0
  }
}
