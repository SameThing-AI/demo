'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/NextAuthContext'
import Navigation from '@/components/Navigation'
import LiveSimulationEngine from '@/components/LiveSimulationEngine'
import TakeAssessment from '@/components/TakeAssessment'
import MultiModalTakeAssessment from '@/components/MultiModalTakeAssessment'
import { aiContentGenerator } from '@/lib/ai-content-generator-openai'

export default function TakeAssessmentPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const assessmentId = params.id as string
  
  const [assessment, setAssessment] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push('/auth')
      return
    }
    if (isAuthenticated && user?.role !== 'candidate') {
      router.push('/recruiter')
      return
    }
  }, [isAuthenticated, isLoading, user, router])

  useEffect(() => {
    if (assessmentId && isAuthenticated) {
      loadAssessment()
    }
  }, [assessmentId, isAuthenticated])

  const loadAssessment = async () => {
    try {
      setLoading(true)
      
      // Load assessment data
      const response = await fetch(`/api/assessments/${assessmentId}`)
      if (!response.ok) throw new Error('Assessment not found')
      
      const assessmentData = await response.json()
      
      // For AI-powered assessments with scenarios, use the LiveSimulationEngine
      if (assessmentData.aiGenerated && assessmentData.scenarios && assessmentData.scenarios.length > 0) {
        console.log('🎮 Using revolutionary LiveSimulationEngine for AI-powered assessment')
        console.log('🎯 Scenarios available:', assessmentData.scenarios.length)
        setAssessment(assessmentData)
        return
      }
      
      // Only generate basic questions if it's a traditional assessment without scenarios
      if (!assessmentData.questions || assessmentData.questions.length === 0) {
        const aiQuestions = await aiContentGenerator.generateAssessmentQuestions({
          role: assessmentData.jobTitle,
          company: assessmentData.company,
          skills: assessmentData.skills || []
        })
        assessmentData.questions = aiQuestions.map((q, index) => ({
          id: `ai-${index + 1}`,
          question: q,
          type: 'open-ended',
          difficulty: index < 2 ? 'easy' : index < 4 ? 'medium' : 'hard'
        }))
      }
      
      setAssessment(assessmentData)
    } catch (error) {
      console.error('Error loading assessment:', error)
      setError('Failed to load assessment')
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    router.push('/assessments')
  }

  const handleComplete = async (results: any) => {
    try {
      console.log('🚀 Assessment completion started:', { assessmentId, results })
      
      // Create the candidate response object
      const candidateResponse = {
        id: Date.now().toString(),
        assessmentId: assessmentId,
        candidateId: user?.id || '',
        candidateName: user?.name || '',
        candidateEmail: user?.email || '',
        score: results.percentage || results.totalScore || 0,
        completedAt: new Date().toISOString(),
        status: 'completed' as const,
        answers: results.questionScores?.map((qs: any, index: number) => ({
          questionId: index.toString(),
          answer: qs.answer || '',
          score: qs.score || 0
        })) || [],
        feedback: results.breakdown || results.feedback || {},
        timeSpent: results.timeSpent || 0
      }

      console.log('� Saving assessment response:', candidateResponse)

      // Save the response to the database
      const response = await fetch('/api/responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(candidateResponse),
      })

      if (!response.ok) {
        throw new Error('Failed to save assessment response')
      }

      console.log('✅ Assessment response saved successfully')
      
      // Navigate to results page
      console.log('🔄 Navigating to results page...')
      router.push(`/assessments/${assessmentId}/results`)
      
    } catch (error) {
      console.error('❌ Error saving assessment response:', error)
      // Still try to navigate to show results, but user might see "Results Not Found"
      router.push(`/assessments/${assessmentId}/results`)
    }
  }

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-300">Loading assessment...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || user?.role !== 'candidate') {
    return null
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Assessments
          </button>
        </div>
      </div>
    )
  }

  if (!assessment) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-300">Assessment not found</p>
          <button
            onClick={handleBack}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Assessments
          </button>
        </div>
      </div>
    )
  }

  const renderAssessmentComponent = () => {
    // Use LiveSimulationEngine for AI-powered assessments with scenarios
    if (assessment.aiGenerated && assessment.scenarios && assessment.scenarios.length > 0) {
      return (
        <LiveSimulationEngine
          scenario={{
            title: assessment.title,
            description: assessment.description,
            scenarios: assessment.scenarios,
            type: assessment.assessmentType || 'simulation',
            difficulty: assessment.difficulty || 'medium',
            uniqueFeatures: assessment.uniqueFeatures || [],
            totalTime: assessment.totalTime || 120
          }}
          onBack={handleBack}
          onComplete={handleComplete}
        />
      )
    }

    // Use LiveSimulationEngine for specific types
    if (assessment.type === 'live-simulation' || assessment.type === 'revolutionary') {
      return (
        <LiveSimulationEngine
          scenario={{
            title: assessment.title,
            description: assessment.description,
            type: assessment.scenario?.type || 'quantum-data',
            difficulty: assessment.difficulty || 'medium'
          }}
          onBack={handleBack}
          onComplete={handleComplete}
        />
      )
    }
    
    // Use MultiModalTakeAssessment for multi-modal type
    if (assessment.type === 'multi-modal') {
      return (
        <MultiModalTakeAssessment
          assessment={assessment}
          onComplete={handleComplete}
        />
      )
    }
    
    // Default to traditional Q&A assessment
    return (
      <TakeAssessment
        assessment={assessment}
        assessmentData={assessment}
        onBack={handleBack}
        onComplete={handleComplete}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation userType="candidate" />
      <div className="pt-16">
        {renderAssessmentComponent()}
      </div>
    </div>
  )
}
