'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  FileText, 
  Clock, 
  Trophy, 
  Star, 
  Eye, 
  Play, 
  CheckCircle, 
  ArrowRight,
  Brain,
  TrendingUp
} from 'lucide-react'
import { useAuth } from '@/contexts/NextAuthContext'
import { useDatabaseData } from '@/contexts/DatabaseDataContext'

export default function CandidateDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const { assessments, getAssessmentsForCandidate, getCandidateResponses } = useDatabaseData()
  const [aiInsights, setAiInsights] = useState<string>('')
  const [loadingInsights, setLoadingInsights] = useState(false)

  const availableAssessments = getAssessmentsForCandidate(user?.id || '')
  const candidateResponses = getCandidateResponses(user?.id || '')
  const completedAssessments = candidateResponses.map(response => {
    const assessment = assessments.find(a => a.id === response.assessmentId)
    return {
      ...assessment,
      ...response,
      assessmentId: response.assessmentId
    }
  }).filter(Boolean)

  useEffect(() => {
    generateAIInsights()
  }, [user, completedAssessments])

  const generateAIInsights = async () => {
    if (!user || completedAssessments.length === 0) {
      setAiInsights('Complete some assessments to get personalized AI insights!')
      return
    }
    
    setLoadingInsights(true)
    try {
      // Use API call instead of direct import to avoid client-side issues
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'coaching',
          context: {
            completedAssessments: completedAssessments.length,
            averageScore: completedAssessments.reduce((acc, a) => acc + (a.score || 0), 0) / completedAssessments.length,
            skills: user.skills || [],
            role: user.role
          },
          constraints: {
            maxLength: 400,
            tone: 'encouraging'
          }
        })
      })
      
      if (response.ok) {
        const result = await response.json()
        setAiInsights(result.content)
      } else {
        throw new Error('API call failed')
      }
    } catch (error) {
      console.error('Error generating AI insights:', error)
      // Provide a fallback insight based on the data we have
      const avgScore = completedAssessments.reduce((acc, a) => acc + (a.score || 0), 0) / completedAssessments.length
      let fallbackInsight = `Based on your ${completedAssessments.length} completed assessment${completedAssessments.length > 1 ? 's' : ''}, `
      
      if (avgScore >= 80) {
        fallbackInsight += `you're performing excellently with an average score of ${Math.round(avgScore)}%! Consider taking more challenging assessments to further develop your skills.`
      } else if (avgScore >= 60) {
        fallbackInsight += `you're showing good progress with an average score of ${Math.round(avgScore)}%. Focus on areas where you scored lower to improve your overall performance.`
      } else {
        fallbackInsight += `there's room for improvement with an average score of ${Math.round(avgScore)}%. Consider reviewing fundamental concepts and practicing more before taking additional assessments.`
      }
      
      setAiInsights(fallbackInsight)
    } finally {
      setLoadingInsights(false)
    }
  }

  const handleTakeAssessment = (assessment: any) => {
    router.push(`/assessments/${assessment.id}/take`)
  }

  const handleViewResults = (assessment: any) => {
    router.push(`/assessments/${assessment.id}/results`)
  }

  const handleAICoaching = () => {
    router.push('/coaching')
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400'
    if (score >= 70) return 'text-yellow-400'
    return 'text-red-400'
  }

  // Debug logging
  console.log('CandidateDashboard render:', {
    user: user?.email,
    assessmentsCount: assessments?.length,
    availableAssessmentsCount: availableAssessments?.length,
    candidateResponsesCount: candidateResponses?.length
  })

  // Loading state
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user?.firstName || user?.name || 'Candidate'}!
          </h1>
          <p className="text-gray-400">
            Track your progress and continue your assessments
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800 border border-gray-700 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Available Assessments</p>
                <p className="text-2xl font-bold text-white">{availableAssessments.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800 border border-gray-700 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Completed</p>
                <p className="text-2xl font-bold text-white">{completedAssessments.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800 border border-gray-700 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Average Score</p>
                <p className="text-2xl font-bold text-white">
                  {completedAssessments.length > 0 
                    ? Math.round(completedAssessments.reduce((acc, a) => acc + (a.score || 0), 0) / completedAssessments.length)
                    : 0}%
                </p>
              </div>
              <Trophy className="h-8 w-8 text-yellow-400" />
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Available Assessments */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-800 border border-gray-700 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Available Assessments</h2>
                <button
                  onClick={() => router.push('/assessments')}
                  className="text-blue-400 hover:text-blue-300 text-sm flex items-center space-x-1"
                >
                  <span>View All</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              {availableAssessments.length > 0 ? (
                <div className="space-y-4">
                  {availableAssessments.slice(0, 3).map((assessment, index) => (
                    <div key={assessment.id} className="bg-gray-700/50 rounded-lg p-4 hover:bg-gray-700 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-white mb-1">{assessment.title}</h3>
                          <p className="text-gray-400 text-sm mb-2">{assessment.description}</p>
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-1 text-gray-400 text-sm">
                              <Clock className="h-4 w-4" />
                              <span>{assessment.timeLimit || 60}min</span>
                            </div>
                            <span className="text-gray-400 text-sm">•</span>
                            <span className="text-blue-400 text-sm">{assessment.assessmentType}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleTakeAssessment(assessment)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                        >
                          <Play className="h-4 w-4" />
                          <span>Start</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No assessments available</p>
                  <button
                    onClick={() => router.push('/assessments')}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Browse Assessments
                  </button>
                </div>
              )}
            </motion.div>

            {/* Recent Results */}
            {completedAssessments.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gray-800 border border-gray-700 rounded-xl p-6"
              >
                <h2 className="text-xl font-bold text-white mb-6">Recent Results</h2>
                <div className="space-y-4">
                  {completedAssessments.slice(0, 3).map((result, index) => (
                    <div key={result.id} className="bg-gray-700/50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-white mb-1">{result.title}</h3>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 text-yellow-400" />
                              <span className={`font-medium ${getScoreColor(result.score || 0)}`}>
                                {result.score || 0}%
                              </span>
                            </div>
                            <span className="text-gray-400 text-sm">
                              {new Date(result.completedAt || Date.now()).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleViewResults(result)}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Insights */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-xl p-6"
            >
              <div className="flex items-center space-x-3 mb-4">
                <Brain className="h-6 w-6 text-purple-400" />
                <h3 className="text-lg font-semibold text-white">AI Insights</h3>
              </div>
              
              {loadingInsights ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-500 border-t-transparent"></div>
                  <span className="text-purple-300 text-sm">Analyzing your performance...</span>
                </div>
              ) : aiInsights ? (
                <p className="text-purple-100 text-sm leading-relaxed">{aiInsights}</p>
              ) : (
                <p className="text-purple-300 text-sm">Complete more assessments to get personalized insights.</p>
              )}
              
              <button
                onClick={handleAICoaching}
                className="mt-4 w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
              >
                <TrendingUp className="h-4 w-4" />
                <span>Get AI Coaching</span>
              </button>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-gray-800 border border-gray-700 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/assessments')}
                  className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Browse All Assessments
                </button>
                <button
                  onClick={() => router.push('/profile')}
                  className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Update Profile
                </button>
                <button
                  onClick={() => router.push('/coaching')}
                  className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                >
                  AI Coaching
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
