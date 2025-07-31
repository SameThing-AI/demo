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
  TrendingUp,
  BookOpen,
  Target,
  Award,
  BarChart3
} from 'lucide-react'
import { useAuth } from '../contexts/NextAuthContext'
import { useDatabaseData } from '../contexts/DatabaseDataContext'
import { Button, Card, Badge, Loading, Alert, ProgressBar } from './ui'
import { useAsync } from '../hooks'
import { formatDate, calculateProgress, cn } from '../utils'

interface DashboardStats {
  totalAssessments: number
  completedAssessments: number
  averageScore: number
  totalTime: number
  improvementRate: number
}

interface AIInsightData {
  completedAssessments: number
  averageScore: number
  skills: string[]
  role?: string
}

export default function CandidateDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const { assessments, getAssessmentsForCandidate, getCandidateResponses } = useDatabaseData()
  
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

  // Calculate dashboard statistics
  const stats: DashboardStats = {
    totalAssessments: availableAssessments.length,
    completedAssessments: completedAssessments.length,
    averageScore: completedAssessments.length > 0 
      ? completedAssessments.reduce((acc, a) => acc + (a.score || 0), 0) / completedAssessments.length 
      : 0,
    totalTime: completedAssessments.reduce((acc, a) => acc + (a.duration || 0), 0),
    improvementRate: completedAssessments.length > 1 
      ? calculateProgress(
          completedAssessments.slice(-1)[0]?.score || 0,
          completedAssessments.slice(-2)[0]?.score || 0
        )
      : 0
  }

  // AI Insights with optimized async handling
  const { 
    data: aiInsights, 
    loading: loadingInsights, 
    error: insightsError,
    execute: generateInsights 
  } = useAsync(async () => {
    if (completedAssessments.length === 0) {
      return 'Complete some assessments to get personalized AI insights!'
    }

    const insightData: AIInsightData = {
      completedAssessments: completedAssessments.length,
      averageScore: stats.averageScore,
      skills: user?.skills || [],
      role: user?.role
    }

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'coaching',
          context: insightData,
          constraints: {
            maxLength: 400,
            tone: 'encouraging'
          }
        })
      })

      if (!response.ok) throw new Error('Failed to generate insights')
      
      const result = await response.json()
      return result.content
    } catch (error) {
      // Fallback insights based on performance
      const { averageScore, completedAssessments: completed } = insightData
      
      if (averageScore >= 80) {
        return `Excellent work! With ${completed} assessments completed and an average score of ${Math.round(averageScore)}%, you're performing at a high level. Consider taking more challenging assessments to further develop your expertise.`
      } else if (averageScore >= 60) {
        return `Good progress! You've completed ${completed} assessments with an average score of ${Math.round(averageScore)}%. Focus on areas where you scored lower to boost your overall performance.`
      } else {
        return `You're on the right track with ${completed} assessments completed. With an average score of ${Math.round(averageScore)}%, consider reviewing fundamental concepts and practicing more to improve your results.`
      }
    }
  })

  useEffect(() => {
    if (user && completedAssessments.length > 0) {
      generateInsights()
    }
  }, [user, completedAssessments.length, generateInsights])

  const handleTakeAssessment = (assessment: any) => {
    router.push(`/assessments/${assessment.id}/take`)
  }

  const handleViewResults = (assessment: any) => {
    router.push(`/assessments/${assessment.id}/results`)
  }

  const handleAICoaching = () => {
    router.push('/candidate/coaching')
  }

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBadgeVariant = (score: number): 'success' | 'warning' | 'danger' => {
    if (score >= 80) return 'success'
    if (score >= 60) return 'warning'
    return 'danger'
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name || 'Candidate'}!
          </h1>
          <p className="text-gray-600 mt-2">
            Track your progress and continue your professional development journey
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.completedAssessments}</h3>
            <p className="text-gray-600">Completed</p>
            <p className="text-sm text-gray-500 mt-1">of {stats.totalAssessments} available</p>
          </Card>

          <Card className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-4">
              <Trophy className="w-6 h-6 text-green-600" />
            </div>
            <h3 className={cn("text-2xl font-bold", getScoreColor(stats.averageScore))}>
              {Math.round(stats.averageScore)}%
            </h3>
            <p className="text-gray-600">Average Score</p>
            <ProgressBar 
              value={stats.averageScore} 
              color={stats.averageScore >= 80 ? 'green' : stats.averageScore >= 60 ? 'yellow' : 'red'}
            />
          </Card>

          <Card className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-4">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {Math.round(stats.totalTime / 60)}h
            </h3>
            <p className="text-gray-600">Time Invested</p>
            <p className="text-sm text-gray-500 mt-1">across all assessments</p>
          </Card>

          <Card className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {stats.improvementRate > 0 ? '+' : ''}{Math.round(stats.improvementRate)}%
            </h3>
            <p className="text-gray-600">Improvement</p>
            <p className="text-sm text-gray-500 mt-1">from recent assessments</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* AI Insights */}
          <div className="lg:col-span-2">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-purple-600" />
                  AI Career Coach
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAICoaching}
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Full Coaching
                </Button>
              </div>
              
              {loadingInsights ? (
                <div className="flex items-center justify-center py-8">
                  <Loading size="md" />
                  <span className="ml-3 text-gray-600">Analyzing your performance...</span>
                </div>
              ) : insightsError ? (
                <Alert variant="warning">
                  Unable to generate personalized insights right now. Please try again later.
                </Alert>
              ) : (
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6">
                  <p className="text-gray-700 leading-relaxed">{aiInsights}</p>
                </div>
              )}
            </Card>

            {/* Available Assessments */}
            <Card className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Target className="w-5 h-5 mr-2 text-blue-600" />
                Available Assessments
              </h2>
              
              {availableAssessments.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No assessments available at the moment</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {availableAssessments.slice(0, 3).map((assessment, index) => (
                    <motion.div
                      key={assessment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{assessment.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{assessment.company}</p>
                          <div className="flex items-center mt-2 space-x-4">
                            <span className="text-sm text-gray-500 flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {assessment.duration || 60} min
                            </span>
                            {(assessment as any).difficulty && (
                              <Badge 
                                variant={
                                  (assessment as any).difficulty === 'hard' ? 'danger' : 
                                  (assessment as any).difficulty === 'medium' ? 'warning' : 'success'
                                }
                                size="sm"
                              >
                                {(assessment as any).difficulty}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleTakeAssessment(assessment)}
                          icon={<Play className="w-4 h-4" />}
                        >
                          Take Assessment
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                  
                  {availableAssessments.length > 3 && (
                    <Button
                      variant="outline"
                      className="w-full mt-4"
                      onClick={() => router.push('/candidate/assessments')}
                    >
                      View All Assessments ({availableAssessments.length})
                    </Button>
                  )}
                </div>
              )}
            </Card>
          </div>

          {/* Recent Results */}
          <div>
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Award className="w-5 h-5 mr-2 text-green-600" />
                Recent Results
              </h2>
              
              {completedAssessments.length === 0 ? (
                <div className="text-center py-8">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No results yet</p>
                  <Button
                    variant="primary"
                    onClick={() => router.push('/candidate/assessments')}
                    icon={<Play className="w-4 h-4" />}
                  >
                    Take Your First Assessment
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {completedAssessments.slice(0, 5).map((result, index) => (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">{result.title}</h4>
                        <p className="text-xs text-gray-600 mt-1">
                          {formatDate(result.completedAt)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant={getScoreBadgeVariant(result.score || 0)}>
                          {Math.round(result.score || 0)}%
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewResults(result)}
                          icon={<Eye className="w-4 h-4" />}
                        />
                      </div>
                    </motion.div>
                  ))}
                  
                  {completedAssessments.length > 5 && (
                    <Button
                      variant="outline"
                      className="w-full mt-4"
                      onClick={() => router.push('/candidate/progress')}
                    >
                      View All Results
                    </Button>
                  )}
                </div>
              )}
            </Card>

            {/* Quick Actions */}
            <Card className="mt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push('/candidate/coaching')}
                  icon={<BookOpen className="w-4 h-4" />}
                >
                  AI Coaching Sessions
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push('/candidate/progress')}
                  icon={<BarChart3 className="w-4 h-4" />}
                >
                  View Progress Report
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push('/candidate/settings')}
                  icon={<Star className="w-4 h-4" />}
                >
                  Update Profile
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
