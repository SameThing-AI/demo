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
    
    console.log('✨ API: Generated complete AI assessment')
    
    return NextResponse.json({
      assessmentInterface,
      scenarios,
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
