'use client'
export const dynamic = "force-dynamic"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Plus, FileText, Eye, Calendar, Users, BarChart3, Sparkles,
  Trash2, Archive, CheckSquare, Square, MoreVertical, Edit,
  XCircle, PlayCircle, Download, Filter
} from 'lucide-react'
import { useAuth } from '@/contexts/NextAuthContext'
import { useDatabaseData } from '@/contexts/DatabaseDataContext'
import Navigation from '@/components/Navigation'

export default function RecruiterAssessmentsPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const { assessments, responses, getResponsesForAssessment, fetchAssessments } = useDatabaseData()
  const router = useRouter()
  const [selectedTab, setSelectedTab] = useState<'all' | 'traditional' | 'ai-powered'>('all')
  const [selectedAssessments, setSelectedAssessments] = useState<string[]>([])
  const [bulkActionLoading, setBulkActionLoading] = useState(false)
  const [showBulkActions, setShowBulkActions] = useState(false)

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
          case 'ai-powered': return a.type === 'ai-powered' || ['creative', 'self-modifying', 'video', 'audio', 'multi-modal'].includes(a.type || '')
          default: return true
        }
      })

  const getAssessmentIcon = (type: string | undefined) => {
    switch (type) {
      case 'ai-powered':
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
      case 'ai-powered':
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
      case 'ai-powered':
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

  // Bulk action handlers
  const handleSelectAll = () => {
    if (selectedAssessments.length === filteredAssessments.length) {
      setSelectedAssessments([])
    } else {
      setSelectedAssessments(filteredAssessments.map(a => a.id))
    }
  }

  const handleSelectAssessment = (assessmentId: string) => {
    setSelectedAssessments(prev => 
      prev.includes(assessmentId) 
        ? prev.filter(id => id !== assessmentId)
        : [...prev, assessmentId]
    )
  }

  const handleBulkAction = async (action: string) => {
    if (selectedAssessments.length === 0) {
      alert('Please select assessments first')
      return
    }

    const actionNames: { [key: string]: string } = {
      delete: 'delete',
      close: 'close',
      activate: 'activate',
      archive: 'archive'
    }

    if (!confirm(`Are you sure you want to ${actionNames[action]} ${selectedAssessments.length} assessment(s)?`)) {
      return
    }

    setBulkActionLoading(true)
    try {
      const response = await fetch('/api/assessments/bulk-actions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          assessmentIds: selectedAssessments
        }),
      })

      if (response.ok) {
        const data = await response.json()
        alert(data.message)
        setSelectedAssessments([])
        // Refresh the data from the server
        await fetchAssessments()
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Error performing bulk action:', error)
      alert('An error occurred while performing the action')
    } finally {
      setBulkActionLoading(false)
    }
  }

  const handleExportSelected = () => {
    const selectedData = filteredAssessments.filter(a => selectedAssessments.includes(a.id))
    const dataStr = JSON.stringify(selectedData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `assessments-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleIndividualAction = async (action: string, assessmentId: string) => {
    const actionNames: { [key: string]: string } = {
      delete: 'delete',
      close: 'close',
      activate: 'activate',
      archive: 'archive'
    }

    if (!confirm(`Are you sure you want to ${actionNames[action]} this assessment?`)) {
      return
    }

    setBulkActionLoading(true)
    try {
      const response = await fetch('/api/assessments/bulk-actions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          assessmentIds: [assessmentId]
        }),
      })

      if (response.ok) {
        const data = await response.json()
        alert(data.message)
        // Refresh the data from the server
        await fetchAssessments()
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Error performing action:', error)
      alert('An error occurred while performing the action')
    } finally {
      setBulkActionLoading(false)
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
              {selectedAssessments.length > 0 && (
                <div className="flex items-center space-x-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2">
                  <span className="text-gray-300 text-sm">{selectedAssessments.length} selected</span>
                  <button
                    onClick={() => setShowBulkActions(!showBulkActions)}
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              )}
              <button
                onClick={() => router.push('/recruiter/assessments/create')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Create Assessment</span>
              </button>
            </div>
          </div>

          {/* Bulk Actions Panel */}
          {showBulkActions && selectedAssessments.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 border border-gray-700 rounded-xl p-4 mb-6"
            >
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleBulkAction('activate')}
                  disabled={bulkActionLoading}
                  className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <PlayCircle className="h-4 w-4" />
                  <span>Activate</span>
                </button>
                <button
                  onClick={() => handleBulkAction('close')}
                  disabled={bulkActionLoading}
                  className="bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <XCircle className="h-4 w-4" />
                  <span>Close</span>
                </button>
                <button
                  onClick={() => handleBulkAction('archive')}
                  disabled={bulkActionLoading}
                  className="bg-gray-600 hover:bg-gray-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <Archive className="h-4 w-4" />
                  <span>Archive</span>
                </button>
                <button
                  onClick={handleExportSelected}
                  disabled={bulkActionLoading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  disabled={bulkActionLoading}
                  className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </button>
              </div>
            </motion.div>
          )}

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
            <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-semibold text-white">Your Assessments</h2>
                {filteredAssessments.length > 0 && (
                  <button
                    onClick={handleSelectAll}
                    className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
                  >
                    {selectedAssessments.length === filteredAssessments.length ? (
                      <CheckSquare className="h-4 w-4" />
                    ) : (
                      <Square className="h-4 w-4" />
                    )}
                    <span className="text-sm">Select All</span>
                  </button>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <span className="text-gray-400 text-sm">{filteredAssessments.length} assessments</span>
              </div>
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
                      className={`p-6 hover:bg-gray-750 transition-colors ${
                        selectedAssessments.includes(assessment.id) ? 'bg-blue-900/20 border-l-4 border-blue-500' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          {/* Selection Checkbox */}
                          <button
                            onClick={() => handleSelectAssessment(assessment.id)}
                            className="mt-1 text-gray-400 hover:text-white transition-colors"
                          >
                            {selectedAssessments.includes(assessment.id) ? (
                              <CheckSquare className="h-5 w-5 text-blue-400" />
                            ) : (
                              <Square className="h-5 w-5" />
                            )}
                          </button>

                          {/* Assessment Info */}
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              {getAssessmentIcon(assessment.type)}
                              <h3 className="text-lg font-semibold text-white">{assessment.title}</h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getAssessmentTypeColor(assessment.type)}`}>
                                {getAssessmentTypeLabel(assessment.type)}
                              </span>
                              {(assessment as any).status && (assessment as any).status !== 'active' && (
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  (assessment as any).status === 'closed' ? 'bg-yellow-600/20 text-yellow-400 border-yellow-500/30' :
                                  (assessment as any).status === 'archived' ? 'bg-gray-600/20 text-gray-400 border-gray-500/30' :
                                  'bg-green-600/20 text-green-400 border-green-500/30'
                                }`}>
                                  {(assessment as any).status}
                                </span>
                              )}
                            </div>
                            <p className="text-gray-400 text-sm mb-3">{assessment.company}</p>
                            <div className="flex items-center space-x-6 text-sm text-gray-500">
                              <span>{assessment.questions?.length || 0} questions</span>
                              <span>{assessmentResponses.length} responses</span>
                              <span>Avg. score: {avgScore}%</span>
                              <span>Created {new Date(assessment.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
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
                          
                          {/* Individual Actions Dropdown */}
                          <div className="relative group">
                            <button className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg transition-colors">
                              <MoreVertical className="h-4 w-4" />
                            </button>
                            <div className="absolute right-0 top-full mt-1 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                              <div className="py-1">
                                <button
                                  onClick={() => router.push(`/recruiter/assessments/${assessment.id}/edit`)}
                                  className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center space-x-2"
                                >
                                  <Edit className="h-4 w-4" />
                                  <span>Edit</span>
                                </button>
                                {(assessment as any).status !== 'active' ? (
                                  <button
                                    onClick={() => handleIndividualAction('activate', assessment.id)}
                                    className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center space-x-2"
                                  >
                                    <PlayCircle className="h-4 w-4" />
                                    <span>Activate</span>
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleIndividualAction('close', assessment.id)}
                                    className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center space-x-2"
                                  >
                                    <XCircle className="h-4 w-4" />
                                    <span>Close</span>
                                  </button>
                                )}
                                <button
                                  onClick={() => handleIndividualAction('archive', assessment.id)}
                                  className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center space-x-2"
                                >
                                  <Archive className="h-4 w-4" />
                                  <span>Archive</span>
                                </button>
                                <hr className="border-gray-700 my-1" />
                                <button
                                  onClick={() => handleIndividualAction('delete', assessment.id)}
                                  className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors flex items-center space-x-2"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span>Delete</span>
                                </button>
                              </div>
                            </div>
                          </div>
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
