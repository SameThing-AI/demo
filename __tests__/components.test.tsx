import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useSession } from 'next-auth/react'
import Dashboard from '../app/dashboard/page'

// Mock useSession
jest.mock('next-auth/react')
const mockUseSession = useSession as jest.MockedFunction<typeof useSession>

// Mock fetch
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

describe('Dashboard Component', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  it('should redirect to login when not authenticated', () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
      update: jest.fn(),
    })

    render(<Dashboard />)
    
    // Should show loading or redirect (depending on implementation)
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument()
  })

  it('should render dashboard when authenticated as recruiter', async () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'recruiter',
          company: 'Test Company',
        },
      },
      status: 'authenticated',
      update: jest.fn(),
    })

    // Mock API responses
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: [],
      }),
    } as Response)

    render(<Dashboard />)

    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument()
    })
  })

  it('should show different content for candidates', async () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          role: 'candidate',
        },
      },
      status: 'authenticated',
      update: jest.fn(),
    })

    render(<Dashboard />)

    await waitFor(() => {
      expect(screen.getByText('My Assessments')).toBeInTheDocument()
    })
  })
})

describe('API Validation', () => {
  it('should validate email format', () => {
    const { isValidEmail } = require('../lib/validation')
    
    expect(isValidEmail('test@example.com')).toBe(true)
    expect(isValidEmail('invalid-email')).toBe(false)
    expect(isValidEmail('')).toBe(false)
  })

  it('should validate password strength', () => {
    const { isValidPassword } = require('../lib/validation')
    
    const strongPassword = isValidPassword('StrongPass123!')
    expect(strongPassword.isValid).toBe(true)
    expect(strongPassword.errors).toHaveLength(0)
    
    const weakPassword = isValidPassword('weak')
    expect(weakPassword.isValid).toBe(false)
    expect(weakPassword.errors.length).toBeGreaterThan(0)
  })

  it('should sanitize input strings', () => {
    const { sanitizeString } = require('../lib/validation')
    
    expect(sanitizeString('  test  ')).toBe('test')
    expect(sanitizeString('test<script>alert("xss")</script>')).toBe('testscriptalert("xss")/script')
  })
})

describe('Performance Utilities', () => {
  it('should memoize function results', () => {
    const { memoize } = require('../lib/performance')
    
    const expensiveFunction = jest.fn((x: number) => x * 2)
    const memoizedFunction = memoize(expensiveFunction)
    
    // First call
    expect(memoizedFunction(5)).toBe(10)
    expect(expensiveFunction).toHaveBeenCalledTimes(1)
    
    // Second call with same argument should use cache
    expect(memoizedFunction(5)).toBe(10)
    expect(expensiveFunction).toHaveBeenCalledTimes(1)
    
    // Different argument should call function again
    expect(memoizedFunction(10)).toBe(20)
    expect(expensiveFunction).toHaveBeenCalledTimes(2)
  })

  it('should debounce function calls', async () => {
    const { debounce } = require('../lib/performance')
    
    const mockFunction = jest.fn()
    const debouncedFunction = debounce(mockFunction, 100)
    
    // Call multiple times quickly
    debouncedFunction()
    debouncedFunction()
    debouncedFunction()
    
    // Should not have called the function yet
    expect(mockFunction).not.toHaveBeenCalled()
    
    // Wait for debounce delay
    await new Promise(resolve => setTimeout(resolve, 150))
    
    // Should have called the function once
    expect(mockFunction).toHaveBeenCalledTimes(1)
  })
})
