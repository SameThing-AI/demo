'use client'
export const dynamic = "force-dynamic"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { useAuth } from '@/contexts/NextAuthContext'
import Navigation from '@/components/Navigation'
import MultiModalAssessmentBuilder from '@/components/MultiModalAssessmentBuilder'

export default function CreateMultiModalAssessmentPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated || user?.type !== 'recruiter') {
      router.push('/auth')
    }
  }, [isAuthenticated, user, router])

  const handleAssessmentGenerated = (data: any) => {
    // Redirect to the assessment view
    router.push(`/recruiter/assessments`)
  }

  const handleBack = () => {
    router.push('/recruiter/assessments')
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation userType="recruiter" />
      
      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <button
            onClick={handleBack}
            className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Assessments</span>
          </button>
        </div>
        
        <MultiModalAssessmentBuilder 
          onSave={handleAssessmentGenerated}
          onCancel={handleBack}
        />
      </div>
    </div>
  )
}
