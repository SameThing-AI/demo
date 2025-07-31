'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Loader2, Building, User, FileText, Brain, Sparkles, Rocket } from 'lucide-react'
import { useAuth } from '@/contexts/NextAuthContext'
import { useDatabaseData } from '@/contexts/DatabaseDataContext'

interface AssessmentFormProps {
  onAssessmentGenerated: (data: any) => void
  onBack: () => void
}

export default function AssessmentForm({ onAssessmentGenerated, onBack }: AssessmentFormProps) {
  const { user } = useAuth()
  const { createAssessment } = useDatabaseData()
  
  const [formData, setFormData] = useState({
    jobTitle: '',
    company: '',
    jobDescription: ''
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = 'Job title is required'
    }
    if (!formData.company.trim()) {
      newErrors.company = 'Company name is required'
    }
    if (!formData.jobDescription.trim()) {
      newErrors.jobDescription = 'Job description is required'
    } else if (formData.jobDescription.trim().length < 50) {
      newErrors.jobDescription = 'Job description must be at least 50 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      setIsGenerating(true)
      
      console.log('🤖 Generating fully AI-powered assessment...')
      
      // Let AI generate everything based only on job requirements
      const response = await fetch('/api/generate-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle: formData.jobTitle,
          company: formData.company,
          jobDescription: formData.jobDescription
        })
      })

      if (!response.ok) {
        throw new Error(`Assessment generation failed: ${response.status}`)
      }

      const assessmentData = await response.json()
      
      console.log('✅ AI-powered assessment generated:', assessmentData.title || 'Untitled')
      console.log('🎮 Assessment type:', assessmentData.assessmentType)
      console.log('🎯 AI-generated features:', assessmentData.uniqueFeatures?.length || 0)
      
      // Create assessment with complete AI-generated data
      const newAssessment = {
        title: assessmentData.title || formData.jobTitle,
        company: assessmentData.company || formData.company,
        description: assessmentData.description || formData.jobDescription,
        questions: assessmentData.questions || [],
        duration: assessmentData.timeLimit || assessmentData.totalTime || 90,
        type: 'ai-powered', // Always AI-powered since AI makes all decisions
        
        // Store complete AI-generated interface specification
        ...(assessmentData.assessmentInterface && {
          assessmentInterface: assessmentData.assessmentInterface,
          scenarios: assessmentData.scenarios,
          generated: true,
          aiGeneratedAt: new Date(),
          assessmentType: assessmentData.assessmentInterface.type,
          revolutionaryTitle: assessmentData.assessmentInterface.title
        }),
        
        // Backward compatibility for revolutionary assessments
        ...(assessmentData.assessmentType && {
          assessmentType: assessmentData.assessmentType,
          revolutionaryTitle: assessmentData.title,
          scenarios: assessmentData.scenarios,
          instructions: assessmentData.instructions,
          totalTime: assessmentData.totalTime,
          aiAssistanceMode: assessmentData.aiAssistanceMode,
          uniqueFeatures: assessmentData.uniqueFeatures,
          criteria: assessmentData.criteria
        })
      }

      await createAssessment(newAssessment)
      
      // Pass complete assessment data to callback
      onAssessmentGenerated({ 
        ...newAssessment,
        ...(assessmentData && {
          jobTitle: assessmentData.jobTitle,
          timeLimit: assessmentData.timeLimit || assessmentData.totalTime,
          scenarios: assessmentData.scenarios,
          uniqueFeatures: assessmentData.uniqueFeatures
        })
      })
      
    } catch (error) {
      console.error('❌ AI assessment generation failed:', error)
      alert('Failed to generate AI-powered assessment. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>
          
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <div className="flex items-center justify-center mb-4">
                <Brain className="h-12 w-12 text-purple-500 mr-3" />
                <Sparkles className="h-8 w-8 text-yellow-400" />
              </div>
              <h1 className="text-4xl font-bold mb-2">
                🤖 AI-Powered Assessment
              </h1>
              <p className="text-xl text-gray-300">
                Let our AI create the perfect assessment for your role
              </p>
            </motion.div>
            
            <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-lg p-6 max-w-3xl mx-auto">
              <h3 className="text-lg font-semibold mb-3 text-purple-300">🚀 What Makes This Revolutionary?</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center text-green-400">
                    <Rocket className="h-4 w-4 mr-2" />
                    <span>AI analyzes your job requirements</span>
                  </div>
                  <div className="flex items-center text-blue-400">
                    <Brain className="h-4 w-4 mr-2" />
                    <span>Generates custom interface types</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-purple-400">
                    <Sparkles className="h-4 w-4 mr-2" />
                    <span>Creates role-specific scenarios</span>
                  </div>
                  <div className="flex items-center text-yellow-400">
                    <FileText className="h-4 w-4 mr-2" />
                    <span>Decides all features automatically</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI-Powered Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <form onSubmit={handleSubmit} className="bg-gray-800 border border-gray-700 rounded-xl p-8">
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Just Tell Us About The Role</h2>
                <p className="text-gray-400">
                  Our AI will handle everything else - interface design, question types, evaluation criteria, and advanced features
                </p>
              </div>

              {/* Job Title */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <User className="inline h-4 w-4 mr-2" />
                  Job Title *
                </label>
                <input
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleInputChange}
                  placeholder="e.g., Senior Product Manager"
                  className={`w-full px-4 py-3 bg-gray-900 border rounded-lg text-white placeholder-gray-400 transition-colors ${
                    errors.jobTitle ? 'border-red-500' : 'border-gray-600 focus:border-purple-500'
                  }`}
                  required
                />
                {errors.jobTitle && (
                  <p className="text-red-400 text-sm mt-1">{errors.jobTitle}</p>
                )}
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Building className="inline h-4 w-4 mr-2" />
                  Company *
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="e.g., TechCorp Inc."
                  className={`w-full px-4 py-3 bg-gray-900 border rounded-lg text-white placeholder-gray-400 transition-colors ${
                    errors.company ? 'border-red-500' : 'border-gray-600 focus:border-purple-500'
                  }`}
                  required
                />
                {errors.company && (
                  <p className="text-red-400 text-sm mt-1">{errors.company}</p>
                )}
              </div>

              {/* Job Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <FileText className="inline h-4 w-4 mr-2" />
                  Job Description *
                </label>
                <textarea
                  name="jobDescription"
                  value={formData.jobDescription}
                  onChange={handleInputChange}
                  placeholder="Describe the role, responsibilities, required skills, and qualifications. The more detailed you are, the better our AI can create a tailored assessment..."
                  rows={8}
                  className={`w-full px-4 py-3 bg-gray-900 border rounded-lg text-white placeholder-gray-400 resize-none transition-colors ${
                    errors.jobDescription ? 'border-red-500' : 'border-gray-600 focus:border-purple-500'
                  }`}
                  required
                />
                {errors.jobDescription && (
                  <p className="text-red-400 text-sm mt-1">{errors.jobDescription}</p>
                )}
                <p className="text-gray-400 text-sm mt-2">
                  {formData.jobDescription.length}/50 minimum characters
                </p>
              </div>

              {/* AI Decision Showcase */}
              <div className="bg-gradient-to-r from-gray-800/50 to-purple-900/20 border border-purple-500/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 text-purple-300 flex items-center">
                  <Brain className="h-5 w-5 mr-2" />
                  AI Will Automatically Decide:
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300">
                  <div className="space-y-2">
                    <div>• Interface type (coding, simulation, creative, etc.)</div>
                    <div>• Question complexity and style</div>
                    <div>• Evaluation criteria and scoring</div>
                    <div>• Time limits and pacing</div>
                  </div>
                  <div className="space-y-2">
                    <div>• Multi-modal responses (video/audio if needed)</div>
                    <div>• Live simulation environments</div>
                    <div>• Adaptive difficulty adjustments</div>
                    <div>• Creative challenges and scenarios</div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="text-center pt-6">
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 flex items-center mx-auto"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5 mr-3" />
                      AI Creating Your Assessment...
                    </>
                  ) : (
                    <>
                      <Rocket className="h-5 w-5 mr-3" />
                      Generate AI-Powered Assessment
                    </>
                  )}
                </button>
                {isGenerating && (
                  <p className="text-gray-400 text-sm mt-3">
                    Our AI is analyzing your requirements and crafting the perfect assessment experience...
                  </p>
                )}
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
