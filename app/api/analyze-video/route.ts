import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface VideoAnalysisRequest {
  videoData: string // Base64 encoded video or video URL
  assessmentType: 'presentation' | 'interview' | 'leadership' | 'communication'
  candidateId: string
  questionContext: string
}

interface VideoAnalysisResult {
  communicationSkills: {
    clarity: number
    confidence: number
    engagement: number
    articulation: number
  }
  nonVerbalCommunication: {
    eyeContact: number
    posture: number
    gestures: number
    facialExpressions: number
  }
  contentQuality: {
    structure: number
    relevance: number
    depth: number
    examples: number
  }
  overallScore: number
  recommendations: string[]
  insights: string[]
}

export async function POST(request: NextRequest) {
  try {
    const {
      videoData,
      assessmentType,
      candidateId,
      questionContext
    }: VideoAnalysisRequest = await request.json()

    if (!videoData || !assessmentType) {
      return NextResponse.json({ error: 'Video data and assessment type required' }, { status: 400 })
    }

    // Simulate video analysis (in production, this would use actual video AI)
    const analysisResult = await analyzeVideo(videoData, assessmentType, questionContext)

    const response = {
      candidateId,
      assessmentType,
      analysis: analysisResult,
      timestamp: new Date().toISOString(),
      processingTime: calculateProcessingTime(),
      confidence: 0.92
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Video analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze video' },
      { status: 500 }
    )
  }
}

async function analyzeVideo(
  videoData: string, 
  assessmentType: string, 
  questionContext: string
): Promise<VideoAnalysisResult> {
  // In production, this would use actual video AI services
  // For demo, we'll simulate realistic analysis
  
  const baseScores = generateBaseScores(assessmentType)
  
  // Simulate AI-powered analysis with contextual insights
  const communicationSkills = {
    clarity: baseScores.clarity + Math.random() * 20 - 10,
    confidence: baseScores.confidence + Math.random() * 15 - 7,
    engagement: baseScores.engagement + Math.random() * 25 - 12,
    articulation: baseScores.articulation + Math.random() * 20 - 10
  }

  const nonVerbalCommunication = {
    eyeContact: baseScores.eyeContact + Math.random() * 20 - 10,
    posture: baseScores.posture + Math.random() * 15 - 7,
    gestures: baseScores.gestures + Math.random() * 25 - 12,
    facialExpressions: baseScores.facialExpressions + Math.random() * 20 - 10
  }

  const contentQuality = {
    structure: baseScores.structure + Math.random() * 20 - 10,
    relevance: baseScores.relevance + Math.random() * 15 - 7,
    depth: baseScores.depth + Math.random() * 25 - 12,
    examples: baseScores.examples + Math.random() * 20 - 10
  }

  // Normalize scores to 0-100 range
  const normalizedCommunication = normalizeScores(communicationSkills)
  const normalizedNonVerbal = normalizeScores(nonVerbalCommunication)
  const normalizedContent = normalizeScores(contentQuality)

  const overallScore = calculateOverallScore(
    normalizedCommunication,
    normalizedNonVerbal,
    normalizedContent
  )

  return {
    communicationSkills: normalizedCommunication,
    nonVerbalCommunication: normalizedNonVerbal,
    contentQuality: normalizedContent,
    overallScore,
    recommendations: generateRecommendations(normalizedCommunication, normalizedNonVerbal, normalizedContent),
    insights: generateInsights(assessmentType, normalizedCommunication, normalizedNonVerbal)
  }
}

function generateBaseScores(assessmentType: string) {
  const scoreRanges = {
    presentation: {
      clarity: 75, confidence: 70, engagement: 80, articulation: 72,
      eyeContact: 68, posture: 75, gestures: 70, facialExpressions: 73,
      structure: 78, relevance: 82, depth: 65, examples: 70
    },
    interview: {
      clarity: 78, confidence: 75, engagement: 75, articulation: 80,
      eyeContact: 82, posture: 78, gestures: 65, facialExpressions: 77,
      structure: 75, relevance: 85, depth: 78, examples: 75
    },
    leadership: {
      clarity: 80, confidence: 85, engagement: 88, articulation: 78,
      eyeContact: 85, posture: 82, gestures: 80, facialExpressions: 80,
      structure: 82, relevance: 80, depth: 85, examples: 88
    },
    communication: {
      clarity: 82, confidence: 75, engagement: 85, articulation: 85,
      eyeContact: 78, posture: 72, gestures: 82, facialExpressions: 80,
      structure: 80, relevance: 88, depth: 75, examples: 82
    }
  }

  return scoreRanges[assessmentType as keyof typeof scoreRanges] || scoreRanges.interview
}

