/**
 * Core utility functions for the AI Hiring Assessment platform
 * Centralized utilities to avoid code duplication
 */

// Type definitions
export interface Assessment {
  id: string
  title: string
  company: string
  description: string
  questions: Question[]
  createdAt: string
  createdBy: string
  duration?: number
  difficulty?: 'easy' | 'medium' | 'hard'
  type?: AssessmentType
  assessmentInterface?: AssessmentInterface
  scenarios?: Scenario[]
}

export interface Question {
  id: string
  type: 'text' | 'code' | 'multiple-choice' | 'scenario'
  question: string
  description?: string
  timeLimit?: number
  difficulty: 'easy' | 'medium' | 'hard'
  evaluation?: EvaluationCriteria
}

export interface EvaluationCriteria {
  primary: string[]
  secondary?: string[]
  scoring?: {
    algorithm: string
    factors: string[]
    weights: number[]
  }
  rubric?: string[]
  aiPrompts?: string[]
}

export interface InterfaceComponent {
  id: string
  type: string
  label: string
  placeholder?: string
  props?: Record<string, any>
  layout?: {
    width?: string
    height?: string
    position?: string
    order?: number
  }
}

export interface StylingConfig {
  theme: string
  colors?: {
    primary: string
    secondary: string
    accent: string
    background: string
  }
  layout?: string
}

export interface AssessmentInterface {
  type: string
  title: string
  description: string
  components: InterfaceComponent[]
  evaluation: EvaluationCriteria
  styling: StylingConfig
}

export interface Scenario {
  id: string
  title: string
  description: string
  challenges: string[]
  successCriteria: string[]
  timeLimit: number
  difficulty: string
}

export type AssessmentType = 
  | 'traditional' 
  | 'revolutionary-ai' 
  | 'creative' 
  | 'self-modifying' 
  | 'video' 
  | 'audio' 
  | 'multi-modal'

export interface User {
  id: string
  name: string
  email: string
  role: 'recruiter' | 'candidate' | 'admin'
  company?: string
}

// Date utilities
export const formatDate = (date: string | Date): string => {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export const formatDateTime = (date: string | Date): string => {
  const d = new Date(date)
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const getTimeAgo = (date: string | Date): string => {
  const now = new Date()
  const then = new Date(date)
  const diffMs = now.getTime() - then.getTime()
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  
  if (diffMinutes < 1) return 'Just now'
  if (diffMinutes < 60) return `${diffMinutes}m ago`
  
  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 7) return `${diffDays}d ago`
  
  return formatDate(date)
}

// String utilities
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-')
}

export const capitalizeFirst = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

// Assessment utilities
export const calculateProgress = (current: number, total: number): number => {
  if (total === 0) return 0
  return Math.round((current / total) * 100)
}

export const getDifficultyColor = (difficulty: string): string => {
  const colors: Record<string, string> = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-red-100 text-red-800',
    beginner: 'bg-blue-100 text-blue-800',
    intermediate: 'bg-purple-100 text-purple-800',
    advanced: 'bg-red-100 text-red-800'
  }
  return colors[difficulty.toLowerCase()] || 'bg-gray-100 text-gray-800'
}

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-800',
    active: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    archived: 'bg-red-100 text-red-800',
    in_progress: 'bg-yellow-100 text-yellow-800',
    connected: 'bg-green-100 text-green-800',
    disconnected: 'bg-red-100 text-red-800',
    syncing: 'bg-yellow-100 text-yellow-800'
  }
  return colors[status.toLowerCase()] || 'bg-gray-100 text-gray-800'
}

// Validation utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0
}

export const validateMinLength = (value: string, minLength: number): boolean => {
  return value.trim().length >= minLength
}

// Array utilities
export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce((groups, item) => {
    const groupKey = String(item[key])
    groups[groupKey] = groups[groupKey] || []
    groups[groupKey].push(item)
    return groups
  }, {} as Record<string, T[]>)
}

export const sortBy = <T>(array: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] => {
  return [...array].sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]
    
    if (aVal < bVal) return direction === 'asc' ? -1 : 1
    if (aVal > bVal) return direction === 'asc' ? 1 : -1
    return 0
  })
}

// Local storage utilities
export const getFromStorage = (key: string): any => {
  if (typeof window === 'undefined') return null
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  } catch {
    return null
  }
}

export const setToStorage = (key: string, value: any): void => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Handle storage errors silently
  }
}

export const removeFromStorage = (key: string): void => {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(key)
  } catch {
    // Handle storage errors silently
  }
}

// API utilities
export const createApiUrl = (endpoint: string, params?: Record<string, string>): string => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || ''
  const url = new URL(endpoint, baseUrl)
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value)
    })
  }
  
  return url.toString()
}

export const handleApiError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message
  }
  if (error.message) {
    return error.message
  }
  return 'An unexpected error occurred'
}

// Security utilities
export const sanitizeHtml = (html: string): string => {
  const div = document.createElement('div')
  div.textContent = html
  return div.innerHTML
}

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Performance utilities
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void => {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void => {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Class name utility (cn)
export const cn = (...inputs: (string | undefined | null | boolean)[]): string => {
  return inputs.filter(Boolean).join(' ')
}

// Enhanced validation functions
export const validatePassword = (password: string): boolean => {
  return password.length >= 8
}

export const validateStrongPassword = (password: string): boolean => {
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  return strongPasswordRegex.test(password)
}

export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s-()]{10,}$/
  return phoneRegex.test(phone)
}

// Constants
export const ASSESSMENT_TYPES = [
  { value: 'traditional', label: 'Traditional Q&A' },
  { value: 'revolutionary-ai', label: '🚀 Revolutionary AI' },
  { value: 'creative', label: 'Creative Components' },
  { value: 'self-modifying', label: 'Self-Modifying' },
  { value: 'multi-modal', label: 'Multi-Modal' }
] as const

export const DIFFICULTY_LEVELS = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' }
] as const

export const USER_ROLES = [
  { value: 'recruiter', label: 'Recruiter' },
  { value: 'candidate', label: 'Candidate' },
  { value: 'admin', label: 'Administrator' }
] as const
