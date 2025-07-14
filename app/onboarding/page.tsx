'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/NextAuthContext'
import { useRouter } from 'next/navigation'
import { Building2, User, Briefcase, GraduationCap } from 'lucide-react'

export default function OnboardingPage() {
  const { user, updateUserRole } = useAuth()
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<'recruiter' | 'candidate' | null>(null)
  const [company, setCompany] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Redirect if user already has a role
  if (user?.role) {
    router.push(user.role === 'recruiter' ? '/recruiter' : '/candidate')
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('Form submitted', { selectedRole, company })
    
    if (!selectedRole) {
      setError('Please select a role')
      return
    }

    if (selectedRole === 'recruiter' && !company.trim()) {
      setError('Company name is required for recruiters')
      return
    }

    try {
      setLoading(true)
      setError('')
      
      console.log('Calling updateUserRole with:', selectedRole, company)
      await updateUserRole(selectedRole, selectedRole === 'recruiter' ? company : undefined)
      
      console.log('Role updated successfully, redirecting...')
      // Redirect based on role
      router.push(selectedRole === 'recruiter' ? '/recruiter' : '/candidate')
    } catch (err) {
      console.error('Error updating user role:', err)
      setError('Failed to update your profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to AI Hiring Assessments!</h1>
            <p className="text-gray-600">Let's set up your account to get started.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                What best describes your role?
              </label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setSelectedRole('recruiter')}
                  className={`relative rounded-xl border-2 p-6 text-left transition-all duration-200 ${
                    selectedRole === 'recruiter'
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      selectedRole === 'recruiter' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <Briefcase className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Recruiter</h3>
                      <p className="text-sm text-gray-600">Create and manage assessments</p>
                    </div>
                  </div>
                  {selectedRole === 'recruiter' && (
                    <div className="absolute top-4 right-4 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('candidate')}
                  className={`relative rounded-xl border-2 p-6 text-left transition-all duration-200 ${
                    selectedRole === 'candidate'
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      selectedRole === 'candidate' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Candidate</h3>
                      <p className="text-sm text-gray-600">Take assessments and get coaching</p>
                    </div>
                  </div>
                  {selectedRole === 'candidate' && (
                    <div className="absolute top-4 right-4 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>
              </div>
            </div>

            {selectedRole === 'recruiter' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name *
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                    placeholder="Enter your company name"
                    required
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !selectedRole}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? 'Setting up your account...' : 'Continue'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
