'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Navigation from '@/components/Navigation'
import CandidateDashboard from '@/components/CandidateDashboard'

export default function CandidatePage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth')
      return
    }
    if (user?.type !== 'candidate') {
      router.push('/recruiter')
      return
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.type !== 'candidate') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation userType="candidate" />
      <div className="pt-16">
        <CandidateDashboard />
      </div>
    </div>
  )
}
