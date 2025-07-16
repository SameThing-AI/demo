'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FileText, Clock, Trophy, Star, Eye, Play, CheckCircle, LogOut, User, Zap, Calendar, AlertCircle, Cpu, AlertTriangle } from 'lucide-react'
import { useAuth } from '@/contexts/NextAuthContext'
import { useDatabaseData } from '@/contexts/DatabaseDataContext'
import TakeAssessment from './TakeAssessment'
import InteractiveAssessment from './InteractiveAssessment'
import SelfModifyingAssessment from './SelfModifyingAssessment'
import MultiModalTakeAssessment from './MultiModalTakeAssessment'
import AICoaching from './AICoaching'
import AssessmentResults from './AssessmentResults'
import ReviewAssessment from './ReviewAssessment'

export default function CandidateDashboard() {
  const { user, logout } = useAuth()
  const { assessments, getAssessmentsForCandidate, getCandidateResponses } = useDatabaseData()
  const [currentView, setCurrentView] = useState<'dashboard' | 'take' | 'results' | 'review' | 'coaching'>('dashboard')
  const [selectedAssessment, setSelectedAssessment] = useState<any>(null)
  const [currentResults, setCurrentResults] = useState<any>(null)
  const [assignedAssessments, setAssignedAssessments] = useState<any[]>([])
  const [loadingAssignments, setLoadingAssignments] = useState(true)

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
    loadAssignedAssessments()
  }, [])

  const loadAssignedAssessments = async () => {
    setLoadingAssignments(true)
    try {
      const response = await fetch('/api/assignments')
      if (response.ok) {
        const data = await response.json()
        setAssignedAssessments(data.assignments)
      }
    } catch (error) {
      console.error('Error loading assigned assessments:', error)
    }
    setLoadingAssignments(false)
  }

  const updateAssignmentStatus = async (assignmentId: string, status: string) => {
    try {
      const response = await fetch('/api/assignments', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ assignmentId, status }),
      })
      
      if (response.ok) {
        loadAssignedAssessments() // Reload assignments
      }
    } catch (error) {
      console.error('Error updating assignment status:', error)
    }
  }

  const handleTakeAssessment = (assessment: any, assignmentId?: string) => {
    setSelectedAssessment({ ...assessment, assignmentId })
    setCurrentView('take')
    
    // Update assignment status to 'started' if it's an assigned assessment
    if (assignmentId) {
      updateAssignmentStatus(assignmentId, 'started')
    }
  }

  const handleViewResults = (assessmentWithResponse: any) => {
    const assessment = assessments.find(a => a.id === assessmentWithResponse.assessmentId)
    if (assessment) {
      setSelectedAssessment(assessment)
      setCurrentResults(assessmentWithResponse)
      setCurrentView('results')
    }
  }

  const handleAssessmentComplete = (resultsData: any) => {
    // Mark assignment as completed if it was an assigned assessment
    if (selectedAssessment?.assignmentId) {
      updateAssignmentStatus(selectedAssessment.assignmentId, 'completed')
    }
    
    setCurrentResults(resultsData)
    setCurrentView('results')
  }

  const handleReviewAssessment = () => {
    setCurrentView('review')
  }

  const handleAICoaching = () => {
    setCurrentView('coaching')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in-progress': return 'bg-yellow-100 text-yellow-800'
      case 'available': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (currentView === 'take' && selectedAssessment) {
    // Check assessment type and route appropriately
    if (selectedAssessment.type === 'multi-modal' || selectedAssessment.modalType) {
      return (
        <MultiModalTakeAssessment
          assessment={selectedAssessment}
          onComplete={(responses) => {
            // Convert multi-modal responses to standard format
            const resultsData = {
              score: Math.round(responses.reduce((sum, r) => sum + (r.analysis?.overallScore || 0), 0) / responses.length),
              responses: responses,
              feedback: responses.flatMap(r => r.analysis?.feedback || []),
              assessmentId: selectedAssessment.id,
              candidateId: user?.id,
              completedAt: new Date().toISOString()
            }
            handleAssessmentComplete(resultsData)
          }}
        />
      )
    } else if (selectedAssessment.type === 'self-modifying' || selectedAssessment.selfModifying) {
      return (
        <SelfModifyingAssessment
          assessmentData={selectedAssessment}
          onBack={() => setCurrentView('dashboard')}
          onComplete={handleAssessmentComplete}
        />
      )
    } else if (selectedAssessment.creativeType || selectedAssessment.type === 'creative') {
      return (
        <InteractiveAssessment
          assessmentData={selectedAssessment}
          onBack={() => setCurrentView('dashboard')}
          onComplete={handleAssessmentComplete}
        />
      )
    } else {
      return (
        <TakeAssessment
          assessmentData={selectedAssessment}
          onBack={() => setCurrentView('dashboard')}
          onComplete={handleAssessmentComplete}
        />
      )
    }
  }

  if (currentView === 'results' && currentResults) {
    return (
      <AssessmentResults
        results={currentResults}
        onBack={handleReviewAssessment}
        onStartNew={() => setCurrentView('dashboard')}
      />
    )
  }

  if (currentView === 'review' && selectedAssessment && currentResults) {
    return (
      <ReviewAssessment
        assessmentData={selectedAssessment}
        results={currentResults}
        onBack={() => setCurrentView('results')}
      />
    )
  }

  if (currentView === 'coaching') {
    return <AICoaching />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <User className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Candidate Dashboard</h1>
                <p className="text-sm text-gray-600">Assessment Portal</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Welcome, {user?.name}</span>
              <button
                onClick={logout}
                className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg shadow-sm"
          >
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-indigo-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Assigned</p>
                <p className="text-2xl font-bold text-gray-900">{assignedAssessments.length}</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-lg shadow-sm"
          >
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Available</p>
                <p className="text-2xl font-bold text-gray-900">{availableAssessments.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-lg shadow-sm"
          >
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{completedAssessments.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-lg shadow-sm"
          >
            <div className="flex items-center">
              <Trophy className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Best Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {candidateResponses.length > 0 
                    ? Math.max(...candidateResponses.map(r => r.score || 0)) + '%'
                    : '-%'
                  }
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-lg shadow-sm"
          >
            <div className="flex items-center">
              <Star className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {candidateResponses.length > 0 
                    ? Math.round(candidateResponses.reduce((sum, r) => sum + (r.score || 0), 0) / candidateResponses.length) + '%'
                    : '-%'
                  }
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 rounded-lg text-white">
              <h3 className="text-xl font-semibold mb-2">AI Coaching</h3>
              <p className="mb-4 opacity-90">Get personalized coaching based on your assessment performance</p>
              <button
                onClick={handleAICoaching}
                className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Start Coaching
              </button>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-teal-600 p-6 rounded-lg text-white">
              <h3 className="text-xl font-semibold mb-2">Assessment Hub</h3>
              <p className="mb-4 opacity-90">View all your assessments and track your progress</p>
              <div className="text-2xl font-bold mb-1">
                {candidateResponses.length > 0 
                  ? Math.round(candidateResponses.reduce((sum, r) => sum + (r.score || 0), 0) / candidateResponses.length)
                  : 0}%
              </div>
              <div className="text-sm opacity-75">Average Score</div>
            </div>
          </div>
        </div>

        {/* Assigned Assessments */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Assigned Assessments</h2>
          {loadingAssignments ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading assigned assessments...</p>
            </div>
          ) : assignedAssessments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assignedAssessments.map((assignment, index) => {
                const assessment = assignment.assessmentId
                const isOverdue = new Date(assignment.dueDate) < new Date()
                const daysLeft = Math.ceil((new Date(assignment.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                
                return (
                  <motion.div
                    key={assignment._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border-l-4 ${
                      isOverdue ? 'border-red-500' : assignment.status === 'completed' ? 'border-green-500' : 'border-indigo-500'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {assessment.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">{assessment.company}</p>
                        <p className="text-xs text-gray-500 mb-2">Assigned by: {assignment.assignedBy.name}</p>
                        
                        {/* Revolutionary Assessment Indicators for Assigned Assessments */}
                        {(assessment.assessmentType === 'revolutionary' || 
                          (assessment.scenarios && assessment.scenarios.length > 0) || 
                          assessment.questions?.some((q: any) => q.scenario?.type === 'simulation')) && (
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full flex items-center">
                              <Zap className="h-3 w-3 mr-1" />
                              Revolutionary
                            </span>
                            {assessment.scenarios?.some((s: any) => s.type === 'simulation') && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full flex items-center">
                                <Cpu className="h-3 w-3 mr-1" />
                                Live Simulation
                              </span>
                            )}
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center text-gray-600">
                            <Clock className="h-4 w-4 mr-1" />
                            {assessment.duration}min
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Calendar className="h-4 w-4 mr-1" />
                            Due: {new Date(assignment.dueDate).toLocaleDateString()}
                          </div>
                        </div>
                        
                        {isOverdue && assignment.status !== 'completed' && (
                          <div className="flex items-center text-red-600 text-sm mt-2">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            Overdue by {Math.abs(daysLeft)} day(s)
                          </div>
                        )}
                        
                        {!isOverdue && assignment.status !== 'completed' && daysLeft <= 3 && (
                          <div className="flex items-center text-orange-600 text-sm mt-2">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            Due in {daysLeft} day(s)
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        assignment.status === 'completed' ? 'bg-green-100 text-green-800' :
                        assignment.status === 'started' ? 'bg-yellow-100 text-yellow-800' :
                        isOverdue ? 'bg-red-100 text-red-800' :
                        'bg-indigo-100 text-indigo-800'
                      }`}>
                        {assignment.status === 'completed' ? 'Completed' :
                         assignment.status === 'started' ? 'In Progress' :
                         isOverdue ? 'Overdue' : 'Assigned'}
                      </span>
                      
                      {assignment.status !== 'completed' && (
                        <button
                          onClick={() => handleTakeAssessment(assignment.assessmentId, assignment._id)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2 transition-colors"
                        >
                          <Play className="h-4 w-4" />
                          <span>{assignment.status === 'started' ? 'Continue' : 'Start'}</span>
                        </button>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8 bg-white rounded-lg shadow-sm">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Assigned Assessments</h3>
              <p className="text-gray-600">You don't have any assessments assigned to you yet.</p>
            </div>
          )}
        </div>

        {/* Available Assessments */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Assessments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableAssessments.map((assessment, index) => (
              <motion.div
                key={assessment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {assessment.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{assessment.company}</p>
                    
                    {/* Revolutionary Assessment Indicators */}
                    {(assessment.assessmentType === 'revolutionary' || 
                      (assessment.scenarios && assessment.scenarios.length > 0) || 
                      assessment.questions?.some((q: any) => q.scenario?.type === 'simulation')) && (
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full flex items-center">
                          <Zap className="h-3 w-3 mr-1" />
                          Revolutionary
                        </span>
                        {assessment.scenarios?.some((s: any) => s.type === 'simulation') && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full flex items-center">
                            <Cpu className="h-3 w-3 mr-1" />
                            Live Simulation
                          </span>
                        )}
                        {assessment.uniqueFeatures?.includes('plot-twists') && (
                          <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full flex items-center">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Plot Twists
                          </span>
                        )}
                      </div>
                    )}
                    
                    <div className="flex space-x-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Available
                      </span>
                      {(assessment.creativeType || assessment.type === 'creative') && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          AI Interactive
                        </span>
                      )}
                      {(assessment.type === 'self-modifying' || assessment.selfModifying) && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800">
                          Self-Adapting
                        </span>
                      )}
                      {(assessment.type === 'multi-modal' || assessment.modalType) && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {assessment.modalType === 'video' ? '📹 Video' : 
                           assessment.modalType === 'audio' ? '🎤 Audio' : 
                           '🎥 Multi-Modal'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">{assessment.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    {assessment.duration} min
                  </div>
                  <button
                    onClick={() => handleTakeAssessment(assessment)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center ${
                      assessment.type === 'multi-modal' || assessment.modalType
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : assessment.creativeType || assessment.type === 'creative'
                        ? 'bg-purple-600 text-white hover:bg-purple-700'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {assessment.type === 'multi-modal' || assessment.modalType ? (
                      <>
                        <span className="mr-1">🎥</span>
                        Start Recording
                      </>
                    ) : assessment.creativeType || assessment.type === 'creative' ? (
                      <>
                        <Zap className="h-4 w-4 mr-1" />
                        Start Interactive
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-1" />
                        Start
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Completed Assessments */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Completed Assessments</h2>
          <div className="space-y-4">
            {completedAssessments.map((assessment, index) => (
              <motion.div
                key={assessment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {assessment.title}
                      </h3>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Completed
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{assessment.company}</p>
                    <p className="text-gray-600 text-sm">{assessment.description}</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${getScoreColor(assessment.score || 0)}`}>
                      {assessment.score}%
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(assessment.completedAt).toLocaleDateString()}
                    </p>
                    <button
                      onClick={() => handleViewResults(assessment)}
                      className="mt-2 flex items-center text-blue-600 hover:text-blue-800 text-sm transition-colors"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Results
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {completedAssessments.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No completed assessments yet</p>
              <p className="text-sm text-gray-400">Take your first assessment to see results here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
