import { NextRequest, NextResponse } from 'next/server'
import { AIInterfaceGenerator } from '../../../lib/AIInterfaceGenerator'

export async function POST(request: NextRequest) {
  try {
    const { jobDescription, roleTitle, companyContext, jobTitle, company } = await request.json()
    
    // Handle both old and new parameter formats
    const title = roleTitle || jobTitle || 'Professional'
    const description = jobDescription || 'Professional role assessment'
    const context = companyContext || company || 'Professional Organization'
    
    console.log('🎨 API: Generating AI assessment for:', title)
    
    const aiGenerator = new AIInterfaceGenerator()
    
    // Generate the assessment interface
    const assessmentInterface = await aiGenerator.generateAssessmentInterface(
      description,
      title,
      context
    )
    
    // Generate scenarios for this interface
    const scenarios = await aiGenerator.generateScenarios(
      assessmentInterface,
      title,
      description
    )
    
    // Generate traditional questions for backward compatibility
    const questions = await aiGenerator.generateQuestionsFromInterface(
      assessmentInterface,
      scenarios,
      title,
      description
    )
    
    console.log('✨ API: Generated complete AI assessment with', questions.length, 'questions')
    
    return NextResponse.json({
      assessmentInterface,
      scenarios,
      questions, // Add traditional questions for compatibility
      generated: true,
      timestamp: new Date().toISOString(),
      // Legacy format support
      title: assessmentInterface.title,
      description: assessmentInterface.description,
      assessmentType: assessmentInterface.type
    })
    
  } catch (error) {
    console.error('❌ API: Assessment generation error:', error)
    
    // Handle both old and new parameter formats for fallback
    const { jobDescription, roleTitle, companyContext, jobTitle, company } = await request.json()
    const title = roleTitle || jobTitle || 'Professional'
    
    // Return fallback assessment
    const fallbackTitle = title + ' Assessment'
    
    return NextResponse.json({
      assessmentInterface: {
        type: 'adaptive-assessment',
        title: fallbackTitle,
        description: 'Comprehensive role-based assessment',
        components: [
          {
            id: 'main-response',
            type: 'textarea',
            label: 'Your Response',
            placeholder: 'Provide your detailed response...',
            props: { rows: 10 },
            layout: { width: '100%', height: '400px', position: 'center', order: 1 }
          }
        ],
        interactions: [
          {
            trigger: 'submit-response',
            action: 'evaluate',
            feedback: { immediate: true, detailed: true, adaptive: true, style: 'analytical' },
            evaluation: 'Evaluate the response comprehensively'
          }
        ],
        evaluation: {
          primary: ['Problem Solving', 'Communication'],
          secondary: ['Creativity', 'Technical Knowledge'],
          scoring: { algorithm: 'adaptive', factors: ['quality', 'completeness'], weights: [0.7, 0.3] },
          aiPrompts: ['Evaluate problem-solving approach', 'Assess communication clarity']
        },
        styling: {
          theme: 'professional',
          colors: { primary: '#3B82F6', secondary: '#1F2937', accent: '#10B981', background: '#111827' },
          layout: 'dashboard'
        }
      },
      scenarios: [
        {
          id: 'scenario-1',
          title: 'Professional Challenge',
          description: 'Navigate a complex professional situation relevant to your role',
          initialState: {},
          challenges: ['Analyze the situation thoroughly', 'Propose actionable solutions'],
          successCriteria: ['Clear analysis', 'Practical solutions'],
          timeLimit: 1800,
          difficulty: 'medium'
        }
      ],
      questions: [
        {
          id: 'q1',
          type: 'text',
          question: `Describe a challenging situation you've encountered in a ${title} role and how you handled it.`,
          description: 'Evaluates problem-solving and experience',
          timeLimit: 600,
          difficulty: 'medium',
          scenario: {
            type: 'role-specific',
            context: `Professional scenario relevant to ${title}`,
            task: 'Analyze and provide detailed response'
          },
          evaluation: {
            rubric: [
              'Situation clarity (25 points)',
              'Problem-solving approach (25 points)', 
              'Communication skills (25 points)',
              'Results and learning (25 points)'
            ],
            aiPrompts: [
              'Evaluate problem-solving methodology',
              'Assess communication clarity',
              'Review outcome effectiveness'
            ]
          }
        },
        {
          id: 'q2',
          type: 'text',
          question: `What would be your approach to achieving key objectives in a ${title} position?`,
          description: 'Evaluates strategic thinking and planning',
          timeLimit: 900,
          difficulty: 'medium',
          scenario: {
            type: 'strategic',
            context: 'Professional planning scenario',
            task: 'Develop comprehensive strategy'
          },
          evaluation: {
            rubric: [
              'Strategic thinking (25 points)',
              'Implementation planning (25 points)',
              'Risk consideration (25 points)', 
              'Success metrics (25 points)'
            ],
            aiPrompts: [
              'Evaluate strategic depth',
              'Assess practical implementation',
              'Review risk awareness'
            ]
          }
        }
      ],
      generated: false,
      fallback: true,
      timestamp: new Date().toISOString(),
      // Legacy format support
      title: fallbackTitle,
      description: 'Comprehensive assessment tailored to your role',
      assessmentType: 'adaptive-assessment'
    })
  }
}
