'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Play, Code, Terminal, Eye, Zap, Cpu, Database, Globe, Settings, RefreshCw,
  Brain, Target, AlertTriangle, CheckCircle, XCircle, Activity, Layers,
  GitBranch, Bug, Rocket, Shield, Clock, Users, BarChart3, Lightbulb,
  ArrowLeft, Maximize2, Minimize2, Copy, Download, Save, FileText,
  MonitorPlay, ThumbsUp, ThumbsDown, Timer, Gauge, TrendingUp
} from 'lucide-react'

interface BusinessSimulationEngineProps {
  scenario: any
  onComplete: (results: any) => void
  onBack: () => void
}

export default function BusinessSimulationEngine({ scenario, onComplete, onBack }: BusinessSimulationEngineProps) {
  console.log('🎯 BusinessSimulationEngine initialized with scenario:', scenario)
  
  const [currentPhase, setCurrentPhase] = useState<'briefing' | 'simulation' | 'validation' | 'results'>('briefing')
  const [currentScenario, setCurrentScenario] = useState(0)
  const [response, setResponse] = useState('')
  const [feedback, setFeedback] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(1800) // 30 minutes
  const [performance, setPerformance] = useState({
    score: 0,
    responses: 0,
    totalTime: 0
  })

  const scenarios = scenario.scenarios || [
    {
      title: 'Crisis Management',
      scenario: 'A critical business situation requires immediate attention',
      initialChallenge: 'Assess and respond to the crisis'
    }
  ]

  useEffect(() => {
    if (timeRemaining > 0 && currentPhase === 'simulation') {
      const timer = setTimeout(() => setTimeRemaining(prev => prev - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeRemaining, currentPhase])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const analyzeResponse = () => {
    if (!response.trim()) {
      setFeedback('Please provide a response before submitting.')
      return
    }

    setIsAnalyzing(true)
    setFeedback('Analyzing your business response...')

    setTimeout(() => {
      const businessFeedback = generateBusinessFeedback(response)
      setFeedback(businessFeedback)
      
      setPerformance(prev => ({
        ...prev,
        responses: prev.responses + 1,
        score: calculateScore(response),
        totalTime: 1800 - timeRemaining
      }))
      
      setIsAnalyzing(false)
    }, 2000)
  }

  const generateBusinessFeedback = (responseText: string) => {
    const length = responseText.length
    const hasStakeholders = responseText.toLowerCase().includes('stakeholder') || responseText.toLowerCase().includes('team')
    const hasPrioritization = responseText.toLowerCase().includes('priority') || responseText.toLowerCase().includes('first')
    const hasCommunication = responseText.toLowerCase().includes('communicate') || responseText.toLowerCase().includes('inform')
    const hasStrategy = responseText.toLowerCase().includes('strategy') || responseText.toLowerCase().includes('plan')

    let feedback = '🎯 **Business Response Analysis**\n\n'
    
    if (length < 100) {
      feedback += '❌ **Response Depth**: Too brief for effective crisis management\n'
    } else {
      feedback += '✅ **Response Depth**: Comprehensive approach demonstrated\n'
    }

    if (hasStakeholders) {
      feedback += '✅ **Stakeholder Awareness**: Shows understanding of key stakeholders\n'
    } else {
      feedback += '⚠️ **Stakeholder Awareness**: Consider stakeholder impact\n'
    }

    if (hasPrioritization) {
      feedback += '✅ **Prioritization**: Demonstrates clear priority setting\n'
    } else {
      feedback += '⚠️ **Prioritization**: Could benefit from clearer prioritization\n'
    }

    if (hasCommunication) {
      feedback += '✅ **Communication Strategy**: Includes communication planning\n'
    } else {
      feedback += '❌ **Communication Strategy**: Missing communication considerations\n'
    }

    if (hasStrategy) {
      feedback += '✅ **Strategic Thinking**: Shows strategic approach\n'
    } else {
      feedback += '⚠️ **Strategic Thinking**: Could demonstrate more strategic thinking\n'
    }

    const score = [hasStakeholders, hasPrioritization, hasCommunication, hasStrategy].filter(Boolean).length
    feedback += `\n📊 **Assessment Score**: ${score * 25}/100\n\n`

    if (score >= 3) {
      feedback += '🌟 **Excellent business acumen! You demonstrate strong product management capabilities.**'
    } else if (score >= 2) {
      feedback += '⚡ **Solid foundation. Consider addressing the highlighted areas for improvement.**'
    } else {
      feedback += '🔄 **Opportunity for growth. Focus on stakeholder management and strategic communication.**'
    }

    return feedback
  }

  const calculateScore = (responseText: string) => {
    const factors = [
      responseText.toLowerCase().includes('stakeholder'),
      responseText.toLowerCase().includes('priority'),
      responseText.toLowerCase().includes('communicate'),
      responseText.toLowerCase().includes('strategy'),
      responseText.length > 200
    ]
    return factors.filter(Boolean).length * 20
  }

  const nextScenario = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1)
      setResponse('')
      setFeedback('')
    } else {
      setCurrentPhase('validation')
    }
  }

  const submitFinalResults = () => {
    const results = {
      type: 'business-simulation',
      scenarios: scenarios.length,
      responses: performance.responses,
      finalScore: performance.score,
      timeSpent: 1800 - timeRemaining,
      feedback: feedback,
      timestamp: new Date().toISOString()
    }
    
    onComplete(results)
  }

  const renderBriefing = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <Brain className="mx-auto h-16 w-16 text-purple-500 mb-4" />
        <h2 className="text-3xl font-bold text-white mb-2">
          🎯 Business Crisis Simulation
        </h2>
        <p className="text-gray-300 max-w-2xl mx-auto">
          You're about to enter an immersive business simulation where you'll navigate real-world 
          challenges that require strategic thinking, stakeholder management, and decisive action.
        </p>
      </div>

      <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-500/30 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center text-white">
          <Target className="mr-2 h-5 w-5 text-purple-400" />
          {scenario.title}
        </h3>
        <p className="text-gray-300 mb-4">{scenario.description}</p>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-white mb-2">🎮 What You'll Face</h4>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>• {scenarios.length} business scenarios</li>
              <li>• Real-time decision making</li>
              <li>• Stakeholder management challenges</li>
              <li>• Strategic communication needs</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">🏆 Success Criteria</h4>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>• Strategic thinking</li>
              <li>• Stakeholder awareness</li>
              <li>• Clear communication</li>
              <li>• Action prioritization</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
        <div className="flex">
          <Lightbulb className="h-5 w-5 text-yellow-400 mt-0.5 mr-3" />
          <div>
            <h4 className="font-medium text-yellow-300">What Makes This Revolutionary?</h4>
            <ul className="mt-2 text-sm text-yellow-200 space-y-1">
              <li>• <strong>AI Analysis:</strong> Get instant feedback on your business approach</li>
              <li>• <strong>Real Scenarios:</strong> Face challenges actual product managers encounter</li>
              <li>• <strong>Adaptive Assessment:</strong> Scenarios tailored to your responses</li>
              <li>• <strong>Comprehensive Evaluation:</strong> Beyond technical skills to business acumen</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={onBack}
          className="px-6 py-2 text-gray-300 bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600 transition-colors"
        >
          Back to Assessments
        </button>
        <button
          onClick={() => setCurrentPhase('simulation')}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
        >
          <Rocket className="mr-2 h-4 w-4" />
          Start Business Simulation
        </button>
      </div>
    </motion.div>
  )

  const renderSimulation = () => (
    <div className="h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="flex items-center text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Exit Simulation
            </button>
            <div className="h-6 w-px bg-gray-600"></div>
            <div className="flex items-center space-x-2">
              <MonitorPlay className="h-5 w-5 text-cyan-400" />
              <span className="font-semibold text-cyan-400">Business Crisis Simulation</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Timer className="h-4 w-4 text-orange-400" />
              <span className="font-mono text-gray-300">{formatTime(timeRemaining)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <BarChart3 className="h-4 w-4 text-green-400" />
              <span className="text-gray-300">{performance.score} pts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Panel - Scenario */}
        <div className="w-1/3 bg-gray-800 border-r border-gray-700 p-6 overflow-y-auto">
          <div className="space-y-6">
            <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                <h3 className="font-bold text-red-300">SCENARIO {currentScenario + 1}</h3>
              </div>
              <h4 className="font-semibold text-white mb-2">{scenarios[currentScenario]?.title}</h4>
              <p className="text-gray-300 text-sm leading-relaxed">{scenarios[currentScenario]?.scenario}</p>
              
              <div className="mt-4 p-3 bg-orange-900/30 border border-orange-500/30 rounded">
                <h5 className="font-medium text-orange-300 mb-1">Your Challenge:</h5>
                <p className="text-orange-200 text-sm">{scenarios[currentScenario]?.initialChallenge}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Center Panel - Response */}
        <div className="flex-1 p-6">
          <div className="space-y-6 h-full">
            <div className="bg-gray-800 rounded-lg p-6 flex-1">
              <h3 className="text-xl font-bold text-white mb-4">Your Strategic Response</h3>
              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                className="w-full h-5/6 p-4 bg-gray-900 text-gray-100 rounded border border-gray-600 focus:border-blue-500 outline-none resize-none"
                placeholder="Provide your detailed response:

