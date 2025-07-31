'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { useAuth } from './NextAuthContext'

export interface Assessment {
  id: string
  title: string
  company: string
  description: string
  questions: any[]
  createdAt: string
  createdBy: string
  duration?: number
  type?: 'traditional' | 'revolutionary-ai' | 'creative' | 'self-modifying' | 'video' | 'audio' | 'multi-modal'
  creativeType?: string
  scenario?: string
  concept?: any
  selfModifying?: boolean
  modalType?: 'video' | 'audio' | 'both'
  videoInstructions?: string
  audioInstructions?: string
  
  // Revolutionary assessment fields
  assessmentType?: string
  revolutionaryTitle?: string
  scenarios?: any[]
  instructions?: string
  totalTime?: number
  timeLimit?: number
  aiAssistanceMode?: string
  uniqueFeatures?: string[]
  criteria?: any
}

export interface CandidateResponse {
  id: string
  assessmentId: string
  candidateId: string
  candidateName: string
  candidateEmail: string
  score: number
  completedAt: string
  answers: any[]
  feedback: any
  status: 'started' | 'in-progress' | 'completed' | 'abandoned'
  startedAt: string
  timeSpent?: number
  assessment?: {
    title: string
    company: string
    type: string
  }
}

interface DatabaseDataContextType {
  assessments: Assessment[]
  responses: CandidateResponse[]
  loading: boolean
  error: string | null
  
  // Assessment methods
  fetchAssessments: () => Promise<void>
  createAssessment: (assessment: Omit<Assessment, 'id' | 'createdAt' | 'createdBy'>) => Promise<Assessment>
  updateAssessment: (id: string, updates: Partial<Assessment>) => Promise<Assessment>
  deleteAssessment: (id: string) => Promise<void>
  getAssessmentById: (id: string) => Assessment | null
  
  // Response methods
  fetchResponses: (assessmentId?: string, candidateId?: string) => Promise<void>
  createResponse: (response: Omit<CandidateResponse, 'id' | 'candidateId' | 'candidateName' | 'candidateEmail' | 'startedAt'>) => Promise<CandidateResponse>
  updateResponse: (id: string, updates: Partial<CandidateResponse>) => Promise<CandidateResponse>
  
  // Helper methods
  getResponsesForAssessment: (assessmentId: string) => CandidateResponse[]
  getAssessmentsForCandidate: (candidateId: string) => Assessment[]
  getCandidateResponses: (candidateId: string) => CandidateResponse[]
}

const DatabaseDataContext = createContext<DatabaseDataContextType | undefined>(undefined)

