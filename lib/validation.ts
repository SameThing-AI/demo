/**
 * Comprehensive Input Validation Utilities
 * Provides client-side and server-side validation functions
 */

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: any) => boolean | string
}

export interface ValidationSchema {
  [key: string]: ValidationRule
}

// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Password validation
export const isValidPassword = (password: string): ValidationResult => {
  const errors: string[] = []
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// URL validation
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Phone validation
export const isValidPhone = (phone: string): boolean => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '')
  // Accept 10-15 digits (international format)
  return cleaned.length >= 10 && cleaned.length <= 15
}

// LinkedIn URL validation
export const isValidLinkedInUrl = (url: string): boolean => {
  const linkedinRegex = /^https?:\/\/(www\.)?linkedin\.com\/in\/[A-Za-z0-9_-]+\/?$/
  return linkedinRegex.test(url)
}

// GitHub URL validation
export const isValidGitHubUrl = (url: string): boolean => {
  const githubRegex = /^https?:\/\/(www\.)?github\.com\/[A-Za-z0-9_-]+\/?$/
  return githubRegex.test(url)
}

// Company name validation
export const isValidCompanyName = (name: string): boolean => {
  return name.length >= 2 && name.length <= 100 && /^[A-Za-z0-9\s\-&.,()]+$/.test(name)
}

// Name validation
export const isValidName = (name: string): boolean => {
  return name.length >= 2 && name.length <= 50 && /^[A-Za-z\s\-']+$/.test(name)
}

// Generic field validation
export const validateField = (value: any, rule: ValidationRule): ValidationResult => {
  const errors: string[] = []
  
  // Required validation
  if (rule.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
    errors.push('This field is required')
    return { isValid: false, errors }
  }
  
  // Skip other validations if value is empty and not required
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return { isValid: true, errors: [] }
  }
  
  // String length validations
  if (typeof value === 'string') {
    if (rule.minLength && value.length < rule.minLength) {
      errors.push(`Must be at least ${rule.minLength} characters long`)
    }
    
    if (rule.maxLength && value.length > rule.maxLength) {
      errors.push(`Must be no more than ${rule.maxLength} characters long`)
    }
  }
  
  // Pattern validation
  if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
    errors.push('Invalid format')
  }
  
  // Custom validation
  if (rule.custom) {
    const customResult = rule.custom(value)
    if (typeof customResult === 'string') {
      errors.push(customResult)
    } else if (!customResult) {
      errors.push('Invalid value')
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Validate entire form against schema
export const validateForm = (data: Record<string, any>, schema: ValidationSchema): ValidationResult => {
  const allErrors: string[] = []
  
  for (const [field, rule] of Object.entries(schema)) {
    const fieldResult = validateField(data[field], rule)
    if (!fieldResult.isValid) {
      allErrors.push(...fieldResult.errors.map(error => `${field}: ${error}`))
    }
  }
  
  return {
    isValid: allErrors.length === 0,
    errors: allErrors
  }
}

// Common validation schemas
export const userRegistrationSchema: ValidationSchema = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    custom: isValidName
  },
  email: {
    required: true,
    custom: isValidEmail
  },
  password: {
    required: true,
    custom: (value) => isValidPassword(value).isValid || isValidPassword(value).errors.join(', ')
  },
  role: {
    required: true,
    custom: (value) => ['recruiter', 'candidate'].includes(value) || 'Invalid role'
  },
  company: {
    required: false, // Will be required conditionally based on role
    custom: (value) => !value || isValidCompanyName(value) || 'Invalid company name'
  }
}

export const profileUpdateSchema: ValidationSchema = {
  firstName: {
    required: false,
    minLength: 2,
    maxLength: 25,
    custom: (value) => !value || isValidName(value) || 'Invalid first name'
  },
  lastName: {
    required: false,
    minLength: 2,
    maxLength: 25,
    custom: (value) => !value || isValidName(value) || 'Invalid last name'
  },
  phone: {
    required: false,
    custom: (value) => !value || isValidPhone(value) || 'Invalid phone number'
  },
  linkedinUrl: {
    required: false,
    custom: (value) => !value || isValidLinkedInUrl(value) || 'Invalid LinkedIn URL'
  },
  githubUrl: {
    required: false,
    custom: (value) => !value || isValidGitHubUrl(value) || 'Invalid GitHub URL'
  },
  portfolioUrl: {
    required: false,
    custom: (value) => !value || isValidUrl(value) || 'Invalid portfolio URL'
  }
}

// Sanitization functions
export const sanitizeString = (str: string): string => {
  return str.trim().replace(/[<>]/g, '')
}

export const sanitizeEmail = (email: string): string => {
  return email.toLowerCase().trim()
}

export const sanitizeUrl = (url: string): string => {
  const trimmed = url.trim()
  if (trimmed && !trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    return `https://${trimmed}`
  }
  return trimmed
}

// API response validation
export const isValidApiResponse = <T>(response: any, requiredFields: string[]): response is T => {
  if (!response || typeof response !== 'object') {
    return false
  }
  
  return requiredFields.every(field => field in response)
}

// Assessment validation
export const assessmentValidationSchema: ValidationSchema = {
  title: {
    required: true,
    minLength: 3,
    maxLength: 100
  },
  company: {
    required: true,
    minLength: 2,
    maxLength: 100,
    custom: isValidCompanyName
  },
  description: {
    required: true,
    minLength: 10,
    maxLength: 2000
  },
  duration: {
    required: true,
    custom: (value) => {
      const num = Number(value)
      return (num >= 5 && num <= 300) || 'Duration must be between 5 and 300 minutes'
    }
  }
}

export default {
  isValidEmail,
  isValidPassword,
  isValidUrl,
  isValidPhone,
  isValidLinkedInUrl,
  isValidGitHubUrl,
  isValidCompanyName,
  isValidName,
  validateField,
  validateForm,
  userRegistrationSchema,
  profileUpdateSchema,
  assessmentValidationSchema,
  sanitizeString,
  sanitizeEmail,
  sanitizeUrl,
  isValidApiResponse
}
