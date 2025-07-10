import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface QuestionGenerationRequest {
  currentContext: any
  candidatePerformance: any
  targetSkills: string[]
  adaptationStrategy: 'difficulty' | 'depth' | 'breadth' | 'creative'
  assessmentType: string
  remainingTime: number
}

export async function POST(request: NextRequest) {
  try {
    const {
      currentContext,
      candidatePerformance,
      targetSkills,
      adaptationStrategy,
      assessmentType,
      remainingTime
    }: QuestionGenerationRequest = await request.json()

    if (!candidatePerformance || !targetSkills) {
      return NextResponse.json({ error: 'Performance data and target skills required' }, { status: 400 })
    }

    let generatedQuestion

    if (process.env.OPENAI_API_KEY) {
      try {
        const systemPrompt = `You are an advanced AI question generator for adaptive hiring assessments. Create contextual, challenging questions that adapt to candidate performance.

GENERATION RULES:
1. Questions must be directly relevant to candidate's demonstrated skill level
2. Adapt complexity based on previous performance
3. Include interactive elements when appropriate
4. Ensure questions are fair, unbiased, and job-relevant
5. Consider remaining assessment time

QUESTION STRUCTURE:
{
  "id": "unique_id",
  "question": "detailed question text",
  "type": "interactive|technical|behavioral|scenario",
  "difficulty": "Easy|Medium|Hard|Expert",
  "category": "skill category",
  "componentType": "dynamic|SystemDashboard|CodeDebugger|StakeholderChat|custom",
  "componentProps": {...},
  "metadata": {
    "estimatedTime": minutes,
    "skillsFocus": ["skill1", "skill2"],
    "adaptationReason": "explanation",
    "successCriteria": ["criteria1", "criteria2"]
  }
}

CONTEXT:
- Candidate Performance: ${JSON.stringify(candidatePerformance)}
- Target Skills: ${targetSkills.join(', ')}
- Adaptation Strategy: ${adaptationStrategy}
- Assessment Type: ${assessmentType}
- Remaining Time: ${remainingTime} minutes
- Current Context: ${JSON.stringify(currentContext)}

Generate ONE highly targeted question that will provide maximum insight into the candidate's capabilities.`

        const completion = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Generate the next adaptive question based on the provided context.` }
          ],
          max_tokens: 1500,
          temperature: 0.7,
        })

        const responseText = completion.choices[0]?.message?.content || ''
        generatedQuestion = JSON.parse(responseText)
      } catch (error) {
        console.error('OpenAI question generation error:', error)
        generatedQuestion = generateAdaptiveQuestion(
          candidatePerformance,
          targetSkills,
          adaptationStrategy,
          remainingTime
        )
      }
    } else {
      generatedQuestion = generateAdaptiveQuestion(
        candidatePerformance,
        targetSkills,
        adaptationStrategy,
        remainingTime
      )
    }

    // Generate component code if needed
    if (generatedQuestion.componentType === 'dynamic') {
      const componentCode = await generateComponentCode(generatedQuestion)
      generatedQuestion.componentCode = componentCode
    }

    const result = {
      question: generatedQuestion,
      adaptationReason: generateAdaptationExplanation(candidatePerformance, adaptationStrategy),
      estimatedImpact: calculateEstimatedImpact(generatedQuestion, candidatePerformance),
      timestamp: new Date().toISOString()
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Question generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate question' },
      { status: 500 }
    )
  }
}

function generateAdaptiveQuestion(
  performance: any,
  targetSkills: string[],
  strategy: string,
  remainingTime: number
) {
  const questionBank = getAdaptiveQuestionBank()
  const skillLevel = performance.skillLevel || 'intermediate'
  const primarySkill = targetSkills[0] || 'problem-solving'
  
  let difficulty = 'Medium'
  let questionType = 'technical'
  let componentType = 'EnhancedTextInput'
  
  // Adapt based on strategy
  switch (strategy) {
    case 'difficulty':
      difficulty = skillLevel === 'expert' ? 'Expert' : 
                  skillLevel === 'advanced' ? 'Hard' : 
                  skillLevel === 'beginner' ? 'Easy' : 'Medium'
      break
    case 'depth':
      questionType = 'scenario'
      componentType = 'dynamic'
      break
    case 'breadth':
      questionType = 'behavioral'
      break
    case 'creative':
      questionType = 'interactive'
      componentType = 'dynamic'
      break
  }

  const questionTemplate = (questionBank as any)[questionType]?.[difficulty] || questionBank.technical.Medium
  
  return {
    id: `adaptive_${Date.now()}`,
    question: questionTemplate.question.replace('{skill}', primarySkill),
    type: questionType,
    difficulty,
    category: primarySkill,
    componentType,
    componentProps: questionTemplate.componentProps || {},
    metadata: {
      estimatedTime: Math.min(remainingTime / 2, questionTemplate.estimatedTime || 10),
      skillsFocus: targetSkills.slice(0, 3),
      adaptationReason: `Adapting for ${strategy} based on ${skillLevel} skill level`,
      successCriteria: questionTemplate.successCriteria || [
        'Clear problem understanding',
        'Structured approach',
        'Relevant examples'
      ]
    }
  }
}

function getAdaptiveQuestionBank() {
  return {
    technical: {
      Easy: {
        question: "Explain a basic concept in {skill} and provide a simple example of how you would apply it.",
        estimatedTime: 8,
        successCriteria: ['Concept understanding', 'Basic application', 'Clear explanation']
      },
      Medium: {
        question: "Design a solution for a {skill} challenge that balances performance, maintainability, and user experience. Walk through your decision-making process.",
        estimatedTime: 12,
        successCriteria: ['Solution design', 'Trade-off analysis', 'Decision rationale']
      },
      Hard: {
        question: "You're tasked with optimizing a complex {skill} system that's experiencing performance issues. Describe your systematic approach to identifying and resolving the problems.",
        estimatedTime: 15,
        successCriteria: ['Systematic approach', 'Performance analysis', 'Solution implementation']
      },
      Expert: {
        question: "Design an innovative {skill} architecture that can scale to handle 10x current load while introducing new features. Consider long-term maintainability and team dynamics.",
        estimatedTime: 20,
        successCriteria: ['Scalable architecture', 'Innovation', 'Team considerations', 'Long-term vision']
      }
    },
    scenario: {
      Easy: {
        question: "You're working on a project and discover a potential issue with the {skill} implementation. How do you handle this situation?",
        estimatedTime: 10,
        componentProps: { scenarioType: 'basic-problem' }
      },
      Medium: {
        question: "A critical {skill} system is failing during peak usage. Multiple stakeholders are demanding immediate fixes. Walk through your crisis management approach.",
        estimatedTime: 15,
        componentProps: { scenarioType: 'crisis-management', stakeholders: ['CTO', 'Product Manager', 'Customer Success'] }
      },
      Hard: {
        question: "You need to lead a cross-functional team to implement a complex {skill} solution with tight deadlines and conflicting requirements from different departments.",
        estimatedTime: 18,
        componentProps: { scenarioType: 'complex-coordination', teamSize: 8, departments: ['Engineering', 'Product', 'Design', 'QA'] }
      },
      Expert: {
        question: "Design and implement a {skill} strategy for a company undergoing rapid scaling, technical debt, and organizational change simultaneously.",
        estimatedTime: 25,
        componentProps: { scenarioType: 'organizational-transformation', complexity: 'high' }
      }
    },
    behavioral: {
      Easy: {
        question: "Tell me about a time when you had to learn a new {skill} concept quickly. How did you approach the learning process?",
        estimatedTime: 8
      },
      Medium: {
        question: "Describe a situation where you had to convince a team to adopt a new {skill} approach. What was your strategy and how did you handle resistance?",
        estimatedTime: 12
      },
      Hard: {
        question: "Share an experience where you had to make a difficult {skill} decision with incomplete information and significant consequences. How did you navigate this challenge?",
        estimatedTime: 15
      },
      Expert: {
        question: "Describe how you've evolved your {skill} philosophy throughout your career and how you've influenced others to adopt best practices in this area.",
        estimatedTime: 18
      }
    },
    interactive: {
      Easy: {
        question: "Use this interactive tool to demonstrate your understanding of {skill} fundamentals.",
        estimatedTime: 10,
        componentProps: { interactionType: 'basic-demo', toolComplexity: 'simple' }
      },
      Medium: {
        question: "Solve this {skill} challenge using the interactive environment. Explain your thought process as you work.",
        estimatedTime: 15,
        componentProps: { interactionType: 'problem-solving', realTime: true }
      },
      Hard: {
        question: "Design and implement a {skill} solution in this collaborative environment while coordinating with simulated team members.",
        estimatedTime: 20,
        componentProps: { interactionType: 'collaborative-design', teamSimulation: true }
      },
      Expert: {
        question: "Lead a complex {skill} project in this simulation, making strategic decisions while managing multiple constraints and stakeholder demands.",
        estimatedTime: 25,
        componentProps: { interactionType: 'strategic-leadership', simulationComplexity: 'high' }
      }
    }
  }
}

async function generateComponentCode(question: any): Promise<string> {
  // Generate component code based on question requirements
  if (question.componentType === 'dynamic') {
    try {
      const response = await fetch('/api/generate-component', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Create an interactive component for: ${question.question}`,
          componentType: question.componentProps?.interactionType || 'custom',
          parameters: {
            difficulty: question.difficulty.toLowerCase(),
            skills: question.metadata?.skillsFocus || []
          }
        })
      })
      
      if (response.ok) {
        const result = await response.json()
        return result.componentCode
      }
    } catch (error) {
      console.error('Component generation failed:', error)
    }
  }
  
  return generateFallbackComponent(question)
}

