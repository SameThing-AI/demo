'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Navigation from '@/components/Navigation'
import RecruiterDashboard from '@/components/RecruiterDashboard'

export default function RecruiterPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth')
      return
    }
    if (user?.type !== 'recruiter') {
      router.push('/candidate')
      return
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.type !== 'recruiter') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation userType="recruiter" />
      <div className="pt-16">
        <RecruiterDashboard />
      </div>
    </div>
  )
}
