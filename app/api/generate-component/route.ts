import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

type ComponentTemplateType = 'data-visualization' | 'simulation-engine' | 'collaborative-workspace'

interface ComponentTemplate {
  description: string
  baseTemplate: string
}

const COMPONENT_TEMPLATES: Record<ComponentTemplateType, ComponentTemplate> = {
  'data-visualization': {
    description: 'Interactive charts and data analysis components',
    baseTemplate: `
import { useState, useEffect } from 'react'
import { BarChart, LineChart, PieChart } from 'recharts'

export default function DataVisualizationComponent({ data, onInteraction, question }) {
  const [analysis, setAnalysis] = useState('')
  const [selectedMetric, setSelectedMetric] = useState('')
  
  return (
    <div className="bg-white p-6 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">{question.title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          {/* Chart components will be generated here */}
        </div>
        <div>
          <textarea
            value={analysis}
            onChange={(e) => {
              setAnalysis(e.target.value)
              onInteraction({ analysis: e.target.value, selectedMetric })
            }}
            placeholder="Analyze the data and provide insights..."
            className="w-full p-3 border rounded"
            rows={6}
          />
        </div>
      </div>
    </div>
  )
}`
  },
  'simulation-engine': {
    description: 'Business scenario and decision simulation components',
    baseTemplate: `
import { useState, useEffect } from 'react'

export default function SimulationComponent({ scenario, onInteraction, question }) {
  const [decisions, setDecisions] = useState([])
  const [currentPhase, setCurrentPhase] = useState(0)
  const [results, setResults] = useState(null)
  
  const makeDecision = (decision) => {
    const newDecisions = [...decisions, decision]
    setDecisions(newDecisions)
    onInteraction({ decisions: newDecisions, phase: currentPhase })
    
    // Advance to next phase
    if (currentPhase < scenario.phases.length - 1) {
      setCurrentPhase(currentPhase + 1)
    } else {
      // Calculate final results
      const finalResults = calculateResults(newDecisions)
      setResults(finalResults)
      onInteraction({ decisions: newDecisions, results: finalResults, completed: true })
    }
  }
  
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">{question.title}</h3>
      {/* Simulation interface will be generated here */}
    </div>
  )
}`
  },
  'collaborative-workspace': {
    description: 'Multi-user collaborative scenario components',
    baseTemplate: `
import { useState, useEffect } from 'react'

export default function CollaborativeComponent({ participants, onInteraction, question }) {
  const [messages, setMessages] = useState([])
  const [currentTask, setCurrentTask] = useState(null)
  const [teamDecisions, setTeamDecisions] = useState({})
  
  return (
    <div className="bg-white p-6 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">{question.title}</h3>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          {/* Collaborative workspace will be generated here */}
        </div>
        <div>
          {/* Team communication panel */}
        </div>
      </div>
    </div>
  )
}`
  }
}

