'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/NextAuthContext'
import { useDatabaseData } from '@/contexts/DatabaseDataContext'

interface CoachingSession {
  id: string
  topic: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: number
  completed: boolean
  score?: number
  feedback?: string[]
  recommendations?: string[]
}

interface LearningPath {
  id: string
  title: string
  description: string
  progress: number
  sessions: CoachingSession[]
  estimatedTime: number
}

export default function AICoaching() {
  const { user } = useAuth()
  const { getCandidateResponses } = useDatabaseData()
  const [currentView, setCurrentView] = useState<'dashboard' | 'paths' | 'session' | 'analytics'>('dashboard')
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null)
  const [selectedSession, setSelectedSession] = useState<CoachingSession | null>(null)
  const [personalizedPaths, setPersonalizedPaths] = useState<LearningPath[]>([])
  const [isGeneratingPaths, setIsGeneratingPaths] = useState(false)

  // Get user's assessment history for personalization
  const candidateResponses = getCandidateResponses(user?.id || '')

  useEffect(() => {
    generatePersonalizedPaths()
  }, [candidateResponses])

  const generatePersonalizedPaths = async () => {
    setIsGeneratingPaths(true)
    try {
      // In a real implementation, this would analyze user's assessment history
      // and generate personalized learning paths using AI
      
      const userWeaknesses = analyzeUserWeaknesses()
      const paths = await createLearningPaths(userWeaknesses)
      setPersonalizedPaths(paths)
    } catch (error) {
      console.error('Error generating paths:', error)
      // Fallback to default paths
      setPersonalizedPaths(getDefaultLearningPaths())
    } finally {
      setIsGeneratingPaths(false)
    }
  }

  const analyzeUserWeaknesses = () => {
    if (candidateResponses.length === 0) {
      return ['communication', 'technical', 'leadership']
    }

    const avgScore = candidateResponses.reduce((sum, r) => sum + (r.score || 0), 0) / candidateResponses.length
    const weaknesses = []

    if (avgScore < 70) {
      weaknesses.push('general-improvement')
    }
    
    // Analyze specific areas based on assessment types and scores
    const lowScoreAreas = candidateResponses
      .filter(r => (r.score || 0) < 75)
      .map(r => 'technical') // Simplified for demo
    
    return [...weaknesses, ...lowScoreAreas]
  }

  const createLearningPaths = async (weaknesses: string[]): Promise<LearningPath[]> => {
    // Simulate AI-generated personalized paths
    const basePaths = getDefaultLearningPaths()
    
    // Customize based on weaknesses
    return basePaths.map(path => ({
      ...path,
      sessions: path.sessions.map(session => ({
        ...session,
        difficulty: weaknesses.includes('general-improvement') ? 'beginner' : session.difficulty
      }))
    }))
  }

  const getDefaultLearningPaths = (): LearningPath[] => [
    {
      id: '1',
      title: 'Communication Mastery',
      description: 'Improve your verbal and non-verbal communication skills for interviews and workplace success',
      progress: 0,
      estimatedTime: 240, // 4 hours
      sessions: [
        {
          id: '1-1',
          topic: 'Effective Body Language',
          difficulty: 'beginner',
          duration: 30,
          completed: false
        },
        {
          id: '1-2',
          topic: 'Clear Verbal Communication',
          difficulty: 'beginner',
          duration: 45,
          completed: false
        },
        {
          id: '1-3',
          topic: 'Active Listening Techniques',
          difficulty: 'intermediate',
          duration: 35,
          completed: false
        },
        {
          id: '1-4',
          topic: 'Handling Difficult Questions',
          difficulty: 'advanced',
          duration: 50,
          completed: false
        },
        {
          id: '1-5',
          topic: 'Storytelling for Impact',
          difficulty: 'intermediate',
          duration: 40,
          completed: false
        }
      ]
    },
    {
      id: '2',
      title: 'Technical Interview Prep',
      description: 'Master technical concepts and problem-solving approaches for technical interviews',
      progress: 0,
      estimatedTime: 300, // 5 hours
      sessions: [
        {
          id: '2-1',
          topic: 'Data Structures Fundamentals',
          difficulty: 'beginner',
          duration: 60,
          completed: false
        },
        {
          id: '2-2',
          topic: 'Algorithm Problem Solving',
          difficulty: 'intermediate',
          duration: 75,
          completed: false
        },
        {
          id: '2-3',
          topic: 'System Design Basics',
          difficulty: 'intermediate',
          duration: 90,
          completed: false
        },
        {
          id: '2-4',
          topic: 'Code Review Best Practices',
          difficulty: 'advanced',
          duration: 45,
          completed: false
        },
        {
          id: '2-5',
          topic: 'Performance Optimization',
          difficulty: 'advanced',
          duration: 30,
          completed: false
        }
      ]
    },
    {
      id: '3',
      title: 'Leadership Development',
      description: 'Build leadership skills and executive presence for management roles',
      progress: 0,
      estimatedTime: 360, // 6 hours
      sessions: [
        {
          id: '3-1',
          topic: 'Leadership Styles & Adaptation',
          difficulty: 'beginner',
          duration: 45,
          completed: false
        },
        {
          id: '3-2',
          topic: 'Team Motivation Strategies',
          difficulty: 'intermediate',
          duration: 60,
          completed: false
        },
        {
          id: '3-3',
          topic: 'Conflict Resolution',
          difficulty: 'intermediate',
          duration: 50,
          completed: false
        },
        {
          id: '3-4',
          topic: 'Strategic Decision Making',
          difficulty: 'advanced',
          duration: 75,
          completed: false
        },
        {
          id: '3-5',
          topic: 'Executive Presence',
          difficulty: 'advanced',
          duration: 55,
          completed: false
        },
        {
          id: '3-6',
          topic: 'Change Management',
          difficulty: 'advanced',
          duration: 75,
          completed: false
        }
      ]
    }
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500'
    if (progress >= 50) return 'bg-yellow-500'
    return 'bg-blue-500'
  }

  if (currentView === 'session' && selectedSession) {
    return <CoachingSessionView session={selectedSession} onBack={() => setCurrentView('paths')} />
  }

  if (currentView === 'paths') {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Learning Paths</h2>
            <p className="text-gray-600">Personalized coaching based on your assessment results</p>
          </div>
          <button
            onClick={() => setCurrentView('dashboard')}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="grid gap-6">
          {personalizedPaths.map((path) => (
            <div key={path.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{path.title}</h3>
                  <p className="text-gray-600 mb-4">{path.description}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{path.sessions.length} sessions</span>
                    <span>~{Math.floor(path.estimatedTime / 60)}h {path.estimatedTime % 60}m</span>
                    <span>{path.sessions.filter(s => s.completed).length}/{path.sessions.length} completed</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900 mb-1">{path.progress}%</div>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getProgressColor(path.progress)}`}
                      style={{ width: `${path.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {path.sessions.map((session) => (
                  <div
                    key={session.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      session.completed 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100 cursor-pointer'
                    }`}
                    onClick={() => !session.completed && setSelectedSession(session)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        session.completed ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                      }`}>
                        {session.completed ? '✓' : path.sessions.indexOf(session) + 1}
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900">{session.topic}</h4>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(session.difficulty)}`}>
                            {session.difficulty}
                          </span>
                          <span className="text-sm text-gray-500">{session.duration} min</span>
                        </div>
                      </div>
                    </div>

                    {session.completed && session.score && (
                      <div className="text-green-600 font-semibold">
                        {session.score}%
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Dashboard view
  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Coaching & Mentorship</h1>
        <p className="text-gray-600">Personalized learning based on your assessment performance</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📚</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Available Paths</p>
              <p className="text-2xl font-bold text-gray-900">{personalizedPaths.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🎯</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Sessions Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {personalizedPaths.reduce((sum, path) => sum + path.sessions.filter(s => s.completed).length, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⚡</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Progress</p>
              <p className="text-2xl font-bold text-gray-900">
                {personalizedPaths.length > 0 
                  ? Math.round(personalizedPaths.reduce((sum, path) => sum + path.progress, 0) / personalizedPaths.length)
                  : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 rounded-lg text-white">
          <h3 className="text-xl font-semibold mb-2">Start Learning</h3>
          <p className="mb-4 opacity-90">Begin your personalized coaching journey</p>
          <button
            onClick={() => setCurrentView('paths')}
            className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            View Learning Paths
          </button>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-teal-600 p-6 rounded-lg text-white">
          <h3 className="text-xl font-semibold mb-2">Performance Analytics</h3>
          <p className="mb-4 opacity-90">Track your improvement over time</p>
          <button
            onClick={() => setCurrentView('analytics')}
            className="bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            View Analytics
          </button>
        </div>
      </div>

      {/* Recommended Sessions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recommended for You</h2>
        {isGeneratingPaths ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Analyzing your performance...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {personalizedPaths.flatMap(path => 
              path.sessions.filter(s => !s.completed).slice(0, 1)
            ).slice(0, 3).map((session) => (
              <div key={session.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 cursor-pointer">
                <h4 className="font-medium text-gray-900 mb-2">{session.topic}</h4>
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(session.difficulty)}`}>
                    {session.difficulty}
                  </span>
                  <span className="text-sm text-gray-500">{session.duration} min</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Coaching Session Component
function CoachingSessionView({ session, onBack }: { session: CoachingSession; onBack: () => void }) {
  const [isActive, setIsActive] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)

  const sessionSteps = [
    {
      title: 'Introduction',
      content: `Welcome to "${session.topic}". This ${session.duration}-minute session will help you improve your skills.`,
      duration: 2
    },
    {
      title: 'Learning Content',
      content: 'Interactive learning content would be delivered here...',
      duration: Math.floor(session.duration * 0.6)
    },
    {
      title: 'Practice Exercise',
      content: 'Practice what you\'ve learned with interactive exercises...',
      duration: Math.floor(session.duration * 0.3)
    },
    {
      title: 'Assessment',
      content: 'Quick assessment to measure your understanding...',
      duration: Math.floor(session.duration * 0.1)
    }
  ]

  useEffect(() => {
    if (isActive) {
      const timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsActive(false)
            return 100
          }
          return prev + (100 / (session.duration * 60))
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [isActive, session.duration])

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{session.topic}</h2>
            <p className="text-gray-600">Duration: {session.duration} minutes</p>
          </div>
          <button
            onClick={onBack}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Back to Paths
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Session Content */}
        <div className="text-center py-12">
          {!isActive ? (
            <div>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">▶️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Start?</h3>
              <p className="text-gray-600 mb-6">This session will help you master {session.topic.toLowerCase()}.</p>
              <button
                onClick={() => setIsActive(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Start Session
              </button>
            </div>
          ) : (
            <div>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Learning in Progress...</h3>
              <p className="text-gray-600">Interactive content is being delivered.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
