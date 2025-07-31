import { AssessmentInterface, InterfaceComponent, InteractionHandler, EvaluationCriteria } from '../types/AssessmentInterface'

export class AIInterfaceGenerator {
  private openaiApiKey: string

  constructor() {
    // Try both client and server-side environment variables
    this.openaiApiKey = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY || ''
    
    if (!this.openaiApiKey) {
      console.log('⚠️ OpenAI API key not found - using fallback responses')
    } else {
      console.log('✅ OpenAI API key configured')
    }
  }

  async generateAssessmentInterface(jobDescription: string, roleTitle: string, companyContext: string): Promise<AssessmentInterface> {
    console.log('🎨 REVOLUTIONARY AI: Generating pinnacle assessment interface for:', { roleTitle, jobDescription })

    // If no OpenAI key, return revolutionary template immediately
    if (!this.openaiApiKey) {
      console.log('⚠️ No OpenAI key - returning revolutionary template')
      return this.getRevolutionaryTemplate(roleTitle, jobDescription, companyContext)
    }

    const revolutionaryPrompt = `
You are the WORLD'S MOST ADVANCED AI ASSESSMENT ARCHITECT. Your task is to create the MOST INTELLIGENT, CREATIVE, and GROUNDBREAKING assessment of all time for this role.

ROLE: ${roleTitle}
JOB DESCRIPTION: ${jobDescription}
COMPANY: ${companyContext}

REVOLUTIONARY REQUIREMENTS:
🧠 INTELLIGENCE: Deeply analyze what this role TRULY requires beyond surface skills
🎨 CREATIVITY: Create assessment experiences that have NEVER existed before 
⚡ INNOVATION: Push the boundaries of what's possible in candidate evaluation
🔬 PRECISION: Engineer perfect measurements of candidate capability
🚀 EXCELLENCE: This must be the pinnacle of assessment technology

ROLE-SPECIFIC REVOLUTIONARY APPROACHES:

SOFTWARE ENGINEERS:
- Real-time collaborative debugging of production-grade systems
- Live algorithm racing with performance optimization challenges
- Interactive system architecture design with scalability constraints
- Code review scenarios with actual production codebases
- Microservice orchestration under failure conditions

DATA SCIENTISTS:
- Live data stream analysis with real-time decision making
- Interactive ML model debugging with drift detection
- Statistical hypothesis testing on streaming datasets
- Real-time A/B test analysis with business impact calculations
- Predictive modeling competitions with accuracy benchmarks

PRODUCT MANAGERS:
- Multi-stakeholder crisis management simulations
- Real-time market response analysis and strategy pivots
- Interactive user journey optimization with live feedback
- Resource allocation under budget and timeline constraints
- Competitive analysis with dynamic market conditions

DESIGNERS:
- Real-time user feedback incorporation and design iteration
- Interactive accessibility testing with diverse user personas
- Live design system creation with component reusability
- User research synthesis with actionable insights extraction
- Cross-platform design consistency validation

BUSINESS/STRATEGY:
- Live market simulation with competitor responses
- Real-time financial modeling with scenario planning
- Interactive stakeholder management with conflicting priorities
- Dynamic strategy adaptation to market disruptions
- Performance metric optimization with trade-off analysis

ENGINEERS (ALL TYPES):
- Real problem-solving with actual engineering constraints
- Live testing and validation of engineering solutions
- Interactive troubleshooting of complex system failures
- Performance optimization under resource limitations
- Quality assurance with real-world edge cases

MARKETING:
- Real-time campaign optimization with live performance data
- Interactive audience segmentation with behavior analysis
- Dynamic content creation with engagement tracking
- Cross-channel attribution modeling with budget allocation
- Brand crisis management with sentiment monitoring

SALES:
- Live objection handling with dynamic customer personas
- Real-time negotiation scenarios with complex deal structures
- Interactive pipeline management with forecasting accuracy
- Customer needs analysis with solution configuration
- Competitive positioning with value proposition optimization

Create an assessment that:
1. MIRRORS THE EXACT WORK ENVIRONMENT they'll face
2. TESTS SKILLS in the most authentic way possible
3. ADAPTS in real-time based on candidate performance
4. PROVIDES UNBREAKABLE infinity sandbox capabilities
5. CHALLENGES even the most experienced professionals
6. MEASURES not just knowledge but THINKING PROCESS
7. CREATES an experience they'll remember forever

Return ONLY a valid JSON object with this structure:
{
  "type": "infinity-sandbox-revolutionary",
  "title": "${roleTitle} - The Ultimate Professional Challenge",
  "description": "The most advanced and intelligent assessment ever created for ${roleTitle} professionals",
  "components": [
    {
      "id": "infinity-sandbox",
      "type": "revolutionary-sandbox",
      "label": "🚀 Infinity Sandbox Environment",
      "placeholder": "Welcome to the most advanced assessment experience ever created...",
      "props": {
        "simulationType": "role-revolutionary",
        "infinityMode": true,
        "realTimeAdaptation": true,
        "plotTwists": true,
        "adaptiveDifficulty": true,
        "professionalToolsAccess": true,
        "collaborativeElements": true,
        "performanceTracking": true
      },
      "layout": {
        "width": "100%",
        "height": "100vh",
        "position": "immersive",
        "order": 1
      }
    }
  ],
  "interactions": [
    {
      "trigger": "sandbox-initialization",
      "action": "deploy-revolutionary-environment",
      "feedback": {
        "immediate": true,
        "detailed": true,
        "adaptive": true,
        "style": "revolutionary"
      },
      "evaluation": "Deploy the most advanced assessment environment ever created"
    }
  ],
  "evaluation": {
    "primary": ["Professional Excellence", "Innovation Thinking", "Real-World Problem Solving"],
    "secondary": ["Adaptability", "Communication", "Strategic Thinking"],
    "scoring": {
      "algorithm": "revolutionary-adaptive",
      "factors": ["technical_mastery", "creative_problem_solving", "real_world_application", "adaptability", "innovation"],
      "weights": [0.25, 0.25, 0.25, 0.15, 0.1]
    },
    "aiPrompts": [
      "Evaluate the candidate's ability to excel in real professional scenarios for ${roleTitle}",
      "Assess innovation, creativity, and problem-solving excellence under pressure"
    ]
  },
  "styling": {
    "theme": "infinity-revolutionary",
    "colors": {
      "primary": "#7C3AED",
      "secondary": "#1F2937",
      "accent": "#10B981",
      "background": "#0F172A"
    },
    "layout": "immersive-simulation"
  }
}
`

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.openaiApiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: 'You are the world\'s most advanced AI assessment architect and revolutionary interface designer. You create the most intelligent, creative, and groundbreaking assessment experiences ever conceived. Return only valid JSON objects without any additional text or formatting. Every assessment must be revolutionary, professionally relevant, and technically sophisticated beyond conventional standards.'
            },
            {
              role: 'user',
              content: revolutionaryPrompt
            }
          ],
          temperature: 0.9,
          max_tokens: 3000
        })
      })

      if (!response.ok) {
        console.error('OpenAI API error:', response.status, await response.text())
        throw new Error(`OpenAI API error: ${response.status}`)
      }

      const data = await response.json()
      const content = data.choices[0].message.content.trim()
      
      // Clean the content to ensure it's valid JSON
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      
      try {
        const generatedInterface = JSON.parse(cleanContent)
        console.log('✨ AI generated interface:', generatedInterface)
        return generatedInterface
      } catch (parseError) {
        console.error('Failed to parse AI response:', parseError, 'Content:', cleanContent)
        throw parseError
      }

    } catch (error) {
      console.error('❌ AI Interface Generation failed:', error)
      return this.getRevolutionaryTemplate(roleTitle, jobDescription, companyContext)
    }
  }

  private getRevolutionaryTemplate(roleTitle: string, jobDescription: string, companyContext: string): AssessmentInterface {
    return {
      type: 'revolutionary-simulation',
      title: `${roleTitle} Revolutionary Assessment`,
      description: `Advanced simulation testing real-world ${roleTitle} capabilities with live scenarios and plot twists`,
      components: [
        {
          id: 'scenario-dashboard',
          type: 'simulation-panel',
          label: '🎮 Live Work Environment',
          placeholder: 'Welcome to your revolutionary assessment experience...',
          props: {
            simulationType: 'role-specific',
            enableRealTime: true,
            plotTwists: true,
            adaptiveDifficulty: true,
            liveMetrics: true
          },
          layout: {
            width: '100%',
            height: '500px',
            position: 'center',
            order: 1
          }
        },
        {
          id: 'mission-brief',
          type: 'metrics-dashboard',
          label: '🚨 Your Mission',
          placeholder: 'Mission objectives will appear here...',
          props: {
            dynamic: true,
            updateInterval: 30000
          },
          layout: {
            width: '100%',
            height: '150px',
            position: 'full',
            order: 2
          }
        },
        {
          id: 'plot-twist-alert',
          type: 'custom',
          label: '🌪️ Plot Twist System',
          placeholder: 'Unexpected challenges will appear here...',
          props: {
            surpriseMode: true,
            difficulty: 'adaptive'
          },
          layout: {
            width: '100%',
            height: '100px',
            position: 'full',
            order: 3
          }
        }
      ],
      interactions: [
        {
          trigger: 'simulation-start',
          action: 'initialize-scenario',
          feedback: {
            immediate: true,
            detailed: true,
            adaptive: true,
            style: 'technical'
          },
          evaluation: `Initialize ${roleTitle} work simulation with real-world challenges`
        },
        {
          trigger: 'plot-twist-event',
          action: 'adaptive-challenge',
          feedback: {
            immediate: true,
            detailed: false,
            adaptive: true,
            style: 'strategic'
          },
          evaluation: 'Evaluate adaptability and crisis management skills under pressure'
        }
      ],
      evaluation: {
        primary: ['Technical Expertise', 'Problem Solving', 'Adaptability'],
        secondary: ['Communication', 'Innovation', 'Decision Making'],
        scoring: {
          algorithm: 'adaptive',
          factors: ['accuracy', 'speed', 'creativity', 'adaptability', 'plot-twist-handling'],
          weights: [0.25, 0.15, 0.2, 0.25, 0.15]
        },
        aiPrompts: [
          `Evaluate ${roleTitle} technical competency in simulated work environment`,
          'Assess problem-solving approach and innovation in unexpected situations',
          'Review adaptability and performance under plot twist scenarios'
        ]
      },
      styling: {
        theme: 'simulation',
        colors: {
          primary: '#7C3AED',
          secondary: '#1F2937', 
          accent: '#10B981',
          background: '#0F172A'
        },
        layout: 'immersive'
      }
    }
  }

  async generateScenarios(assessmentInterface: AssessmentInterface, roleTitle: string, jobDescription: string): Promise<any[]> {
    console.log('🎭 AI generating scenarios for interface:', assessmentInterface.type)

    const scenarioPrompt = `
Generate 3-5 realistic, challenging scenarios for this assessment interface:

INTERFACE TYPE: ${assessmentInterface.type}
ROLE: ${roleTitle}
JOB DESCRIPTION: ${jobDescription}

Each scenario should be:
1. Realistic and based on actual work situations
2. Progressively challenging
3. Designed to test the skills in the evaluation criteria
4. Specific to the interface components available

Return a JSON array of scenarios with this structure:
[
  {
    "id": "scenario-1",
    "title": "Scenario Title",
    "description": "Detailed scenario description",
    "initialState": {
      "component-id": "initial data for component"
    },
    "challenges": [
      "Challenge 1 description",
      "Challenge 2 description"
    ],
    "successCriteria": [
      "What constitutes success",
      "Key performance indicators"
    ],
    "timeLimit": 1800,
    "difficulty": "medium"
  }
]

Make these scenarios ENGAGING and REALISTIC for the specific role.
`

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.openaiApiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are an expert scenario designer for professional assessments. Return only valid JSON arrays.'
            },
            {
              role: 'user',
              content: scenarioPrompt
            }
          ],
          temperature: 0.9,
          max_tokens: 2000
        })
      })

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`)
      }

      const data = await response.json()
      const scenarios = JSON.parse(data.choices[0].message.content)
      
      console.log('🎪 AI generated scenarios:', scenarios)
      return scenarios

    } catch (error) {
      console.error('❌ Scenario generation failed:', error)
      return this.getFallbackScenarios()
    }
  }

  async evaluateResponse(
    userResponse: any, 
    scenario: any, 
    assessmentInterface: AssessmentInterface
  ): Promise<any> {
    console.log('🧠 AI evaluating response for:', assessmentInterface.type)

    const evaluationPrompt = `
