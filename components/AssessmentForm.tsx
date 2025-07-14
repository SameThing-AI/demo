'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Loader2, Building, User, FileText } from 'lucide-react'
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)

    try {
      const response = await fetch('/api/generate-assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const assessmentData = await response.json()
        
        // Save to data store
        const newAssessment = {
          id: Date.now().toString(),
          title: formData.jobTitle,
          company: formData.company,
          description: formData.jobDescription,
          questions: assessmentData.questions || [],
          createdAt: new Date().toISOString().split('T')[0],
          createdBy: user?.id || '',
          duration: assessmentData.timeLimit || 60
        }
        
        await createAssessment(newAssessment)
        onAssessmentGenerated(assessmentData)
      } else {
        throw new Error('Failed to generate assessment')
      }
    } catch (error) {
      console.error('Error generating assessment:', error)
      // For demo purposes, generate a mock assessment
      const mockAssessment = {
        jobTitle: formData.jobTitle,
        company: formData.company,
        questions: [
          {
            type: 'technical',
            question: 'Explain the concept of closures in JavaScript and provide a practical example.',
            expectedAnswer: 'A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function has returned...',
            difficulty: 'Medium',
            category: 'JavaScript Fundamentals'
          },
          {
            type: 'problem-solving',
            question: 'Design a system to handle real-time notifications for a social media platform with millions of users.',
            expectedAnswer: 'I would use a combination of WebSockets, message queues, and database sharding...',
            difficulty: 'Hard',
            category: 'System Design'
          },
          {
            type: 'behavioral',
            question: 'Describe a time when you had to work with a difficult team member. How did you handle the situation?',
            expectedAnswer: 'Look for examples of communication, conflict resolution, and professional maturity...',
            difficulty: 'Medium',
            category: 'Teamwork'
          }
        ],
        criteria: {
          technical: 40,
          problemSolving: 30,
          communication: 20,
          cultural: 10
        },
        timeLimit: 90,
        instructions: 'This assessment evaluates your technical skills, problem-solving ability, and cultural fit for the role.'
      }
      
      // Save mock assessment to data store
      const newAssessment = {
        id: Date.now().toString(),
        title: formData.jobTitle,
        company: formData.company,
        description: formData.jobDescription,
        questions: mockAssessment.questions || [],
        createdAt: new Date().toISOString().split('T')[0],
        createdBy: user?.id || '',
        duration: mockAssessment.timeLimit || 60
      }
      
      await createAssessment(newAssessment)
      onAssessmentGenerated(mockAssessment)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-lg shadow-lg p-8"
        >
          <div className="flex items-center mb-8">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </button>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Create Your Assessment
            </h2>
            <p className="text-gray-600">
              Just provide the job title, company name, and job description. Our AI will extract all the details and create a customized assessment.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="h-4 w-4 inline mr-2" />
                  Job Title *
                </label>
                <input
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                  placeholder="e.g., Senior Frontend Developer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Building className="h-4 w-4 inline mr-2" />
                  Company Name *
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                  placeholder="e.g., Tech Startup Inc."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="h-4 w-4 inline mr-2" />
                Job Description *
              </label>
              <textarea
                name="jobDescription"
                value={formData.jobDescription}
                onChange={handleInputChange}
                required
                rows={8}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                placeholder="Paste the full job description here. Include requirements, responsibilities, required skills, experience level, company culture, and any other relevant details..."
              />
              <p className="text-sm text-gray-500 mt-2">
                💡 <strong>Tip:</strong> The more detailed your job description, the better our AI can create targeted assessment questions. Include required skills, experience level, team size, and company culture.
              </p>
            </div>

            <div className="flex justify-center pt-6">
              <motion.button
                type="submit"
                disabled={isGenerating}
                whileHover={{ scale: isGenerating ? 1 : 1.05 }}
                whileTap={{ scale: isGenerating ? 1 : 0.95 }}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Generating Assessment...
                  </>
                ) : (
                  'Generate Assessment'
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
