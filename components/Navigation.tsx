'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Brain, Home, Users, FileText, BarChart3, Settings, LogOut, User, BookOpen, MessageSquare, Building2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface NavigationProps {
  userType?: 'recruiter' | 'candidate' | null
}

export default function Navigation({ userType }: NavigationProps) {
  const pathname = usePathname()
  const { logout, user } = useAuth()

  const recruiterNavItems = [
    { href: '/recruiter', icon: Home, label: 'Dashboard' },
    { href: '/recruiter/assessments', icon: FileText, label: 'Assessments' },
    { href: '/recruiter/candidates', icon: Users, label: 'Candidates' },
    { href: '/recruiter/analytics', icon: BarChart3, label: 'Analytics' },
    { href: '/recruiter/ai-assistant', icon: MessageSquare, label: 'AI Assistant' },
    { href: '/recruiter/enterprise', icon: Building2, label: 'Enterprise' },
    { href: '/recruiter/settings', icon: Settings, label: 'Settings' },
  ]

  const candidateNavItems = [
    { href: '/candidate', icon: Home, label: 'Dashboard' },
    { href: '/candidate/assessments', icon: FileText, label: 'My Assessments' },
    { href: '/candidate/coaching', icon: BookOpen, label: 'AI Coaching' },
    { href: '/candidate/progress', icon: BarChart3, label: 'Progress' },
    { href: '/candidate/settings', icon: Settings, label: 'Settings' },
  ]

  const navItems = userType === 'recruiter' ? recruiterNavItems : 
                   userType === 'candidate' ? candidateNavItems : []

  if (!userType) {
    return (
      <nav className="bg-gray-900 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <Brain className="h-8 w-8 text-blue-400" />
                <span className="text-xl font-bold text-white">AI Hiring</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/auth" 
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Sign In
              </Link>
              <Link 
                href="/demo" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Try Demo
              </Link>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="bg-gray-900 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold text-white">AI Hiring</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-300">
              <User className="h-4 w-4" />
              <span className="text-sm">{user?.name}</span>
              <span className="text-xs bg-blue-600 px-2 py-1 rounded capitalize">
                {userType}
              </span>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-1 text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden bg-gray-800 border-t border-gray-700">
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                  isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
