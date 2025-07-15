'use client'
export const dynamic = "force-dynamic"

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Edit, Play, Share, Eye, Clock, Users, FileText, Sparkles, UserPlus, X, Calendar, Search } from 'lucide-react'
import { useAuth } from '@/contexts/NextAuthContext'
import { useDatabaseData } from '@/contexts/DatabaseDataContext'
import Navigation from '@/components/Navigation'

export default function ViewAssessmentPage() {
  const { user, isAuthenticated } = useAuth()
  const { assessments, getResponsesForAssessment } = useDatabaseData()
  const router = useRouter()
  const params = useParams()
  const assessmentId = params.id as string

  const [assessment, setAssessment] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [candidates, setCandidates] = useState<any[]>([])
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([])
  const [dueDate, setDueDate] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [assignLoading, setAssignLoading] = useState(false)
  const [assignments, setAssignments] = useState<any[]>([])
  const [loadingCandidates, setLoadingCandidates] = useState(false)

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'recruiter') {
      router.push('/auth')
      return
    }

    // Find the assessment
    const foundAssessment = assessments.find(a => a.id === assessmentId)
    if (foundAssessment) {
      setAssessment(foundAssessment)
      loadAssignments()
    } else {
      // Assessment not found in local data, could fetch from API
      console.log('Assessment not found:', assessmentId)
    }
    setLoading(false)
  }, [isAuthenticated, user, router, assessmentId, assessments])

  const loadCandidates = async () => {
    setLoadingCandidates(true)
    try {
      const response = await fetch(`/api/candidates?search=${searchTerm}`)
      if (response.ok) {
        const data = await response.json()
        setCandidates(data.candidates)
      }
    } catch (error) {
      console.error('Error loading candidates:', error)
    }
    setLoadingCandidates(false)
  }

  const loadAssignments = async () => {
    try {
      const response = await fetch(`/api/assessments/assign?assessmentId=${assessmentId}`)
      if (response.ok) {
        const data = await response.json()
        setAssignments(data.assignments)
      }
    } catch (error) {
      console.error('Error loading assignments:', error)
    }
  }

  const handleAssignToUsers = async () => {
    if (selectedCandidates.length === 0 || !dueDate) {
      alert('Please select candidates and set a due date')
      return
    }

    setAssignLoading(true)
    try {
      const response = await fetch('/api/assessments/assign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assessmentId,
          candidateIds: selectedCandidates,
          dueDate
        }),
      })

      if (response.ok) {
        const data = await response.json()
        alert(`Assessment assigned to ${data.assignments.length} candidates successfully!`)
        setShowAssignModal(false)
        setSelectedCandidates([])
        setDueDate('')
        loadAssignments() // Reload assignments
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Failed to assign assessment')
      }
    } catch (error) {
      console.error('Error assigning assessment:', error)
      alert('Failed to assign assessment')
    }
    setAssignLoading(false)
  }

  const openAssignModal = async () => {
    setShowAssignModal(true)
    await loadCandidates()
  }

  const getAssessmentIcon = (type: string | undefined) => {
    switch (type) {
      case 'creative': 
      case 'self-modifying': 
      case 'video': 
      case 'audio': 
      case 'multi-modal': 
      case 'ai-powered':
        return <Sparkles className="h-6 w-6 text-purple-400" />
      default: 
        return <FileText className="h-6 w-6 text-blue-400" />
    }
  }

  const getAssessmentTypeLabel = (type: string | undefined) => {
    switch (type) {
      case 'creative': 
      case 'self-modifying': 
      case 'video': 
      case 'audio': 
      case 'multi-modal': 
      case 'ai-powered':
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
      case 'ai-powered':
        return 'bg-purple-600/20 text-purple-400 border-purple-500/30'
      default: 
        return 'bg-blue-600/20 text-blue-400 border-blue-500/30'
    }
  }

  if (!isAuthenticated || loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
      </div>
    )
  }

  if (!assessment) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navigation userType="recruiter" />
        <div className="pt-24 pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white mb-4">Assessment Not Found</h1>
              <p className="text-gray-400 mb-6">The assessment you're looking for doesn't exist or you don't have permission to view it.</p>
              <button
                onClick={() => router.push('/recruiter/assessments')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 mx-auto transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Assessments</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const responses = getResponsesForAssessment(assessment.id)
  const avgScore = responses.length > 0 
    ? Math.round(responses.reduce((sum, r) => sum + r.score, 0) / responses.length)
    : 0

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation userType="recruiter" />
      
      <div className="pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/recruiter/assessments')}
                className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  {getAssessmentIcon(assessment.type)}
                  <h1 className="text-3xl font-bold text-white">{assessment.title}</h1>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getAssessmentTypeColor(assessment.type)}`}>
                    {getAssessmentTypeLabel(assessment.type)}
                  </span>
                </div>
                <p className="text-gray-400">{assessment.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={openAssignModal}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <UserPlus className="h-4 w-4" />
                <span>Assign to Candidates</span>
              </button>
              <button
                onClick={() => router.push(`/recruiter/assessments/${assessment.id}/preview`)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Play className="h-4 w-4" />
                <span>Preview</span>
              </button>
              <button
                onClick={() => {
                  const shareUrl = `${window.location.origin}/assessment/${assessment.id}`
                  navigator.clipboard.writeText(shareUrl)
                  alert('Assessment link copied to clipboard!')
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Share className="h-4 w-4" />
                <span>Share</span>
              </button>
              {responses.length > 0 && (
                <button
                  onClick={() => router.push(`/recruiter/assessments/${assessment.id}/responses`)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <Users className="h-4 w-4" />
                  <span>View Responses</span>
                </button>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Questions</p>
                  <p className="text-2xl font-bold text-white">{assessment.questions?.length || 0}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-400" />
              </div>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Duration</p>
                  <p className="text-2xl font-bold text-white">{assessment.duration}min</p>
                </div>
                <Clock className="h-8 w-8 text-green-400" />
              </div>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Assigned</p>
                  <p className="text-2xl font-bold text-white">{assignments.length}</p>
                </div>
                <UserPlus className="h-8 w-8 text-indigo-400" />
              </div>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Responses</p>
                  <p className="text-2xl font-bold text-white">{responses.length}</p>
                </div>
                <Users className="h-8 w-8 text-purple-400" />
              </div>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Avg. Score</p>
                  <p className="text-2xl font-bold text-white">{avgScore}%</p>
                </div>
                <Eye className="h-8 w-8 text-yellow-400" />
              </div>
            </div>
          </div>

          {/* Assessment Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Assessment Content */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-700">
                  <h2 className="text-xl font-semibold text-white">Assessment Questions</h2>
                </div>
                <div className="p-6">
                  {assessment.questions && assessment.questions.length > 0 ? (
                    <div className="space-y-6">
                      {assessment.questions.map((question: any, index: number) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-gray-700/50 rounded-lg p-4"
                        >
                          <div className="flex items-start space-x-3">
                            <span className="bg-blue-600 text-white text-sm font-medium px-2 py-1 rounded-full min-w-[24px] text-center">
                              {index + 1}
                            </span>
                            <div className="flex-1">
                              <h3 className="text-white font-medium mb-2">{question.question || question.text}</h3>
                              {question.type && (
                                <span className="inline-block bg-gray-600 text-gray-300 text-xs px-2 py-1 rounded-full mb-2">
                                  {question.type}
                                </span>
                              )}
                              {question.options && (
                                <div className="mt-3 space-y-2">
                                  {question.options.map((option: string, optIndex: number) => (
                                    <div key={optIndex} className="flex items-center space-x-2">
                                      <span className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center text-xs text-gray-300">
                                        {String.fromCharCode(65 + optIndex)}
                                      </span>
                                      <span className="text-gray-300 text-sm">{option}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {question.expectedAnswer && (
                                <div className="mt-3 p-3 bg-gray-800 rounded-lg">
                                  <p className="text-gray-400 text-xs mb-1">Expected Answer:</p>
                                  <p className="text-gray-300 text-sm">{question.expectedAnswer}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-400">No questions found in this assessment</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Assessment Info */}
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Assessment Info</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-400 text-sm">Company</p>
                    <p className="text-white">{assessment.company}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Created</p>
                    <p className="text-white">{new Date(assessment.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Status</p>
                    <span className="inline-block bg-green-600/20 text-green-400 text-sm px-2 py-1 rounded-full">
                      Active
                    </span>
                  </div>
                </div>
              </div>

              {/* AI Features (if applicable) */}
              {assessment.type === 'ai-powered' && (
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">AI Features</h3>
                  <div className="space-y-3">
                    {assessment.creativeType && (
                      <div>
                        <p className="text-gray-400 text-sm">Creative Type</p>
                        <p className="text-white">{assessment.creativeType}</p>
                      </div>
                    )}
                    {assessment.scenario && (
                      <div>
                        <p className="text-gray-400 text-sm">Scenario</p>
                        <p className="text-white">{assessment.scenario}</p>
                      </div>
                    )}
                    {assessment.selfModifying && (
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                        <span className="text-gray-300 text-sm">Self-Modifying Questions</span>
                      </div>
                    )}
                    {assessment.modalType && (
                      <div>
                        <p className="text-gray-400 text-sm">Modal Type</p>
                        <p className="text-white">{assessment.modalType}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => router.push(`/recruiter/assessments/${assessment.id}/preview`)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                  >
                    <Play className="h-4 w-4" />
                    <span>Preview Assessment</span>
                  </button>
                  <button
                    onClick={() => {
                      const shareUrl = `${window.location.origin}/assessment/${assessment.id}`
                      navigator.clipboard.writeText(shareUrl)
                      alert('Assessment link copied to clipboard!')
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                  >
                    <Share className="h-4 w-4" />
                    <span>Copy Share Link</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Assignment Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Assign Assessment to Candidates</h2>
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              {/* Due Date */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Calendar className="h-4 w-4 inline mr-2" />
                  Due Date
                </label>
                <input
                  type="datetime-local"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* Search */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search candidates..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value)
                      loadCandidates()
                    }}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Candidates List */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Select Candidates ({selectedCandidates.length} selected)
                </label>
                
                {loadingCandidates ? (
                  <div className="text-center py-4">
                    <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-gray-400 mt-2">Loading candidates...</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {candidates.map((candidate) => (
                      <label
                        key={candidate._id}
                        className="flex items-center p-3 bg-gray-700 hover:bg-gray-600 rounded-lg cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCandidates.includes(candidate._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCandidates([...selectedCandidates, candidate._id])
                            } else {
                              setSelectedCandidates(selectedCandidates.filter(id => id !== candidate._id))
                            }
                          }}
                          className="mr-3 rounded border-gray-500 text-indigo-600 focus:ring-indigo-500"
                        />
                        <div className="flex-1">
                          <p className="text-white font-medium">{candidate.name}</p>
                          <p className="text-gray-400 text-sm">{candidate.email}</p>
                        </div>
                      </label>
                    ))}
                    
                    {candidates.length === 0 && !loadingCandidates && (
                      <div className="text-center py-8">
                        <Users className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-400">No candidates found</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-gray-700">
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignToUsers}
                  disabled={assignLoading || selectedCandidates.length === 0 || !dueDate}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  {assignLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Assigning...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4" />
                      <span>Assign Assessment</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
