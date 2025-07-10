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
  type?: 'traditional' | 'creative' | 'self-modifying' | 'video' | 'audio' | 'multi-modal'
  creativeType?: string
  scenario?: string
  concept?: any
  selfModifying?: boolean
  modalType?: 'video' | 'audio' | 'both'
  videoInstructions?: string
  audioInstructions?: string
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
  },
  {
    id: '3',
    title: 'DevOps Crisis Manager',
    company: 'CloudTech Inc',
    description: 'Interactive scenario-based assessment for crisis management and system troubleshooting',
    type: 'creative',
    creativeType: 'Crisis Management Simulation',
    scenario: 'Production system outage during peak traffic',
    questions: [
      {
        id: '1',
        question: 'The production servers are showing high CPU and memory usage. Customer complaints are flooding in. What are your immediate actions?',
        type: 'interactive',
        difficulty: 'Hard',
        category: 'Crisis Management',
        componentType: 'SystemDashboard',
        componentProps: {
          initialMetrics: { cpu: 95, memory: 88, errorRate: 12, responseTime: 2000 }
        }
      },
      {
        id: '2',
        question: 'You need to communicate with stakeholders about the outage. Handle the crisis communication.',
        type: 'scenario',
        difficulty: 'Medium',
        category: 'Communication',
        componentType: 'StakeholderChat',
        componentProps: {
          stakeholders: ['CTO', 'Product Manager', 'Customer Success']
        }
      }
    ],
    createdAt: '2025-01-13',
    createdBy: '1',
    duration: 30
  },
  {
    id: '4',
    title: 'Full Stack Debug Challenge',
    company: 'StartupXYZ',
    description: 'AI-powered interactive coding assessment with real-time debugging',
    type: 'creative',
    creativeType: 'Interactive Coding Challenge',
    scenario: 'Fix critical bugs in a production application',
    questions: [
      {
        id: '1',
        question: 'This React component has a memory leak. Identify and fix the issue.',
        type: 'interactive',
        difficulty: 'Hard',
        category: 'Technical Problem Solving',
        componentType: 'CodeDebugger',
        componentProps: {
          buggyCode: `function UserProfile({ userId }) {
  const [userData, setUserData] = useState(null);
  
  useEffect(() => {
    const interval = setInterval(() => {
      fetchUserData(userId).then(setUserData);
    }, 1000);
    // Missing cleanup!
  }, [userId]);
  
  return <div>{userData?.name}</div>;
}`
        }
      },
      {
        id: '2',
        question: 'Explain your debugging approach and how you would prevent similar issues.',
        type: 'technical',
        difficulty: 'Medium',
        category: 'Problem Solving',
        componentType: 'EnhancedTextInput'
      }
    ],
    createdAt: '2025-01-13',
    createdBy: '1',
    duration: 45
  },
  {
    id: '5',
    title: 'Adaptive Leadership Assessment',
    company: 'InnovateCorp',
    description: 'Self-modifying assessment that adapts to your leadership style and experience level in real-time',
    type: 'self-modifying',
    selfModifying: true,
    scenario: 'Dynamic leadership challenges that evolve based on your responses',
    questions: [
      {
        id: '1',
        question: 'Describe your approach to leading a team through a major organizational change.',
        type: 'behavioral',
        difficulty: 'Medium',
        category: 'Leadership',
        componentType: 'EnhancedTextInput'
      },
      {
        id: '2',
        question: 'How do you handle conflict resolution between team members with different perspectives?',
        type: 'scenario',
        difficulty: 'Medium',
        category: 'Conflict Resolution',
        componentType: 'StakeholderChat',
        componentProps: {
          stakeholders: ['Team Member A', 'Team Member B', 'HR Representative']
        }
      }
    ],
    createdAt: '2025-01-14',
    createdBy: '1',
    duration: 60
  },
  {
    id: '6',
    title: 'AI-Powered Data Science Challenge',
    company: 'DataDriven Analytics',
    description: 'Revolutionary self-adapting assessment that generates personalized data science challenges',
    type: 'self-modifying',
    selfModifying: true,
    scenario: 'Progressive data analysis challenges that adapt to your skill demonstration',
    questions: [
      {
        id: '1',
        question: 'Analyze this dataset and identify key patterns and insights.',
        type: 'technical',
        difficulty: 'Medium',
        category: 'Data Analysis',
        componentType: 'dynamic',
        componentProps: {
          datasetType: 'sales-performance',
          interactionType: 'data-exploration'
        }
      }
    ],
    createdAt: '2025-01-14',
    createdBy: '1',
    duration: 90
  },
  // Multi-Modal Assessments
  {
    id: '7',
    title: 'Sales Executive Video Interview',
    company: 'SalesForce Pro',
    description: 'Video-based assessment for sales communication skills, presentation abilities, and client interaction',
    type: 'multi-modal',
    modalType: 'video',
    videoInstructions: 'Please ensure you are in a well-lit environment with a clear background. Look directly at the camera and speak clearly.',
    questions: [
      {
        id: '1',
        text: 'Introduce yourself and explain why you are interested in this sales position.',
        type: 'video',
        timeLimit: 120
      },
      {
        id: '2',
        text: 'Role-play: You are presenting our product to a skeptical client. Convince them of its value.',
        type: 'video',
        timeLimit: 180
      },
      {
        id: '3',
        text: 'Describe a time when you successfully closed a difficult deal. What strategies did you use?',
        type: 'video',
        timeLimit: 150
      }
    ],
    createdAt: '2025-01-15',
    createdBy: '1',
    duration: 25
  },
  {
    id: '8',
    title: 'Podcast Host Audio Assessment',
    company: 'MediaWorks',
    description: 'Audio-only assessment focusing on voice quality, storytelling, and communication skills',
    type: 'multi-modal',
    modalType: 'audio',
    audioInstructions: 'Use a quiet environment with minimal background noise. Speak clearly into your microphone.',
    questions: [
      {
        id: '1',
        text: 'Record a 2-minute introduction segment as if you were starting a podcast episode about technology trends.',
        type: 'audio',
        timeLimit: 120
      },
      {
        id: '2',
        text: 'Conduct a mock interview: Ask and answer questions as if interviewing a tech entrepreneur.',
        type: 'audio',
        timeLimit: 180
      },
      {
        id: '3',
        text: 'Create an engaging advertisement read for a fictional tech product in your authentic voice.',
        type: 'audio',
        timeLimit: 90
      }
    ],
    createdAt: '2025-01-15',
    createdBy: '1',
    duration: 20
  },
  {
    id: '9',
    title: 'Leadership Assessment Suite',
    company: 'ExecutiveSearch Plus',
    description: 'Comprehensive multi-modal assessment combining video presentations and audio discussions',
    type: 'multi-modal',
    modalType: 'both',
    videoInstructions: 'Professional attire recommended. Use a stable camera position at eye level.',
    audioInstructions: 'Ensure clear audio quality for the discussion portions.',
    questions: [
      {
        id: '1',
        text: 'Present your vision for leading a remote team of 20+ people. Use visual aids if helpful.',
        type: 'video',
        timeLimit: 240
      },
      {
        id: '2',
        text: 'Discuss your approach to handling conflict between team members. Focus on your tone and communication style.',
        type: 'audio',
        timeLimit: 180
      },
      {
        id: '3',
        text: 'Give a motivational speech to boost team morale during a challenging project.',
        type: 'video',
        timeLimit: 120
      },
      {
        id: '4',
        text: 'Explain your decision-making process when faced with incomplete information.',
        type: 'audio',
        timeLimit: 150
      }
    ],
    createdAt: '2025-01-15',
    createdBy: '1',
    duration: 45
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
