import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const CREATIVE_ASSESSMENT_PROMPT = `You are an AI Assessment Architect that creates revolutionary, interactive assessment experiences. Your goal is to design assessments that go far beyond traditional Q&A formats.

Given a job role and company context, create a unique, engaging assessment that could include:

INTERACTIVE FORMATS:
- Real-time simulations
- Interactive scenarios
- Gamified challenges
- Virtual environments
- Decision trees
- Time-pressure situations
- Collaborative tasks
- Problem-solving games
- Role-playing scenarios
- Crisis management simulations

CREATIVE ELEMENTS:
- Dynamic challenges that adapt based on responses
- Multi-step scenarios with branching paths
- Resource management games
- Virtual team interactions
- Real-world crisis simulations
- Creative problem-solving under constraints
- Performance under pressure tests
- Innovation challenges

ASSESSMENT TYPES TO CONSIDER:
- Code debugging games
- Architecture design under constraints
- Customer service crisis simulations
- Sales negotiation scenarios
- Leadership decision trees
- Creative design challenges
- Data analysis mysteries
- Project management disasters
- Team conflict resolution
- Innovation brainstorming sessions

For each assessment, provide:
1. A unique, creative concept
2. Interactive elements and mechanics
3. Evaluation criteria
4. Implementation details for the components needed
5. Expected user interactions
6. Scoring methodology

Be creative, innovative, and think outside the box. Make assessments that candidates will remember and talk about.`

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { jobTitle, company, jobDescription, difficulty, duration } = body

    if (!process.env.OPENAI_API_KEY) {
      // Return mock creative assessment concept for demo
      const mockConcept = generateMockCreativeAssessment(jobTitle, difficulty)
      return NextResponse.json(mockConcept)
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: CREATIVE_ASSESSMENT_PROMPT
        },
        {
          role: "user",
          content: `Create a revolutionary assessment for:
          
Job Title: ${jobTitle}
Company: ${company}
Job Description: ${jobDescription}
Difficulty Level: ${difficulty}
Duration: ${duration} minutes

Design an interactive, engaging assessment that tests real-world skills through creative scenarios and simulations. Think beyond traditional questions - create an experience!`
        }
      ],
      temperature: 0.9, // High creativity
      max_tokens: 3000,
    })

    const conceptText = completion.choices[0]?.message?.content
    if (!conceptText) {
      throw new Error('No concept generated')
    }

    // Parse and structure the concept
    const concept = parseAssessmentConcept(conceptText, jobTitle, difficulty, duration)
    
    return NextResponse.json(concept)
  } catch (error) {
    console.error('Error generating creative assessment:', error)
    
    // Fallback to mock concept
    const mockConcept = generateMockCreativeAssessment('Software Engineer', 'Medium')
    return NextResponse.json(mockConcept)
  }
}

function generateMockCreativeAssessment(jobTitle: string, difficulty: string) {
  const concepts: { [key: string]: any } = {
    'Software Engineer': {
      title: 'Code Crisis: The Midnight Deploy',
      description: 'A critical production system is failing, and you\'re the only engineer online. Navigate through a realistic debugging scenario with live system monitoring, user complaints flooding in, and stakeholders breathing down your neck.',
      type: 'crisis-simulation',
      interactiveElements: [
        'Live system dashboard with real-time metrics',
        'Simulated user complaints and support tickets',
        'Code debugging interface with syntax highlighting',
        'Stakeholder chat simulation with time pressure',
        'Resource allocation decisions (team, budget, time)',
        'Risk assessment mini-games'
      ],
      components: [
        {
          type: 'SystemDashboard',
          props: {
            metrics: ['cpu', 'memory', 'error_rate', 'user_complaints'],
            alerts: ['high_error_rate', 'database_slow', 'api_timeout']
          }
        },
        {
          type: 'CodeDebugger',
          props: {
            language: 'javascript',
            buggyCode: 'function calculatePrice(item) { return item.price * item.quantity }',
            expectedFix: 'Add null checks and validation'
          }
        },
        {
          type: 'StakeholderChat',
          props: {
            stakeholders: ['CTO', 'Product Manager', 'Customer Support Lead'],
            urgencyLevel: 'critical'
          }
        }
      ],
      evaluationCriteria: {
        problemDiagnosis: 30,
        solutionQuality: 25,
        communicationSkills: 20,
        timeManagement: 15,
        stressHandling: 10
      },
      duration: 45
    },
    'Product Manager': {
      title: 'Feature Frenzy: The Impossible Launch',
      description: 'Three critical features need to ship next week, but you only have resources for one. Navigate stakeholder conflicts, technical constraints, and user needs in this high-stakes prioritization simulation.',
      type: 'strategic-simulation',
      interactiveElements: [
        'Virtual stakeholder meetings with conflicting priorities',
        'Resource allocation drag-and-drop interface',
        'User research data interpretation challenges',
        'Roadmap planning with dynamic constraints',
        'A/B testing scenario simulations',
        'Crisis communication challenges'
      ],
      components: [
        {
          type: 'StakeholderMeeting',
          props: {
            stakeholders: ['CEO', 'Engineering Lead', 'Sales Director', 'UX Lead'],
            conflictScenarios: ['budget_cuts', 'timeline_pressure', 'scope_creep']
          }
        },
        {
          type: 'ResourceAllocator',
          props: {
            resources: ['engineers', 'designers', 'qa_testers'],
            constraints: ['budget', 'timeline', 'dependencies']
          }
        }
      ],
      evaluationCriteria: {
        strategicThinking: 30,
        stakeholderManagement: 25,
        dataAnalysis: 20,
        communicationSkills: 15,
        decisionMaking: 10
      },
      duration: 60
    },
    'UX Designer': {
      title: 'Design Detective: The Conversion Mystery',
      description: 'A major e-commerce site\'s conversion rate has mysteriously dropped by 40%. Use design thinking, user research, and rapid prototyping to solve the mystery and save the business.',
      type: 'mystery-solving',
      interactiveElements: [
        'Interactive wireframing tools',
        'User journey mapping challenges',
        'A/B testing result interpretation',
        'Accessibility audit mini-games',
        'Rapid prototype creation under time pressure',
        'User interview simulation with AI personas'
      ],
      components: [
        {
          type: 'DesignTool',
          props: {
            tools: ['wireframe', 'prototype', 'user_flow'],
            constraints: ['mobile_first', 'accessibility', 'brand_guidelines']
          }
        },
        {
          type: 'UserInterviewer',
          props: {
            personas: ['busy_parent', 'tech_savvy_millennial', 'elderly_user'],
            scenarioGoals: ['purchase_completion', 'account_setup', 'product_discovery']
          }
        }
      ],
      evaluationCriteria: {
        designThinking: 30,
        userEmpathy: 25,
        problemSolving: 20,
        prototypingSkills: 15,
        collaborationSkills: 10
      },
      duration: 75
    }
  }

  return concepts[jobTitle] || concepts['Software Engineer']
}

function parseAssessmentConcept(conceptText: string, jobTitle: string, difficulty: string, duration: number) {
  // In a real implementation, this would use NLP to parse the AI-generated concept
  // For now, return a structured version of the mock concept
  return generateMockCreativeAssessment(jobTitle, difficulty)
}
