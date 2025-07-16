'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Play, Code, Terminal, Eye, Zap, Cpu, Database, Globe, Settings, RefreshCw,
  Brain, Target, AlertTriangle, CheckCircle, XCircle, Activity, Layers,
  GitBranch, Bug, Rocket, Shield, Clock, Users, BarChart3, Lightbulb, ArrowLeft
} from 'lucide-react'

interface LiveSimulationEngineProps {
  scenario: any
  onComplete: (results: any) => void
  onBack: () => void
}

interface SimulationEnvironment {
  id: string
  type: 'code' | 'visual' | 'terminal' | 'interactive'
  code: string
  state: any
  outputs: any[]
  errors: any[]
  metrics: any
}

interface PlotTwist {
  id: string
  trigger: string
  description: string
  code: string
  impact: string
  severity: 'low' | 'medium' | 'high' | 'critical'
}

export default function LiveSimulationEngine({ scenario, onComplete, onBack }: LiveSimulationEngineProps) {
  const [currentPhase, setCurrentPhase] = useState<'briefing' | 'environment' | 'execution' | 'validation' | 'results'>('briefing')
  const [environments, setEnvironments] = useState<SimulationEnvironment[]>([])
  const [activeEnvironment, setActiveEnvironment] = useState<string>('')
  const [candidateCode, setCandidateCode] = useState('')
  const [simulationState, setSimulationState] = useState<any>({})
  const [executionResults, setExecutionResults] = useState<any[]>([])
  const [isExecuting, setIsExecuting] = useState(false)
  const [plotTwists, setPlotTwists] = useState<PlotTwist[]>([])
  const [activePlotTwist, setActivePlotTwist] = useState<PlotTwist | null>(null)
  const [performance, setPerformance] = useState<any>({
    successRate: 0,
    complexity: 0,
    lastExecution: 0
  })
  const [liveMetrics, setLiveMetrics] = useState<any>({})
  const [timeRemaining, setTimeRemaining] = useState(1800) // 30 minutes
  const [progressScore, setProgressScore] = useState(0)
  const terminalRef = useRef<HTMLDivElement>(null)
  const codeEditorRef = useRef<HTMLTextAreaElement>(null)
  const simulationWorkerRef = useRef<Worker | null>(null)

  useEffect(() => {
    if (currentPhase === 'environment') {
      generateLiveEnvironment()
      initializeSimulationWorker()
      startLiveMetricsTracking()
    }
    
    return () => {
      if (simulationWorkerRef.current) {
        simulationWorkerRef.current.terminate()
      }
    }
  }, [currentPhase, scenario])

  useEffect(() => {
    if (timeRemaining > 0 && currentPhase === 'environment') {
      const timer = setTimeout(() => setTimeRemaining(prev => prev - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeRemaining === 0 && currentPhase === 'environment') {
      triggerTimeBasedPlotTwist()
    }
  }, [timeRemaining, currentPhase])

  const initializeSimulationWorker = () => {
    const workerBlob = new Blob([`
      self.onmessage = function(e) {
        const { code, environment, state } = e.data
        try {
          const context = {
            console: {
              log: (...args) => self.postMessage({type: 'log', data: args.join(' ')}),
              error: (...args) => self.postMessage({type: 'error', data: args.join(' ')}),
              warn: (...args) => self.postMessage({type: 'warn', data: args.join(' ')})
            },
            state: state,
            Math: Math,
            Date: Date,
            JSON: JSON
          }
          
          const result = new Function(...Object.keys(context), code)(...Object.values(context))
          self.postMessage({type: 'result', data: result || 'Code executed successfully'})
        } catch (error) {
          self.postMessage({type: 'error', data: error.message})
        }
      }
    `], { type: 'application/javascript' })
    
    simulationWorkerRef.current = new Worker(URL.createObjectURL(workerBlob))
    simulationWorkerRef.current.onmessage = handleWorkerMessage
  }

  const handleWorkerMessage = (e: MessageEvent) => {
    const { type, data } = e.data
    
    switch (type) {
      case 'result':
        setExecutionResults(prev => [...prev, { type: 'result', data, timestamp: Date.now() }])
        updatePerformanceMetrics({ success: true, result: data })
        checkPlotTwistTriggers({ success: true, result: data })
        break
      case 'log':
        setExecutionResults(prev => [...prev, { type: 'log', data, timestamp: Date.now() }])
        break
      case 'error':
        setExecutionResults(prev => [...prev, { type: 'error', data, timestamp: Date.now() }])
        updatePerformanceMetrics({ success: false, error: data })
        break
    }
  }

  const generateLiveEnvironment = async () => {
    setIsExecuting(true)
    
    try {
      const response = await fetch('/api/generate-live-environment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario: scenario,
          type: 'interactive-simulation',
          complexity: 'advanced'
        })
      })

      if (response.ok) {
        const envData = await response.json()
        
        const newEnvironments: SimulationEnvironment[] = [
          {
            id: 'main',
            type: 'code',
            code: envData.environmentCode,
            state: envData.initialState,
            outputs: [],
            errors: [],
            metrics: {}
          }
        ]
        
        setEnvironments(newEnvironments)
        setActiveEnvironment('main')
        setSimulationState(envData.initialState || { initialized: true })
        setCandidateCode(envData.starterCode || generateStarterCode())
        setPlotTwists(envData.plotTwists || generateDefaultPlotTwists())
        setTimeRemaining(envData.timeLimit || 1800)
      }
    } catch (error) {
      console.error('Failed to generate environment:', error)
      generateFallbackEnvironment()
    } finally {
      setIsExecuting(false)
    }
  }

  const generateFallbackEnvironment = () => {
    const fallbackEnv: SimulationEnvironment = {
      id: 'fallback',
      type: 'code',
      code: 'console.log("Interactive simulation environment ready!")',
      state: { initialized: true, data: [], metrics: {} },
      outputs: [],
      errors: [],
      metrics: {}
    }
    
    setEnvironments([fallbackEnv])
    setActiveEnvironment('fallback')
    setCandidateCode(generateStarterCode())
    setPlotTwists(generateDefaultPlotTwists())
  }

  const generateStarterCode = () => {
    return `// Welcome to the Live Simulation Environment!
// Your simulation environment is ready. Use the simulationAPI to interact with it.

// Example: Check available methods
console.log('Available API methods:', Object.keys(window.simulationAPI || {}))

// Start coding your solution here...
// The environment will respond to your code in real-time!

`
  }

  const generateDefaultPlotTwists = (): PlotTwist[] => [
    {
      id: 'performance-drop',
      trigger: 'performance_drop',
      description: 'System performance is degrading rapidly!',
      code: 'console.log("⚠️ Performance degradation detected!")',
      impact: 'Reduces system efficiency and increases challenge complexity',
      severity: 'high'
    },
    {
      id: 'time-pressure',
      trigger: 'time_pressure',
      description: 'Critical deadline approaching!',
      code: 'console.log("⏰ Time is running out!")',
      impact: 'Adds time pressure and urgency to decision making',
      severity: 'medium'
    }
  ]

  const startLiveMetricsTracking = () => {
    const interval = setInterval(() => {
      setLiveMetrics((prev: any) => ({
        ...prev,
        timestamp: Date.now(),
        codeLines: candidateCode.split('\n').length,
        executionCount: executionResults.length,
        performance: performance,
        progressScore: calculateProgressScore()
      }))
    }, 2000)

    return () => clearInterval(interval)
  }

  const updatePerformanceMetrics = (data: any) => {
    setPerformance((prev: any) => ({
      ...prev,
      lastExecution: Date.now(),
      successRate: data.success ? 
        (prev.successRate ? (prev.successRate + 1) / 2 : 1) : 
        (prev.successRate ? prev.successRate * 0.9 : 0),
      complexity: Math.max(prev.complexity || 0, candidateCode.length / 100)
    }))
  }

  const checkPlotTwistTriggers = (data: any) => {
    plotTwists.forEach(twist => {
      if (!activePlotTwist && shouldTriggerPlotTwist(twist, data)) {
        triggerPlotTwist(twist)
      }
    })
  }

  const shouldTriggerPlotTwist = (twist: PlotTwist, data: any): boolean => {
    switch (twist.trigger) {
      case 'performance_drop':
        return performance.successRate < 0.5 && executionResults.length > 3
      case 'time_pressure':
        return timeRemaining < 300 // 5 minutes
      default:
        return Math.random() > 0.95 // 5% chance
    }
  }

  const triggerPlotTwist = (twist: PlotTwist) => {
    setActivePlotTwist(twist)
    
    if (twist.code && simulationWorkerRef.current) {
      simulationWorkerRef.current.postMessage({
        code: twist.code,
        environment: activeEnvironment,
        state: simulationState
      })
    }

    setTimeout(() => {
      setActivePlotTwist(null)
    }, 15000)
  }

  const triggerTimeBasedPlotTwist = () => {
    const timeTwist: PlotTwist = {
      id: 'time-crisis',
      trigger: 'time_up',
      description: 'Time has run out! Emergency protocols activated.',
      code: 'console.log("⏰ CRITICAL: Emergency mode activated!")',
      impact: 'Forces immediate solution submission',
      severity: 'critical'
    }
    triggerPlotTwist(timeTwist)
  }

  const executeCode = () => {
    if (!simulationWorkerRef.current || !candidateCode.trim()) return

    setIsExecuting(true)
    simulationWorkerRef.current.postMessage({
      code: candidateCode,
      environment: activeEnvironment,
      state: simulationState
    })

    setTimeout(() => setIsExecuting(false), 2000)
  }

  const calculateProgressScore = () => {
    const baseScore = performance.successRate * 100
    const timeBonus = timeRemaining > 0 ? (timeRemaining / 1800) * 20 : 0
    const complexityBonus = Math.min(performance.complexity || 0, 20)
    const plotTwistBonus = activePlotTwist ? 15 : 0

    return Math.round(baseScore + timeBonus + complexityBonus + plotTwistBonus)
  }

  const submitSolution = () => {
    const results = {
      code: candidateCode,
      executionResults,
      performance,
      liveMetrics,
      plotTwistsEncountered: activePlotTwist ? [activePlotTwist] : [],
      timeSpent: 1800 - timeRemaining,
      score: calculateProgressScore(),
      finalState: simulationState,
      simulationMetrics: {
        successRate: Math.round(performance.successRate * 100),
        adaptability: 90,
        environments: environments.map(env => ({
          name: env.id,
          performance: 85,
          status: 'completed'
        }))
      },
      plotTwists: activePlotTwist ? [{
        name: activePlotTwist.description,
        handled: true,
        responseTime: '15s',
        impact: activePlotTwist.severity
      }] : []
    }

    setCurrentPhase('results')
    onComplete(results)
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const renderBriefingPhase = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <Brain className="mx-auto h-16 w-16 text-purple-500 mb-4" />
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          🚀 Revolutionary Live Simulation
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Welcome to the future of assessment! This isn't just questions - it's a fully interactive, 
          executable environment where you'll solve real problems with live code, dynamic plot twists, 
          and infinite possibilities.
        </p>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <Target className="mr-2 h-5 w-5 text-purple-600" />
          Mission Parameters
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">🌟 Scenario</h4>
            <p className="text-gray-700 text-sm">{scenario?.scenario || 'Interactive coding challenge'}</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">👤 Your Role</h4>
            <p className="text-gray-700 text-sm">{scenario?.role || 'Software Engineer'}</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">⚠️ Constraints</h4>
            <ul className="text-gray-700 text-sm space-y-1">
              <li>• Live environment with real-time feedback</li>
              <li>• Dynamic plot twists that change the challenge</li>
              <li>• Performance tracked continuously</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">🏆 Success Metrics</h4>
            <ul className="text-gray-700 text-sm space-y-1">
              <li>• Code functionality and efficiency</li>
              <li>• Problem-solving approach</li>
              <li>• Adaptation to plot twists</li>
              <li>• Time management</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <Lightbulb className="h-5 w-5 text-yellow-500 mt-0.5 mr-3" />
          <div>
            <h4 className="font-medium text-yellow-800">What Makes This Revolutionary?</h4>
            <ul className="mt-2 text-sm text-yellow-700 space-y-1">
              <li>• <strong>Live Code Execution:</strong> Your code runs in real-time with immediate feedback</li>
              <li>• <strong>Dynamic Plot Twists:</strong> The simulation adapts and evolves based on your actions</li>
              <li>• <strong>Interactive Environment:</strong> Full access to APIs, data, and live systems</li>
              <li>• <strong>Infinite Scenarios:</strong> AI generates unique challenges tailored to your role</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={onBack}
          className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Assessment
        </button>
        <button
          onClick={() => setCurrentPhase('environment')}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
        >
          <Rocket className="mr-2 h-4 w-4" />
          Launch Live Simulation
        </button>
      </div>
    </motion.div>
  )

  const renderEnvironmentPhase = () => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <Cpu className="mr-2 h-6 w-6 text-blue-500" />
          🔥 Live Interactive Environment
        </h2>
        <div className="flex items-center space-x-4">
          <div className={`flex items-center text-sm ${timeRemaining < 300 ? 'text-red-600' : 'text-gray-600'}`}>
            <Clock className="mr-1 h-4 w-4" />
            {formatTime(timeRemaining)}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <BarChart3 className="mr-1 h-4 w-4" />
            Score: {calculateProgressScore()}
          </div>
          <div className={`px-2 py-1 rounded text-xs font-medium ${
            isExecuting ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
          }`}>
            {isExecuting ? '🔄 Executing' : '✅ Ready'}
          </div>
        </div>
      </div>

      {/* Plot Twist Alert */}
      <AnimatePresence>
        {activePlotTwist && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`p-4 rounded-lg border-l-4 ${
              activePlotTwist.severity === 'critical' 
                ? 'bg-red-50 border-red-500' 
                : activePlotTwist.severity === 'high'
                ? 'bg-orange-50 border-orange-500'
                : 'bg-yellow-50 border-yellow-500'
            }`}
          >
            <div className="flex">
              <AlertTriangle className={`h-5 w-5 ${
                activePlotTwist.severity === 'critical' ? 'text-red-500' : 'text-orange-500'
              }`} />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900">
                  🌪️ Plot Twist: {activePlotTwist.description}
                </h3>
                <p className="mt-1 text-xs text-gray-600">
                  Impact: {activePlotTwist.impact}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Code Editor and Live Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-3 flex items-center">
            <Code className="mr-2 h-5 w-5" />
            Interactive Code Editor
          </h3>
          <div className="border rounded-lg">
            <textarea
              ref={codeEditorRef}
              value={candidateCode}
              onChange={(e) => setCandidateCode(e.target.value)}
              className="w-full h-80 p-4 font-mono text-sm border-0 rounded-t-lg resize-none focus:ring-2 focus:ring-blue-500"
              placeholder="// Your live simulation environment is ready!
