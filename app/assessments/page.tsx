'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/NextAuthContext'
import Navigation from '@/components/Navigation'
import { motion } from 'framer-motion'
import { 
  FileText, 
  Clock, 
  Star, 
  ArrowRight, 
  Brain, 
  Zap, 
  Play,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { aiContentGenerator } from '@/lib/ai-content-generator-openai'

interface Assessment {
  id: string
  title: string
  description: string
  type: string
  status: 'available' | 'in-progress' | 'completed'
  timeLimit: number
  difficulty: 'easy' | 'medium' | 'hard'
  score?: number
  dueDate?: string
  company: string
  jobTitle: string
  aiGenerated?: boolean
}

export default function AssessmentsPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [loading, setLoading] = useState(true)
  const [enhancingWithAI, setEnhancingWithAI] = useState(false)

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push('/auth')
      return
    }
    if (isAuthenticated && user?.role !== 'candidate') {
      router.push('/recruiter')
      return
    }
  }, [isAuthenticated, isLoading, user, router])

  useEffect(() => {
    if (isAuthenticated && user?.role === 'candidate') {
      loadAssessments()
    }
  }, [isAuthenticated, user])

  const loadAssessments = async () => {
    try {
      setLoading(true)
      
      // Load assessments for candidate
      const response = await fetch(`/api/candidates/${user?.id}/assessments`)
      
      if (response.ok) {
        const data = await response.json()
        setAssessments(data)
      } else {
        // Generate sample AI-powered assessments if none exist
        await generateSampleAssessments()
      }
    } catch (error) {
      console.error('Error loading assessments:', error)
      await generateSampleAssessments()
    } finally {
      setLoading(false)
    }
  }

  const generateSampleAssessments = async () => {
    setEnhancingWithAI(true)
    
    const sampleAssessments: Assessment[] = [
      {
        id: 'ai-frontend-dev',
        title: 'Frontend Developer Assessment',
        description: 'Evaluate your React, TypeScript, and modern web development skills',
        type: 'technical',
        status: 'available',
        timeLimit: 90,
        difficulty: 'medium',
        company: 'TechCorp',
        jobTitle: 'Senior Frontend Developer',
        aiGenerated: true
      },
      {
        id: 'ai-live-simulation',
        title: 'Live Problem-Solving Simulation',
        description: 'Interactive coding environment with real-time challenges',
        type: 'live-simulation',
        status: 'available',
        timeLimit: 120,
        difficulty: 'hard',
        company: 'InnovateLab',
        jobTitle: 'Full Stack Engineer',
        aiGenerated: true
      },
      {
        id: 'ai-system-design',
        title: 'System Design Challenge',
        description: 'Design scalable systems and architect solutions',
        type: 'architectural',
        status: 'available',
        timeLimit: 180,
        difficulty: 'hard',
        company: 'ScaleUp Inc',
        jobTitle: 'Software Architect',
        aiGenerated: true
      }
    ]

    // Enhance descriptions with AI
    for (const assessment of sampleAssessments) {
      try {
        const aiDescription = await aiContentGenerator.generateContent({
          type: 'description',
          context: {
            type: 'assessment',
            role: assessment.jobTitle,
            company: assessment.company,
            difficulty: assessment.difficulty
          }
        })
        assessment.description = aiDescription.content
      } catch (error) {
        console.log('Using fallback description for', assessment.title)
      }
    }

    setAssessments(sampleAssessments)
    setEnhancingWithAI(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200'
      case 'in-progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'available': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-600/20 text-green-400 border-green-500/30'
      case 'medium': return 'bg-yellow-600/20 text-yellow-400 border-yellow-500/30'
      case 'hard': return 'bg-red-600/20 text-red-400 border-red-500/30'
      default: return 'bg-gray-600/20 text-gray-400 border-gray-500/30'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'live-simulation': return <Zap className="h-5 w-5" />
      case 'technical': return <Brain className="h-5 w-5" />
      default: return <FileText className="h-5 w-5" />
    }
  }

  const handleTakeAssessment = (assessmentId: string) => {
    router.push(`/assessments/${assessmentId}/take`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navigation userType="candidate" />
        <div className="pt-16 flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-300">Loading your assessments...</p>
            {enhancingWithAI && (
              <p className="text-blue-400 text-sm mt-2">Enhancing with AI...</p>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || user?.role !== 'candidate') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation userType="candidate" />
      
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-white mb-2">
              Your Assessments
            </h1>
            <p className="text-gray-400">
              Complete assessments to showcase your skills to potential employers
            </p>
          </motion.div>

          {/* AI Enhancement Notice */}
          {enhancingWithAI && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 bg-blue-600/20 border border-blue-500/30 rounded-lg p-4"
            >
              <div className="flex items-center space-x-3">
                <Brain className="h-5 w-5 text-blue-400 animate-pulse" />
                <div>
                  <p className="text-blue-400 font-medium">AI Enhancement in Progress</p>
                  <p className="text-blue-300 text-sm">Personalizing assessment content for your skill level...</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Assessments Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assessments.map((assessment, index) => (
              <motion.div
                key={assessment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden hover:border-gray-600 transition-colors"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-600/20 rounded-lg text-blue-400">
                        {getTypeIcon(assessment.type)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {assessment.title}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {assessment.company} • {assessment.jobTitle}
                        </p>
                      </div>
                    </div>
                    {assessment.aiGenerated && (
                      <div className="flex items-center space-x-1 px-2 py-1 bg-purple-600/20 text-purple-400 rounded-full">
                        <Brain className="h-3 w-3" />
                        <span className="text-xs">AI</span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                    {assessment.description}
                  </p>

                  {/* Metadata */}
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="flex items-center space-x-1 text-gray-400 text-sm">
                      <Clock className="h-4 w-4" />
                      <span>{assessment.timeLimit}min</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(assessment.difficulty)}`}>
                      {assessment.difficulty}
                    </span>
                  </div>

                  {/* Status and Score */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(assessment.status)}`}>
                      {assessment.status === 'available' && 'Ready to Start'}
                      {assessment.status === 'in-progress' && 'In Progress'}
                      {assessment.status === 'completed' && 'Completed'}
                    </span>
                    
                    {assessment.score && (
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400" />
                        <span className="text-white font-medium">{assessment.score}%</span>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleTakeAssessment(assessment.id)}
                    disabled={assessment.status === 'completed'}
                    className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                      assessment.status === 'completed'
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        : assessment.type === 'live-simulation'
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {assessment.status === 'completed' ? (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        <span>Completed</span>
                      </>
                    ) : assessment.status === 'in-progress' ? (
                      <>
                        <Play className="h-4 w-4" />
                        <span>Continue</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" />
                        <span>Start Assessment</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {assessments.length === 0 && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <FileText className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                No Assessments Yet
              </h3>
              <p className="text-gray-500 mb-6">
                Assessments will appear here when employers invite you to complete them.
              </p>
              <button
                onClick={generateSampleAssessments}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Generate Sample Assessments
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
