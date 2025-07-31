'use client'
export const dynamic = "force-dynamic"

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Clock, FileText, Zap, Cpu, AlertTriangle, Eye, Play } from 'lucide-react'
import { useAuth } from '@/contexts/NextAuthContext'
import { useDatabaseData } from '@/contexts/DatabaseDataContext'
import Navigation from '@/components/Navigation'
import TakeAssessment from '@/components/TakeAssessment'

export default function PreviewAssessmentPage() {
  const { user, isAuthenticated } = useAuth()
  const { assessments } = useDatabaseData()
  const router = useRouter()
  const params = useParams()
  const assessmentId = params.id as string

  const [assessment, setAssessment] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [previewMode, setPreviewMode] = useState<'standard' | 'simulation'>('standard')

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'recruiter') {
      router.push('/auth')
      return
    }

    // Find the assessment
    const foundAssessment = assessments.find(a => a.id === assessmentId)
    if (foundAssessment) {
      setAssessment(foundAssessment)
    }
    setLoading(false)
  }, [isAuthenticated, user, router, assessmentId, assessments])

  // Check if this is an AI-generated assessment
  const isAIGeneratedAssessment = assessment?.assessmentInterface || 
                                 assessment?.generated ||
                                 assessment?.assessmentType === 'revolutionary' || 
                                 assessment?.liveSimulation || 
                                 assessment?.plotTwists ||
                                 assessment?.revolutionaryFeatures

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
              <p className="text-gray-400 mb-6">The assessment you're trying to preview doesn't exist.</p>
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

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation userType="recruiter" />
      
      <div className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Preview Header */}
          <div className="bg-yellow-600/20 border border-yellow-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                <span className="text-yellow-400 font-medium">Preview Mode</span>
                <span className="text-gray-400 text-sm">You are previewing this assessment as a candidate would see it</span>
                
                {/* AI-Generated Assessment Indicators */}
                {isAIGeneratedAssessment && (
                  <div className="flex items-center space-x-2 ml-4">
                    <div className="flex items-center bg-purple-100/20 text-purple-400 rounded-full px-2 py-1">
                      <Zap className="h-3 w-3 mr-1" />
                      <span className="text-xs font-medium">AI-Generated</span>
                    </div>
                    {assessment.liveSimulation && (
                      <div className="flex items-center bg-blue-100/20 text-blue-400 rounded-full px-2 py-1">
                        <Cpu className="h-3 w-3 mr-1" />
                        <span className="text-xs font-medium">Live Simulation</span>
                      </div>
                    )}
                    {assessment.plotTwists && (
                      <div className="flex items-center bg-orange-100/20 text-orange-400 rounded-full px-2 py-1">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        <span className="text-xs font-medium">Plot Twists</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-3">
                {/* Preview Mode Toggle for AI-Generated Assessments */}
                {isAIGeneratedAssessment && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setPreviewMode('standard')}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        previewMode === 'standard' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      <Eye className="h-3 w-3 mr-1 inline" />
                      Standard
                    </button>
                    <button
                      onClick={() => setPreviewMode('simulation')}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        previewMode === 'simulation' 
                          ? 'bg-purple-600 text-white' 
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      <Play className="h-3 w-3 mr-1 inline" />
                      Live Simulation
                    </button>
                  </div>
                )}
                <button
                  onClick={() => router.push(`/recruiter/assessments/${assessmentId}`)}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Exit Preview</span>
                </button>
              </div>
            </div>
          </div>

          {/* Assessment Header */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">{assessment.title}</h1>
                <p className="text-gray-400">{assessment.description}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2 text-gray-400 text-sm mb-2">
                  <Clock className="h-4 w-4" />
                  <span>{assessment.duration} minutes</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400 text-sm">
                  <FileText className="h-4 w-4" />
                  <span>{assessment.questions?.length || 0} questions</span>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-700 pt-4">
              <h3 className="text-white font-medium mb-2">Instructions:</h3>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>• Read each question carefully before answering</li>
                <li>• You have {assessment.duration} minutes to complete this assessment</li>
                <li>• Make sure to answer all questions before submitting</li>
                {assessment.type === 'ai-powered' && (
                  <li>• This assessment includes AI-powered features for enhanced evaluation</li>
                )}
                {isAIGeneratedAssessment && (
                  <>
                    <li>• 🤖 This is an <strong>AI-Generated Assessment</strong> with advanced simulation features</li>
                    {assessment.liveSimulation && (
                      <li>• 💻 Includes live, executable environments for real-time problem solving</li>
                    )}
                    {assessment.plotTwists && (
                      <li>• ⚡ Features dynamic plot twists that adapt based on your performance</li>
                    )}
                    {assessment.realTimeMetrics && (
                      <li>• 📊 Real-time performance metrics track your progress</li>
                    )}
                    {assessment.adaptiveDifficulty && (
                      <li>• 🎯 Adaptive difficulty adjusts to your skill level</li>
                    )}
                  </>
                )}
              </ul>
              
              {/* Preview Mode Information */}
              <div className="mt-4 p-3 bg-blue-600/20 border border-blue-500/30 rounded-lg">
                <p className="text-blue-400 text-sm">
                  <strong>Note:</strong> You're in preview mode. {previewMode === 'simulation' ? 'Live simulation preview shows reduced functionality.' : 'AI chatbot features are disabled in preview.'} 
                  Candidates will see {isAIGeneratedAssessment ? 'full AI-powered features including dynamic simulation engines' : 'an AI assistant button with question-specific credits'} during actual assessments.
                </p>
              </div>

              {/* AI-Generated Features Preview */}
              {isAIGeneratedAssessment && previewMode === 'simulation' && (
                <div className="mt-4 p-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-lg">
                  <h4 className="text-purple-400 font-medium mb-2 flex items-center">
                    <Zap className="h-4 w-4 mr-2" />
                    🚀 Revolutionary Simulation Preview
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h5 className="text-white font-medium mb-1">Live Features:</h5>
                      <ul className="text-gray-400 space-y-1">
                        <li>• Real-time code execution</li>
                        <li>• Interactive environments</li>
                        <li>• Dynamic scenario generation</li>
                        <li>• Live performance tracking</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-white font-medium mb-1">Advanced Capabilities:</h5>
                      <ul className="text-gray-400 space-y-1">
                        <li>• Plot twist scenarios</li>
                        <li>• Adaptive difficulty scaling</li>
                        <li>• Multi-environment support</li>
                        <li>• Innovation scoring</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Assessment Content */}
          {assessment.questions && assessment.questions.length > 0 ? (
            <TakeAssessment 
              assessment={assessment}
              assessmentData={assessment} // Pass full assessment data for revolutionary features
              isPreview={true}
              onComplete={(responses) => {
                alert(`Preview completed! ${isAIGeneratedAssessment ? 'AI-generated features were simulated.' : 'In a real assessment, responses would be saved.'}`)
                console.log('Preview responses:', responses)
              }}
            />
          ) : (
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 text-center">
              <FileText className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-white font-medium mb-2">No Questions Available</h3>
              <p className="text-gray-400 mb-4">This assessment doesn't have any questions to preview.</p>
              <button
                onClick={() => router.push(`/recruiter/assessments/${assessmentId}`)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Back to Assessment
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
