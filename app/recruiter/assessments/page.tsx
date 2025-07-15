'use client'
export const dynamic = "force-dynamic"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Plus, FileText, Eye, Calendar, Users, BarChart3, Sparkles } from 'lucide-react'
import { useAuth } from '@/contexts/NextAuthContext'
import { useDatabaseData } from '@/contexts/DatabaseDataContext'
import Navigation from '@/components/Navigation'

export default function RecruiterAssessmentsPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const { assessments, responses, getResponsesForAssessment } = useDatabaseData()
  const router = useRouter()
  const [selectedTab, setSelectedTab] = useState<'all' | 'traditional' | 'ai-powered'>('all')

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

  const filteredAssessments = selectedTab === 'all' 
    ? userAssessments 
    : userAssessments.filter(a => {
        switch (selectedTab) {
          case 'traditional': return a.type === 'traditional'
          case 'ai-powered': return ['creative', 'self-modifying', 'video', 'audio', 'multi-modal'].includes(a.type || '')
          default: return true
        }
      })

  const getAssessmentIcon = (type: string | undefined) => {
    switch (type) {
      case 'creative': 
      case 'self-modifying': 
      case 'video': 
      case 'audio': 
      case 'multi-modal': 
        return <Sparkles className="h-5 w-5 text-purple-400" />
      default: 
        return <FileText className="h-5 w-5 text-blue-400" />
    }
  }

  const getAssessmentTypeLabel = (type: string | undefined) => {
    switch (type) {
      case 'creative': 
      case 'self-modifying': 
      case 'video': 
      case 'audio': 
      case 'multi-modal': 
        return 'AI-Powered'
      default: 
        return 'Traditional'
    }
  }

  const getAssessmentTypeColor = (type: string | undefined) => {
    switch (type) {
      case 'creative': 
      case 'self-modifying': 
      case 'video': 
      case 'audio': 
      case 'multi-modal': 
        return 'bg-purple-600/20 text-purple-400 border-purple-500/30'
      default: 
        return 'bg-blue-600/20 text-blue-400 border-blue-500/30'
    }
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation userType="recruiter" />
      
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Assessment Management</h1>
              <p className="text-gray-400">Create, manage, and analyze your assessments</p>
            </div>
            <div className="mt-4 lg:mt-0 flex flex-wrap gap-3">
              <button
                onClick={() => router.push('/recruiter/assessments/create')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Create Assessment</span>
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-1 mb-8 bg-gray-800 p-1 rounded-lg w-fit">
            {[
              { key: 'all', label: 'All Assessments' },
              { key: 'traditional', label: 'Traditional' },
              { key: 'ai-powered', label: 'AI-Powered' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSelectedTab(tab.key as any)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedTab === tab.key
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
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
                  <p className="text-2xl font-bold text-white">
                    {userAssessments.reduce((total, assessment) => 
                      total + getResponsesForAssessment(assessment.id).length, 0
                    )}
                  </p>
                </div>
                <Users className="h-8 w-8 text-green-400" />
              </div>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Avg. Score</p>
                  <p className="text-2xl font-bold text-white">
                    {Math.round(responses.reduce((sum, r) => sum + r.score, 0) / responses.length || 0)}%
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-400" />
              </div>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">This Month</p>
                  <p className="text-2xl font-bold text-white">
                    {userAssessments.filter(a => 
                      new Date(a.createdAt).getMonth() === new Date().getMonth()
                    ).length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-yellow-400" />
              </div>
            </div>
          </div>

          {/* Assessments List */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white">Your Assessments</h2>
            </div>
            
            {filteredAssessments.length === 0 ? (
              <div className="p-12 text-center">
                <FileText className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-400 mb-2">No assessments found</h3>
                <p className="text-gray-500 mb-6">Create your first assessment to get started</p>
                <button
                  onClick={() => router.push('/recruiter/assessments/create')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 mx-auto transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Assessment</span>
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-700">
                {filteredAssessments.map((assessment) => {
                  const assessmentResponses = getResponsesForAssessment(assessment.id)
                  const avgScore = assessmentResponses.length > 0 
                    ? Math.round(assessmentResponses.reduce((sum, r) => sum + r.score, 0) / assessmentResponses.length)
                    : 0

                  return (
                    <motion.div
                      key={assessment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 hover:bg-gray-750 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            {getAssessmentIcon(assessment.type)}
                            <h3 className="text-lg font-semibold text-white">{assessment.title}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getAssessmentTypeColor(assessment.type)}`}>
                              {getAssessmentTypeLabel(assessment.type)}
                            </span>
                          </div>
                          <p className="text-gray-400 text-sm mb-3">{assessment.description}</p>
                          <div className="flex items-center space-x-6 text-sm text-gray-500">
                            <span>{assessment.questions?.length || 0} questions</span>
                            <span>{assessmentResponses.length} responses</span>
                            <span>Avg. score: {avgScore}%</span>
                            <span>Created {new Date(assessment.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-6">
                          <button
                            onClick={() => router.push(`/recruiter/assessments/${assessment.id}`)}
                            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                            <span>View</span>
                          </button>
                          {assessmentResponses.length > 0 && (
                            <button
                              onClick={() => router.push(`/recruiter/assessments/${assessment.id}/responses`)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                            >
                              <Users className="h-4 w-4" />
                              <span>Responses</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
