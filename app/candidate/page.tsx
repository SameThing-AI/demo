'use client'
export const dynamic = "force-dynamic"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/NextAuthContext'
import Navigation from '@/components/Navigation'
import CandidateDashboard from '@/components/CandidateDashboard'

export default function CandidatePage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

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

  if (isLoading || !isAuthenticated || user?.role !== 'candidate') {
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