function normalizeScores<T extends Record<string, number>>(scores: T): T {
  const normalized = {} as T
  Object.entries(scores).forEach(([key, value]) => {
    (normalized as any)[key] = Math.max(0, Math.min(100, Math.round(value)))
  })
  return normalized
}

function calculateOverallScore(
  communication: Record<string, number>,
  nonVerbal: Record<string, number>,
  content: Record<string, number>
): number {
  const commAvg = Object.values(communication).reduce((a, b) => a + b, 0) / Object.values(communication).length
  const nonVerbalAvg = Object.values(nonVerbal).reduce((a, b) => a + b, 0) / Object.values(nonVerbal).length
  const contentAvg = Object.values(content).reduce((a, b) => a + b, 0) / Object.values(content).length

  // Weighted average: content 40%, communication 35%, non-verbal 25%
  return Math.round(contentAvg * 0.4 + commAvg * 0.35 + nonVerbalAvg * 0.25)
}

function generateRecommendations(
  communication: Record<string, number>,
  nonVerbal: Record<string, number>,
  content: Record<string, number>
): string[] {
  const recommendations = []

  // Communication recommendations
  if (communication.clarity < 70) {
    recommendations.push("Work on speaking more clearly and at an appropriate pace")
  }
  if (communication.confidence < 70) {
    recommendations.push("Practice building confidence through preparation and rehearsal")
  }
  if (communication.engagement < 70) {
    recommendations.push("Focus on engaging your audience through storytelling and interaction")
  }

  // Non-verbal recommendations
  if (nonVerbal.eyeContact < 70) {
    recommendations.push("Maintain better eye contact to establish connection with your audience")
  }
  if (nonVerbal.posture < 70) {
    recommendations.push("Improve posture to project confidence and professionalism")
  }
  if (nonVerbal.gestures < 70) {
    recommendations.push("Use purposeful gestures to emphasize key points")
  }

  // Content recommendations
  if (content.structure < 70) {
    recommendations.push("Organize your content with a clear beginning, middle, and end")
  }
  if (content.depth < 70) {
    recommendations.push("Provide more detailed analysis and deeper insights")
  }
  if (content.examples < 70) {
    recommendations.push("Include more concrete examples to illustrate your points")
  }

  return recommendations.slice(0, 5) // Limit to top 5 recommendations
}

function generateInsights(
  assessmentType: string,
  communication: Record<string, number>,
  nonVerbal: Record<string, number>
): string[] {
  const insights = []

  const avgCommunication = Object.values(communication).reduce((a, b) => a + b, 0) / Object.values(communication).length
  const avgNonVerbal = Object.values(nonVerbal).reduce((a, b) => a + b, 0) / Object.values(nonVerbal).length

  if (avgCommunication > 85) {
    insights.push("Demonstrates exceptional verbal communication skills")
  }
  if (avgNonVerbal > 85) {
    insights.push("Shows strong non-verbal communication and presence")
  }
  if (communication.confidence > 85 && nonVerbal.posture > 85) {
    insights.push("Projects strong leadership presence and confidence")
  }
  if (communication.engagement > 85) {
    insights.push("Highly engaging communication style that captures attention")
  }

  // Assessment-specific insights
  if (assessmentType === 'leadership') {
    if (communication.confidence > 80 && nonVerbal.eyeContact > 80) {
      insights.push("Demonstrates natural leadership communication abilities")
    }
  }
  if (assessmentType === 'presentation') {
    if (communication.clarity > 80 && nonVerbal.gestures > 75) {
      insights.push("Skilled at delivering clear, well-structured presentations")
    }
  }

  return insights
}

function calculateProcessingTime(): number {
  // Simulate realistic processing time (2-8 seconds)
  return Math.random() * 6 + 2
}