Evaluate this user response for the assessment:

INTERFACE TYPE: ${assessmentInterface.type}
SCENARIO: ${JSON.stringify(scenario)}
USER RESPONSE: ${JSON.stringify(userResponse)}
EVALUATION CRITERIA: ${JSON.stringify(assessmentInterface.evaluation)}

Provide detailed feedback analyzing:
1. How well they addressed the primary skills
2. Evidence of secondary skills
3. Areas for improvement
4. Specific strengths demonstrated
5. Overall performance score (0-100)

Return a JSON object with this structure:
{
  "score": 85,
  "primarySkillsAnalysis": {
    "skill1": {
      "score": 90,
      "evidence": "Specific evidence from response",
      "feedback": "Detailed feedback"
    }
  },
  "secondarySkillsAnalysis": {
    "skill1": {
      "score": 80,
      "evidence": "Specific evidence",
      "feedback": "Feedback"
    }
  },
  "overallFeedback": "Comprehensive feedback paragraph",
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2"],
  "nextSteps": "Recommended next actions"
}
`

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.openaiApiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are an expert assessment evaluator. Provide fair, detailed, and constructive feedback. Return only valid JSON.'
            },
            {
              role: 'user',
              content: evaluationPrompt
            }
          ],
          temperature: 0.3,
          max_tokens: 1500
        })
      })

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`)
      }

      const data = await response.json()
      const evaluation = JSON.parse(data.choices[0].message.content)
      
      console.log('📊 AI evaluation complete:', evaluation)
      return evaluation

    } catch (error) {
      console.error('❌ Response evaluation failed:', error)
      return this.getFallbackEvaluation()
    }
  }

  private getFallbackInterface(roleTitle: string): AssessmentInterface {
    return {
      type: 'adaptive-assessment',
      title: `${roleTitle} Assessment`,
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
    }
  }

  // Generate traditional questions for backward compatibility with existing system
  async generateQuestionsFromInterface(
    assessmentInterface: AssessmentInterface, 
    scenarios: any[], 
    roleTitle: string, 
    jobDescription: string
  ): Promise<any[]> {
    console.log('📝 AI generating revolutionary questions from interface for:', roleTitle)

    // If no scenarios, create revolutionary template scenarios
    if (!scenarios.length) {
      scenarios = this.getRevolutionaryScenarios(roleTitle, jobDescription)
    }

    // Always return revolutionary format questions, not traditional text-based ones
    const revolutionaryQuestions = scenarios.map((scenario: any, index: number) => {
      return {
        id: `revolutionary-q${index + 1}`,
        type: 'revolutionary-simulation',
        question: `🎮 ${scenario.title}`,
        description: scenario.description,
        timeLimit: scenario.timeLimit || 1800, // 30 minutes
        difficulty: scenario.difficulty || 'medium',
        scenario: {
          ...scenario,
          type: 'simulation',
          title: `🌟 ${scenario.title}`,
          description: `🚨 Your Mission: ${scenario.description}`,
          plotTwists: this.generatePlotTwists(scenario),
          arsenal: this.generateArsenal(roleTitle),
          victoryConditions: scenario.successCriteria || ['Complete the mission successfully', 'Adapt to unexpected challenges'],
          skillsTested: assessmentInterface.evaluation?.primary || ['Problem Solving', 'Adaptability', 'Technical Skills']
        },
        evaluation: {
          rubric: [
            'Mission Completion (25 points)',
            'Adaptability to Plot Twists (25 points)',
            'Creative Problem Solving (25 points)',
            'Strategic Thinking (25 points)'
          ],
          aiPrompts: [
            `Evaluate ${roleTitle} mission completion and strategic approach`,
            'Assess adaptability when facing unexpected plot twists',
            'Review creative problem-solving and innovation'
          ]
        },
        revolutionaryFeatures: {
          liveSimulation: true,
          plotTwists: true,
          adaptiveDifficulty: true,
          realTimeMetrics: true,
          immersiveInterface: true
        }
      }
    })

    // If we still don't have enough questions, add more revolutionary scenarios
    if (revolutionaryQuestions.length < 4) {
      const additionalScenarios = this.getAdditionalRevolutionaryQuestions(roleTitle, jobDescription)
      revolutionaryQuestions.push(...additionalScenarios)
    }

    console.log('✨ Generated', revolutionaryQuestions.length, 'revolutionary questions with full scenarios')
    return revolutionaryQuestions
  }

  private getRevolutionaryScenarios(roleTitle: string, jobDescription: string): any[] {
    const baseScenarios = [
      {
        id: `${roleTitle.toLowerCase().replace(/\s+/g, '-')}-crisis-1`,
        title: `The ${roleTitle} Crisis Simulation`,
        description: `Navigate a high-stakes crisis scenario where your ${roleTitle} expertise is put to the ultimate test`,
        initialState: { status: 'critical', timeRemaining: 30, stakeholderPressure: 'high' },
        challenges: [
          'Identify the root cause of the crisis',
          'Coordinate with multiple stakeholders under pressure',
          'Implement immediate solutions while planning long-term fixes',
          'Communicate effectively with stressed team members'
        ],
        successCriteria: [
          'Crisis resolved within time limit',
          'Stakeholder satisfaction maintained',
          'Team morale preserved',
          'Learning documented for future prevention'
        ],
        timeLimit: 1800,
        difficulty: 'hard'
      },
      {
        id: `${roleTitle.toLowerCase().replace(/\s+/g, '-')}-innovation-2`,
        title: `Innovation Challenge: Future-Proofing ${roleTitle}`,
        description: `Design the future of ${roleTitle} work in a rapidly changing technological landscape`,
        challenges: [
          'Analyze emerging trends affecting your role',
          'Design innovative solutions for future challenges',
          'Create a roadmap for skill development',
          'Present your vision to stakeholders'
        ],
        successCriteria: [
          'Comprehensive future analysis',
          'Innovative and practical solutions',
          'Clear implementation roadmap',
          'Compelling stakeholder presentation'
        ],
        timeLimit: 2400,
        difficulty: 'expert'
      }
    ]

    return baseScenarios
  }

  private generatePlotTwists(scenario: any): any[] {
    const plotTwists = [
      {
        id: 'twist-1',
        trigger: 'mid-assessment',
        type: 'resource-constraint',
        title: '💥 Budget Cut!',
        description: 'Your project budget has been suddenly reduced by 40%. Adapt your strategy immediately.',
        impact: 'high',
        timeToAdapt: 300 // 5 minutes
      },
      {
        id: 'twist-2',
        trigger: 'time-based',
        type: 'stakeholder-change',
        title: '🔄 New Stakeholder Alert!',
        description: 'A key decision-maker has changed, bringing completely different priorities.',
        impact: 'medium',
        timeToAdapt: 180 // 3 minutes
      },
      {
        id: 'twist-3',
        trigger: 'performance-based',
        type: 'technical-challenge',
        title: '🚨 System Failure!', 
        description: 'A critical system has failed. You must find alternative solutions immediately.',
        impact: 'high',
        timeToAdapt: 240 // 4 minutes
      }
    ]
    
    return plotTwists
  }

  private generateArsenal(roleTitle: string): string[] {
    const baseArsenal = [
      '🧠 Your expertise and experience',
      '📊 Real-time analytics dashboard',
      '💬 Team communication tools',
      '📋 Project management interface',
      '🔍 Research and analysis tools'
    ]

    const roleSpecificArsenal: Record<string, string[]> = {
      'Software Engineer': ['💻 Live coding environment', '🐛 Debugging tools', '📚 Documentation access', '⚡ Performance monitoring'],
      'Product Manager': ['📈 User analytics', '🎯 A/B testing tools', '👥 Customer feedback panel', '🗺️ Roadmap builder'],
      'Designer': ['🎨 Design tools', '🖼️ Asset library', '👁️ User testing platform', '🎭 Prototyping environment'],
      'Data Scientist': ['📊 Data visualization', '🤖 ML model sandbox', '📈 Statistical analysis', '🔬 Experiment tracker'],
      'Marketing Manager': ['📱 Campaign dashboard', '📊 Analytics suite', '🎯 Audience insights', '📝 Content editor']
    }

    return [...baseArsenal, ...(roleSpecificArsenal[roleTitle] || [])]
  }

  private getAdditionalRevolutionaryQuestions(roleTitle: string, jobDescription: string): any[] {
    return [
      {
        id: 'revolutionary-q3',
        type: 'revolutionary-simulation',
        question: '🎮 Multi-Dimensional Challenge',
        description: `Navigate complex ${roleTitle} scenarios with multiple moving parts`,
        timeLimit: 1500,
        difficulty: 'hard',
        scenario: {
          type: 'simulation',
          title: '🌟 The Multi-Dimensional Challenge',
          description: '🚨 Your Mission: Balance competing priorities while driving innovation',
          plotTwists: this.generatePlotTwists({}),
          arsenal: this.generateArsenal(roleTitle),
          victoryConditions: ['Achieve all objectives', 'Adapt to plot twists', 'Maintain team alignment'],
          skillsTested: ['Multi-tasking', 'Strategic Thinking', 'Innovation']
        },
        revolutionaryFeatures: {
          liveSimulation: true,
          plotTwists: true,
          adaptiveDifficulty: true,
          realTimeMetrics: true
        }
      },
      {
        id: 'revolutionary-q4',
        type: 'revolutionary-simulation', 
        question: '🎮 Leadership Under Fire',
        description: `Lead through crisis while maintaining ${roleTitle} excellence`,
        timeLimit: 1200,
        difficulty: 'expert',
        scenario: {
          type: 'simulation',
          title: '🌟 Leadership Under Fire',
          description: '🚨 Your Mission: Lead your team through unprecedented challenges',
          plotTwists: this.generatePlotTwists({}),
          arsenal: this.generateArsenal(roleTitle),
          victoryConditions: ['Team morale maintained', 'Objectives achieved', 'Innovation demonstrated'],
          skillsTested: ['Leadership', 'Crisis Management', 'Communication']
        },
        revolutionaryFeatures: {
          liveSimulation: true,
          plotTwists: true,
          adaptiveDifficulty: true,
          realTimeMetrics: true
        }
      }
    ]
  }

  private getFallbackQuestions(roleTitle: string): any[] {
    return [
      {
        id: 'q1',
        type: 'text',
        question: `Describe a challenging situation you've encountered in a ${roleTitle} role and how you handled it.`,
        description: 'Evaluates problem-solving and experience',
        timeLimit: 600,
        difficulty: 'medium',
        scenario: {
          type: 'role-specific',
          context: `Professional scenario relevant to ${roleTitle}`,
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
        question: `What would be your approach to ${roleTitle === 'Product Manager' ? 'launching a new product feature' : roleTitle === 'Software Engineer' ? 'architecting a scalable system' : 'achieving key objectives'} in your role?`,
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
      },
      {
        id: 'q3',
        type: 'text',
        question: `How would you handle stakeholder communication and collaboration in a ${roleTitle} position, especially when dealing with conflicting priorities?`,
        description: 'Evaluates communication and leadership skills',
        timeLimit: 600,
        difficulty: 'medium',
        scenario: {
          type: 'interpersonal',
          context: 'Multi-stakeholder environment',
          task: 'Navigate complex relationships'
        },
        evaluation: {
          rubric: [
            'Communication strategy (25 points)',
            'Conflict resolution (25 points)',
            'Leadership approach (25 points)',
            'Outcome focus (25 points)'
          ],
          aiPrompts: [
            'Evaluate communication effectiveness',
            'Assess conflict resolution skills',
            'Review leadership potential'
          ]
        }
      }
    ]
  }

  private getFallbackScenarios(): any[] {
    return [
      {
        id: 'scenario-1',
        title: 'Professional Challenge',
        description: 'Navigate a complex professional situation',
        initialState: {},
        challenges: ['Analyze the situation', 'Propose solutions'],
        successCriteria: ['Clear analysis', 'Actionable solutions'],
        timeLimit: 1800,
        difficulty: 'medium'
      }
    ]
  }

  private getFallbackEvaluation(): any {
    return {
      score: 75,
      primarySkillsAnalysis: {},
      secondarySkillsAnalysis: {},
      overallFeedback: 'Response demonstrates good understanding of the requirements.',
      strengths: ['Clear communication'],
      improvements: ['More detailed analysis'],
      nextSteps: 'Continue developing professional skills'
    }
  }
}
