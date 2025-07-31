'use client'

import { useState, useEffect } from 'react'
import DynamicInterfaceRenderer from './DynamicInterfaceRenderer'

interface LiveSimulationEngineProps {
  scenario: any
  onComplete: (results: any) => void
  onBack: () => void
}

export default function LiveSimulationEngine({ scenario, onComplete, onBack }: LiveSimulationEngineProps) {
  const [assessmentInterface, setAssessmentInterface] = useState<any>(null)
  const [scenarios, setScenarios] = useState<any[]>([])
  const [isGenerating, setIsGenerating] = useState(true)
  const [error, setError] = useState<string | null>(null)

  console.log('🎯 LiveSimulationEngine: AI-powered assessment for:', scenario.title)

  useEffect(() => {
    generateAIAssessment()
  }, [scenario])

  const generateAIAssessment = async () => {
    try {
      setIsGenerating(true)
      setError(null)
      
      console.log('🎮 CREATING INFINITY SANDBOX ENVIRONMENT for:', scenario)
      
      // Enhanced request for infinity sandbox experience
      const response = await fetch('/api/generate-live-environment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario: {
            role: scenario.title || 'Software Engineer',
            description: scenario.description || 'Create an infinite interactive sandbox',
            company: scenario.company || 'Professional Organization',
            difficulty: scenario.difficulty || 'Revolutionary',
            type: 'infinity-sandbox',
            requirements: [
              'Fully executable code environment',
              'Interactive APIs and data structures', 
              'Real-time performance monitoring',
              'Dynamic plot twists and challenges',
              'Unlimited exploration capabilities',
              'Live feedback and adaptation systems'
            ]
          },
          complexity: 'revolutionary',
          type: 'infinity-sandbox'
        })
      })

      if (!response.ok) {
        console.error('Infinity sandbox generation failed:', response.status)
        throw new Error(`Infinity sandbox generation failed: ${response.status}`)
      }

      const data = await response.json()
      
      console.log('🚀 INFINITY SANDBOX ENVIRONMENT Created:', {
        environmentCode: data.environmentCode ? `${data.environmentCode.length} chars of executable code` : 'No Code',
        plotTwists: data.plotTwists?.length || 0,
        starterCode: data.starterCode ? 'Interactive starter provided' : 'None',
        validationCriteria: data.validationCriteria ? 'Dynamic validation active' : 'Basic',
        infinityFeatures: data.infinityFeatures || 'Standard',
        timeLimit: data.timeLimit
      })

      // Create infinity sandbox assessment interface
      setAssessmentInterface({
        type: 'infinity-sandbox-environment',
        title: `${scenario.title} - Infinity Sandbox`,
        description: 'Unlimited interactive coding environment with real-time execution',
        environment: data.environmentCode,
        starterCode: data.starterCode,
        plotTwists: data.plotTwists,
        initialState: data.initialState,
        validationCriteria: data.validationCriteria,
        timeLimit: data.timeLimit,
        successConditions: data.successConditions,
        infinityFeatures: {
          unlimited_execution: true,
          live_code_evaluation: true,
          dynamic_environment_mutation: true,
          real_time_performance_tracking: true,
          adaptive_difficulty_scaling: true,
          infinite_exploration_paths: true,
          collaborative_ai_assistance: true,
          sandbox_persistence: true
        }
      })
      
      setScenarios([{
        id: 'infinity-sandbox-1',
        title: `${scenario.title} - Infinite Challenge Arena`,
        description: 'Unlimited interactive sandbox with evolving challenges',
        environment: data,
        timeLimit: data.timeLimit || 3600, // Extended time for infinity sandbox
        difficulty: 'infinity',
        features: [
          'Live code execution',
          'Real-time environment mutation',
          'Adaptive challenge generation',
          'Unlimited experimentation',
          'Dynamic performance scaling',
          'Interactive AI collaboration'
        ]
      }])
      
    } catch (error) {
      console.error('❌ AI Assessment generation failed:', error)
      setError('Failed to generate AI assessment. Please try again.')
      
      // Fallback to infinity sandbox basic environment
      setAssessmentInterface({
        type: 'infinity-sandbox-basic',
        title: `${scenario.title} - Interactive Sandbox`,
        description: 'Interactive coding environment with real-time execution',
        environment: `
          // BASIC INFINITY SANDBOX ENVIRONMENT
          class InteractiveSandbox {
            constructor() {
              this.state = {
                codeExecutions: 0,
                performanceScore: 100,
                challenges: [],
                completedTasks: [],
                availableTools: ['console', 'debugger', 'profiler', 'tester']
              }
              this.timeline = []
              this.feedback = []
              console.log('🎮 Interactive Sandbox Initialized')
            }
            
            executeCode(code) {
              this.state.codeExecutions++
              this.timeline.push({ action: 'code_execution', code, timestamp: Date.now() })
              
              try {
                const result = eval(code)
                this.feedback.push({ type: 'success', message: 'Code executed successfully', result })
                return { success: true, result, executions: this.state.codeExecutions }
              } catch (error) {
                this.feedback.push({ type: 'error', message: error.message })
                return { success: false, error: error.message }
              }
            }
            
            addChallenge(challenge) {
              this.state.challenges.push({
                id: Date.now(),
                ...challenge,
                status: 'active',
                attempts: 0
              })
              console.log('New challenge added:', challenge.title)
            }
            
            completeTask(taskId) {
              const challenge = this.state.challenges.find(c => c.id === taskId)
              if (challenge) {
                challenge.status = 'completed'
                this.state.completedTasks.push(taskId)
                this.state.performanceScore += 10
                console.log('Task completed! Performance score:', this.state.performanceScore)
              }
            }
            
            getPerformanceMetrics() {
              return {
                executions: this.state.codeExecutions,
                score: this.state.performanceScore,
                completed: this.state.completedTasks.length,
                challenges: this.state.challenges.length,
                efficiency: this.state.completedTasks.length / (this.state.codeExecutions || 1)
              }
            }
          }
          
          // Initialize sandbox
          const sandbox = new InteractiveSandbox()
          
          // Add initial challenges
          sandbox.addChallenge({
            title: 'System Integration',
            description: 'Implement and test system integration',
            difficulty: 'medium',
            points: 50
          })
        `,
        starterCode: `
          // INTERACTIVE SANDBOX - GET STARTED
          
          // Execute code in the sandbox
          sandbox.executeCode('console.log("Hello Infinity Sandbox!")')
          
          // Check your performance
          console.log('Current Metrics:', sandbox.getPerformanceMetrics())
          
          // Add your own challenges
          sandbox.addChallenge({
            title: 'Your Custom Challenge',
            description: 'Describe what you want to build',
            difficulty: 'custom'
          })
          
          // Example: Create a function and test it
          function testFunction() {
            // Your implementation here
            return 'Working!';
          }
          
          // Execute and validate
          const result = sandbox.executeCode('testFunction()')
          console.log('Execution Result:', result)
          
          // Complete tasks as you go
          // sandbox.completeTask(challengeId)
        `,
        components: [
          {
            id: 'code-executor',
            type: 'code-editor',
            label: 'Interactive Code Environment',
            language: 'javascript',
            placeholder: 'Write and execute code in the infinity sandbox...',
            props: { 
              height: '400px',
              features: ['autocomplete', 'syntax-highlighting', 'live-execution', 'performance-monitoring']
            },
            layout: { width: '100%', height: '500px', position: 'center', order: 1 }
          },
          {
            id: 'performance-dashboard',
            type: 'dashboard',
            label: 'Real-time Performance Metrics',
            props: { 
              metrics: ['executions', 'score', 'efficiency', 'challenges'],
              refreshRate: 1000
            },
            layout: { width: '100%', height: '200px', position: 'bottom', order: 2 }
          }
        ],
        interactions: [
          {
            trigger: 'submit-response',
            action: 'evaluate',
            feedback: { immediate: true, detailed: true, adaptive: true, style: 'analytical' },
            evaluation: 'Comprehensive evaluation of the response'
          }
        ],
        evaluation: {
          primary: ['Problem Solving', 'Communication', 'Strategic Thinking'],
          secondary: ['Creativity', 'Leadership', 'Technical Knowledge'],
          scoring: { algorithm: 'adaptive', factors: ['quality', 'depth', 'practicality'], weights: [0.4, 0.3, 0.3] },
          aiPrompts: ['Evaluate problem-solving approach', 'Assess communication clarity', 'Analyze strategic thinking']
        },
        styling: {
          theme: 'professional',
          colors: { primary: '#3B82F6', secondary: '#1F2937', accent: '#10B981', background: '#111827' },
          layout: 'dashboard'
        }
      })
      
      setScenarios([
        {
          id: 'infinity-sandbox-basic',
          title: `${scenario.title} - Interactive Coding Arena`,
          description: 'Unlimited interactive environment with real-time code execution and performance tracking',
          challenges: [
            'Build and test interactive systems', 
            'Implement real-time data processing', 
            'Create adaptive algorithms',
            'Design efficient architectures',
            'Optimize performance metrics'
          ],
          features: [
            'Live code execution environment',
            'Real-time performance monitoring', 
            'Interactive challenge system',
            'Adaptive difficulty scaling',
            'Unlimited experimentation space'
          ],
          successCriteria: [
            'Demonstrate functional code execution', 
            'Show measurable performance improvements', 
            'Complete interactive challenges',
            'Exhibit problem-solving creativity'
          ],
          timeLimit: 3600, // Extended time for sandbox exploration
          difficulty: 'interactive',
          sandboxFeatures: {
            unlimited_execution: true,
            real_time_feedback: true,
            performance_tracking: true,
            interactive_challenges: true,
            code_persistence: true
          }
        }
      ])
      
    } finally {
      setIsGenerating(false)
    }
  }

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white flex items-center justify-center">
        <div className="text-center space-y-6 max-w-2xl px-6">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-purple-500 mx-auto"></div>
            <div className="absolute inset-0 animate-pulse rounded-full h-20 w-20 border-t-4 border-cyan-400 mx-auto"></div>
          </div>
          
          <div className="space-y-3">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              🚀 Creating Infinity Sandbox
            </h2>
            <div className="text-lg text-gray-300 space-y-2">
              <p className="font-medium">Generating unlimited interactive environment...</p>
              <div className="text-sm space-y-1 text-gray-400">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Compiling executable code environment</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse delay-100"></div>
                  <span>Initializing interactive APIs & data structures</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-200"></div>
                  <span>Setting up real-time performance monitoring</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-300"></div>
                  <span>Generating dynamic plot twists & challenges</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-500"></div>
                  <span>Activating infinity exploration mode</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm border border-purple-500/20 rounded-lg p-4">
            <p className="text-sm text-purple-300 leading-relaxed">
              <span className="font-semibold">✨ Revolutionary Assessment:</span> You're about to enter a 
              <span className="text-cyan-400 font-bold"> fully executable sandbox environment</span> with 
              unlimited exploration, real-time code execution, and adaptive challenges that evolve based on your actions.
            </p>
          </div>
          
          <div className="text-xs text-gray-500">
            🤖 Powered by advanced AI • Zero hardcoding • Infinite possibilities
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 text-white flex items-center justify-center">
        <div className="text-center space-y-6 max-w-lg px-6">
          <div className="text-red-400 text-8xl animate-pulse">⚠️</div>
          <div className="space-y-3">
            <h2 className="text-3xl font-bold text-red-400">Infinity Sandbox Creation Failed</h2>
            <p className="text-gray-300 text-lg leading-relaxed">{error}</p>
            <div className="text-sm text-gray-400 space-y-1">
              <p>• Interactive environment compilation interrupted</p>
              <p>• Code execution sandbox initialization failed</p>
              <p>• Real-time performance monitoring unavailable</p>
            </div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm border border-red-500/20 rounded-lg p-4">
            <p className="text-sm text-red-300">
              The infinity sandbox environment requires advanced AI processing. 
              Network connectivity or API availability may be affecting generation.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={generateAIAssessment}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors font-semibold"
            >
              🚀 Retry Infinity Sandbox Creation
            </button>
            <button
              onClick={onBack}
              className="px-8 py-3 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
            >
              ← Back to Assessments
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!assessmentInterface || !scenarios.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-yellow-900 to-gray-900 text-white flex items-center justify-center">
        <div className="text-center space-y-6 max-w-lg px-6">
          <div className="text-yellow-400 text-8xl animate-bounce">🔧</div>
          <div className="space-y-3">
            <h2 className="text-3xl font-bold text-yellow-400">Infinity Sandbox Unavailable</h2>
            <p className="text-gray-300 text-lg">Unable to generate interactive sandbox environment for this role.</p>
            <div className="text-sm text-gray-400 space-y-1">
              <p>• Interactive code environment not initialized</p>
              <p>• Real-time execution system offline</p>
              <p>• Performance monitoring unavailable</p>
            </div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-500/20 rounded-lg p-4">
            <p className="text-sm text-yellow-300">
              The infinity sandbox requires specific environment configurations. 
              Please check system requirements and try again.
            </p>
          </div>
          
          <button
            onClick={onBack}
            className="px-8 py-3 bg-gradient-to-r from-gray-700 to-gray-600 text-gray-200 rounded-lg hover:from-gray-600 hover:to-gray-500 transition-colors font-semibold"
          >
            ← Back to Assessments
          </button>
        </div>
      </div>
    )
  }

  return (
    <DynamicInterfaceRenderer
      assessmentInterface={assessmentInterface}
      scenarios={scenarios}
      onComplete={onComplete}
      onBack={onBack}
    />
  )
}
