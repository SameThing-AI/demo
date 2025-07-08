'use client'

import { useState } from 'react'
import { User, Lock, Building, Users } from 'lucide-react'

interface User {
  id: string
  email: string
  password: string
  type: 'recruiter' | 'candidate'
  name: string
  company?: string
}

// Hardcoded users for demo
const DEMO_USERS: User[] = [
  {
    id: '1',
    email: 'recruiter@techcorp.com',
    password: 'demo123',
    type: 'recruiter',
    name: 'Sarah Johnson',
    company: 'TechCorp'
  },
  {
    id: '2',
    email: 'hr@startupco.com',
    password: 'demo123',
    type: 'recruiter',
    name: 'Mike Chen',
    company: 'StartupCo'
  },
  {
    id: '3',
    email: 'john.doe@email.com',
    password: 'demo123',
    type: 'candidate',
    name: 'John Doe'
  },
  {
    id: '4',
    email: 'jane.smith@email.com',
    password: 'demo123',
    type: 'candidate',
    name: 'Jane Smith'
  }
]

interface AuthFormProps {
  onAuth: (user: User) => void
}

export default function AuthForm({ onAuth }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [userType, setUserType] = useState<'recruiter' | 'candidate'>('recruiter')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (isLogin) {
      // Login logic
      const user = DEMO_USERS.find(u => u.email === email && u.password === password)
      if (user) {
        onAuth(user)
      } else {
        setError('Invalid email or password')
      }
    } else {
      // Sign up logic (for demo, just create a new user)
      const newUser: User = {
        id: Date.now().toString(),
        email,
        password,
        type: userType,
        name,
        company: userType === 'recruiter' ? company : undefined
      }
      onAuth(newUser)
    }
  }

  const fillDemoCredentials = (type: 'recruiter' | 'candidate') => {
    const demoUser = DEMO_USERS.find(u => u.type === type)
    if (demoUser) {
      setEmail(demoUser.email)
      setPassword(demoUser.password)
      setUserType(type)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isLogin ? 'Welcome Back' : 'Join SameThing.AI'}
          </h1>
          <p className="text-gray-600">
            {isLogin ? 'Sign in to your account' : 'Create your account'}
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm font-medium text-blue-800 mb-2">Demo Credentials:</p>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => fillDemoCredentials('recruiter')}
              className="w-full text-left text-xs bg-blue-100 hover:bg-blue-200 p-2 rounded flex items-center gap-2 transition-colors"
            >
              <Building className="h-3 w-3" />
              <span>Recruiter: recruiter@techcorp.com / demo123</span>
            </button>
            <button
              type="button"
              onClick={() => fillDemoCredentials('candidate')}
              className="w-full text-left text-xs bg-green-100 hover:bg-green-200 p-2 rounded flex items-center gap-2 transition-colors"
            >
              <Users className="h-3 w-3" />
              <span>Candidate: john.doe@email.com / demo123</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <>
              {/* User Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  I am a...
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setUserType('recruiter')}
                    className={`p-3 rounded-lg border-2 text-center transition-colors ${
                      userType === 'recruiter'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Building className="h-6 w-6 mx-auto mb-1" />
                    <span className="text-sm font-medium">Recruiter</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType('candidate')}
                    className={`p-3 rounded-lg border-2 text-center transition-colors ${
                      userType === 'candidate'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Users className="h-6 w-6 mx-auto mb-1" />
                    <span className="text-sm font-medium">Candidate</span>
                  </button>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                    placeholder="Enter your full name"
                    required={!isLogin}
                  />
                </div>
              </div>

              {/* Company (for recruiters) */}
              {userType === 'recruiter' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                      placeholder="Enter your company name"
                      required={!isLogin && userType === 'recruiter'}
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-colors"
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:text-blue-800 text-sm transition-colors"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  )
}
