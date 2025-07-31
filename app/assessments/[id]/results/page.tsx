'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Trophy, 
  Star, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Download, 
  Home, 
  RotateCcw,
  Brain,
  TrendingUp,
  Target,
  Award,
  ArrowLeft
} from 'lucide-react'
import { useAuth } from '@/contexts/NextAuthContext'
import { useDatabaseData } from '@/contexts/DatabaseDataContext'
import { aiContentGenerator } from '@/lib/ai-content-generator-openai'

interface AssessmentResultsPageProps {
  params: {
    id: string
  }
}

export default function AssessmentResultsPage({ params }: AssessmentResultsPageProps) {
  const router = useRouter()
  const { user } = useAuth()
  const { getAssessmentById, getCandidateResponses, fetchResponses } = useDatabaseData()
  
  const [assessment, setAssessment] = useState<any>(null)
  const [response, setResponse] = useState<any>(null)
  const [aiAnalysis, setAiAnalysis] = useState<string>('')
  const [recommendations, setRecommendations] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingAnalysis, setLoadingAnalysis] = useState(false)

  useEffect(() => {
    loadAssessmentResults()
  }, [params.id, user])

  const loadAssessmentResults = async () => {
    try {
      setLoading(true)
      
      // Get assessment details
      const assessmentData = await getAssessmentById(params.id)
      if (!assessmentData) {
        throw new Error('Assessment not found')
      }
      setAssessment(assessmentData)

      // Fetch responses directly from API instead of relying on context state
      console.log('🔍 Fetching responses for assessment:', params.id, 'user:', user?.id)
      
      const searchParams = new URLSearchParams()
      searchParams.append('assessmentId', params.id)
      if (user?.id) {
        searchParams.append('candidateId', user.id)
      }
      
      const responsesResponse = await fetch(`/api/responses?${searchParams.toString()}`)
      
      if (!responsesResponse.ok) {
        throw new Error('Failed to fetch responses from server')
      }
      
      const responsesData = await responsesResponse.json()
      console.log('📥 Fetched responses:', responsesData)
      
      // Find the specific response for this user and assessment
      const candidateResponse = responsesData.find((r: any) => 
        r.assessmentId === params.id && r.candidateId === user?.id
      )
      
      if (!candidateResponse) {
        // Wait a moment and try once more in case the response was just created
        console.log('⏳ Response not found, waiting 2 seconds and retrying...')
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        const retryResponse = await fetch(`/api/responses?${searchParams.toString()}`)
        if (retryResponse.ok) {
          const retryData = await retryResponse.json()
          const retryCandidate = retryData.find((r: any) => 
            r.assessmentId === params.id && r.candidateId === user?.id
          )
          
          if (retryCandidate) {
            setResponse(retryCandidate)
            await generateAIAnalysis(assessmentData, retryCandidate)
            setLoading(false)
            return
          }
        }
        
        throw new Error('Assessment results not found. Please make sure you have completed the assessment.')
      }
      
      setResponse(candidateResponse)

      // Generate AI analysis
      await generateAIAnalysis(assessmentData, candidateResponse)
      
    } catch (error) {
      console.error('Error loading assessment results:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateAIAnalysis = async (assessmentData: any, responseData: any) => {
    setLoadingAnalysis(true)
    try {
      // Generate detailed AI analysis
      const analysis = await aiContentGenerator.generateContent({
        type: 'feedback',
        context: {
          assessmentType: assessmentData.assessmentType,
          score: responseData.score,
          answers: responseData.answers,
          timeSpent: responseData.timeSpent,
          role: user?.role,
          skills: user?.skills || [],
          industry: assessmentData.industry || 'Technology'
        },
        constraints: {
          maxLength: 500,
          tone: 'professional',
          format: 'text'
        }
      })
      setAiAnalysis(analysis.content)

      // Generate recommendations
      const recommendationsResult = await aiContentGenerator.generateContent({
        type: 'coaching',
        context: {
          score: responseData.score,
          weakAreas: getWeakAreas(responseData),
          strengths: getStrengths(responseData),
          role: user?.role,
          nextSteps: true
        },
        constraints: {
          maxLength: 300,
          tone: 'encouraging',
          format: 'text'
        }
      })
      
      // Split recommendations into bullet points
      const recs = recommendationsResult.content.split('\n').filter(line => line.trim())
      setRecommendations(recs)
      
    } catch (error) {
      console.error('Error generating AI analysis:', error)
      
      // Fallback analysis
      const score = responseData.score || 0
      if (score >= 90) {
        setAiAnalysis('Outstanding performance! You demonstrated exceptional understanding and problem-solving skills throughout this assessment.')
        setRecommendations([
          'Consider taking advanced assessments to further challenge yourself',
          'Share your expertise by mentoring others in your field',
          'Explore leadership roles that match your skill level'
        ])
      } else if (score >= 70) {
        setAiAnalysis('Strong performance with room for targeted improvement. You show solid fundamentals and good problem-solving approach.')
        setRecommendations([
          'Focus on areas where you scored lower to strengthen overall performance',
          'Practice similar assessments to build confidence',
          'Consider additional training in specific weak areas'
        ])
      } else {
        setAiAnalysis('This assessment has highlighted specific areas for development. With focused effort, you can significantly improve your performance.')
        setRecommendations([
          'Review fundamental concepts in areas where you struggled',
          'Take practice assessments to build familiarity with question types',
          'Consider structured learning programs or courses'
        ])
      }
    } finally {
      setLoadingAnalysis(false)
    }
  }

  const getWeakAreas = (responseData: any) => {
    // Analyze answers to identify weak areas
    const questionScores = responseData.questionScores || []
    return questionScores
      .filter((q: any) => q.score < 70)
      .map((q: any) => q.category || 'General')
  }

  const getStrengths = (responseData: any) => {
    // Analyze answers to identify strengths
    const questionScores = responseData.questionScores || []
    return questionScores
      .filter((q: any) => q.score >= 80)
      .map((q: any) => q.category || 'General')
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400'
    if (score >= 70) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getScoreGradient = (score: number) => {
    if (score >= 90) return 'from-green-500 to-emerald-500'
    if (score >= 70) return 'from-yellow-500 to-orange-500'
    return 'from-red-500 to-pink-500'
  }

  const exportResults = () => {
    const exportData = {
      assessment: assessment?.title,
      candidate: user?.name || user?.email,
      score: response?.score,
      completedAt: response?.completedAt,
      timeSpent: response?.timeSpent,
      analysis: aiAnalysis,
      recommendations: recommendations,
      questionBreakdown: response?.questionScores || []
    }
    
    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `assessment_results_${assessment?.title || 'assessment'}_${Date.now()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your results...</p>
        </div>
      </div>
    )
  }

  if (!assessment || !response) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Results Not Found</h1>
          <p className="text-gray-400 mb-6">We couldn't find the results for this assessment.</p>
          <button
            onClick={() => router.push('/candidate')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const score = response.score || 0
  const passed = score >= 70

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => router.push('/candidate')}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Dashboard</span>
            </button>
            
            <button
              onClick={exportResults}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Export Results</span>
            </button>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-2">{assessment.title}</h1>
          <p className="text-gray-400">{assessment.description}</p>
        </motion.div>

        {/* Score Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className={`bg-gradient-to-r ${getScoreGradient(score)} rounded-xl p-8 mb-8`}
        >
          <div className="flex items-center justify-between text-white">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                {passed ? (
                  <CheckCircle className="h-8 w-8" />
                ) : (
                  <XCircle className="h-8 w-8" />
                )}
                <h2 className="text-2xl font-bold">
                  {passed ? 'Assessment Passed!' : 'Assessment Complete'}
                </h2>
              </div>
              <p className="text-xl opacity-90">
                {passed ? 'Congratulations on your performance!' : 'Review the feedback below to improve'}
              </p>
            </div>
            
            <div className="text-right">
              <div className="text-4xl font-bold mb-1">{score}%</div>
              <div className="flex items-center space-x-2 text-sm opacity-90">
                <Clock className="h-4 w-4" />
                <span>{Math.round((response.timeSpent || 0) / 60)} minutes</span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Analysis */}
          <div className="lg:col-span-2 space-y-6">
            {/* AI Analysis */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800 border border-gray-700 rounded-xl p-6"
            >
              <div className="flex items-center space-x-3 mb-4">
                <Brain className="h-6 w-6 text-purple-400" />
                <h3 className="text-xl font-semibold text-white">AI Performance Analysis</h3>
              </div>
              
              {loadingAnalysis ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-purple-500 border-t-transparent"></div>
                  <span className="text-purple-300">Analyzing your performance...</span>
                </div>
              ) : (
                <p className="text-gray-300 leading-relaxed">{aiAnalysis}</p>
              )}
            </motion.div>

            {/* Question Breakdown */}
            {response.questionScores && response.questionScores.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gray-800 border border-gray-700 rounded-xl p-6"
              >
                <h3 className="text-xl font-semibold text-white mb-6">Question Breakdown</h3>
                <div className="space-y-4">
                  {response.questionScores.map((question: any, index: number) => (
                    <div key={index} className="bg-gray-700/50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-300">Question {index + 1}</span>
                        <span className={`font-semibold ${getScoreColor(question.score || 0)}`}>
                          {question.score || 0}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${question.score >= 70 ? 'bg-green-500' : question.score >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${Math.min(question.score || 0, 100)}%` }}
                        />
                      </div>
                      {question.feedback && (
                        <p className="text-gray-400 text-sm mt-2">{question.feedback}</p>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-800 border border-gray-700 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Assessment Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Score</span>
                  <span className={`font-semibold ${getScoreColor(score)}`}>{score}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Time Spent</span>
                  <span className="text-white">{Math.round((response.timeSpent || 0) / 60)}m</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Questions</span>
                  <span className="text-white">{response.questionScores?.length || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Type</span>
                  <span className="text-white">{assessment.assessmentType}</span>
                </div>
              </div>
            </motion.div>

            {/* Recommendations */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl p-6"
            >
              <div className="flex items-center space-x-3 mb-4">
                <TrendingUp className="h-6 w-6 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">Next Steps</h3>
              </div>
              
              {recommendations.length > 0 ? (
                <div className="space-y-3">
                  {recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <Target className="h-4 w-4 text-blue-400 mt-1 flex-shrink-0" />
                      <span className="text-blue-100 text-sm">{rec}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-blue-300 text-sm">Generating personalized recommendations...</p>
              )}
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-3"
            >
              <button
                onClick={() => router.push('/candidate')}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Home className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </button>
              
              <button
                onClick={() => router.push('/assessments')}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Take Another Assessment</span>
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
