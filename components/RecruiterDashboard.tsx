'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Users, FileText, BarChart3, Eye, Calendar, Building, LogOut, Sparkles, Zap, Cpu, AlertTriangle, Brain } from 'lucide-react'
import { useAuth } from '@/contexts/NextAuthContext'
import { useDatabaseData } from '@/contexts/DatabaseDataContext'
import AssessmentForm from './AssessmentForm'
import AssessmentDisplay from './AssessmentDisplay'
import ReviewAssessment from './ReviewAssessment'
import CreativeAssessmentForm from './CreativeAssessmentForm'
import AdvancedAssessmentBuilder from './AdvancedAssessmentBuilder'
import MultiModalAssessmentBuilder from './MultiModalAssessmentBuilder'
import RecruiterAIAssistant from './RecruiterAIAssistant'
import EnterpriseIntegration from './EnterpriseIntegration'

export default function RecruiterDashboard() {
  const { user, logout } = useAuth()
  const { assessments, responses, createAssessment, getResponsesForAssessment: getAssessmentResponses } = useDatabaseData()
  const [currentView, setCurrentView] = useState<'dashboard' | 'create' | 'creative' | 'advanced' | 'multimodal' | 'assistant' | 'enterprise' | 'assessment' | 'review'>('dashboard')
  const [selectedAssessment, setSelectedAssessment] = useState<any>(null)
  const [newAssessmentData, setNewAssessmentData] = useState<any>(null)
  const [selectedResponse, setSelectedResponse] = useState<any>(null)

  // Filter assessments created by current user
  const userAssessments = assessments.filter((a: any) => a.createdBy === user?.id)

  const handleCreateAssessment = () => {
    setCurrentView('create')
  }

  const handleCreateCreativeAssessment = () => {
    setCurrentView('creative')
  }

  const handleCreateAdvancedAssessment = () => {
    setCurrentView('advanced')
  }

  const handleCreateMultiModalAssessment = () => {
    setCurrentView('multimodal')
  }

  const handleAIAssistant = () => {
    setCurrentView('assistant')
  }

  const handleEnterpriseIntegration = () => {
    setCurrentView('enterprise')
  }

  const handleAssessmentGenerated = (data: any) => {
    setNewAssessmentData(data)
    setCurrentView('assessment')
  }

  const handleViewAssessment = (assessment: any) => {
    setSelectedAssessment(assessment)
    setCurrentView('assessment')
  }

  const handleViewResponse = (response: any, assessment: any) => {
    setSelectedResponse(response)
    setSelectedAssessment(assessment)
    setCurrentView('review')
  }

  if (currentView === 'create') {
    return (
      <AssessmentForm 
        onAssessmentGenerated={handleAssessmentGenerated}
        onBack={() => setCurrentView('dashboard')}
      />
    )
  }

  if (currentView === 'creative') {
    return (
      <CreativeAssessmentForm 
        onAssessmentGenerated={handleAssessmentGenerated}
        onBack={() => setCurrentView('dashboard')}
      />
    )
  }

  if (currentView === 'advanced') {
    return (
      <AdvancedAssessmentBuilder
        onSave={handleAssessmentGenerated}
        onBack={() => setCurrentView('dashboard')}
      />
    )
  }

  if (currentView === 'multimodal') {
    return (
      <MultiModalAssessmentBuilder
        onSave={handleAssessmentGenerated}
        onCancel={() => setCurrentView('dashboard')}
      />
    )
  }

  if (currentView === 'assistant') {
    return <RecruiterAIAssistant />
  }

  if (currentView === 'enterprise') {
    return <EnterpriseIntegration />
  }

  if (currentView === 'assessment' && (newAssessmentData || selectedAssessment)) {
    return (
      <AssessmentDisplay 
        assessmentData={selectedAssessment || newAssessmentData}
        onBack={() => {
          setCurrentView('dashboard')
          setSelectedAssessment(null)
          setNewAssessmentData(null)
        }}
        onTakeAssessment={() => {}} // Recruiters don't take assessments
        hideTestButtons={true}
      />
    )
  }

  if (currentView === 'review' && selectedResponse && selectedAssessment) {
    return (
      <ReviewAssessment 
        assessmentData={selectedAssessment}
        results={selectedResponse}
        onBack={() => {
          setCurrentView('dashboard')
          setSelectedResponse(null)
          setSelectedAssessment(null)
        }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Building className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Recruiter Dashboard</h1>
                <p className="text-sm text-gray-600">{user?.company}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleAIAssistant}
                className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <span className="mr-1">🤖</span>
                AI Assistant
              </button>
              <button
                onClick={handleEnterpriseIntegration}
                className="flex items-center px-3 py-1 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
              >
                <span className="mr-1">🏢</span>
                Enterprise
              </button>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg shadow-sm"
          >
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Assessments</p>
                <p className="text-2xl font-bold text-gray-900">{userAssessments.length}</p>
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
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Candidates</p>
                <p className="text-2xl font-bold text-gray-900">{responses.length}</p>
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
              <BarChart3 className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(responses.reduce((sum: number, r: any) => sum + r.score, 0) / responses.length)}%
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
              <Calendar className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-gray-900">5</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">My Assessments</h2>
          <div className="flex space-x-3">
            <button
              onClick={handleCreateAssessment}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Traditional
            </button>
            <button
              onClick={handleCreateCreativeAssessment}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-colors flex items-center"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Create AI-Powered
            </button>
            <button
              onClick={handleCreateAdvancedAssessment}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-colors flex items-center"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Advanced Builder
            </button>
            <button
              onClick={handleCreateMultiModalAssessment}
              className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:from-green-700 hover:to-teal-700 transition-colors flex items-center"
            >
              <span className="mr-2">🎥</span>
              Video/Audio
            </button>
          </div>
        </div>

        {/* Assessments List */}
        <div className="space-y-4">
          {userAssessments.map((assessment: any, index: number) => {
            const assessmentResponses = getAssessmentResponses(assessment.id)
            return (
              <motion.div
                key={assessment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {assessment.title}
                    </h3>
                    
                    {/* Revolutionary Assessment Indicators */}
                    {(assessment.assessmentType === 'revolutionary' || 
                      (assessment.scenarios && assessment.scenarios.length > 0) || 
                      assessment.questions?.some((q: any) => q.scenario?.type === 'simulation')) && (
                      <div className="flex items-center space-x-2 mb-3">
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
                        {assessment.uniqueFeatures?.includes('ai-powered') && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full flex items-center">
                            <Brain className="h-3 w-3 mr-1" />
                            AI-Powered
                          </span>
                        )}
                      </div>
                    )}
                    
                    <p className="text-gray-600 mb-4">{assessment.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Created: {assessment.createdAt}</span>
                      <span>•</span>
                      <span>{assessmentResponses.length} responses</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewAssessment(assessment)}
                      className="flex items-center px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </button>
                  </div>
                </div>

                {/* Candidate Responses */}
                {assessmentResponses.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Responses</h4>
                    <div className="space-y-2">
                      {assessmentResponses.slice(0, 3).map((response: any) => (
                        <div 
                          key={response.id} 
                          onClick={() => handleViewResponse(response, assessment)}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                              <span className="text-xs font-medium text-blue-600">
                                {response.candidateName.split(' ').map((n: string) => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{response.candidateName}</p>
                              <p className="text-xs text-gray-500">{response.candidateEmail}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="text-right">
                              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                response.score >= 90 ? 'bg-green-100 text-green-800' :
                                response.score >= 70 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {response.score}%
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(response.completedAt).toLocaleDateString()}
                              </p>
                            </div>
                            <Eye className="h-4 w-4 text-gray-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
