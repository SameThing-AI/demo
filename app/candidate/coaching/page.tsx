'use client'
export const dynamic = "force-dynamic"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/NextAuthContext'
import Navigation from '@/components/Navigation'
import AICoaching from '@/components/AICoaching'

export default function CandidateCoachingPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated || user?.type !== 'candidate') {
      router.push('/auth')
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated) {
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
        <AICoaching />
      </div>
    </div>
  )
}
