'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Wand2, 
  Eye, 
  Save, 
  ArrowLeft, 
  Sparkles, 
  Code, 
  BarChart3, 
  Users, 
  Gamepad2,
  Loader2 
} from 'lucide-react'
import DynamicComponentRenderer from './DynamicComponentRenderer'

interface AdvancedAssessmentBuilderProps {
  onSave: (assessmentData: any) => void
  onBack: () => void
  initialData?: any
}

const COMPONENT_TYPES = [
  {
    id: 'data-visualization',
    name: 'Data Visualization',
    description: 'Interactive charts and analytics components',
    icon: BarChart3,
    color: 'blue',
    examples: [
      'Sales performance dashboard analysis',
      'Marketing metrics interpretation',
      'Financial data trend analysis'
    ]
  },
  {
    id: 'simulation-engine',
    name: 'Business Simulation',
    description: 'Scenario-based decision making simulations',
    icon: Sparkles,
    color: 'purple',
    examples: [
      'Crisis management scenarios',
      'Market competition simulation',
      'Resource allocation challenges'
    ]
  },
  {
    id: 'collaborative-workspace',
    name: 'Team Collaboration',
    description: 'Multi-user collaborative scenarios',
    icon: Users,
    color: 'green',
    examples: [
      'Cross-functional project coordination',
      'Conflict resolution scenarios',
      'Leadership decision making'
    ]
  },
  {
    id: 'gamified-challenge',
    name: 'Gamified Challenge',
    description: 'Interactive puzzles and strategic thinking games',
    icon: Gamepad2,
    color: 'red',
    examples: [
      'Strategic puzzle solving',
      'Time-pressure challenges',
      'Competitive scenarios'
    ]
  },
  {
    id: 'custom',
    name: 'Custom Component',
    description: 'AI-generated custom interactive component',
    icon: Code,
    color: 'indigo',
    examples: [
      'Unique assessment experiences',
      'Industry-specific challenges',
      'Creative problem-solving tasks'
    ]
  }
]

