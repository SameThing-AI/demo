'use client'
export const dynamic = "force-dynamic"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { useAuth } from '@/contexts/NextAuthContext'
import Navigation from '@/components/Navigation'
import AssessmentForm from '@/components/AssessmentForm'
import AssessmentDisplay from '@/components/AssessmentDisplay'

export default function CreateAssessmentPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [currentView, setCurrentView] = useState<'form' | 'preview'>('form')
  const [generatedAssessment, setGeneratedAssessment] = useState<any>(null)

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

  const handleAssessmentGenerated = (assessmentData: any) => {
    console.log('🎉 Revolutionary assessment created:', assessmentData)
    setGeneratedAssessment(assessmentData)
    setCurrentView('preview')
  }

  const handleBack = () => {
    if (currentView === 'preview') {
      setCurrentView('form')
    } else {
      router.push('/recruiter/assessments')
    }
  }

  const handleFinish = () => {
    router.push('/recruiter/assessments')
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation userType="recruiter" />
      
      <div className="pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  {currentView === 'form' ? 'Create Revolutionary Assessment' : '🎉 Revolutionary Assessment Created!'}
                </h1>
                <p className="text-gray-400">
                  {currentView === 'form' 
                    ? 'Design your assessment with AI-powered revolutionary features including creative challenges' 
                    : 'Preview your extraordinary AI-generated assessment'
                  }
                </p>
              </div>
            </div>
            {currentView === 'preview' && (
              <button
                onClick={handleFinish}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Finish & Save
              </button>
            )}
          </div>

          {/* Content */}
          {currentView === 'form' ? (
            <AssessmentForm 
              onAssessmentGenerated={handleAssessmentGenerated}
              onBack={handleBack}
            />
          ) : (
            <AssessmentDisplay
              assessmentData={generatedAssessment}
              onBack={handleBack}
              onTakeAssessment={() => {}} // Not needed in create flow
              hideTestButtons={true}
            />
          )}
        </div>
      </div>
    </div>
  )
}
