'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AdvancedAssessmentPage() {
  const router = useRouter()
  
  useEffect(() => {
    router.push('/recruiter/assessments')
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Redirecting...</h1>
        <p className="text-gray-600">Taking you to the assessments page</p>
      </div>
    </div>
  )
}
