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

export default function CandidateDashboardSimple() {
  const { user } = useAuth()
  const router = useRouter()
  const { assessments, responses, loading, error, fetchResponses } = useDatabaseData()
  const [aiInsights, setAiInsights] = useState<string>('Welcome to your revolutionary assessment dashboard! Complete assessments to get AI-powered insights.')

  // Calculate stats based on actual data
  const candidateResponses = responses.filter(r => r.candidateId === user?.id)
  const completedAssessments = candidateResponses.length
  const averageScore = completedAssessments > 0 
    ? Math.round(candidateResponses.reduce((sum, r) => sum + (r.score || 0), 0) / completedAssessments)
    : 0
  
  // Filter available assessments (exclude those already completed)
  const completedAssessmentIds = new Set(candidateResponses.map(r => r.assessmentId))
  const availableAssessments = assessments?.filter(a => !completedAssessmentIds.has(a.id)) || []

  console.log('Dashboard data:', { 
    user: user?.email, 
    loading, 
    totalAssessments: assessments?.length,
    availableAssessments: availableAssessments.length,
    completedAssessments,
    averageScore
  })

  // Fetch responses when component mounts or user changes  
  useEffect(() => {
    if (user?.id) {
      fetchResponses(undefined, user.id)
    }
  }, [user?.id]) // Removed fetchResponses from dependencies since it's now memoized

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your dashboard...</p>
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
                <p className="text-2xl font-bold text-white">{completedAssessments}</p>
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
                <p className="text-2xl font-bold text-white">{averageScore > 0 ? `${averageScore}%` : '--'}</p>
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

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mx-auto mb-4"></div>
                  <p className="text-gray-400">Loading assessments...</p>
                </div>
              ) : availableAssessments && availableAssessments.length > 0 ? (
                <div className="space-y-4">
                  {availableAssessments.slice(0, 3).map((assessment: any, index: number) => (
                    <div key={assessment.id || index} className="bg-gray-700/50 rounded-lg p-4 hover:bg-gray-700 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-white mb-1">{assessment.title || 'Assessment'}</h3>
                          <p className="text-gray-400 text-sm mb-2">{assessment.description || 'No description available'}</p>
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-1 text-gray-400 text-sm">
                              <Clock className="h-4 w-4" />
                              <span>{assessment.timeLimit || 60}min</span>
                            </div>
                            <span className="text-gray-400 text-sm">•</span>
                            <span className="text-blue-400 text-sm">{assessment.assessmentType || 'Assessment'}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => router.push(`/assessments/${assessment.id}/take`)}
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
                  <p className="text-gray-400 mb-4">
                    {completedAssessments > 0 
                      ? "Great job! You've completed all available assessments." 
                      : "No assessments available yet"
                    }
                  </p>
                  <button
                    onClick={() => router.push('/assessments')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {completedAssessments > 0 ? "View Results" : "Browse Assessments"}
                  </button>
                </div>
              )}

              {error && (
                <div className="bg-red-600/20 border border-red-500/30 rounded-lg p-4 mt-4">
                  <p className="text-red-300 text-sm">Error loading assessments: {error}</p>
                </div>
              )}
            </motion.div>

            {/* Completed Assessments Section */}
            {completedAssessments > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gray-800 border border-gray-700 rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Completed Assessments</h2>
                  <span className="text-green-400 text-sm">{completedAssessments} completed</span>
                </div>

                <div className="space-y-4">
                  {candidateResponses.slice(0, 3).map((response: any, index: number) => {
                    const assessment = assessments?.find(a => a.id === response.assessmentId)
                    return (
                      <div key={response.id || index} className="bg-gray-700/50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-white mb-1">
                              {assessment?.title || 'Assessment'}
                            </h3>
                            <p className="text-gray-400 text-sm mb-2">
                              Completed on {new Date(response.completedAt).toLocaleDateString()}
                            </p>
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center space-x-1">
                                <Trophy className="h-4 w-4 text-yellow-400" />
                                <span className="text-yellow-400 font-medium">{response.score}%</span>
                              </div>
                              <span className="text-gray-400 text-sm">•</span>
                              <span className={`text-sm ${response.score >= 70 ? 'text-green-400' : 'text-orange-400'}`}>
                                {response.score >= 70 ? 'Passed' : 'Needs Improvement'}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => router.push(`/assessments/${response.assessmentId}/results`)}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors flex items-center space-x-2"
                          >
                            <Eye className="h-4 w-4" />
                            <span>View Results</span>
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {candidateResponses.length > 3 && (
                  <button
                    onClick={() => router.push('/assessments')}
                    className="mt-4 w-full text-center py-2 text-blue-400 hover:text-blue-300 text-sm"
                  >
                    View all {candidateResponses.length} completed assessments
                  </button>
                )}
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
              
              <p className="text-purple-100 text-sm leading-relaxed">{aiInsights}</p>
              
              <button
                onClick={() => router.push('/coaching')}
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