export async function POST(request: NextRequest) {
  try {
    const { 
      prompt, 
      componentType = 'custom',
      parameters = {},
      difficulty = 'medium',
      duration = 30 
    } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    let generatedComponent

    if (process.env.OPENAI_API_KEY) {
      try {
        const systemPrompt = `You are an expert React component generator specialized in creating interactive assessment components for hiring platforms.

GUIDELINES:
1. Generate ONLY React component code (TypeScript/JSX)
2. Use modern React patterns (hooks, functional components)
3. Include proper TypeScript types
4. Make components interactive and engaging
5. Include data capture via onInteraction callback
6. Use Tailwind CSS for styling
7. Ensure accessibility and responsive design
8. Component should be self-contained with all logic

COMPONENT REQUIREMENTS:
- Component Type: ${componentType}
- Difficulty: ${difficulty}
- Duration: ${duration} minutes
- Parameters: ${JSON.stringify(parameters)}

BASE TEMPLATE (if applicable):
${(componentType as ComponentTemplateType) in COMPONENT_TEMPLATES 
  ? COMPONENT_TEMPLATES[componentType as ComponentTemplateType].baseTemplate 
  : 'Create a custom component from scratch'}

IMPORTANT:
- Return ONLY the component code, no explanations
- Use the exact function signature: export default function GeneratedComponent({ question, onInteraction, ...props })
- Capture user interactions via onInteraction({ data })
- Make it visually appealing and professional
- Include loading states and error handling where appropriate`

        const completion = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Create an interactive assessment component: ${prompt}` }
          ],
          max_tokens: 2000,
          temperature: 0.7,
        })

        generatedComponent = completion.choices[0]?.message?.content || ''
      } catch (error) {
        console.error('OpenAI API error:', error)
        // Fall back to template-based generation
        generatedComponent = generateFromTemplate(prompt, componentType, parameters)
      }
    } else {
      // Use template-based generation when no API key
      generatedComponent = generateFromTemplate(prompt, componentType, parameters)
    }

    // Validate and sanitize the generated component
    const validatedComponent = validateAndSanitizeComponent(generatedComponent)

    const response = {
      componentCode: validatedComponent,
      componentType,
      metadata: {
        prompt,
        difficulty,
        duration,
        parameters,
        generatedAt: new Date().toISOString(),
        safetyChecked: true
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Component generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate component' },
      { status: 500 }
    )
  }
}

function generateFromTemplate(prompt: string, componentType: string, parameters: any) {
  const template = (componentType as ComponentTemplateType) in COMPONENT_TEMPLATES 
    ? COMPONENT_TEMPLATES[componentType as ComponentTemplateType]
    : null
  
  if (template) {
    // Use template and customize based on prompt
    return customizeTemplate(template.baseTemplate, prompt, parameters)
  }
  
  // Generate a basic interactive component
  return `
import { useState } from 'react'

export default function GeneratedComponent({ question, onInteraction }) {
  const [response, setResponse] = useState('')
  const [interactionData, setInteractionData] = useState({})
  
  const handleInteraction = (data) => {
    const newData = { ...interactionData, ...data }
    setInteractionData(newData)
    onInteraction(newData)
  }
  
  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">
        Interactive Challenge
      </h3>
      <div className="prose max-w-none mb-4">
        <p className="text-gray-700">
          {question.description || "Complete this interactive assessment component."}
        </p>
      </div>
      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">Challenge Instructions</h4>
          <p className="text-blue-800 text-sm">
            This is a dynamically generated assessment component. Interact with the elements below to demonstrate your skills.
          </p>
        </div>
        <textarea
          value={response}
          onChange={(e) => {
            setResponse(e.target.value)
            handleInteraction({ response: e.target.value, timestamp: Date.now() })
          }}
          placeholder="Provide your response and approach..."
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          rows={6}
        />
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            Generated from: "${prompt.substring(0, 50)}..."
          </span>
          <button
            onClick={() => handleInteraction({ completed: true, finalResponse: response })}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Submit Response
          </button>
        </div>
      </div>
    </div>
  )
}`
}

function customizeTemplate(template: string, prompt: string, parameters: any) {
  // Basic template customization logic
  // In a real implementation, this would be more sophisticated
  return template.replace(/\{prompt\}/g, prompt)
                 .replace(/\{parameters\}/g, JSON.stringify(parameters))
}

function validateAndSanitizeComponent(componentCode: string): string {
  // Basic security checks
  const dangerousPatterns = [
    /eval\(/gi,
    /Function\(/gi,
    /document\.write/gi,
    /innerHTML/gi,
    /window\./gi,
    /global\./gi,
    /__proto__/gi,
    /constructor/gi
  ]
  
  let sanitized = componentCode
  
  // Remove dangerous patterns
  dangerousPatterns.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '/* REMOVED_FOR_SECURITY */')
  })
  
  // Ensure proper component structure
  if (!sanitized.includes('export default function')) {
    throw new Error('Invalid component structure')
  }
  
  // Ensure required props are handled
  if (!sanitized.includes('onInteraction')) {
    sanitized = sanitized.replace(
      'export default function',
      'export default function GeneratedComponent({ question, onInteraction }) {'
    )
  }
  
  return sanitized
}
