'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, Building, Loader2, AlertCircle } from 'lucide-react'
import { Button, Input, Card, Alert } from './ui'
import { useForm, useAsync } from '../hooks'
import { validateEmail, validatePassword, cn } from '../utils'
import { signUp } from '../utils/auth'

type AuthMode = 'signin' | 'signup'
type UserType = 'recruiter' | 'candidate'

interface AuthFormData {
  email: string
  password: string
  name?: string
  company?: string
  confirmPassword?: string
}

interface AuthFormProps {
  initialMode?: AuthMode
  onSuccess?: () => void
  className?: string
}

export default function AuthForm({ 
  initialMode = 'signin', 
  onSuccess,
  className = '' 
}: AuthFormProps) {
  const router = useRouter()
  const [mode, setMode] = useState<AuthMode>(initialMode)
  const [userType, setUserType] = useState<UserType>('candidate')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { execute: handleAuth, loading, error } = useAsync(async (data: AuthFormData) => {
    if (mode === 'signup') {
      if (data.password !== data.confirmPassword) {
        throw new Error('Passwords do not match')
      }
      
      const result = await signUp({
        email: data.email,
        password: data.password,
        name: data.name || '',
        company: data.company,
        userType
      })
      
      if (!result.success) {
        throw new Error(result.error || 'Sign up failed')
      }
    } else {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false
      })
      
      if (result?.error) {
        throw new Error('Invalid credentials')
      }
    }
    
    onSuccess?.()
    router.push(`/${userType}`)
  })

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isValid
  } = useForm<AuthFormData>({
    initialValues: {
      email: '',
      password: '',
      name: '',
      company: '',
      confirmPassword: ''
    },
    validate: (values) => {
      const errors: Partial<AuthFormData> = {}
      
      if (!validateEmail(values.email)) {
        errors.email = 'Please enter a valid email address'
      }
      
      if (!validatePassword(values.password)) {
        errors.password = 'Password must be at least 8 characters long'
      }
      
      if (mode === 'signup') {
        if (!values.name?.trim()) {
          errors.name = 'Name is required'
        }
        
        if (userType === 'recruiter' && !values.company?.trim()) {
          errors.company = 'Company name is required for recruiters'
        }
        
        if (values.password !== values.confirmPassword) {
          errors.confirmPassword = 'Passwords do not match'
        }
      }
      
      return errors
    },
    onSubmit: handleAuth
  })

  const toggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin')
  }

  const toggleUserType = () => {
    setUserType(userType === 'candidate' ? 'recruiter' : 'candidate')
  }

  return (
    <Card className={cn('w-full max-w-md mx-auto p-8', className)}>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
        </h1>
        <p className="text-gray-600">
          {mode === 'signin' 
            ? 'Sign in to your account to continue' 
            : 'Join our AI-powered hiring platform'
          }
        </p>
      </div>

      {/* User Type Toggle for Signup */}
      <AnimatePresence>
        {mode === 'signup' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <div className="flex rounded-lg bg-gray-100 p-1">
              <button
                type="button"
                onClick={() => setUserType('candidate')}
                className={cn(
                  'flex-1 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-all',
                  userType === 'candidate'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                <User className="w-4 h-4 mr-2" />
                Candidate
              </button>
              <button
                type="button"
                onClick={() => setUserType('recruiter')}
                className={cn(
                  'flex-1 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-all',
                  userType === 'recruiter'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                <Building className="w-4 h-4 mr-2" />
                Recruiter
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Alert */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4"
          >
            <Alert variant="error" icon={<AlertCircle className="w-5 h-5" />}>
              {error}
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Field (Signup only) */}
        <AnimatePresence>
          {mode === 'signup' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Input
                name="name"
                type="text"
                placeholder="Full Name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.name ? errors.name : undefined}
                icon={User}
                autoComplete="name"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Email Field */}
        <Input
          name="email"
          type="email"
          placeholder="Email Address"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.email ? errors.email : undefined}
          icon={Mail}
          autoComplete="email"
          required
        />

        {/* Company Field (Recruiter Signup only) */}
        <AnimatePresence>
          {mode === 'signup' && userType === 'recruiter' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Input
                name="company"
                type="text"
                placeholder="Company Name"
                value={values.company}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.company ? errors.company : undefined}
                icon={Building}
                autoComplete="organization"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Password Field */}
        <div className="relative">
          <Input
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.password ? errors.password : undefined}
            icon={Lock}
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {/* Confirm Password Field (Signup only) */}
        <AnimatePresence>
          {mode === 'signup' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="relative">
                <Input
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.confirmPassword ? errors.confirmPassword : undefined}
                  icon={Lock}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={loading || !isValid}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {mode === 'signin' ? 'Signing In...' : 'Creating Account...'}
            </>
          ) : (
            mode === 'signin' ? 'Sign In' : 'Create Account'
          )}
        </Button>
      </form>

      {/* Mode Toggle */}
      <div className="mt-6 text-center">
        <p className="text-gray-600">
          {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            onClick={toggleMode}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            {mode === 'signin' ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </Card>
  )
}