• What immediate actions would you take?
• How would you prioritize different issues?
• What stakeholders need to be involved?
• How would you communicate the situation?
• What's your long-term strategy?

Be specific and actionable in your response..."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={analyzeResponse}
                disabled={isAnalyzing || !response.trim()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center"
              >
                {isAnalyzing ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Brain className="h-4 w-4 mr-2" />}
                Analyze Response
              </button>
              
              <button
                onClick={nextScenario}
                disabled={!feedback}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center justify-center"
              >
                <Rocket className="h-4 w-4 mr-2" />
                {currentScenario < scenarios.length - 1 ? 'Next Scenario' : 'Complete Assessment'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel - Feedback */}
        <div className="w-1/3 bg-gray-800 border-l border-gray-700 p-6 overflow-y-auto">
          <div className="space-y-6">
            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-3 flex items-center">
                <Brain className="h-4 w-4 mr-2 text-purple-400" />
                AI Analysis
              </h4>
              <div className="space-y-3">
                {feedback ? (
                  <div className="bg-gray-900 p-3 rounded text-sm text-gray-300 whitespace-pre-line">
                    {feedback}
                  </div>
                ) : (
                  <div className="text-gray-500 text-sm">
                    Submit your response to receive detailed AI-powered feedback on your business approach.
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-3">Performance</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Current Score:</span>
                  <span className="text-green-400">{performance.score}/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Scenarios:</span>
                  <span className="text-white">{currentScenario + 1}/{scenarios.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Time Elapsed:</span>
                  <span className="text-white">{formatTime(1800 - timeRemaining)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderValidation = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
        <h2 className="text-3xl font-bold text-white mb-2">
          Assessment Complete!
        </h2>
        <p className="text-gray-300">
          You've successfully navigated all business scenarios. Here's your performance summary:
        </p>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">Final Results</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-300">Final Score:</span>
              <span className="text-green-400 font-bold">{performance.score}/100</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Scenarios Completed:</span>
              <span className="text-white">{scenarios.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Total Time:</span>
              <span className="text-white">{formatTime(1800 - timeRemaining)}</span>
            </div>
          </div>
          
          <div className="bg-gray-700 rounded p-4">
            <h4 className="font-medium text-white mb-2">Assessment Highlights</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Strategic business thinking</li>
              <li>• Crisis management skills</li>
              <li>• Stakeholder communication</li>
              <li>• Decision making under pressure</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={submitFinalResults}
          className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center mx-auto"
        >
          <CheckCircle className="mr-2 h-5 w-5" />
          Submit Final Results
        </button>
      </div>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {currentPhase === 'briefing' && renderBriefing()}
        {currentPhase === 'simulation' && renderSimulation()}
        {currentPhase === 'validation' && renderValidation()}
      </div>
    </div>
  )
}