export default function AdvancedAssessmentBuilder({ onSave, onBack, initialData }: AdvancedAssessmentBuilderProps) {
  const [assessmentData, setAssessmentData] = useState({
    title: initialData?.title || '',
    company: initialData?.company || '',
    description: initialData?.description || '',
    duration: initialData?.duration || 45,
    type: 'creative',
    creativeType: 'Advanced Interactive Assessment',
    questions: initialData?.questions || []
  })

  const [currentStep, setCurrentStep] = useState<'setup' | 'build' | 'preview'>('setup')
  const [selectedComponent, setSelectedComponent] = useState<string>('')
  const [generatingComponent, setGeneratingComponent] = useState(false)
  const [componentPrompt, setComponentPrompt] = useState('')
  const [generatedComponents, setGeneratedComponents] = useState<Record<string, any>>({})
  const [previewComponent, setPreviewComponent] = useState<any>(null)

  const generateComponent = async () => {
    if (!componentPrompt.trim() || !selectedComponent) return

    setGeneratingComponent(true)
    try {
      const response = await fetch('/api/generate-component', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: componentPrompt,
          componentType: selectedComponent,
          parameters: {
            difficulty: 'medium',
            duration: assessmentData.duration
          }
        })
      })

      if (response.ok) {
        const result = await response.json()
        const componentId = `component_${Date.now()}`
        
        setGeneratedComponents(prev => ({
          ...prev,
          [componentId]: result
        }))

        // Add to questions
        const newQuestion = {
          id: componentId,
          question: componentPrompt,
          type: 'interactive',
          difficulty: 'Medium',
          category: 'Dynamic Assessment',
          componentType: 'dynamic',
          componentCode: result.componentCode,
          metadata: result.metadata
        }

        setAssessmentData(prev => ({
          ...prev,
          questions: [...prev.questions, newQuestion]
        }))

        setComponentPrompt('')
        alert('Component generated successfully!')
      } else {
        throw new Error('Failed to generate component')
      }
    } catch (error) {
      console.error('Component generation error:', error)
      alert('Failed to generate component. Please try again.')
    } finally {
      setGeneratingComponent(false)
    }
  }

  const previewQuestion = (question: any) => {
    setPreviewComponent(question)
  }

  const removeQuestion = (questionId: string) => {
    setAssessmentData(prev => ({
      ...prev,
      questions: prev.questions.filter((q: any) => q.id !== questionId)
    }))
    
    setGeneratedComponents(prev => {
      const updated = { ...prev }
      delete updated[questionId]
      return updated
    })
  }

  const saveAssessment = () => {
    if (!assessmentData.title || !assessmentData.company || assessmentData.questions.length === 0) {
      alert('Please fill in all required fields and add at least one question.')
      return
    }

    const finalAssessment = {
      ...assessmentData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      createdBy: '1' // Current user ID
    }

    onSave(finalAssessment)
  }

  if (currentStep === 'setup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-8">
              <button
                onClick={onBack}
                className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors mr-6"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Advanced Assessment Builder</h1>
                <p className="text-gray-600">Create AI-powered interactive assessments</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assessment Title *
                  </label>
                  <input
                    type="text"
                    value={assessmentData.title}
                    onChange={(e) => setAssessmentData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., Advanced Product Manager Assessment"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company *
                  </label>
                  <input
                    type="text"
                    value={assessmentData.company}
                    onChange={(e) => setAssessmentData(prev => ({ ...prev, company: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., TechCorp Inc"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={assessmentData.description}
                  onChange={(e) => setAssessmentData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Describe what this assessment evaluates..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  value={assessmentData.duration}
                  onChange={(e) => setAssessmentData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  min="15"
                  max="180"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setCurrentStep('build')}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                >
                  Continue to Builder
                  <Wand2 className="h-4 w-4 ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === 'build') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Component Builder</h1>
                <p className="text-gray-600">Add interactive components to your assessment</p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setCurrentStep('setup')}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Back to Setup
                </button>
                <button
                  onClick={() => setCurrentStep('preview')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </button>
                <button
                  onClick={saveAssessment}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Assessment
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Component Types */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Component Types</h2>
                {COMPONENT_TYPES.map((type) => {
                  const Icon = type.icon
                  return (
                    <motion.div
                      key={type.id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedComponent === type.id
                          ? `border-${type.color}-500 bg-${type.color}-50`
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedComponent(type.id)}
                    >
                      <div className="flex items-center mb-2">
                        <Icon className={`h-5 w-5 text-${type.color}-600 mr-2`} />
                        <h3 className="font-medium text-gray-900">{type.name}</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{type.description}</p>
                      <div className="text-xs text-gray-500">
                        Examples: {type.examples.join(', ')}
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              {/* Component Generator */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Generate Component</h2>
                <div className="space-y-4">
                  <textarea
                    value={componentPrompt}
                    onChange={(e) => setComponentPrompt(e.target.value)}
                    placeholder="Describe the interactive component you want to create..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    rows={4}
                  />
                  <button
                    onClick={generateComponent}
                    disabled={!selectedComponent || !componentPrompt.trim() || generatingComponent}
                    className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {generatingComponent ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4 mr-2" />
                        Generate Component
                      </>
                    )}
                  </button>
                </div>

                {/* Generated Questions */}
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900">Generated Questions ({assessmentData.questions.length})</h3>
                  {assessmentData.questions.map((question: any, index: number) => (
                    <div key={question.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          Question {index + 1}
                        </p>
                        <p className="text-xs text-gray-600 truncate">
                          {question.question}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => previewQuestion(question)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => removeQuestion(question.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Preview Panel */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Live Preview</h2>
                {previewComponent ? (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900">Preview Mode</h4>
                      <p className="text-sm text-gray-600">{previewComponent.question}</p>
                    </div>
                    {previewComponent.componentCode ? (
                      <DynamicComponentRenderer
                        componentCode={previewComponent.componentCode}
                        question={previewComponent}
                        onInteraction={(data) => console.log('Preview interaction:', data)}
                      />
                    ) : (
                      <div className="text-gray-500 text-center py-8">
                        Traditional question component
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="border border-gray-200 rounded-lg p-8 text-center text-gray-500">
                    Select a question to preview
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Preview step would go here...
  return <div>Preview coming soon...</div>
}
