'use client'
export const dynamic = "force-dynamic"


import Navigation from '@/components/Navigation'
import RecruiterDashboard from '@/components/RecruiterDashboard'
import AuthGuard from '@/components/AuthGuard'

export default function RecruiterPage() {
  return (
    <AuthGuard requiredRole="recruiter">
      <div className="min-h-screen bg-gray-900">
        <Navigation userType="recruiter" />
        <div className="pt-16">
          <RecruiterDashboard />
        </div>
      </div>
    </AuthGuard>
  )
}