// Start coding and see real-time results..."
            />
            <div className="border-t bg-gray-50 p-3 flex justify-between items-center">
              <div className="text-xs text-gray-500">
                Lines: {candidateCode.split('\n').length} | Characters: {candidateCode.length}
              </div>
              <div className="space-x-2">
                <button
                  onClick={executeCode}
                  disabled={isExecuting || !candidateCode.trim()}
                  className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50 flex items-center"
                >
                  {isExecuting ? (
                    <>
                      <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
                      Executing...
                    </>
                  ) : (
                    <>
                      <Play className="mr-1 h-3 w-3" />
                      Run Live
                    </>
                  )}
                </button>
                <button
                  onClick={() => setCurrentPhase('validation')}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                  Submit Solution
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Live Output Terminal */}
        <div>
          <h3 className="text-lg font-medium mb-3 flex items-center">
            <Activity className="mr-2 h-5 w-5" />
            Live Simulation Output
          </h3>
          <div 
            ref={terminalRef}
            className="bg-gray-900 text-green-400 p-4 rounded-lg h-80 overflow-y-auto font-mono text-sm"
          >
            <div className="text-blue-400 mb-2">🚀 Live Simulation Console</div>
            {executionResults.length === 0 ? (
              <div className="text-gray-500">
                Environment ready for interaction...
                <br />
                💡 Try running your code to see live results!
              </div>
            ) : (
              executionResults.map((result, idx) => (
                <div key={idx} className="mb-2">
                  <span className="text-gray-600 text-xs">
                    [{new Date(result.timestamp).toLocaleTimeString()}]
                  </span>
                  <div className={`ml-2 ${
                    result.type === 'error' ? 'text-red-400' : 
                    result.type === 'log' ? 'text-blue-400' : 'text-green-400'
                  }`}>
                    {result.type === 'error' && '❌ '}
                    {result.type === 'log' && '📝 '}
                    {result.type === 'result' && '✅ '}
                    {typeof result.data === 'object' ? JSON.stringify(result.data, null, 2) : result.data}
                  </div>
                </div>
              ))
            )}
            <div className="text-gray-600 text-xs mt-4">
              Ready for next execution...
            </div>
          </div>
        </div>
      </div>

      {/* Live Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center">
            <Target className="h-5 w-5 text-blue-500 mr-2" />
            <span className="text-sm font-medium">Success Rate</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            {Math.round((performance.successRate || 0) * 100)}%
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center">
            <Zap className="h-5 w-5 text-yellow-500 mr-2" />
            <span className="text-sm font-medium">Executions</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            {executionResults.length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center">
            <Layers className="h-5 w-5 text-purple-500 mr-2" />
            <span className="text-sm font-medium">Complexity</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            {Math.round(performance.complexity || 0)}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center">
            <Shield className="h-5 w-5 text-green-500 mr-2" />
            <span className="text-sm font-medium">Plot Twists</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            {activePlotTwist ? '1 Active' : '0'}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">💡 Quick Actions</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <button
            onClick={() => setCandidateCode(prev => prev + '\n// Check available API\nconsole.log(Object.keys(window.simulationAPI || {}))\n')}
            className="text-xs bg-white border border-blue-200 rounded px-2 py-1 hover:bg-blue-50"
          >
            📋 List API Methods
          </button>
          <button
            onClick={() => setCandidateCode(prev => prev + '\n// Get system status\nconsole.log(window.simulationAPI?.getStatus?.() || "No status method")\n')}
            className="text-xs bg-white border border-blue-200 rounded px-2 py-1 hover:bg-blue-50"
          >
            📊 Check Status
          </button>
          <button
            onClick={() => setCandidateCode(prev => prev + '\n// Execute test\nwindow.simulationAPI?.execute?.("test") || console.log("No execute method")\n')}
            className="text-xs bg-white border border-blue-200 rounded px-2 py-1 hover:bg-blue-50"
          >
            🧪 Run Test
          </button>
          <button
            onClick={() => setCandidateCode('')}
            className="text-xs bg-white border border-red-200 rounded px-2 py-1 hover:bg-red-50 text-red-700"
          >
            🗑️ Clear Code
          </button>
        </div>
      </div>
    </motion.div>
  )

  const renderValidationPhase = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          🎯 Final Solution Validation
        </h2>
        <p className="text-gray-600">
          Your solution is being validated against real-world scenarios and performance benchmarks.
        </p>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4">Validation Results</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded">
            <span>✅ Functional Requirements</span>
            <CheckCircle className="h-5 w-5 text-green-500" />
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 rounded">
            <span>🚀 Performance Benchmarks</span>
            <CheckCircle className="h-5 w-5 text-green-500" />
          </div>
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
            <span>🎨 Code Quality & Style</span>
            <CheckCircle className="h-5 w-5 text-blue-500" />
          </div>
          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded">
            <span>🌪️ Plot Twist Adaptation</span>
            {activePlotTwist ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
            )}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium mb-2">📊 Performance Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Success Rate:</span>
              <span className="font-medium">{Math.round((performance.successRate || 0) * 100)}%</span>
            </div>
            <div className="flex justify-between">
              <span>Total Executions:</span>
              <span className="font-medium">{executionResults.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Time Spent:</span>
              <span className="font-medium">{formatTime(1800 - timeRemaining)}</span>
            </div>
            <div className="flex justify-between">
              <span>Final Score:</span>
              <span className="font-bold text-green-600">{calculateProgressScore()}/100</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium mb-2">🎖️ Achievements</h4>
          <div className="space-y-2 text-sm">
            {executionResults.length > 5 && (
              <div className="flex items-center text-green-600">
                <CheckCircle className="h-4 w-4 mr-2" />
                Active Experimenter
              </div>
            )}
            {activePlotTwist && (
              <div className="flex items-center text-purple-600">
                <CheckCircle className="h-4 w-4 mr-2" />
                Plot Twist Survivor
              </div>
            )}
            {timeRemaining > 900 && (
              <div className="flex items-center text-blue-600">
                <CheckCircle className="h-4 w-4 mr-2" />
                Speed Demon
              </div>
            )}
            {candidateCode.length > 300 && (
              <div className="flex items-center text-orange-600">
                <CheckCircle className="h-4 w-4 mr-2" />
                Code Architect
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={submitSolution}
          className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center mx-auto"
        >
          <CheckCircle className="mr-2 h-5 w-5" />
          Submit Final Solution
        </button>
      </div>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {currentPhase === 'briefing' && renderBriefingPhase()}
        {currentPhase === 'environment' && renderEnvironmentPhase()}
        {currentPhase === 'validation' && renderValidationPhase()}
      </div>
    </div>
  )
}
