'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Clock, CheckCircle, Download, Share2, Star } from 'lucide-react'

interface AssessmentDisplayProps {
  assessmentData: any
  onBack: () => void
  onTakeAssessment: () => void
  hideTestButtons?: boolean
}

export default function AssessmentDisplay({ assessmentData, onBack, onTakeAssessment, hideTestButtons = false }: AssessmentDisplayProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'questions' | 'criteria'>('overview')

  // Handle case where assessmentData is null or undefined
  if (!assessmentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Assessment Not Found</h2>
          <p className="text-gray-600 mb-6">The assessment data could not be loaded.</p>
          <button
            onClick={onBack}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  const handleExport = () => {
    if (!assessmentData) return
    
    const dataStr = JSON.stringify(assessmentData, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    const exportFileDefaultName = `${assessmentData.jobTitle}_assessment.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'technical': return 'bg-blue-100 text-blue-800'
      case 'problem-solving': return 'bg-purple-100 text-purple-800'
      case 'behavioral': return 'bg-indigo-100 text-indigo-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={onBack}
                className="flex items-center text-blue-100 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Form
              </button>
              <div className="flex space-x-4">
                {!hideTestButtons && (
                  <button
                    onClick={onTakeAssessment}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center transition-colors"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Take Assessment
                  </button>
                )}
                <button
                  onClick={handleExport}
                  className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg flex items-center transition-colors"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </button>
                <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg flex items-center transition-colors">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </button>
              </div>
            </div>
            
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2">
                {assessmentData.jobTitle || 'Untitled'} Assessment
              </h1>
              <p className="text-blue-100 text-lg">
                {assessmentData.company || 'Company'}
              </p>
              <div className="flex justify-center items-center mt-4 space-x-6">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>{assessmentData.timeLimit || 60} minutes</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span>{assessmentData.questions?.length || 0} questions</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-5 w-5 mr-2" />
                  <span>AI Generated</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-8">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'questions', label: 'Questions' },
                { id: 'criteria', label: 'Evaluation Criteria' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="p-8">
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">
                    Assessment Instructions
                  </h3>
                  <p className="text-blue-800">
                    {assessmentData.instructions || 'No specific instructions provided for this assessment.'}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Question Breakdown</h4>
                    <div className="space-y-2">
                      {assessmentData.questions && assessmentData.questions.length > 0 ? (
                        Object.entries(
                          assessmentData.questions.reduce((acc: any, q: any) => {
                            acc[q.type] = (acc[q.type] || 0) + 1
                            return acc
                          }, {})
                        ).map(([type, count]) => (
                          <div key={type} className="flex justify-between">
                            <span className="capitalize text-gray-700">{type}:</span>
                            <span className="font-medium text-gray-900">{count as number}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm">No questions available</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Difficulty Levels</h4>
                    <div className="space-y-2">
                      {assessmentData.questions && assessmentData.questions.length > 0 ? (
                        Object.entries(
                          assessmentData.questions.reduce((acc: any, q: any) => {
                            acc[q.difficulty] = (acc[q.difficulty] || 0) + 1
                            return acc
                          }, {})
                        ).map(([difficulty, count]) => (
                          <div key={difficulty} className="flex justify-between">
                            <span className="text-gray-700">{difficulty}:</span>
                            <span className="font-medium text-gray-900">{count as number}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm">No difficulty data available</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'questions' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                {assessmentData.questions && assessmentData.questions.length > 0 ? (
                  assessmentData.questions.map((question: any, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Question {index + 1}
                        </h3>
                        <div className="flex space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(question.type)}`}>
                            {question.type}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                            {question.difficulty}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <span className="text-sm text-gray-500 font-medium">Category: {question.category}</span>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Question:</h4>
                      <p className="text-gray-700">{question.question}</p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Expected Answer / Evaluation Points:</h4>
                      <p className="text-gray-700 text-sm">{question.expectedAnswer}</p>
                    </div>
                  </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No questions available for this assessment.</p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'criteria' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Evaluation Criteria & Weightings
                  </h3>
                  <div className="space-y-4">
                    {assessmentData.criteria && Object.entries(assessmentData.criteria).length > 0 ? (
                      Object.entries(assessmentData.criteria).map(([criterion, weight]) => (
                        <div key={criterion} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                            <span className="font-medium text-gray-900 capitalize">
                              {criterion.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{ width: `${weight}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-600">
                              {weight as number}%
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        <p>No evaluation criteria defined for this assessment.</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <h4 className="font-semibold text-yellow-900 mb-2">Scoring Guidelines</h4>
                  <ul className="text-yellow-800 text-sm space-y-1">
                    <li>• Each question is scored from 0-10 points</li>
                    <li>• Final score is calculated based on the weighted criteria above</li>
                    <li>• Minimum passing score: 70%</li>
                    <li>• Top candidates (85%+) proceed to next round</li>
                  </ul>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
