'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

export interface Assessment {
  id: string
  title: string
  company: string
  description: string
  questions: any[]
  createdAt: string
  createdBy: string
  duration?: number
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
}

interface DataContextType {
  assessments: Assessment[]
  responses: CandidateResponse[]
  addAssessment: (assessment: Assessment) => void
  addResponse: (response: CandidateResponse) => void
  getResponsesForAssessment: (assessmentId: string) => CandidateResponse[]
  getAssessmentsForCandidate: (candidateId: string) => Assessment[]
  getCandidateResponses: (candidateId: string) => CandidateResponse[]
}

// Initial mock data
const INITIAL_ASSESSMENTS: Assessment[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'TechCorp',
    description: 'React, TypeScript, and modern web development assessment',
    questions: [
      {
        id: '1',
        text: 'Explain the difference between useMemo and useCallback in React.',
        type: 'technical',
        difficulty: 'medium'
      },
      {
        id: '2',
        text: 'How would you optimize a React application for performance?',
        type: 'technical',
        difficulty: 'hard'
      }
    ],
    createdAt: '2025-01-12',
    createdBy: '1',
    duration: 45
  },
  {
    id: '2',
    title: 'Product Manager',
    company: 'TechCorp',
    description: 'Strategic thinking, user empathy, and product vision assessment',
    questions: [
      {
        id: '1',
        text: 'How would you prioritize features for a new product launch?',
        type: 'behavioral',
        difficulty: 'medium'
      },
      {
        id: '2',
        text: 'Describe a time when you had to make a difficult product decision.',
        type: 'behavioral',
        difficulty: 'medium'
      }
    ],
    createdAt: '2025-01-10',
    createdBy: '1',
    duration: 60
  }
]

const INITIAL_RESPONSES: CandidateResponse[] = [
  {
    id: '1',
    assessmentId: '1',
    candidateId: '3',
    candidateName: 'John Doe',
    candidateEmail: 'john.doe@email.com',
    score: 87,
    completedAt: '2025-01-12T14:30:00Z',
    answers: [
      {
        questionId: '1',
        answer: 'useMemo is used for memoizing values, while useCallback is used for memoizing functions...',
        score: 9
      },
      {
        questionId: '2',
        answer: 'To optimize React performance, I would use React.memo, lazy loading, code splitting...',
        score: 8
      }
    ],
    feedback: {
      overall: 'Strong technical skills with good problem-solving approach',
      strengths: ['Technical knowledge', 'Problem-solving', 'Code quality'],
      improvements: ['Communication', 'Documentation']
    }
  },
  {
    id: '2',
    assessmentId: '1',
    candidateId: '4',
    candidateName: 'Jane Smith',
    candidateEmail: 'jane.smith@email.com',
    score: 92,
    completedAt: '2025-01-12T16:45:00Z',
    answers: [
      {
        questionId: '1',
        answer: 'useMemo caches the result of expensive calculations, useCallback caches function references...',
        score: 10
      },
      {
        questionId: '2',
        answer: 'Performance optimization strategies include virtual scrolling, memoization, bundle splitting...',
        score: 9
      }
    ],
    feedback: {
      overall: 'Excellent understanding of modern web development practices',
      strengths: ['Deep technical knowledge', 'Clear communication', 'Best practices'],
      improvements: ['Leadership experience']
    }
  },
  {
    id: '3',
    assessmentId: '2',
    candidateId: '3',
    candidateName: 'John Doe',
    candidateEmail: 'john.doe@email.com',
    score: 78,
    completedAt: '2025-01-11T10:15:00Z',
    answers: [
      {
        questionId: '1',
        answer: 'I would prioritize based on user impact, business value, and technical feasibility...',
        score: 8
      },
      {
        questionId: '2',
        answer: 'I had to decide whether to delay a feature to improve quality, and I chose quality...',
        score: 7
      }
    ],
    feedback: {
      overall: 'Good strategic thinking, needs improvement in stakeholder management',
      strengths: ['Strategic thinking', 'User focus'],
      improvements: ['Stakeholder management', 'Data analysis']
    }
  }
]

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: ReactNode }) {
  const [assessments, setAssessments] = useState<Assessment[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('assessments')
      return saved ? JSON.parse(saved) : INITIAL_ASSESSMENTS
    }
    return INITIAL_ASSESSMENTS
  })
  
  const [responses, setResponses] = useState<CandidateResponse[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('responses')
      return saved ? JSON.parse(saved) : INITIAL_RESPONSES
    }
    return INITIAL_RESPONSES
  })

  const addAssessment = (assessment: Assessment) => {
    setAssessments(prev => {
      const updated = [...prev, assessment]
      if (typeof window !== 'undefined') {
        localStorage.setItem('assessments', JSON.stringify(updated))
      }
      return updated
    })
  }

  const addResponse = (response: CandidateResponse) => {
    setResponses(prev => {
      const updated = [...prev, response]
      if (typeof window !== 'undefined') {
        localStorage.setItem('responses', JSON.stringify(updated))
      }
      return updated
    })
  }

  const getResponsesForAssessment = (assessmentId: string) => {
    return responses.filter(r => r.assessmentId === assessmentId)
  }

  const getAssessmentsForCandidate = (candidateId: string) => {
    const candidateResponseAssessmentIds = responses
      .filter(r => r.candidateId === candidateId)
      .map(r => r.assessmentId)
    
    return assessments.filter(a => !candidateResponseAssessmentIds.includes(a.id))
  }

  const getCandidateResponses = (candidateId: string) => {
    return responses.filter(r => r.candidateId === candidateId)
  }

  return (
    <DataContext.Provider value={{
      assessments,
      responses,
      addAssessment,
      addResponse,
      getResponsesForAssessment,
      getAssessmentsForCandidate,
      getCandidateResponses
    }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}
