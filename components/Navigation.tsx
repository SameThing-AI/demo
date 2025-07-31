'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Brain, Home, Users, FileText, BarChart3, Settings, LogOut, 
  User, BookOpen, MessageSquare, Building2, Menu, X 
} from 'lucide-react'
import { useAuth } from '../contexts/NextAuthContext'
import { Button } from './ui'

interface NavItem {
  href: string
  icon: React.ComponentType<{ className?: string }>
  label: string
}

type UserType = 'recruiter' | 'candidate'

interface NavigationProps {
  userType?: UserType | null
  className?: string
}

export default function Navigation({ userType, className = '' }: NavigationProps) {
  const pathname = usePathname()
  const { logout, user } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const recruiterNavItems: NavItem[] = [
    { href: '/recruiter', icon: Home, label: 'Dashboard' },
    { href: '/recruiter/assessments', icon: FileText, label: 'Assessments' },
    { href: '/recruiter/candidates', icon: Users, label: 'Candidates' },
    { href: '/recruiter/analytics', icon: BarChart3, label: 'Analytics' },
    { href: '/recruiter/ai-assistant', icon: MessageSquare, label: 'AI Assistant' },
    { href: '/recruiter/enterprise', icon: Building2, label: 'Enterprise' },
    { href: '/recruiter/settings', icon: Settings, label: 'Settings' },
  ]

  const candidateNavItems: NavItem[] = [
    { href: '/candidate', icon: Home, label: 'Dashboard' },
    { href: '/candidate/assessments', icon: FileText, label: 'My Assessments' },
    { href: '/candidate/coaching', icon: BookOpen, label: 'AI Coaching' },
    { href: '/candidate/progress', icon: BarChart3, label: 'Progress' },
    { href: '/candidate/settings', icon: Settings, label: 'Settings' },
  ]

  const navItems = userType === 'recruiter' ? recruiterNavItems : 
                   userType === 'candidate' ? candidateNavItems : []

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)

  const renderNavItem = (item: NavItem, isMobile = false) => {
    const Icon = item.icon
    const isActive = pathname === item.href
    
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={() => isMobile && setIsMobileMenuOpen(false)}
        className={`
          relative flex items-center space-x-2 sm:space-x-3 px-3 py-2 sm:py-2.5 rounded-md font-medium transition-all duration-200 touch-manipulation
          ${isMobile 
            ? 'text-fluid-sm w-full justify-start' 
            : 'text-xs lg:text-sm justify-center lg:justify-start'
          }
          ${isActive 
            ? 'bg-blue-600 text-white shadow-lg' 
            : 'text-gray-300 hover:text-white hover:bg-gray-700'
          }
        `}
      >
        <Icon className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'} flex-shrink-0`} />
        <span className={`truncate ${isMobile ? '' : 'hidden lg:inline'}`}>{item.label}</span>
        {isActive && !isMobile && (
          <motion.div
            layoutId="activeIndicator"
            className="absolute inset-0 bg-blue-600 rounded-md -z-10"
            initial={false}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          />
        )}
      </Link>
    )
  }

  // Unauthenticated navigation
  if (!userType) {
    return (
      <nav className={`bg-gray-900 border-b border-gray-700 ${className}`}>
        <div className="container-responsive">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center min-w-0">
              <Link href="/" className="flex items-center space-x-2">
                <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400 flex-shrink-0" />
                <span className="text-fluid-lg font-bold text-white truncate">AI Hiring Platform</span>
              </Link>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link href="/auth">
                <Button 
                  variant="primary" 
                  size="md"
                  className="text-fluid-sm font-medium min-w-0"
                >
                  <span className="hidden xs:inline">Get Started</span>
                  <span className="xs:hidden">Login</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  // Authenticated navigation
  return (
    <nav className={`bg-gray-900 border-b border-gray-700 sticky top-0 z-50 ${className}`}>
      <div className="container-responsive">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center min-w-0">
            <Link href="/" className="flex items-center space-x-2 mr-2 sm:mr-4 lg:mr-8">
              <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400 flex-shrink-0" />
              <span className="text-fluid-lg font-bold text-white truncate">
                <span className="hidden sm:inline">AI Hiring Platform</span>
                <span className="sm:hidden">AI Hiring</span>
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1 flex-1 justify-center max-w-2xl">
            {navItems.slice(0, 5).map((item) => renderNavItem(item))}
            {navItems.length > 5 && (
              <div className="relative group">
                <button className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-200">
                  <span>More</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute right-0 top-full mt-1 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-1">
                    {navItems.slice(5).map((item) => renderNavItem(item))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* User Profile */}
            <div className="hidden sm:flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.location.href = '/profile'}
                className="flex items-center space-x-1 lg:space-x-2 text-gray-300 hover:text-white px-2 lg:px-3 py-2 text-xs lg:text-sm min-w-0"
              >
                <User className="h-4 w-4 flex-shrink-0" />
                <span className="hidden lg:inline truncate max-w-16 xl:max-w-none">{user?.name || 'User'}</span>
                <span className="text-xs bg-blue-600 px-1.5 py-0.5 lg:px-2 lg:py-1 rounded capitalize">
                  {userType}
                </span>
              </Button>
            </div>

            {/* Logout Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="hidden sm:flex items-center space-x-1 text-gray-300 hover:text-white px-2 lg:px-3 py-2 text-xs lg:text-sm"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden lg:inline">Logout</span>
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="lg:hidden flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors touch-manipulation"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="lg:hidden bg-gray-800 border-t border-gray-700 overflow-hidden"
          >
            <div className="container-responsive py-3 max-h-[calc(100vh-4rem)] overflow-y-auto">
              <div className="space-y-1">
                {navItems.map((item) => renderNavItem(item, true))}
              </div>
              
              {/* Mobile User Section */}
              <div className="pt-4 mt-4 border-t border-gray-700 space-y-1">
                <button
                  onClick={() => {
                    window.location.href = '/profile'
                    setIsMobileMenuOpen(false)
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors text-fluid-sm touch-manipulation"
                >
                  <User className="h-5 w-5 flex-shrink-0" />
                  <span className="truncate flex-1 text-left">{user?.name || 'User'}</span>
                  <span className="text-xs bg-blue-600 px-2 py-1 rounded capitalize flex-shrink-0">
                    {userType}
                  </span>
                </button>
                <button
                  onClick={() => {
                    logout()
                    setIsMobileMenuOpen(false)
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors text-fluid-sm touch-manipulation"
                >
                  <LogOut className="h-5 w-5 flex-shrink-0" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