export function DatabaseDataProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth()
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [responses, setResponses] = useState<CandidateResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch assessments
  const fetchAssessments = useCallback(async () => {
    if (!isAuthenticated) return
    
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/assessments')
      
      if (!response.ok) {
        throw new Error('Failed to fetch assessments')
      }
      
      const data = await response.json()
      setAssessments(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  // Create assessment
  const createAssessment = async (assessmentData: Omit<Assessment, 'id' | 'createdAt' | 'createdBy'>): Promise<Assessment> => {
    try {
      setError(null)
      const response = await fetch('/api/assessments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assessmentData),
      })

      if (!response.ok) {
        throw new Error('Failed to create assessment')
      }

      const newAssessment = await response.json()
      setAssessments(prev => [newAssessment, ...prev])
      return newAssessment
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      throw err
    }
  }

  // Update assessment
  const updateAssessment = async (id: string, updates: Partial<Assessment>): Promise<Assessment> => {
    try {
      setError(null)
      const response = await fetch(`/api/assessments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        throw new Error('Failed to update assessment')
      }

      const updatedAssessment = await response.json()
      setAssessments(prev => prev.map(a => a.id === id ? updatedAssessment : a))
      return updatedAssessment
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      throw err
    }
  }

  // Delete assessment
  const deleteAssessment = async (id: string): Promise<void> => {
    try {
      setError(null)
      const response = await fetch(`/api/assessments/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete assessment')
      }

      setAssessments(prev => prev.filter(a => a.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      throw err
    }
  }

  // Fetch responses
  const fetchResponses = useCallback(async (assessmentId?: string, candidateId?: string) => {
    if (!isAuthenticated) return

    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams()
      if (assessmentId) params.append('assessmentId', assessmentId)
      if (candidateId) params.append('candidateId', candidateId)
      
      const response = await fetch(`/api/responses?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch responses')
      }
      
      const data = await response.json()
      setResponses(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  // Create response
  const createResponse = async (responseData: Omit<CandidateResponse, 'id' | 'candidateId' | 'candidateName' | 'candidateEmail' | 'startedAt'>): Promise<CandidateResponse> => {
    try {
      setError(null)
      console.log('🚀 Creating response:', responseData)
      
      // Check if response already exists for this assessment
      const existingResponse = responses.find(r => 
        r.assessmentId === responseData.assessmentId && 
        r.candidateId === user?.id
      )
      
      if (existingResponse) {
        console.log('⚠️ Response already exists, returning existing response')
        return existingResponse
      }
      
      const response = await fetch('/api/responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(responseData),
      })

      if (!response.ok) {
        const errorData = await response.text()
        
        // If response already exists (409), try to find and return the existing one
        if (response.status === 409) {
          console.log('⚠️ Response already exists on server (409), refreshing local data')
          await fetchResponses(responseData.assessmentId, user?.id)
          const existingResponse = responses.find(r => 
            r.assessmentId === responseData.assessmentId && 
            r.candidateId === user?.id
          )
          
          if (existingResponse) {
            console.log('✅ Found existing response after 409 error')
            return existingResponse
          }
        }
        
        // Handle rate limiting with retry after delay
        if (response.status === 429) {
          console.log('⚠️ Rate limited (429), will retry after delay')
          await new Promise(resolve => setTimeout(resolve, 2000)) // Wait 2 seconds
          
          // Retry the request once
          const retryResponse = await fetch('/api/responses', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(responseData),
          })
          
          if (retryResponse.ok) {
            const newResponse = await retryResponse.json()
            console.log('✅ Response created successfully on retry:', newResponse)
            
            setResponses(prev => {
              const filtered = prev.filter(r => !(r.assessmentId === responseData.assessmentId && r.candidateId === user?.id))
              return [newResponse, ...filtered]
            })
            
            return newResponse
          } else {
            const retryErrorData = await retryResponse.text()
            console.error('Retry also failed:', retryResponse.status, retryErrorData)
            throw new Error(`Server is temporarily busy. Please try again in a moment. (${retryResponse.status})`)
          }
        }
        
        console.error('Response creation failed:', response.status, errorData)
        throw new Error(`Failed to create response: ${response.status} ${errorData}`)
      }

      const newResponse = await response.json()
      console.log('✅ Response created successfully:', newResponse)
      
      // Update local state immediately
      setResponses(prev => {
        const filtered = prev.filter(r => !(r.assessmentId === responseData.assessmentId && r.candidateId === user?.id))
        return [newResponse, ...filtered]
      })
      
      return newResponse
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      console.error('❌ Error in createResponse:', err)
      setError(errorMessage)
      throw err
    }
  }

  // Update response
  const updateResponse = async (id: string, updates: Partial<CandidateResponse>): Promise<CandidateResponse> => {
    try {
      setError(null)
      const response = await fetch(`/api/responses/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        throw new Error('Failed to update response')
      }

      const updatedResponse = await response.json()
      setResponses(prev => prev.map(r => r.id === id ? updatedResponse : r))
      return updatedResponse
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      throw err
    }
  }

  // Helper methods
  const getResponsesForAssessment = (assessmentId: string): CandidateResponse[] => {
    return responses.filter(r => r.assessmentId === assessmentId)
  }

  const getAssessmentsForCandidate = (candidateId: string): Assessment[] => {
    const candidateResponseAssessmentIds = responses
      .filter(r => r.candidateId === candidateId)
      .map(r => r.assessmentId)
    return assessments.filter(a => candidateResponseAssessmentIds.includes(a.id))
  }

  const getCandidateResponses = (candidateId: string): CandidateResponse[] => {
    return responses.filter(r => r.candidateId === candidateId)
  }

  const getAssessmentById = (id: string): Assessment | null => {
    return assessments.find(a => a.id === id) || null
  }

  // Load initial data when authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      fetchAssessments()
      fetchResponses()
    }
  }, [isAuthenticated, authLoading])

  return (
    <DatabaseDataContext.Provider value={{
      assessments,
      responses,
      loading,
      error,
      fetchAssessments,
      createAssessment,
      updateAssessment,
      deleteAssessment,
      getAssessmentById,
      fetchResponses,
      createResponse,
      updateResponse,
      getResponsesForAssessment,
      getAssessmentsForCandidate,
      getCandidateResponses,
    }}>
      {children}
    </DatabaseDataContext.Provider>
  )
}

export function useDatabaseData() {
  const context = useContext(DatabaseDataContext)
  if (context === undefined) {
    throw new Error('useDatabaseData must be used within a DatabaseDataProvider')
  }
  return context
}