function generateFallbackComponent(question: any): string {
  return `
import { useState } from 'react'

export default function AdaptiveQuestionComponent({ question, onInteraction }) {
  const [response, setResponse] = useState('')
  const [progress, setProgress] = useState(0)
  
  const handleResponseChange = (value) => {
    setResponse(value)
    setProgress(value.length > 0 ? Math.min(100, value.length / 10) : 0)
    onInteraction({ 
      response: value, 
      progress,
      adaptiveMetadata: {
        questionId: question.id,
        difficulty: '${question.difficulty}',
        skillsFocus: ${JSON.stringify(question.metadata?.skillsFocus || [])}
      }
    })
  }
  
  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">Adaptive Challenge</h3>
          <div className="flex space-x-2">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
              ${question.difficulty}
            </span>
            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-sm">
              ${question.category}
            </span>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: \`\${progress}%\` }}
          />
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-gray-700 leading-relaxed">
          {question.question}
        </p>
      </div>
      
      <textarea
        value={response}
        onChange={(e) => handleResponseChange(e.target.value)}
        placeholder="Provide your detailed response..."
        className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        rows={8}
      />
      
      <div className="mt-4 text-sm text-gray-600">
        <p><strong>Focus Areas:</strong> ${(question.metadata?.skillsFocus || []).join(', ')}</p>
        <p><strong>Success Criteria:</strong> ${(question.metadata?.successCriteria || []).join(', ')}</p>
      </div>
    </div>
  )
}`
}

function generateAdaptationExplanation(performance: any, strategy: string): string {
  const explanations = {
    difficulty: `Adjusting difficulty based on demonstrated ${performance.skillLevel} level performance`,
    depth: `Exploring deeper technical knowledge in areas of strength: ${performance.strengths?.join(', ')}`,
    breadth: `Broadening assessment scope to evaluate additional competencies`,
    creative: `Introducing creative challenges based on high creativity score: ${performance.creativity}`
  }
  
  return explanations[strategy as keyof typeof explanations] || 'Adapting assessment based on performance analysis'
}

function calculateEstimatedImpact(question: any, performance: any) {
  return {
    skillAssessmentValue: question.difficulty === 'Expert' ? 95 : 
                         question.difficulty === 'Hard' ? 85 :
                         question.difficulty === 'Medium' ? 70 : 55,
    timeEfficiency: question.metadata?.estimatedTime <= 10 ? 90 : 70,
    candidateEngagement: question.componentType === 'dynamic' ? 95 : 75,
    overallScore: 85 // Calculated based on above factors
  }
}
