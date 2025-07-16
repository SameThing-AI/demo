'use client'
export const dynamic = "force-dynamic"

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Download, Eye, Calendar, Clock, User, FileText, Star, TrendingUp, Award } from 'lucide-react'
import { useAuth } from '@/contexts/NextAuthContext'
import { useDatabaseData } from '@/contexts/DatabaseDataContext'
import Navigation from '@/components/Navigation'

// Helper function to get grade from score
const getGradeFromScore = (score: number): string => {
  if (score >= 90) return 'A+'
  if (score >= 80) return 'A'
  if (score >= 70) return 'B'
  if (score >= 60) return 'C'
  if (score >= 50) return 'D'
  return 'F'
}

export default function AssessmentResponsesPage() {
  const { user, isAuthenticated } = useAuth()
  const { assessments, getResponsesForAssessment } = useDatabaseData()
  const router = useRouter()
  const params = useParams()
  const assessmentId = params.id as string

  const [assessment, setAssessment] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedResponse, setSelectedResponse] = useState<any>(null)

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'recruiter') {
      router.push('/auth')
      return
    }

    // Find the assessment
    const foundAssessment = assessments.find(a => a.id === assessmentId)
    if (foundAssessment) {
      setAssessment(foundAssessment)
    } else {
      console.log('Assessment not found:', assessmentId)
    }
    setLoading(false)
  }, [isAuthenticated, user, router, assessmentId, assessments])

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

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation userType="recruiter" />
      
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push(`/recruiter/assessments/${assessmentId}`)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-white">{assessment.title} - Responses</h1>
                <p className="text-gray-400">{assessment.company} • {responses.length} responses</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Responses</p>
                  <p className="text-2xl font-bold text-white">{responses.length}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-400" />
              </div>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Average Score</p>
                  <p className="text-2xl font-bold text-white">
                    {responses.length > 0 
                      ? Math.round(responses.reduce((sum, r) => sum + r.score, 0) / responses.length)
                      : 0}%
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-400" />
              </div>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Top Score</p>
                  <p className="text-2xl font-bold text-white">
                    {responses.length > 0 ? Math.max(...responses.map(r => r.score)) : 0}%
                  </p>
                </div>
                <Award className="h-8 w-8 text-yellow-400" />
              </div>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Completion Rate</p>
                  <p className="text-2xl font-bold text-white">
                    {responses.length > 0 ? Math.round((responses.filter(r => r.completedAt).length / responses.length) * 100) : 0}%
                  </p>
                </div>
                <Clock className="h-8 w-8 text-purple-400" />
              </div>
            </div>
          </div>

          {/* Responses List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Responses List */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white mb-4">Candidate Responses</h2>
              {responses.length > 0 ? (
                responses.map((response) => (
                  <motion.div
                    key={response.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`bg-gray-800 border border-gray-700 rounded-xl p-6 cursor-pointer transition-all hover:bg-gray-750 ${
                      selectedResponse?.id === response.id ? 'border-blue-500' : ''
                    }`}
                    onClick={() => setSelectedResponse(response)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{response.candidateName || 'Anonymous'}</h3>
                          <p className="text-gray-400 text-sm">{response.candidateEmail}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${
                          response.score >= 80 ? 'text-green-400' : 
                          response.score >= 60 ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {response.score}%
                        </div>
                        <p className="text-gray-400 text-sm">{getGradeFromScore(response.score)}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span>Completed: {new Date(response.completedAt).toLocaleDateString()}</span>
                      <span>Time: {Math.round((response.timeSpent || 0) / 60)}min</span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No Responses Yet</h3>
                  <p className="text-gray-400">Candidates haven't submitted any responses to this assessment.</p>
                </div>
              )}
            </div>

            {/* Response Details */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white mb-4">Response Details</h2>
              {selectedResponse ? (
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                  {/* Candidate Info */}
                  <div className="border-b border-gray-700 pb-4 mb-6">
                    <h3 className="text-lg font-semibold text-white mb-2">{selectedResponse.candidateName || 'Anonymous'}</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Email</p>
                        <p className="text-white">{selectedResponse.candidateEmail || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Score</p>
                        <p className="text-white font-semibold">{selectedResponse.score}% ({getGradeFromScore(selectedResponse.score)})</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Time Spent</p>
                        <p className="text-white">{Math.round((selectedResponse.timeSpent || 0) / 60)} minutes</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Completed</p>
                        <p className="text-white">{new Date(selectedResponse.completedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Answers */}
                  <div className="space-y-6">
                    <h4 className="font-semibold text-white">Answers</h4>
                    {selectedResponse.answers && (
                      Array.isArray(selectedResponse.answers) ? (
                        // Handle array format (as per schema)
                        selectedResponse.answers.map((answer: any, idx: number) => {
                          const question = assessment.questions?.[idx]
                          return (
                            <div key={idx} className="border-b border-gray-700 pb-4 last:border-b-0">
                              <div className="mb-3">
                                <p className="text-gray-400 text-sm mb-1">Question {idx + 1}</p>
                                <p className="text-white font-medium">{question?.question || 'Question not found'}</p>
                              </div>
                              <div className="bg-gray-700 rounded-lg p-4">
                                {typeof answer === 'string' ? (
                                  <p className="text-gray-300">{answer}</p>
                                ) : typeof answer === 'object' && answer !== null ? (
                                  <pre className="text-gray-300 text-sm whitespace-pre-wrap overflow-x-auto">
                                    {JSON.stringify(answer, null, 2)}
                                  </pre>
                                ) : (
                                  <p className="text-gray-300">{answer?.toString() || 'No answer provided'}</p>
                                )}
                              </div>
                              {question?.expectedAnswer && (
                                <div className="mt-2 p-3 bg-blue-900/20 rounded-lg">
                                  <p className="text-blue-400 text-xs mb-1">Expected Answer:</p>
                                  <p className="text-blue-300 text-sm">{question.expectedAnswer}</p>
                                </div>
                              )}
                            </div>
                          )
                        })
                      ) : (
                        // Handle object format (for backward compatibility)
                        Object.entries(selectedResponse.answers).map(([questionIndex, answer], idx: number) => {
                          const question = assessment.questions?.[parseInt(questionIndex)]
                          return (
                            <div key={idx} className="border-b border-gray-700 pb-4 last:border-b-0">
                              <div className="mb-3">
                                <p className="text-gray-400 text-sm mb-1">Question {parseInt(questionIndex) + 1}</p>
                                <p className="text-white font-medium">{question?.question || 'Question not found'}</p>
                              </div>
                              <div className="bg-gray-700 rounded-lg p-4">
                                {typeof answer === 'string' ? (
                                  <p className="text-gray-300">{answer}</p>
                                ) : typeof answer === 'object' && answer !== null ? (
                                  <pre className="text-gray-300 text-sm whitespace-pre-wrap overflow-x-auto">
                                    {JSON.stringify(answer, null, 2)}
                                  </pre>
                                ) : (
                                  <p className="text-gray-300">{answer?.toString() || 'No answer provided'}</p>
                                )}
                              </div>
                              {question?.expectedAnswer && (
                                <div className="mt-2 p-3 bg-blue-900/20 rounded-lg">
                                  <p className="text-blue-400 text-xs mb-1">Expected Answer:</p>
                                  <p className="text-blue-300 text-sm">{question.expectedAnswer}</p>
                                </div>
                              )}
                            </div>
                          )
                        })
                      )
                    )}
                  </div>

                  {/* AI Feedback */}
                  {selectedResponse.feedback && (
                    <div className="mt-6 pt-6 border-t border-gray-700">
                      <h4 className="font-semibold text-white mb-3">AI Feedback</h4>
                      <div className="bg-purple-900/20 rounded-lg p-4">
                        {typeof selectedResponse.feedback === 'string' ? (
                          <p className="text-purple-300 text-sm">{selectedResponse.feedback}</p>
                        ) : typeof selectedResponse.feedback === 'object' && selectedResponse.feedback !== null ? (
                          <div className="space-y-3">
                            {Object.entries(selectedResponse.feedback).map(([key, value]) => (
                              <div key={key} className="border-b border-purple-700/30 pb-2 last:border-b-0">
                                <p className="text-purple-400 text-xs uppercase tracking-wide mb-1">
                                  {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                                </p>
                                <p className="text-purple-300 text-sm">
                                  {typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-purple-300 text-sm">{selectedResponse.feedback?.toString() || 'No feedback available'}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-12 text-center">
                  <Eye className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Select a Response</h3>
                  <p className="text-gray-400">Click on a candidate response to view details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
