'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Zap, 
  Target, 
  Clock, 
  AlertTriangle, 
  Cpu, 
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Trophy,
  Gamepad2,
  Timer,
  Wrench
} from 'lucide-react'

interface RevolutionaryQuestion {
  id: string
  type: string
  question: string
  description: string
  timeLimit: number
  difficulty: string
  scenario: {
    type: string
    title: string
    description: string
    plotTwists?: any[]
    arsenal?: string[]
    victoryConditions?: string[]
    skillsTested?: string[]
  }
  revolutionaryFeatures?: {
    liveSimulation: boolean
    plotTwists: boolean
    adaptiveDifficulty: boolean
    realTimeMetrics: boolean
    immersiveInterface?: boolean
  }
}

interface RevolutionaryAssessmentInterfaceProps {
  questions: RevolutionaryQuestion[]
  onComplete: (results: any) => void
  onBack: () => void
  isPreview?: boolean
}

export default function RevolutionaryAssessmentInterface({
  questions,
  onComplete,
  onBack,
  isPreview = false
}: RevolutionaryAssessmentInterfaceProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(questions[0]?.timeLimit || 1800)
  const [activePlotTwist, setActivePlotTwist] = useState<any>(null)
  const [responses, setResponses] = useState<Record<number, any>>({})
  const [simulationMetrics, setSimulationMetrics] = useState({
    adaptability: 85,
    creativity: 78,
    speed: 92,
    problemSolving: 88
  })
  const [showVictoryConditions, setShowVictoryConditions] = useState(false)
  const [plotTwistHistory, setPlotTwistHistory] = useState<any[]>([])

  const currentQ = questions[currentQuestion]

  // Timer logic
  useEffect(() => {
    if (!isPreview && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Auto-advance or complete assessment
            if (currentQuestion < questions.length - 1) {
              setCurrentQuestion(prev => prev + 1)
              return questions[currentQuestion + 1]?.timeLimit || 1800
            } else {
              handleComplete()
              return 0
            }
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [timeRemaining, currentQuestion, questions.length, isPreview])

  // Plot twist trigger logic
  useEffect(() => {
    if (!isPreview && currentQ?.scenario?.plotTwists?.length) {
      const triggerPlotTwist = () => {
        const availableTwists = currentQ.scenario.plotTwists?.filter(
          (twist: any) => !plotTwistHistory.some(h => h.id === twist.id)
        )
        
        if (availableTwists?.length > 0) {
          const randomTwist = availableTwists[Math.floor(Math.random() * availableTwists.length)]
          setActivePlotTwist(randomTwist)
          setPlotTwistHistory(prev => [...prev, { ...randomTwist, triggeredAt: Date.now() }])
          
          // Auto-hide after specified time
          setTimeout(() => {
            setActivePlotTwist(null)
          }, (randomTwist.timeToAdapt || 300) * 1000)
        }
      }

      // Random plot twist timing (30% chance every 30 seconds)
      const plotTwistTimer = setInterval(() => {
        if (Math.random() < 0.3) {
          triggerPlotTwist()
        }
      }, 30000)

      return () => clearInterval(plotTwistTimer)
    }
  }, [currentQ, plotTwistHistory, isPreview])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleResponseChange = (value: string) => {
    setResponses(prev => ({
      ...prev,
      [currentQuestion]: value
    }))

    // Update simulation metrics based on response quality
    if (value.length > 100) {
      setSimulationMetrics(prev => ({
        ...prev,
        problemSolving: Math.min(100, prev.problemSolving + 2),
        creativity: Math.min(100, prev.creativity + 1)
      }))
    }
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
      setTimeRemaining(questions[currentQuestion + 1]?.timeLimit || 1800)
    } else {
      handleComplete()
    }
  }

  const handleComplete = () => {
    const results = {
      responses: Object.entries(responses).map(([questionIndex, response]) => ({
        questionId: questions[parseInt(questionIndex)]?.id,
        answer: response,
        score: Math.floor(Math.random() * 30) + 70 // Simulate scoring
      })),
      revolutionaryMetrics: {
        simulationMetrics,
        plotTwistsHandled: plotTwistHistory.length,
        adaptabilityScore: simulationMetrics.adaptability,
        innovationLevel: simulationMetrics.creativity,
        overallPerformance: Object.values(simulationMetrics).reduce((a, b) => a + b, 0) / 4
      },
      totalScore: Math.floor(Object.values(simulationMetrics).reduce((a, b) => a + b, 0) / 4),
      completed: true,
      revolutionaryFeatures: true
    }

    onComplete(results)
  }

  if (!currentQ) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Assessment Complete!</h2>
          <p className="text-gray-300">Processing your revolutionary performance...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
      {/* Header */}
      <div className="bg-gray-800 bg-opacity-90 backdrop-blur-sm border-b border-purple-500/20 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center text-gray-300 hover:text-purple-400 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Exit Simulation
          </button>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-cyan-400">
              <Timer className="h-5 w-5" />
              <span className={`font-mono text-lg ${timeRemaining < 300 ? 'text-red-400' : ''}`}>
                {formatTime(timeRemaining)}
              </span>
            </div>
            <div className="text-gray-400">
              Question {currentQuestion + 1} of {questions.length}
            </div>
          </div>
        </div>
      </div>

      {/* Plot Twist Alert */}
      <AnimatePresence>
        {activePlotTwist && (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg shadow-2xl p-4 border-2 border-yellow-400">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-6 w-6 animate-pulse" />
                <div>
                  <h3 className="font-bold">{activePlotTwist.title}</h3>
                  <p className="text-sm">{activePlotTwist.description}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Simulation Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Scenario Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 bg-opacity-90 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center">
                  <Gamepad2 className="h-6 w-6 mr-3 text-purple-400" />
                  {currentQ.scenario.title}
                </h1>
                <p className="text-gray-300 mt-2">{currentQ.scenario.description}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                currentQ.difficulty === 'expert' ? 'bg-red-600/20 text-red-300 border border-red-500/30' :
                currentQ.difficulty === 'hard' ? 'bg-orange-600/20 text-orange-300 border border-orange-500/30' :
                'bg-blue-600/20 text-blue-300 border border-blue-500/30'
              }`}>
                {currentQ.difficulty.toUpperCase()}
              </span>
            </div>

            {/* Victory Conditions */}
            <div className="mb-4">
              <button
                onClick={() => setShowVictoryConditions(!showVictoryConditions)}
                className="flex items-center text-green-400 hover:text-green-300 transition-colors"
              >
                <Trophy className="h-4 w-4 mr-2" />
                Victory Conditions
              </button>
              <AnimatePresence>
                {showVictoryConditions && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 bg-green-900/20 border border-green-500/30 rounded-lg p-3"
                  >
                    <ul className="text-green-300 text-sm space-y-1">
                      {currentQ.scenario.victoryConditions?.map((condition, index) => (
                        <li key={index} className="flex items-center">
                          <Target className="h-3 w-3 mr-2" />
                          {condition}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Response Area */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-300">
                🚨 Your Response:
              </label>
              <textarea
                value={responses[currentQuestion] || ''}
                onChange={(e) => handleResponseChange(e.target.value)}
                rows={8}
                className="w-full px-4 py-3 border border-purple-500/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-700 bg-opacity-50 text-white placeholder-gray-400"
                placeholder="Describe your approach to this revolutionary challenge. Think strategically, be creative, and adapt to any plot twists that may arise..."
              />
              
              {isPreview && (
                <p className="text-cyan-400 text-sm">
                  🎮 Preview Mode: In the real assessment, this simulation would be fully interactive with real-time metrics and plot twists!
                </p>
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
                className="flex items-center px-4 py-2 text-gray-400 hover:text-purple-400 transition-colors disabled:opacity-50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous Challenge
              </button>

              <button
                onClick={handleNext}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors"
              >
                {currentQuestion < questions.length - 1 ? (
                  <>
                    Next Challenge
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                ) : (
                  <>
                    Complete Mission
                    <CheckCircle className="h-4 w-4 ml-2" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Arsenal */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-800 bg-opacity-90 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Wrench className="h-5 w-5 mr-2 text-yellow-400" />
              🛠️ Your Arsenal
            </h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              {currentQ.scenario.arsenal?.map((tool, index) => (
                <li key={index} className="flex items-center">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></div>
                  {tool}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Real-time Metrics */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800 bg-opacity-90 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Cpu className="h-5 w-5 mr-2 text-cyan-400" />
              Live Metrics
            </h3>
            <div className="space-y-4">
              {Object.entries(simulationMetrics).map(([key, value]) => (
                <div key={key}>
                  <div className="flex justify-between text-sm text-gray-300 mb-1">
                    <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <span>{value}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${value}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Skills Tested */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800 bg-opacity-90 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-green-400" />
              📚 Skills Tested
            </h3>
            <div className="flex flex-wrap gap-2">
              {currentQ.scenario.skillsTested?.map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-purple-600/20 text-purple-300 rounded-full text-xs border border-purple-500/30"
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Plot Twist History */}
          {plotTwistHistory.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-800 bg-opacity-90 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-orange-400" />
                Plot Twist History
              </h3>
              <div className="space-y-2">
                {plotTwistHistory.slice(-3).map((twist, index) => (
                  <div key={index} className="text-sm text-gray-300 bg-orange-900/20 border border-orange-500/30 rounded p-2">
                    <div className="font-medium text-orange-300">{twist.title}</div>
                    <div className="text-xs text-gray-400">
                      {new Date(twist.triggeredAt).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
