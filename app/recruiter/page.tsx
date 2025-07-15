'use client'
export const dynamic = "force-dynamic"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Plus, Users, BarChart3, FileText, Calendar, TrendingUp, Clock, Target } from 'lucide-react'
import { useAuth } from '@/contexts/NextAuthContext'
import { useDatabaseData } from '@/contexts/DatabaseDataContext'
import Navigation from '@/components/Navigation'

export default function RecruiterPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const { assessments, responses, getResponsesForAssessment } = useDatabaseData()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push('/auth')
    } else if (isAuthenticated && user?.role !== 'recruiter') {
      router.push('/auth')
    }
  }, [isAuthenticated, isLoading, user, router])

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
      </div>
    )
  }

  // Filter assessments created by current user
  const userAssessments = assessments.filter(a => a.createdBy === user?.id)
  const totalResponses = userAssessments.reduce((total, assessment) => 
    total + getResponsesForAssessment(assessment.id).length, 0
  )
  const avgScore = responses.length > 0 
    ? Math.round(responses.reduce((sum, r) => sum + r.score, 0) / responses.length)
    : 0
  const thisMonthAssessments = userAssessments.filter(a => 
    new Date(a.createdAt).getMonth() === new Date().getMonth()
  ).length

  const quickActions = [
    {
      title: 'Create Assessment',
      description: 'Start building a new assessment',
      icon: Plus,
      color: 'bg-blue-600 hover:bg-blue-700',
      href: '/recruiter/assessments/create'
    },
    {
      title: 'View Assessments',
      description: 'Manage your existing assessments',
      icon: FileText,
      color: 'bg-green-600 hover:bg-green-700',
      href: '/recruiter/assessments'
    },
    {
      title: 'AI Assistant',
      description: 'Get help with recruiting tasks',
      icon: Target,
      color: 'bg-purple-600 hover:bg-purple-700',
      href: '/recruiter/ai-assistant'
    },
    {
      title: 'Enterprise Tools',
      description: 'Access advanced features',
      icon: TrendingUp,
      color: 'bg-orange-600 hover:bg-orange-700',
      href: '/recruiter/enterprise'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation userType="recruiter" />
      
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {user?.name || 'Recruiter'}
            </h1>
            <p className="text-gray-400">
              Here's what's happening with your recruitment activities
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Assessments</p>
                  <p className="text-2xl font-bold text-white">{userAssessments.length}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-400" />
              </div>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Responses</p>
                  <p className="text-2xl font-bold text-white">{totalResponses}</p>
                </div>
                <Users className="h-8 w-8 text-green-400" />
              </div>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Avg. Score</p>
                  <p className="text-2xl font-bold text-white">{avgScore}%</p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-400" />
              </div>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">This Month</p>
                  <p className="text-2xl font-bold text-white">{thisMonthAssessments}</p>
                </div>
                <Calendar className="h-8 w-8 text-yellow-400" />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <motion.button
                  key={action.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => router.push(action.href)}
                  className={`${action.color} text-white p-6 rounded-xl transition-colors flex flex-col items-center text-center space-y-3`}
                >
                  <action.icon className="h-8 w-8" />
                  <div>
                    <h3 className="font-semibold">{action.title}</h3>
                    <p className="text-sm opacity-90">{action.description}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Recent Assessments */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Recent Assessments</h2>
                <button
                  onClick={() => router.push('/recruiter/assessments')}
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  View all →
                </button>
              </div>
            </div>
            <div className="p-6">
              {userAssessments.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400 mb-4">No assessments created yet</p>
                  <button
                    onClick={() => router.push('/recruiter/assessments/create')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 mx-auto transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Create Your First Assessment</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {userAssessments.slice(0, 3).map((assessment) => (
                    <div
                      key={assessment.id}
                      className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <div>
                          <h3 className="text-white font-medium">{assessment.title}</h3>
                          <p className="text-gray-400 text-sm">
                            {new Date(assessment.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white text-sm">
                          {getResponsesForAssessment(assessment.id).length} responses
                        </p>
                        <p className="text-gray-400 text-xs">
                          {assessment.type === 'traditional' ? 'Traditional' : 'AI-Powered'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
