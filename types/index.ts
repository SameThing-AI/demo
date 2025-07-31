/**
 * TypeScript Type Definitions for Shared Components
 * Comprehensive type safety across the application
 */

// User Types
export interface User {
  _id: string
  name: string
  email: string
  role: 'recruiter' | 'candidate'
  company?: string
  isVerified: boolean
  credits: number
  subscription?: {
    plan: 'free' | 'pro' | 'enterprise'
    status: 'active' | 'inactive' | 'cancelled'
    expiresAt?: Date
  }
  profile?: UserProfile
  createdAt: Date
  updatedAt: Date
}

export interface UserProfile {
  firstName?: string
  lastName?: string
  phone?: string
  location?: string
  bio?: string
  skills?: string[]
  experience?: number
  education?: string
  linkedinUrl?: string
  githubUrl?: string
  portfolioUrl?: string
  avatar?: string
  resumeUrl?: string
}

// Assessment Types
export interface Assessment {
  _id: string
  title: string
  company: string
  description: string
  duration: number
  difficulty: 'entry' | 'mid' | 'senior' | 'executive'
  type: 'standard' | 'revolutionary'
  skills: string[]
  questions?: Question[]
  liveEnvironment?: LiveEnvironment
  createdBy: string
  isActive: boolean
  metadata?: AssessmentMetadata
  createdAt: Date
  updatedAt: Date
}

export interface Question {
  _id: string
  type: 'multiple-choice' | 'short-answer' | 'essay' | 'code' | 'scenario'
  question: string
  options?: string[]
  correctAnswer?: string | string[]
  points: number
  timeLimit?: number
  skills: string[]
}

export interface LiveEnvironment {
  scenario: string
  objectives: string[]
  resources: Resource[]
  constraints: string[]
  successCriteria: string[]
  environment: {
    type: 'email' | 'slack' | 'dashboard' | 'presentation' | 'meeting'
    tools: string[]
    data: Record<string, any>
  }
}

export interface Resource {
  type: 'document' | 'spreadsheet' | 'email' | 'chat' | 'data'
  title: string
  content: string | Record<string, any>
  accessLevel: 'read' | 'write' | 'admin'
}

export interface AssessmentMetadata {
  industry: string
  jobLevel: string
  requiredExperience: number
  estimatedCompletionTime: number
  passingScore: number
  tags: string[]
  version: string
}

// Response Types
export interface CandidateResponse {
  _id: string
  userId: string
  assessmentId: string
  responses: ResponseItem[]
  startedAt: Date
  completedAt?: Date
  timeSpent: number
  score?: number
  feedback?: string
  status: 'in-progress' | 'completed' | 'abandoned' | 'expired'
  metadata: ResponseMetadata
}

export interface ResponseItem {
  questionId: string
  answer: string | string[] | Record<string, any>
  timeSpent: number
  confidence?: number
  flagged?: boolean
  notes?: string
}

export interface ResponseMetadata {
  browserInfo: string
  ipAddress: string
  screenResolution: string
  timezone: string
  deviceType: 'desktop' | 'tablet' | 'mobile'
  suspiciousActivity: SuspiciousActivity[]
}

export interface SuspiciousActivity {
  type: 'tab-switch' | 'copy-paste' | 'right-click' | 'dev-tools' | 'screen-capture'
  timestamp: Date
  details: string
}

// Assessment Assignment Types
export interface AssessmentAssignment {
  _id: string
  assessmentId: string
  candidateEmail: string
  assignedBy: string
  status: 'pending' | 'in-progress' | 'completed' | 'expired'
  expiresAt: Date
  customMessage?: string
  allowRetakes: boolean
  maxAttempts: number
  currentAttempts: number
  createdAt: Date
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Authentication Types
export interface AuthUser {
  id: string
  name: string
  email: string
  role: 'recruiter' | 'candidate'
  company?: string
  isVerified: boolean
  credits: number
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  role: 'recruiter' | 'candidate'
  company?: string
}

// Form Types
export interface ProfileFormData {
  firstName?: string
  lastName?: string
  phone?: string
  location?: string
  bio?: string
  skills?: string[]
  experience?: number
  education?: string
  linkedinUrl?: string
  githubUrl?: string
  portfolioUrl?: string
}

export interface AssessmentFormData {
  title: string
  company: string
  description: string
  duration: number
  difficulty: 'entry' | 'mid' | 'senior' | 'executive'
  type: 'standard' | 'revolutionary'
  skills: string[]
  industry: string
  jobLevel: string
  requiredExperience: number
}

// Component Props Types
export interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  className?: string
}

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  closable?: boolean
  className?: string
}

export interface InputProps {
  label?: string
  name: string
  type?: string
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  required?: boolean
  disabled?: boolean
  className?: string
}

export interface SelectProps {
  label?: string
  name: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
  options: Array<{ value: string; label: string }>
  error?: string
  required?: boolean
  disabled?: boolean
  placeholder?: string
  className?: string
}

// Live Simulation Types
export interface SimulationState {
  currentStep: number
  totalSteps: number
  isComplete: boolean
  score: number
  responses: Record<string, any>
  timeRemaining: number
  environment: LiveEnvironment
  context: SimulationContext
}

export interface SimulationContext {
  role: string
  company: string
  scenario: string
  objectives: string[]
  availableActions: Action[]
  currentData: Record<string, any>
}

export interface Action {
  id: string
  type: 'email' | 'meeting' | 'document' | 'analysis' | 'decision'
  label: string
  description: string
  enabled: boolean
  consequences?: string[]
}

// Analytics Types
export interface AssessmentAnalytics {
  totalAssessments: number
  completionRate: number
  averageScore: number
  averageTimeSpent: number
  skillsDistribution: Record<string, number>
  difficultyDistribution: Record<string, number>
  topPerformingCandidates: CandidateScore[]
  trends: AnalyticsTrend[]
}

export interface CandidateScore {
  userId: string
  name: string
  email: string
  score: number
  completedAt: Date
  assessmentTitle: string
}

export interface AnalyticsTrend {
  date: string
  completions: number
  averageScore: number
  newCandidates: number
}

// Notification Types
export interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  timestamp: Date
  read: boolean
  actionUrl?: string
}

// Search and Filter Types
export interface SearchFilters {
  query?: string
  skills?: string[]
  difficulty?: string[]
  type?: string[]
  company?: string
  dateRange?: {
    start: Date
    end: Date
  }
  scoreRange?: {
    min: number
    max: number
  }
}

export interface SortOptions {
  field: string
  direction: 'asc' | 'desc'
}

// Error Types
export interface AppError {
  code: string
  message: string
  details?: Record<string, any>
  timestamp: Date
  userId?: string
  context?: string
}

// Config Types
export interface AppConfig {
  api: {
    baseUrl: string
    timeout: number
    retries: number
  }
  auth: {
    sessionTimeout: number
    maxLoginAttempts: number
  }
  assessment: {
    maxDuration: number
    autoSaveInterval: number
    warningThreshold: number
  }
  ui: {
    theme: 'light' | 'dark' | 'auto'
    language: string
    timezone: string
  }
}

// All types are already exported via individual export interface declarations above

export default {
  // Type guards
  isUser: (obj: any): obj is User => {
    return obj && typeof obj === 'object' && '_id' in obj && 'email' in obj && 'role' in obj
  },
  
  isAssessment: (obj: any): obj is Assessment => {
    return obj && typeof obj === 'object' && '_id' in obj && 'title' in obj && 'type' in obj
  },
  
  isApiResponse: (obj: any): obj is ApiResponse => {
    return obj && typeof obj === 'object' && 'success' in obj
  }
}
