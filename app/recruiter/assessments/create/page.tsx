'use client'
export const dynamic = "force-dynamic"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { useAuth } from '@/contexts/NextAuthContext'
import Navigation from '@/components/Navigation'
import AssessmentForm from '@/components/AssessmentForm'

export default function CreateAssessmentPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

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
    console.log('Assessment saved:', assessmentData)
    router.push('/recruiter/assessments')
  }

  const handleBack = () => {
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
                <h1 className="text-3xl font-bold text-white">Create Assessment</h1>
                <p className="text-gray-400">Design your assessment with traditional or AI-powered features</p>
              </div>
            </div>
          </div>

          {/* Assessment Form */}
          <AssessmentForm 
            onAssessmentGenerated={handleAssessmentGenerated}
            onBack={handleBack}
          />
        </div>
      </div>
    </div>
  )
}
