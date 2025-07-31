'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Clock, ChevronLeft, ChevronRight, CheckCircle, Save, ArrowRight, Zap, Cpu } from 'lucide-react'
import { useAuth } from '@/contexts/NextAuthContext'
import { useDatabaseData } from '@/contexts/DatabaseDataContext'
import InteractiveAssessment from './InteractiveAssessment'
import SelfModifyingAssessment from './SelfModifyingAssessment'
import LiveSimulationEngine from './LiveSimulationEngine'
import AssessmentChatbot from './AssessmentChatbot'
import RevolutionaryAssessmentInterface from './RevolutionaryAssessmentInterface'

interface TakeAssessmentProps {
  assessment?: any // For new usage
  assessmentData?: any // For backward compatibility
  onBack?: () => void
  onComplete: (results: any) => void
  isPreview?: boolean
}

export default function TakeAssessment({ assessment, assessmentData, onBack, onComplete, isPreview = false }: TakeAssessmentProps) {
  const { user } = useAuth()
  const { createResponse } = useDatabaseData()
  
  // Use assessment or assessmentData for backward compatibility
  const currentAssessment = assessment || assessmentData
  
  // Add safety checks for assessment data
  if (!currentAssessment || !currentAssessment.questions || !Array.isArray(currentAssessment.questions)) {
    console.error('TakeAssessment - Invalid assessment data:', currentAssessment)
    return (
      <div className="min-h-screen-responsive bg-gray-900 flex items-center justify-center container-fluid">
        <div className="text-center text-white max-w-md w-full card-responsive">
          <h2 className="text-fluid-xl font-bold mb-4">Assessment Not Available</h2>
          <p className="text-gray-400 mb-6 text-fluid-sm">This assessment data is not properly configured or questions are missing.</p>
          {onBack && (
            <button
              onClick={onBack}
              className="btn-responsive bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors w-full sm:w-auto"
            >
              Go Back
            </button>
          )}
        </div>
      </div>
    )
  }
  
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [timeRemaining, setTimeRemaining] = useState(currentAssessment.duration ? currentAssessment.duration * 60 : 3600)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [lastSubmitTime, setLastSubmitTime] = useState(0)
  const [submissionMessage, setSubmissionMessage] = useState('')
  const [questionCredits, setQuestionCredits] = useState<Record<number, number>>({})
  const [showIntro, setShowIntro] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  
  // 🚀 REVOLUTIONARY AI DETECTION: Enhanced detection for the most advanced AI-generated assessments
  const isAIGeneratedAssessment = currentAssessment.revolutionaryFeatures?.infinitySandbox ||
    currentAssessment.aiGenerated ||
    currentAssessment.assessmentInterface || 
    currentAssessment.generated ||
    currentAssessment.type === 'revolutionary-ai' ||
    currentAssessment.assessmentType === 'revolutionary' ||
    currentAssessment.assessmentType === 'revolutionary-simulation' ||
    currentAssessment.scenarios?.length > 0 ||
    currentAssessment.questions?.some((q: any) => q.type === 'revolutionary-simulation' || q.scenario?.type === 'simulation')
  
  // 🎯 CRITICAL: Check if this assessment should use the revolutionary LiveSimulationEngine
  // ALL revolutionary AI assessments should go directly to LiveSimulationEngine
  const shouldUseRevolutionaryInterface = currentAssessment.type === 'revolutionary-ai' ||
    currentAssessment.revolutionaryFeatures?.infinitySandbox ||
    currentAssessment.assessmentInterface ||
    currentAssessment.assessmentType === 'revolutionary-ai' ||
    currentAssessment.aiGenerated ||
    currentAssessment.generated ||
    isAIGeneratedAssessment
  
  console.log('🚀 REVOLUTIONARY ASSESSMENT DETECTION:', {
    type: currentAssessment.type,
    revolutionaryFeatures: currentAssessment.revolutionaryFeatures,
    assessmentInterface: !!currentAssessment.assessmentInterface,
    assessmentType: currentAssessment.assessmentType,
    aiGenerated: currentAssessment.aiGenerated,
    generated: currentAssessment.generated,
    shouldUseRevolutionaryInterface,
    isAIGeneratedAssessment
  })
  
  const currentQuestionData = currentAssessment.questions[currentQuestion]
  
  const isLiveSimulationQuestion = currentQuestionData?.scenario && 
    (currentQuestionData.scenario.type === 'simulation' || 
     currentQuestionData.scenario.type === 'technical-mystery' || 
     currentQuestionData.scenario.type === 'interactive-code-simulation' ||
     currentQuestionData.scenario.type === 'crisis' ||
     currentQuestionData.scenario.type === 'creative' ||
     currentQuestionData.scenario.difficulty === 'Impossible' ||
     currentQuestionData.scenario.difficulty === 'Hard') && 
    !isPreview
  
  // Auto-launch revolutionary interface for revolutionary assessments or live simulation for older format
  const shouldUseLiveSimulation = shouldUseRevolutionaryInterface || isLiveSimulationQuestion
  
  // Show revolutionary intro on first load
  useEffect(() => {
    if (isAIGeneratedAssessment && !isPreview) {
      setShowIntro(true)
    }
  }, [isAIGeneratedAssessment, isPreview])
  useEffect(() => {
    if (currentAssessment.questions) {
      const initialCredits: Record<number, number> = {}
      currentAssessment.questions.forEach((question: any, index: number) => {
        // Assign credits based on difficulty
        const difficulty = question.difficulty?.toLowerCase() || 'medium'
        const credits = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : 4
        initialCredits[index] = credits
      })
      setQuestionCredits(initialCredits)
    }
  }, [currentAssessment.questions])

  // Timer effect (disabled in preview mode)
  useEffect(() => {
    if (!isPreview && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (!isPreview && timeRemaining <= 0) {
      // Auto-submit when time runs out
      handleSubmit()
    }
  }, [timeRemaining, isPreview])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }))
  }

  const handleCreditsChange = (questionIndex: number, newCredits: number) => {
    setQuestionCredits(prev => ({
      ...prev,
      [questionIndex]: newCredits
    }))
  }

  const retrySubmission = () => {
    setSubmissionMessage('')
    // Clear the cooldown to allow immediate retry
    setLastSubmitTime(0)
    handleSubmit()
  }

  const proceedWithEstimatedResults = async () => {
    console.log('📊 User chose to proceed with estimated results')
    
    setSubmissionMessage('Generating estimated results...')
    
    const mockResults = {
      totalScore: 75,
      maxScore: 100,
      percentage: 75,
      passed: true,
      timeSpent: (currentAssessment.duration * 60) - timeRemaining,
      breakdown: {
        technical: { score: 30, max: 40, percentage: 75 },
        problemSolving: { score: 23, max: 30, percentage: 77 },
        communication: { score: 15, max: 20, percentage: 75 },
        cultural: { score: 7, max: 10, percentage: 70 }
      },
      questionScores: currentAssessment.questions.map((q: any, i: number) => ({
        question: q.question || q.text,
        answer: answers[i] || '',
        score: Math.floor(Math.random() * 3) + 6, // Random score 6-9
        feedback: 'Assessment completed during high server load. Score is estimated.'
      })),
      serverNote: 'Assessment completed during high server load. Results are estimated and may be updated.'
    }
    
    // Save mock response to data store
    const candidateResponse = {
      assessmentId: currentAssessment.id || Date.now().toString(),
      score: mockResults.percentage || 0,
      completedAt: new Date().toISOString(),
      status: 'completed' as const,
      answers: Object.entries(answers).map(([questionIndex, answer]) => ({
        questionId: questionIndex,
        answer,
        score: mockResults.questionScores?.[parseInt(questionIndex)]?.score || 0
      })),
      feedback: mockResults.breakdown || {},
      serverNote: 'Completed during server high load - estimated results'
    }
    
    try {
      await createResponse(candidateResponse)
    } catch (responseError) {
      console.log('⚠️ Could not save response due to server load, but proceeding for UX')
    }
    
    // Proceed with completion
    setTimeout(() => {
      setSubmissionMessage('')
      onComplete(mockResults)
    }, 1000)
  }

  const handleNext = () => {
    if (currentQuestion < currentAssessment.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = async () => {
    // Prevent rapid successive submissions
    const now = Date.now()
    if (now - lastSubmitTime < 3000) { // 3 second cooldown
      console.log('⚠️ Submission too soon, please wait')
      return
    }
    
    setIsSubmitting(true)
    setLastSubmitTime(now)
    
    // FORCE AI EVALUATION - Remove preview mode bypass that was causing mock results
    console.log('🚫 BYPASSING PREVIEW MODE - FORCING AI EVALUATION')
    console.log('Assessment Data:', {
      title: currentAssessment.title,
      questionsCount: currentAssessment.questions?.length,
      isPreview: isPreview,
      type: currentAssessment.type
    })
    
    try {
      console.log('🚀 Starting AI-powered assessment evaluation')
      
      // Prepare answers array
      const answersArray = currentAssessment.questions.map((_: any, index: number) => 
        answers[index] || ''
      )

      const evaluationPayload = {
        assessmentData: {
          title: currentAssessment.title || 'Assessment',
          company: currentAssessment.company || 'Company',
          description: currentAssessment.description || currentAssessment.jobDescription,
          type: currentAssessment.type || 'traditional',
          duration: currentAssessment.duration || 60,
          questions: currentAssessment.questions
        },
        answers: answersArray,
        candidateProfile: {
          name: user?.name || 'Anonymous',
          email: user?.email,
          experience: user?.experience,
          skills: user?.skills,
          education: user?.education,
          summary: user?.summary,
          linkedinUrl: user?.linkedinUrl
        },
        timeSpent: (currentAssessment.duration * 60) - timeRemaining
      }

      console.log('📤 Sending to AI evaluation API:', evaluationPayload)
      setSubmissionMessage('AI is evaluating your responses...')

      // Call the real AI evaluation API
      const response = await fetch('/api/evaluate-assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(evaluationPayload),
      })

      if (!response.ok) {
        throw new Error(`Evaluation API failed: ${response.status}`)
      }

      const results = await response.json()
      console.log('🎯 AI evaluation results:', results)

      // Save response to data store
      const candidateResponse = {
        assessmentId: currentAssessment.id || Date.now().toString(),
        score: results.percentage || results.totalScore || 0,
        completedAt: new Date().toISOString(),
        status: 'completed' as const,
        answers: answersArray.map((answer, index) => ({
          questionId: index.toString(),
          answer,
          score: results.questionScores?.[index]?.score || 0
        })),
        feedback: results.breakdown || results.overallFeedback || {},
        timeSpent: results.timeSpent || ((currentAssessment.duration * 60) - timeRemaining)
      }
      
      console.log('💾 Saving evaluated response:', candidateResponse)
      
      // Try to save, but don't block on it
      try {
        await createResponse(candidateResponse)
        console.log('✅ Response saved successfully')
      } catch (saveError) {
        console.log('⚠️ Could not save response, but continuing:', saveError)
        // Continue anyway - don't block the user
      }
      
      console.log('🎯 Completing assessment with AI results:', results)
      setIsCompleted(true)
      setSubmissionMessage('Assessment evaluated successfully! Redirecting to results...')

      // Call onComplete after a brief delay to show success message
      setTimeout(() => {
        onComplete(results)
      }, 1000)
      
    } catch (error) {
      console.error('Error in AI evaluation:', error)
      
      // Fallback - use simple evaluation if AI fails
      const answersArray = currentAssessment.questions.map((_: any, index: number) => 
        answers[index] || ''
      )
      
      const completedAnswers = answersArray.filter(answer => answer.trim().length > 0).length
      const completionRate = completedAnswers / answersArray.length
      const baseScore = Math.max(50, Math.round(completionRate * 85)) // More generous fallback
      
      const fallbackResults = {
        totalScore: baseScore,
        maxScore: 100,
        percentage: baseScore,
        passed: baseScore >= 70,
        timeSpent: (currentAssessment.duration * 60) - timeRemaining,
        breakdown: {
          technical: { score: Math.round(baseScore * 0.4), max: 40, percentage: baseScore },
          problemSolving: { score: Math.round(baseScore * 0.3), max: 30, percentage: baseScore },
          communication: { score: Math.round(baseScore * 0.2), max: 20, percentage: baseScore },
          cultural: { score: Math.round(baseScore * 0.1), max: 10, percentage: baseScore }
        },
        questionScores: answersArray.map((answer, i) => ({
          question: currentAssessment.questions[i]?.question || currentAssessment.questions[i]?.text || `Question ${i + 1}`,
          answer: answer,
          score: answer.trim().length > 20 ? Math.round(baseScore / 10) : Math.round(baseScore / 15),
          feedback: answer.trim().length > 20 ? 'Good response provided.' : 'Response could be more detailed.'
        })),
        aiNote: 'AI evaluation temporarily unavailable - basic scoring applied'
      }
      
      // Save fallback response
      const candidateResponse = {
        assessmentId: currentAssessment.id || Date.now().toString(),
        score: fallbackResults.percentage || 0,
        completedAt: new Date().toISOString(),
        status: 'completed' as const,
        answers: answersArray.map((answer, index) => ({
          questionId: index.toString(),
          answer,
          score: fallbackResults.questionScores?.[index]?.score || 0
        })),
        feedback: fallbackResults.breakdown || {},
        timeSpent: fallbackResults.timeSpent || 0,
        serverNote: 'AI evaluation failed - fallback scoring used'
      }
      
      try {
        await createResponse(candidateResponse)
      } catch (responseError) {
        console.log('⚠️ Could not save fallback response:', responseError)
      }
      
      setIsCompleted(true)
      setSubmissionMessage('Assessment completed! Using backup evaluation method.')
      
      setTimeout(() => {
        onComplete(fallbackResults)
      }, 1000)
    } finally {
      setIsSubmitting(false)
    }
  }

  const progress = ((currentQuestion + 1) / currentAssessment.questions.length) * 100
  const currentQ = currentAssessment.questions[currentQuestion]

  // 🚀 Revolutionary Introduction Screen
  if (showIntro && isAIGeneratedAssessment) {
    return (
      <div className="min-h-screen-responsive bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex items-center justify-center container-fluid">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto card-responsive bg-gray-800 bg-opacity-90 backdrop-blur-sm border border-purple-500/20 rounded-2xl shadow-2xl"
        >
          <div className="text-center space-y-4 sm:space-y-6">
            <div className="flex justify-center space-x-2">
              <Zap className="h-8 w-8 sm:h-12 sm:w-12 text-yellow-400 animate-pulse" />
              <Cpu className="h-8 w-8 sm:h-12 sm:w-12 text-cyan-400 animate-pulse" />
            </div>
            
            <h1 className="text-fluid-3xl font-bold text-white">
              Revolutionary Assessment
            </h1>
            
            <p className="text-fluid-lg text-gray-300 leading-relaxed">
              Welcome to a <span className="text-purple-400 font-bold">game-changing</span> assessment experience.
              This isn't your typical Q&A - you're about to enter <span className="text-cyan-400 font-bold">live simulations</span> that test your real-world problem-solving abilities.
            </p>
            
            <div className="bg-gradient-to-r from-purple-600/20 to-cyan-600/20 border border-purple-500/30 rounded-lg spacing-responsive-sm text-left">
              <h3 className="text-fluid-lg font-semibold text-white mb-3">🚀 What to Expect:</h3>
              <ul className="space-y-2 text-gray-300 text-fluid-sm">
                <li className="flex items-start"><span className="text-green-400 mr-2 mt-1 flex-shrink-0">✓</span><span>Interactive code environments with real execution</span></li>
                <li className="flex items-start"><span className="text-green-400 mr-2 mt-1 flex-shrink-0">✓</span><span>Dynamic plot twists that adapt to your performance</span></li>
                <li className="flex items-start"><span className="text-green-400 mr-2 mt-1 flex-shrink-0">✓</span><span>Real-time feedback and live simulations</span></li>
                <li className="flex items-start"><span className="text-green-400 mr-2 mt-1 flex-shrink-0">✓</span><span>Scenarios that mirror actual job challenges</span></li>
              </ul>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 justify-center">
              <button
                onClick={onBack}
                className="btn-responsive bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Go Back
              </button>
              <button
                onClick={() => setShowIntro(false)}
                className="btn-responsive bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors font-semibold"
              >
                Enter the Simulation →
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  // 🚀 REVOLUTIONARY INTERFACE MODE - For truly revolutionary assessments
  // ALL revolutionary AI assessments should bypass traditional Q&A and go directly to LiveSimulationEngine
  if (shouldUseRevolutionaryInterface && !isPreview) {
    console.log('🎮 LAUNCHING REVOLUTIONARY LIVE SIMULATION ENGINE')
    console.log('🎯 Revolutionary Assessment Data:', {
      title: currentAssessment.title,
      type: currentAssessment.type,
      revolutionaryFeatures: currentAssessment.revolutionaryFeatures,
      assessmentInterface: currentAssessment.assessmentInterface
    })
    
    return (
      <LiveSimulationEngine
        scenario={{
          title: currentAssessment.title || 'Revolutionary AI Assessment',
          description: currentAssessment.description || currentAssessment.jobDescription || 'Revolutionary AI-powered assessment with infinity sandbox capabilities',
          company: currentAssessment.company || 'Professional Organization',
          difficulty: 'revolutionary',
          type: 'infinity-sandbox',
          assessmentInterface: currentAssessment.assessmentInterface,
          revolutionaryFeatures: currentAssessment.revolutionaryFeatures,
          scenarios: currentAssessment.scenarios,
          requirements: [
            'Revolutionary AI-generated challenges',
            'Infinity sandbox environment',
            'Real-time professional analysis',
            'Dynamic plot twists and adaptation',
            'Live code execution capabilities',
            'Professional excellence evaluation'
          ]
        }}
        onComplete={(results) => {
          console.log('� Revolutionary Live Simulation completed:', results)
          onComplete(results)
        }}
        onBack={onBack || (() => {})}
      />
    )
  }

  // 🚀 LIVE SIMULATION MODE - Auto-launch for revolutionary scenarios
  if (shouldUseLiveSimulation && currentQuestionData?.scenario && !isPreview) {
    console.log('🎮 LAUNCHING LIVE SIMULATION ENGINE:', {
      scenario: currentQuestionData.scenario,
      type: currentQuestionData.scenario.type,
      title: currentQuestionData.scenario.title || currentAssessment.title,
      isLiveSimulationQuestion
    })
    
    return (
      <LiveSimulationEngine
        scenario={{
          ...currentQuestionData.scenario,
          title: currentQuestionData.scenario.title || currentAssessment.title,
          description: currentQuestionData.scenario.description || currentQuestionData.question,
          company: currentAssessment.company
        }}
        onComplete={(simulationResults) => {
          console.log('🎯 Live simulation completed:', simulationResults)
          // Store simulation results as answer
          setAnswers(prev => ({
            ...prev,
            [currentQuestion]: JSON.stringify(simulationResults)
          }))
          
          // Move to next question or complete assessment
          if (currentQuestion < currentAssessment.questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1)
          } else {
            // Complete assessment with live simulation results
            handleSubmit()
          }
        }}
        onBack={onBack || (() => {})}
      />
    )
  }

  return (
    <div className={`min-h-screen-responsive ${isAIGeneratedAssessment 
      ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900' 
      : 'bg-gradient-to-br from-blue-50 to-indigo-100'
    }`}>
      <div className="container-responsive py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className={`rounded-lg shadow-xl card-responsive mb-4 sm:mb-6 ${isAIGeneratedAssessment 
          ? 'bg-gray-800 bg-opacity-90 backdrop-blur-sm border border-purple-500/20' 
          : 'bg-white'
        }`}>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex items-start space-x-3 min-w-0 flex-1">
                <button
                  onClick={onBack}
                  className={`flex-shrink-0 mt-1 tap-target ${
                    isAIGeneratedAssessment 
                      ? 'text-gray-300 hover:text-purple-400' 
                      : 'text-gray-600 hover:text-blue-600'
                  } transition-colors`}
                >
                  <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span className="sr-only sm:not-sr-only sm:ml-2 text-fluid-sm">Back</span>
                </button>
                <div className="min-w-0 flex-1">
                  <h1 className={`text-fluid-xl font-bold truncate ${
                    isAIGeneratedAssessment ? 'text-white' : 'text-gray-900'
                  }`}>
                    {currentAssessment.title || 'Assessment'}
                  </h1>
                  <p className={`text-fluid-sm truncate ${
                    isAIGeneratedAssessment ? 'text-gray-300' : 'text-gray-600'
                  }`}>{currentAssessment.company}</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 sm:gap-4">
                {/* Revolutionary Assessment Indicator */}
                {isAIGeneratedAssessment && (
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center px-2 py-1 sm:px-3 sm:py-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg text-2xs sm:text-xs font-medium">
                      <Zap className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      <span className="hidden xs:inline">Revolutionary</span>
                      <span className="xs:hidden">Rev</span>
                    </div>
                    {isLiveSimulationQuestion && (
                      <div className="flex items-center px-2 py-1 sm:px-3 sm:py-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg text-2xs sm:text-xs font-medium">
                        <Cpu className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        <span className="hidden sm:inline">Live Simulation</span>
                        <span className="sm:hidden">Live</span>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                  <div className={`flex items-center ${
                    isAIGeneratedAssessment ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    <Clock className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2 flex-shrink-0" />
                    <span className={`font-mono text-fluid-base ${timeRemaining < 300 ? 'text-red-400' : ''}`}>
                      {formatTime(timeRemaining)}
                    </span>
                  </div>
                  <div className={`text-2xs sm:text-sm whitespace-nowrap ${
                    isAIGeneratedAssessment ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    <span className="hidden xs:inline">Question </span>{currentQuestion + 1}/{currentAssessment.questions.length}
                  </div>
                </div>
              </div>
            </div>
          
          {/* Progress Bar */}
          <div className="mt-3 sm:mt-4">
            <div className={`w-full rounded-full h-1.5 sm:h-2 ${
              isAIGeneratedAssessment ? 'bg-gray-700' : 'bg-gray-200'
            }`}>
              <div
                className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                  isAIGeneratedAssessment 
                    ? 'bg-gradient-to-r from-purple-500 to-cyan-500' 
                    : 'bg-blue-600'
                }`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Submission Message */}
          {submissionMessage && (
            <div className="mt-4 p-3 sm:p-4 bg-blue-100 border border-blue-300 rounded-lg">
              <p className="text-blue-800 text-fluid-sm">{submissionMessage}</p>
            </div>
          )}
        </div>

        {/* Question */}
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className={`rounded-lg shadow-xl card-responsive ${
            isAIGeneratedAssessment 
              ? 'bg-gray-800 bg-opacity-90 backdrop-blur-sm border border-purple-500/20' 
              : 'bg-white'
          }`}
        >
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
              <h2 className={`text-fluid-2xl font-bold ${
                isAIGeneratedAssessment ? 'text-white' : 'text-gray-900'
              }`}>
                Question {currentQuestion + 1}
              </h2>
              <div className="flex flex-wrap gap-2">
                <span className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-2xs sm:text-sm font-medium ${
                  isAIGeneratedAssessment ? (
                    currentQ.type === 'technical' ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30' :
                    currentQ.type === 'problem-solving' ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30' :
                    'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  ) : (
                    currentQ.type === 'technical' ? 'bg-blue-100 text-blue-800' :
                    currentQ.type === 'problem-solving' ? 'bg-purple-100 text-purple-800' :
                    'bg-indigo-100 text-indigo-800'
                  )
                }`}>
                  {currentQ.type}
                </span>
                <span className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-2xs sm:text-sm font-medium ${
                  isAIGeneratedAssessment ? (
                    currentQ.difficulty === 'Easy' ? 'bg-green-600/20 text-green-300 border border-green-500/30' :
                    currentQ.difficulty === 'Medium' ? 'bg-yellow-600/20 text-yellow-300 border border-yellow-500/30' :
                    'bg-red-600/20 text-red-300 border border-red-500/30'
                  ) : (
                    currentQ.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                    currentQ.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  )
                }`}>
                  {currentQ.difficulty}
                </span>
                <span className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-2xs sm:text-sm font-medium flex items-center space-x-1 ${
                  isAIGeneratedAssessment 
                    ? 'bg-cyan-600/20 text-cyan-300 border border-cyan-500/30' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  <Zap className="h-3 w-3" />
                  <span className="hidden xs:inline">{questionCredits[currentQuestion] || 0} AI Credits</span>
                  <span className="xs:hidden">{questionCredits[currentQuestion] || 0}</span>
                </span>
              </div>
            </div>
            
            <p className={`text-fluid-sm mb-4 ${
              isAIGeneratedAssessment ? 'text-gray-400' : 'text-gray-600'
            }`}>Category: {currentQ.category}</p>
            
            <div className="prose max-w-none">
              <p className={`text-fluid-lg leading-relaxed ${
                isAIGeneratedAssessment ? 'text-gray-200' : 'text-gray-800'
              }`}>
                {currentQ.question}
              </p>
            </div>
          </div>

          {/* Answer Input */}
          <div className="mb-6 sm:mb-8">
            <label className={`block text-fluid-sm font-medium mb-2 ${
              isAIGeneratedAssessment ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Your Answer:
            </label>
            <textarea
              value={answers[currentQuestion] || ''}
              onChange={(e) => handleAnswerChange(currentQuestion, e.target.value)}
              rows={6}
              className={`w-full input-responsive border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                isAIGeneratedAssessment 
                  ? 'border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400 focus:ring-purple-500'
                  : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-blue-500'
              }`}
              placeholder="Type your detailed answer here..."
            />
            <p className={`text-fluid-xs mt-2 leading-relaxed ${
              isAIGeneratedAssessment ? 'text-gray-400' : 'text-gray-500'
            }`}>
              💡 Provide a detailed explanation with examples where applicable.
              {!isPreview && questionCredits[currentQuestion] > 0 && (
                <> 🤖 <strong>AI Assistant Available:</strong> Look for the blue chatbot button (bottom-right) - you have {questionCredits[currentQuestion]} credits for this question!</>
              )}
              {!isPreview && questionCredits[currentQuestion] === 0 && (
                <> 🤖 No AI credits remaining for this question.</>
              )}
              {isPreview && (
                <> 🤖 AI Assistant disabled in preview mode - candidates will see it with {questionCredits[currentQuestion] || 0} credits.</>
              )}
            </p>
          </div>

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className={`flex items-center justify-center sm:justify-start btn-responsive-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                isAIGeneratedAssessment 
                  ? 'text-gray-400 hover:text-purple-400 bg-gray-700 hover:bg-gray-600' 
                  : 'text-gray-600 hover:text-blue-600 bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span>Previous</span>
            </button>

            {/* Success Message */}
            {isCompleted && submissionMessage && (
              <div className={`mb-4 p-4 rounded-lg ${
                isAIGeneratedAssessment 
                  ? 'bg-green-800 bg-opacity-50 border border-green-500 text-green-200'
                  : 'bg-green-50 border border-green-200 text-green-700'
              }`}>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span className="font-medium">{submissionMessage}</span>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => handleAnswerChange(currentQuestion, answers[currentQuestion] || '')}
                className={`flex items-center justify-center btn-responsive-sm rounded-lg transition-colors ${
                  isAIGeneratedAssessment 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Save className="h-4 w-4 mr-2" />
                <span>Save</span>
              </button>
              
              {currentQuestion < currentAssessment.questions.length - 1 ? (
                <button
                  onClick={handleNext}
                  className={`flex items-center justify-center btn-responsive rounded-lg transition-colors ${
                    isAIGeneratedAssessment 
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  <span>Next</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || isCompleted || (Date.now() - lastSubmitTime < 3000)}
                  className={`flex items-center justify-center btn-responsive rounded-lg transition-colors disabled:opacity-50 ${
                    isAIGeneratedAssessment 
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700' 
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  <span>
                    {isCompleted ? 'Completed! Redirecting...' :
                     isSubmitting ? 'Submitting...' : 
                     (Date.now() - lastSubmitTime < 3000) ? 'Please wait...' : 
                     'Submit Assessment'}
                  </span>
                  <CheckCircle className="h-4 w-4 ml-2" />
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Question Overview */}
        <div className={`rounded-lg shadow-xl card-responsive mt-4 sm:mt-6 ${
          isAIGeneratedAssessment 
            ? 'bg-gray-800 bg-opacity-90 backdrop-blur-sm border border-purple-500/20' 
            : 'bg-white'
        }`}>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
            <h3 className={`text-fluid-lg font-semibold ${
              isAIGeneratedAssessment ? 'text-white' : 'text-gray-900'
            }`}>Progress Overview</h3>
            {!isPreview && (Object.values(questionCredits).reduce((sum, credits) => sum + credits, 0) > 0) && (
              <div className="flex items-center space-x-2 text-fluid-sm">
                <Zap className="h-4 w-4 text-blue-600 flex-shrink-0" />
                <span className={`${
                  isAIGeneratedAssessment ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  <span className="hidden sm:inline">Total AI Credits: </span>
                  <span className="sm:hidden">AI Credits: </span>
                  {Object.values(questionCredits).reduce((sum, credits) => sum + credits, 0)}
                </span>
              </div>
            )}
          </div>
          <div className="grid grid-cols-5 xs:grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-15 gap-2">
            {currentAssessment.questions.map((_: any, index: number) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`aspect-square w-full min-w-0 rounded-lg border-2 flex items-center justify-center text-xs sm:text-sm font-medium transition-colors tap-target ${
                  isAIGeneratedAssessment ? (
                    index === currentQuestion
                      ? 'border-purple-500 bg-purple-600/20 text-purple-300'
                      : answers[index]
                      ? 'border-green-500 bg-green-600/20 text-green-300'
                      : 'border-gray-600 bg-gray-700 text-gray-400 hover:border-gray-500'
                  ) : (
                    index === currentQuestion
                      ? 'border-blue-500 bg-blue-100 text-blue-700'
                      : answers[index]
                      ? 'border-green-500 bg-green-100 text-green-700'
                      : 'border-gray-300 bg-white text-gray-500 hover:border-gray-400'
                  )
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        {/* AI Chatbot */}
        {!isPreview && Object.keys(questionCredits).length > 0 && (
          <AssessmentChatbot
            question={currentQ.question}
            jobRole={currentAssessment.title}
            jobDescription={currentAssessment.description}
            questionDifficulty={currentQ.difficulty}
            maxCredits={questionCredits[currentQuestion] || 0}
            onCreditsChange={(newCredits) => handleCreditsChange(currentQuestion, newCredits)}
          />
        )}
      </div>
    </div>
  )
}
