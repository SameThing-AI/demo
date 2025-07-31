'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, 
  Clock, 
  Brain, 
  Zap, 
  TrendingUp, 
  Target, 
  Lightbulb, 
  CheckCircle, 
  AlertCircle,
  Loader2
} from 'lucide-react'
import { useAuth } from '@/contexts/NextAuthContext'
import { useDatabaseData } from '@/contexts/DatabaseDataContext'
import DynamicComponentRenderer from './DynamicComponentRenderer'
import InteractiveAssessment from './InteractiveAssessment'

interface SelfModifyingAssessmentProps {
  assessmentData: any
  onBack: () => void
  onComplete: (results: any) => void
}

interface AdaptationState {
  currentDifficulty: string
  skillLevel: string
  focusAreas: string[]
  adaptationHistory: any[]
  confidenceLevel: number
  engagementScore: number
}

export default function SelfModifyingAssessment({ 
  assessmentData, 
  onBack, 
  onComplete 
}: SelfModifyingAssessmentProps) {
  const { user } = useAuth()
  const { createResponse } = useDatabaseData()
  
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, any>>({})
  const [adaptationState, setAdaptationState] = useState<AdaptationState>({
    currentDifficulty: 'Medium',
    skillLevel: 'intermediate',
    focusAreas: [],
    adaptationHistory: [],
    confidenceLevel: 50,
    engagementScore: 50
  })
  
  const [questions, setQuestions] = useState(assessmentData.questions || [])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isGeneratingNext, setIsGeneratingNext] = useState(false)
  const [adaptationInsights, setAdaptationInsights] = useState<any>(null)
  const [timeRemaining, setTimeRemaining] = useState(assessmentData.timeLimit ? assessmentData.timeLimit * 60 : 3600)
  const [totalAdaptations, setTotalAdaptations] = useState(0)

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

  // Analyze response and potentially modify assessment
  const analyzeResponseAndAdapt = useCallback(async (questionIndex: number, answer: any) => {
    if (!answer || typeof answer === 'string' && answer.trim().length < 50) return

    setIsAnalyzing(true)
    try {
      const response = await fetch('/api/analyze-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assessmentId: assessmentData.id,
          questionId: questions[questionIndex]?.id,
          response: typeof answer === 'object' ? JSON.stringify(answer) : answer,
          interactionData: { timestamp: Date.now(), questionIndex },
          candidateProfile: { id: user?.id, currentLevel: adaptationState.skillLevel },
          currentContext: {
            currentDifficulty: adaptationState.currentDifficulty,
            questionsCompleted: questionIndex + 1,
            totalQuestions: questions.length,
            timeRemaining
          }
        })
      })

      if (response.ok) {
        const analysisResult = await response.json()
        await handleAnalysisResult(analysisResult, questionIndex)
      }
    } catch (error) {
      console.error('Response analysis failed:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }, [assessmentData.id, questions, adaptationState, user?.id, timeRemaining])

  const handleAnalysisResult = async (analysisResult: any, questionIndex: number) => {
    const { analysis, adaptationRecommendations } = analysisResult
    
    // Update adaptation state
    setAdaptationState(prev => ({
      ...prev,
      skillLevel: analysis.skillLevel,
      currentDifficulty: getDifficultyFromStrategy(adaptationRecommendations.difficultyAdjustment),
      focusAreas: analysis.competencyAreas,
      confidenceLevel: analysis.confidenceLevel,
      adaptationHistory: [...prev.adaptationHistory, {
        questionIndex,
        previousLevel: prev.skillLevel,
        newLevel: analysis.skillLevel,
        reasoning: adaptationRecommendations.difficultyAdjustment,
        timestamp: Date.now()
      }]
    }))

    setAdaptationInsights(analysisResult)

    // Generate next question if needed
    const shouldGenerateNewQuestion = decideShouldGenerateNewQuestion(
      analysis, 
      adaptationRecommendations, 
      questionIndex
    )
    
    if (shouldGenerateNewQuestion && questionIndex < questions.length - 1) {
      await generateAndInsertAdaptiveQuestion(questionIndex + 1, analysis, adaptationRecommendations)
    }
  }

  const generateAndInsertAdaptiveQuestion = async (
    insertIndex: number, 
    analysis: any, 
    recommendations: any
  ) => {
    setIsGeneratingNext(true)
    try {
      const response = await fetch('/api/generate-next-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentContext: {
            questionsCompleted: insertIndex,
            currentDifficulty: adaptationState.currentDifficulty,
            skillLevel: analysis.skillLevel
          },
          candidatePerformance: analysis,
          targetSkills: analysis.recommendedNextSkills,
          adaptationStrategy: mapRecommendationToStrategy(recommendations.difficultyAdjustment),
          assessmentType: assessmentData.type,
          remainingTime: Math.floor(timeRemaining / 60)
        })
      })

      if (response.ok) {
        const result = await response.json()
        const newQuestion = result.question
        
        // Insert the new question
        setQuestions((prev: any[]) => {
          const newQuestions = [...prev]
          newQuestions.splice(insertIndex, 0, newQuestion)
          return newQuestions
        })

        setTotalAdaptations(prev => prev + 1)
        
        // Show adaptation notification
        showAdaptationNotification(result.adaptationReason, newQuestion.difficulty)
      }
    } catch (error) {
      console.error('Question generation failed:', error)
    } finally {
      setIsGeneratingNext(false)
    }
  }

  const handleAnswerChange = (questionIndex: number, answer: any, metadata?: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }))

    // Trigger analysis for substantial responses
    if (answer && (typeof answer === 'string' ? answer.length > 100 : true)) {
      analyzeResponseAndAdapt(questionIndex, answer)
    }
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = async () => {
    try {
      // Prepare answers array for AI evaluation
      const answersArray = questions.map((_: any, index: number) => 
        typeof answers[index] === 'object' ? JSON.stringify(answers[index]) : answers[index] || ''
      )

      const evaluationPayload = {
        assessmentData: {
          title: assessmentData.title || 'Self-Modifying Assessment',
          company: assessmentData.company || 'Company',
          description: assessmentData.description || assessmentData.jobDescription,
          type: 'self-modifying',
          duration: assessmentData.timeLimit || 60,
          questions: questions
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
        timeSpent: (assessmentData.timeLimit * 60) - timeRemaining
      }

      console.log('📤 Sending self-modifying assessment to AI evaluation:', evaluationPayload)

      // Call the real AI evaluation API
      const response = await fetch('/api/evaluate-assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(evaluationPayload),
      })

      let results
      if (response.ok) {
        results = await response.json()
        console.log('🎯 AI evaluation results for self-modifying assessment:', results)
      } else {
        throw new Error(`AI evaluation failed: ${response.status}`)
      }

      // Enhanced submission with adaptation data
      const candidateResponse = {
        id: Date.now().toString(),
        assessmentId: assessmentData.id || Date.now().toString(),
        candidateId: user?.id || '',
        candidateName: user?.name || '',
        candidateEmail: user?.email || '',
        score: results.percentage || results.totalScore || calculateAdaptiveScore(),
        completedAt: new Date().toISOString(),
        status: 'completed' as const,
        answers: Object.entries(answers).map(([questionIndex, answer]) => ({
          questionId: questions[parseInt(questionIndex)]?.id || questionIndex,
          answer: typeof answer === 'object' ? JSON.stringify(answer) : answer,
          score: results.questionScores?.[parseInt(questionIndex)]?.score || 85
        })),
        feedback: results.breakdown || results.overallFeedback || generateAdaptiveFeedback(),
        adaptationData: {
          totalAdaptations,
          finalSkillLevel: adaptationState.skillLevel,
          adaptationHistory: adaptationState.adaptationHistory,
          finalConfidenceLevel: adaptationState.confidenceLevel,
          focusAreas: adaptationState.focusAreas
        },
        timeSpent: results.timeSpent || ((assessmentData.timeLimit * 60) - timeRemaining)
      }

      await createResponse(candidateResponse)
      onComplete(results)
    } catch (error) {
      console.error('Error in AI evaluation for self-modifying assessment:', error)
      
      // Fallback to original adaptive scoring logic
      const fallbackResponse = {
        id: Date.now().toString(),
        assessmentId: assessmentData.id || Date.now().toString(),
        candidateId: user?.id || '',
        candidateName: user?.name || '',
        candidateEmail: user?.email || '',
        score: calculateAdaptiveScore(),
        completedAt: new Date().toISOString(),
        status: 'completed' as const,
        answers: Object.entries(answers).map(([questionIndex, answer]) => ({
          questionId: questions[parseInt(questionIndex)]?.id || questionIndex,
          answer: typeof answer === 'object' ? JSON.stringify(answer) : answer,
          score: 85 // Enhanced scoring logic would go here
        })),
        feedback: generateAdaptiveFeedback(),
        adaptationData: {
          totalAdaptations,
          finalSkillLevel: adaptationState.skillLevel,
          adaptationHistory: adaptationState.adaptationHistory,
          finalConfidenceLevel: adaptationState.confidenceLevel,
          focusAreas: adaptationState.focusAreas
        },
        timeSpent: (assessmentData.timeLimit * 60) - timeRemaining,
        aiNote: 'AI evaluation temporarily unavailable - adaptive scoring applied'
      }

      await createResponse(fallbackResponse)
      
      // Convert to results format for onComplete
      const fallbackResults = {
        totalScore: fallbackResponse.score,
        maxScore: 100,
        percentage: fallbackResponse.score,
        passed: fallbackResponse.score >= 70,
        timeSpent: fallbackResponse.timeSpent,
        breakdown: fallbackResponse.feedback,
        adaptationData: fallbackResponse.adaptationData,
        aiNote: 'AI evaluation temporarily unavailable - adaptive scoring applied'
      }
      
      onComplete(fallbackResults)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100
  const currentQ = questions[currentQuestion]

  if (!currentQ) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading adaptive assessment...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header with Adaptation Info */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
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
                  <Brain className="h-6 w-6 text-purple-600 mr-2" />
                  <h1 className="text-xl font-bold text-gray-900">
                    Self-Modifying Assessment
                  </h1>
                  {totalAdaptations > 0 && (
                    <span className="ml-3 px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                      {totalAdaptations} adaptations
                    </span>
                  )}
                </div>
                <p className="text-gray-600">{assessmentData.company}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              {/* Adaptation Status */}
              <div className="text-center">
                <div className="text-sm text-gray-500">Skill Level</div>
                <div className={`font-bold ${
                  adaptationState.skillLevel === 'expert' ? 'text-green-600' :
                  adaptationState.skillLevel === 'advanced' ? 'text-blue-600' :
                  adaptationState.skillLevel === 'intermediate' ? 'text-yellow-600' :
                  'text-gray-600'
                }`}>
                  {adaptationState.skillLevel}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-sm text-gray-500">Confidence</div>
                <div className="font-bold text-purple-600">
                  {adaptationState.confidenceLevel}%
                </div>
              </div>
              
              <div className="flex items-center text-gray-600">
                <Clock className="h-5 w-5 mr-2" />
                <span className={`font-mono text-lg ${timeRemaining < 300 ? 'text-red-600' : 'text-purple-600'}`}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
              
              <div className="text-sm text-gray-500">
                Question {currentQuestion + 1} of {questions.length}
              </div>
            </div>
          </div>
          
          {/* Enhanced Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progress</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full transition-all duration-500 relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-0 w-3 h-3 bg-white rounded-full shadow-md border-2 border-purple-500"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Analysis Status */}
        <AnimatePresence>
          {(isAnalyzing || isGeneratingNext) && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6"
            >
              <div className="flex items-center">
                <Loader2 className="h-5 w-5 animate-spin text-blue-600 mr-2" />
                <span className="text-blue-800">
                  {isAnalyzing ? 'Analyzing your response...' : 'Generating personalized question...'}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Adaptation Insights */}
        {adaptationInsights && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 mb-6"
          >
            <div className="flex items-center mb-2">
              <Lightbulb className="h-5 w-5 text-green-600 mr-2" />
              <h3 className="font-medium text-green-800">Assessment Adaptation</h3>
            </div>
            <p className="text-green-700 text-sm">
              {adaptationInsights.adaptationReason}
            </p>
          </motion.div>
        )}

        {/* Current Question */}
        <motion.div
          key={`${currentQuestion}-${questions[currentQuestion]?.id}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-8 mb-6"
        >
          <div className="mb-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {currentQ.componentType === 'dynamic' ? 'Adaptive Challenge' : 'Question'} {currentQuestion + 1}
              </h2>
              <div className="flex space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  currentQ.type === 'interactive' ? 'bg-purple-100 text-purple-800' :
                  currentQ.type === 'scenario' ? 'bg-blue-100 text-blue-800' :
                  currentQ.type === 'technical' ? 'bg-green-100 text-green-800' :
                  'bg-indigo-100 text-indigo-800'
                }`}>
                  {currentQ.type}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  currentQ.difficulty === 'Expert' ? 'bg-red-100 text-red-800' :
                  currentQ.difficulty === 'Hard' ? 'bg-orange-100 text-orange-800' :
                  currentQ.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {currentQ.difficulty}
                </span>
                {currentQ.metadata?.adaptationReason && (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                    <Zap className="h-3 w-3 inline mr-1" />
                    Adaptive
                  </span>
                )}
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">Category: {currentQ.category}</p>
            
            <div className="prose max-w-none mb-6">
              <p className="text-gray-800 text-lg leading-relaxed">
                {currentQ.question}
              </p>
            </div>

            {/* Render Component */}
            {currentQ.componentType === 'dynamic' && currentQ.componentCode ? (
              <DynamicComponentRenderer
                componentCode={currentQ.componentCode}
                question={currentQ}
                onInteraction={(data) => handleAnswerChange(currentQuestion, data)}
              />
            ) : currentQ.componentType ? (
              <InteractiveAssessment
                assessmentData={{ questions: [currentQ] }}
                onBack={() => {}}
                onComplete={() => {}}
              />
            ) : (
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Response:
                </label>
                <textarea
                  value={answers[currentQuestion] || ''}
                  onChange={(e) => handleAnswerChange(currentQuestion, e.target.value)}
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Provide your detailed response..."
                />
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-purple-600 transition-colors disabled:opacity-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </button>

            <div className="flex space-x-3">
              {currentQuestion < questions.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="flex items-center px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Next Challenge
                  <TrendingUp className="h-4 w-4 ml-2" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Complete Assessment
                  <CheckCircle className="h-4 w-4 ml-2" />
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Question Overview with Adaptation Indicators */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Assessment Progress
          </h3>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
            {questions.map((q: any, index: number) => (
              <button
                key={`${index}-${q.id}`}
                onClick={() => setCurrentQuestion(index)}
                className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-sm font-medium transition-colors relative ${
                  index === currentQuestion
                    ? 'border-purple-500 bg-purple-100 text-purple-700'
                    : answers[index]
                    ? 'border-green-500 bg-green-100 text-green-700'
                    : 'border-gray-300 bg-white text-gray-500 hover:border-purple-300'
                }`}
              >
                {index + 1}
                {q.metadata?.adaptationReason && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full">
                    <Zap className="h-2 w-2 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
          
          {adaptationState.focusAreas.length > 0 && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Current Focus Areas:</strong> {adaptationState.focusAreas.join(', ')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Helper functions
function getDifficultyFromStrategy(strategy: string): string {
  switch (strategy) {
    case 'increase_difficulty': return 'Hard'
    case 'decrease_difficulty': return 'Easy'
    default: return 'Medium'
  }
}

function decideShouldGenerateNewQuestion(
  analysis: any, 
  recommendations: any, 
  questionIndex: number
): boolean {
  // Generate new question if significant skill level change or specific adaptation needed
  return (
    analysis.adaptationStrategy === 'increase_difficulty' ||
    analysis.creativity > 80 ||
    recommendations.nextChallengeType !== 'standard'
  )
}

function mapRecommendationToStrategy(recommendation: string): string {
  const mapping: Record<string, string> = {
    'increase_difficulty': 'difficulty',
    'decrease_difficulty': 'difficulty',
    'explore_depth': 'depth',
    'broaden_scope': 'breadth'
  }
  return mapping[recommendation] || 'difficulty'
}

function showAdaptationNotification(reason: string, difficulty: string) {
  // This would show a toast or notification in a real app
  console.log(`Assessment adapted: ${reason} (New difficulty: ${difficulty})`)
}

function calculateAdaptiveScore(): number {
  // Enhanced scoring algorithm based on adaptation data
  return 88 // Placeholder
}

function generateAdaptiveFeedback(): any {
  // Generate comprehensive feedback including adaptation insights
  return {
    overall: 'Excellent adaptive performance',
    adaptationInsights: 'Demonstrated strong learning agility',
    recommendations: 'Continue challenging yourself with complex scenarios'
  }
}
