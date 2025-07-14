'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/NextAuthContext'
import { useRouter } from 'next/navigation'

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: 'recruiter' | 'candidate'
}

export default function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !isLoading) {
      if (!user) {
        router.push('/auth')
        return
      }

      if (!user.role) {
        router.push('/onboarding')
        return
      }

      if (requiredRole && user.role !== requiredRole) {
        router.push(user.role === 'recruiter' ? '/recruiter' : '/candidate')
        return
      }
    }
  }, [user, isLoading, mounted, requiredRole, router])

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user || !user.role || (requiredRole && user.role !== requiredRole)) {
    return null
  }

  return <>{children}</>
}
