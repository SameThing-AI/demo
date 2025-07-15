'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Clock, CheckCircle, Save, ArrowRight, Zap, Brain } from 'lucide-react'
import { useAuth } from '@/contexts/NextAuthContext'
import { useDatabaseData } from '@/contexts/DatabaseDataContext'
import DynamicComponentRenderer from './DynamicComponentRenderer'

interface InteractiveAssessmentProps {
  assessmentData: any
  onBack: () => void
  onComplete: (results: any) => void
}

export default function InteractiveAssessment({ assessmentData, onBack, onComplete }: InteractiveAssessmentProps) {
  const { user } = useAuth()
  const { createResponse } = useDatabaseData()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, any>>({})
  const [timeRemaining, setTimeRemaining] = useState(assessmentData.timeLimit ? assessmentData.timeLimit * 60 : 3600)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [interactionData, setInteractionData] = useState<Record<number, any>>({})

  // Timer effect
  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else {
      handleSubmit()
    }
  }, [timeRemaining])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswerChange = (questionIndex: number, answer: any, metadata?: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }))
    
    if (metadata) {
      setInteractionData(prev => ({
        ...prev,
        [questionIndex]: metadata
      }))
    }
  }

  const handleNext = () => {
    if (currentQuestion < assessmentData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      // Enhanced evaluation for interactive assessments
      const results = await evaluateInteractiveAssessment()
      
      // Save response to data store
      const candidateResponse = {
        id: Date.now().toString(),
        assessmentId: assessmentData.id || Date.now().toString(),
        candidateId: user?.id || '',
        candidateName: user?.name || '',
        candidateEmail: user?.email || '',
        score: results.percentage || 0,
        completedAt: new Date().toISOString(),
        status: 'completed' as const,
        answers: Object.entries(answers).map(([questionIndex, answer]) => ({
          questionId: questionIndex,
          answer: typeof answer === 'object' ? JSON.stringify(answer) : answer,
          score: results.questionScores?.[parseInt(questionIndex)]?.score || 0,
          interactionData: interactionData[parseInt(questionIndex)]
        })),
        feedback: results.breakdown || {},
        interactionSummary: interactionData,
        assessmentType: 'interactive'
      }
      
      await createResponse(candidateResponse)
      onComplete(results)
    } catch (error) {
      console.error('Error evaluating interactive assessment:', error)
      const fallbackResults = generateFallbackResults()
      
      const candidateResponse = {
        id: Date.now().toString(),
        assessmentId: assessmentData.id || Date.now().toString(),
        candidateId: user?.id || '',
        candidateName: user?.name || '',
        candidateEmail: user?.email || '',
        score: fallbackResults.percentage || 0,
        completedAt: new Date().toISOString(),
        status: 'completed' as const,
        answers: Object.entries(answers).map(([questionIndex, answer]) => ({
          questionId: questionIndex,
          answer: typeof answer === 'object' ? JSON.stringify(answer) : answer,
          score: fallbackResults.questionScores?.[parseInt(questionIndex)]?.score || 0
        })),
        feedback: fallbackResults.breakdown || {},
        assessmentType: 'interactive'
      }
      
      await createResponse(candidateResponse)
      onComplete(fallbackResults)
    } finally {
      setIsSubmitting(false)
    }
  }

  const evaluateInteractiveAssessment = async () => {
    // This would call an enhanced API that understands interactive elements
    // For now, return enhanced mock results
    return {
      totalScore: 85,
      maxScore: 100,
      percentage: 85,
      passed: true,
      timeSpent: (assessmentData.timeLimit * 60) - timeRemaining,
      breakdown: {
        problemSolving: { score: 34, max: 40, percentage: 85 },
        creativity: { score: 26, max: 30, percentage: 87 },
        interactionQuality: { score: 17, max: 20, percentage: 85 },
        decisionMaking: { score: 8, max: 10, percentage: 80 }
      },
      questionScores: assessmentData.questions.map((q: any, i: number) => ({
        question: q.question,
        answer: answers[i] || '',
        score: Math.floor(Math.random() * 3) + 8, // Higher scores for interactive
        feedback: 'Excellent engagement with interactive elements and creative problem-solving.',
        interactionScore: interactionData[i] ? 95 : 70
      })),
      interactiveMetrics: {
        engagementLevel: 'High',
        creativityIndex: 87,
        problemSolvingApproach: 'Systematic',
        adaptabilityScore: 92
      }
    }
  }

  const generateFallbackResults = () => {
    return {
      totalScore: 75,
      maxScore: 100,
      percentage: 75,
      passed: true,
      timeSpent: (assessmentData.timeLimit * 60) - timeRemaining,
      breakdown: {
        problemSolving: { score: 30, max: 40, percentage: 75 },
        creativity: { score: 23, max: 30, percentage: 77 },
        interactionQuality: { score: 15, max: 20, percentage: 75 },
        decisionMaking: { score: 7, max: 10, percentage: 70 }
      },
      questionScores: assessmentData.questions.map((q: any, i: number) => ({
        question: q.question,
        answer: answers[i] || '',
        score: Math.floor(Math.random() * 3) + 7,
        feedback: 'Good understanding demonstrated with interactive elements.'
      }))
    }
  }

  const progress = ((currentQuestion + 1) / assessmentData.questions.length) * 100
  const currentQ = assessmentData.questions[currentQuestion]

  if (!currentQ) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-12 w-12 text-purple-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Interactive Assessment...</h2>
          <p className="text-gray-600">Preparing your personalized experience</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-t-4 border-gradient-to-r from-purple-500 to-blue-500">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <button
                onClick={onBack}
                className="flex items-center text-gray-600 hover:text-purple-600 transition-colors mr-6"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </button>
              <div>
                <div className="flex items-center mb-1">
                  <Zap className="h-5 w-5 text-purple-600 mr-2" />
                  <h1 className="text-xl font-bold text-gray-900">
                    {assessmentData.title || `${assessmentData.jobTitle} Interactive Assessment`}
                  </h1>
                </div>
                <p className="text-gray-600">{assessmentData.company}</p>
                {assessmentData.isCreative && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mt-1">
                    <Brain className="h-3 w-3 mr-1" />
                    AI-Powered Experience
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-gray-600">
                <Clock className="h-5 w-5 mr-2" />
                <span className={`font-mono text-lg ${timeRemaining < 300 ? 'text-red-600' : 'text-purple-600'}`}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                Challenge {currentQuestion + 1} of {assessmentData.questions.length}
              </div>
            </div>
          </div>
          
          {/* Enhanced Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full transition-all duration-500 relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-0 w-3 h-3 bg-white rounded-full shadow-md"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Question */}
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <div className="mb-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {currentQ.componentType === 'interactive' ? 'Interactive Challenge' : 'Question'} {currentQuestion + 1}
              </h2>
              <div className="flex space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  currentQ.type === 'interactive' ? 'bg-purple-100 text-purple-800' :
                  currentQ.type === 'scenario' ? 'bg-blue-100 text-blue-800' :
                  currentQ.type === 'simulation' ? 'bg-green-100 text-green-800' :
                  'bg-indigo-100 text-indigo-800'
                }`}>
                  {currentQ.type}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  currentQ.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                  currentQ.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {currentQ.difficulty}
                </span>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">Category: {currentQ.category}</p>
            
            <div className="prose max-w-none mb-6">
              <p className="text-gray-800 text-lg leading-relaxed">
                {currentQ.question}
              </p>
            </div>

            {/* Render Interactive Component */}
            {currentQ.componentType && renderInteractiveComponent(currentQ, currentQuestion)}
          </div>

          {/* Answer Input - Traditional fallback */}
          {!currentQ.componentType && (
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Response:
              </label>
              <textarea
                value={answers[currentQuestion] || ''}
                onChange={(e) => handleAnswerChange(currentQuestion, e.target.value)}
                rows={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                placeholder="Provide your detailed response..."
              />
              <p className="text-sm text-gray-500 mt-2">
                💡 Think creatively and provide specific examples where applicable.
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center pt-6 border-t">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </button>

            <div className="flex space-x-3">
              <button
                onClick={() => {/* Save current state */}}
                className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Progress
              </button>
              
              {currentQuestion < assessmentData.questions.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="flex items-center px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors"
                >
                  Next Challenge
                  <ArrowRight className="h-4 w-4 ml-2" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Evaluating...' : 'Complete Assessment'}
                  <CheckCircle className="h-4 w-4 ml-2" />
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Progress Overview */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Challenge Progress</h3>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
            {assessmentData.questions.map((_: any, index: number) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center text-sm font-medium transition-colors ${
                  index === currentQuestion
                    ? 'border-purple-500 bg-purple-100 text-purple-700'
                    : answers[index]
                    ? 'border-green-500 bg-green-100 text-green-700'
                    : 'border-gray-300 bg-white text-gray-500 hover:border-purple-300'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  function renderInteractiveComponent(question: any, questionIndex: number) {
    // Handle dynamic components
    if (question.componentType === 'dynamic' && question.componentCode) {
      return (
        <DynamicComponentRenderer
          componentCode={question.componentCode}
          question={question}
          onInteraction={(data: any) => handleAnswerChange(questionIndex, data, { 
            type: 'dynamic', 
            timestamp: Date.now(),
            metadata: question.metadata 
          })}
        />
      )
    }
    
    // Handle static interactive components
    const componentType = question.componentType
    
    switch (componentType) {
      case 'SystemDashboard':
        return <SystemDashboardComponent question={question} onInteraction={(data: any) => handleAnswerChange(questionIndex, data, { type: 'dashboard', timestamp: Date.now() })} />
      case 'CodeDebugger':
        return <CodeDebuggerComponent question={question} onInteraction={(data: any) => handleAnswerChange(questionIndex, data, { type: 'coding', timestamp: Date.now() })} />
      case 'StakeholderChat':
        return <StakeholderChatComponent question={question} onInteraction={(data: any) => handleAnswerChange(questionIndex, data, { type: 'communication', timestamp: Date.now() })} />
      default:
        return <EnhancedTextInput question={question} onInteraction={(data: any) => handleAnswerChange(questionIndex, data)} />
    }
  }
}

// Interactive Component Examples (Phase 1 implementations)
function SystemDashboardComponent({ question, onInteraction }: any) {
  const [metrics, setMetrics] = useState({
    cpu: Math.random() * 100,
    memory: Math.random() * 100,
    errorRate: Math.random() * 10,
    responseTime: Math.random() * 1000
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        cpu: Math.max(0, Math.min(100, prev.cpu + (Math.random() - 0.5) * 20)),
        memory: Math.max(0, Math.min(100, prev.memory + (Math.random() - 0.5) * 15)),
        errorRate: Math.max(0, prev.errorRate + (Math.random() - 0.5) * 2),
        responseTime: Math.max(0, prev.responseTime + (Math.random() - 0.5) * 200)
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-gray-900 rounded-lg p-6 text-white">
      <h3 className="text-lg font-semibold mb-4 text-green-400">🖥️ System Dashboard</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800 p-4 rounded">
          <div className="text-sm text-gray-300">CPU Usage</div>
          <div className={`text-2xl font-bold ${metrics.cpu > 80 ? 'text-red-400' : 'text-green-400'}`}>
            {metrics.cpu.toFixed(1)}%
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded">
          <div className="text-sm text-gray-300">Memory</div>
          <div className={`text-2xl font-bold ${metrics.memory > 85 ? 'text-red-400' : 'text-blue-400'}`}>
            {metrics.memory.toFixed(1)}%
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded">
          <div className="text-sm text-gray-300">Error Rate</div>
          <div className={`text-2xl font-bold ${metrics.errorRate > 5 ? 'text-red-400' : 'text-yellow-400'}`}>
            {metrics.errorRate.toFixed(2)}/min
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded">
          <div className="text-sm text-gray-300">Response Time</div>
          <div className={`text-2xl font-bold ${metrics.responseTime > 500 ? 'text-red-400' : 'text-green-400'}`}>
            {metrics.responseTime.toFixed(0)}ms
          </div>
        </div>
      </div>
      <div className="mt-4">
        <textarea
          placeholder="Describe what you observe and your diagnosis..."
          className="w-full p-3 bg-gray-800 text-white rounded border border-gray-600"
          rows={3}
          onChange={(e) => onInteraction({ diagnosis: e.target.value, metrics })}
        />
      </div>
    </div>
  )
}

function CodeDebuggerComponent({ question, onInteraction }: any) {
  const [code, setCode] = useState(question.componentProps?.buggyCode || 'function example() {\n  // Fix the bug here\n  return undefined;\n}')
  
  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4 text-green-400">🐛 Code Debugger</h3>
      <div className="bg-gray-800 p-4 rounded mb-4">
        <div className="text-sm text-gray-300 mb-2">Buggy Code:</div>
        <pre className="text-green-400 font-mono text-sm overflow-x-auto">{question.componentProps?.buggyCode}</pre>
      </div>
      <textarea
        value={code}
        onChange={(e) => {
          setCode(e.target.value)
          onInteraction({ originalCode: question.componentProps?.buggyCode, fixedCode: e.target.value })
        }}
        className="w-full p-3 bg-gray-800 text-green-400 font-mono rounded border border-gray-600"
        rows={6}
        placeholder="Write your fixed code here..."
      />
    </div>
  )
}

function StakeholderChatComponent({ question, onInteraction }: any) {
  const [messages, setMessages] = useState([
    { from: 'CTO', message: 'We have a critical issue! The system is down and customers are complaining.', time: '2 min ago' },
    { from: 'Product Manager', message: 'How long until we can get this fixed? We have a demo with a major client in 30 minutes!', time: '1 min ago' }
  ])
  const [response, setResponse] = useState('')

  const sendMessage = () => {
    if (response.trim()) {
      const newMessage = { from: 'You', message: response, time: 'just now' }
      setMessages(prev => [...prev, newMessage])
      onInteraction({ messages: [...messages, newMessage], latestResponse: response })
      setResponse('')
    }
  }

  return (
    <div className="bg-blue-50 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4 text-blue-800">💬 Stakeholder Communication</h3>
      <div className="bg-white rounded border h-48 overflow-y-auto mb-4 p-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`mb-3 ${msg.from === 'You' ? 'text-right' : ''}`}>
            <div className={`inline-block p-2 rounded-lg max-w-xs ${
              msg.from === 'You' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}>
              <div className="font-semibold text-xs">{msg.from}</div>
              <div>{msg.message}</div>
              <div className="text-xs opacity-70">{msg.time}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex space-x-2">
        <input
          type="text"
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          placeholder="Type your response..."
          className="flex-1 p-2 border rounded"
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage} className="px-4 py-2 bg-blue-500 text-white rounded">Send</button>
      </div>
    </div>
  )
}

function EnhancedTextInput({ question, onInteraction }: any) {
  return (
    <div className="mb-8">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Your Response:
      </label>
      <textarea
        onChange={(e) => onInteraction(e.target.value)}
        rows={8}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
        placeholder="Provide your detailed response..."
      />
    </div>
  )
}
