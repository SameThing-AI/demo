'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Loader2, Building, User, FileText, Brain, Sparkles, Rocket } from 'lucide-react'
import { useAuth } from '../contexts/NextAuthContext'
import { useDatabaseData } from '../contexts/DatabaseDataContext'
import { Button, Input, Textarea, Card, Alert } from './ui'
import { useForm, useAsync } from '../hooks'
import { cn } from '../utils'

interface AssessmentFormData {
  jobTitle: string
  company: string
  jobDescription: string
  difficulty: 'easy' | 'medium' | 'hard'
  duration: number
  assessmentType: 'traditional' | 'revolutionary-ai'
}

interface AssessmentFormProps {
  onAssessmentGenerated: (data: any) => void
  onBack: () => void
  className?: string
}

export default function AssessmentForm({ 
  onAssessmentGenerated, 
  onBack, 
  className = '' 
}: AssessmentFormProps) {
  const { user } = useAuth()
  const { createAssessment } = useDatabaseData()
  const router = useRouter()
  
  const [selectedType, setSelectedType] = useState<'traditional' | 'revolutionary-ai'>('revolutionary-ai')

  const { execute: generateAssessment, loading: isGenerating, error } = useAsync(
    async (data: AssessmentFormData) => {
      const payload = {
        jobTitle: data.jobTitle,
        company: data.company,
        jobDescription: data.jobDescription,
        difficulty: data.difficulty,
        duration: data.duration,
        assessmentType: data.assessmentType
      }

      const response = await fetch('/api/generate-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Failed to generate assessment')
      }

      const result = await response.json()
      
      const assessmentData = {
        id: Date.now().toString(),
        title: result.title || `Revolutionary ${data.jobTitle} Assessment - The Ultimate Professional Challenge`,
        company: data.company,
        description: result.description || `The most advanced and intelligent assessment ever created for ${data.jobTitle} professionals, featuring revolutionary AI technology and infinity sandbox capabilities`,
        createdAt: new Date().toISOString(),
        createdBy: user?.id || '',
        duration: data.duration,
        type: (data.assessmentType === 'revolutionary-ai' ? 'revolutionary-ai' : 'traditional') as 'revolutionary-ai' | 'traditional',
        questions: result.questions || [],
        assessmentInterface: result.assessmentInterface,
        scenarios: result.scenarios,
        jobTitle: data.jobTitle,
        jobDescription: data.jobDescription,
        difficulty: data.difficulty,
        // Revolutionary AI features - The pinnacle of assessment technology
        aiGenerated: data.assessmentType === 'revolutionary-ai',
        revolutionaryFeatures: data.assessmentType === 'revolutionary-ai' ? {
          infinitySandbox: true,
          liveSimulation: true,
          plotTwists: true,
          adaptiveDifficulty: true,
          realTimeMetrics: true,
          professionalTools: true,
          aiAssistance: true,
          unlimitedExecution: true,
          revolutionaryExperience: true,
          professionalGradeEnvironment: true,
          adaptiveIntelligence: true,
          realWorldMirroring: true
        } : undefined,
        // Enhanced metadata for Revolutionary AI assessments
        assessmentMetadata: {
          generatedAt: new Date().toISOString(),
          aiModel: 'gpt-4o',
          complexity: 'revolutionary-maximum',
          experienceLevel: data.difficulty,
          expectedCompletionTime: data.duration,
          professionalGrade: true,
          industryStandard: true,
          revolutionaryTechnology: data.assessmentType === 'revolutionary-ai',
          infinitySandboxEnabled: data.assessmentType === 'revolutionary-ai',
          realTimePlotTwists: data.assessmentType === 'revolutionary-ai',
          adaptiveAI: data.assessmentType === 'revolutionary-ai',
          professionalExcellenceStandard: true
        }
      }

      await createAssessment(assessmentData)
      onAssessmentGenerated(assessmentData)
      
      return assessmentData
    }
  )

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isValid
  } = useForm<AssessmentFormData>({
    initialValues: {
      jobTitle: '',
      company: user?.company || '',
      jobDescription: '',
      difficulty: 'medium',
      duration: 60,
      assessmentType: selectedType
    },
    validate: (values) => {
      const errors: Partial<Record<keyof AssessmentFormData, string>> = {}
      
      if (!values.jobTitle?.trim()) {
        errors.jobTitle = 'Job title is required'
      }
      
      if (!values.company?.trim()) {
        errors.company = 'Company name is required'
      }
      
      if (!values.jobDescription?.trim()) {
        errors.jobDescription = 'Job description is required'
      } else if (values.jobDescription.trim().length < 50) {
        errors.jobDescription = 'Job description must be at least 50 characters'
      }
      
      if (values.duration < 15 || values.duration > 180) {
        errors.duration = 'Duration must be between 15 and 180 minutes'
      }
      
      return errors
    },
    onSubmit: async (data) => {
      await generateAssessment({ ...data, assessmentType: selectedType })
    }
  })

  const assessmentTypes = [
    {
      id: 'traditional',
      title: 'Traditional Q&A',
      description: 'Standard questions with text-based answers',
      icon: FileText,
      color: 'blue'
    },
    {
      id: 'revolutionary-ai',
      title: '🚀 Revolutionary AI Assessment',
      description: 'The absolute pinnacle of AI-powered assessment technology featuring infinity sandbox environments, revolutionary simulations, live code execution, adaptive intelligence, real-time plot twists, and professional-grade challenges that push the boundaries of candidate evaluation',
      icon: Brain,
      color: 'purple',
      features: [
        '🧠 Advanced AI Assessment Architect that analyzes role requirements with unprecedented depth',
        '🎮 Infinity Sandbox Environments with unlimited code execution and real-time adaptation',  
        '⚡ Revolutionary Live Simulations that mirror actual professional work environments',
        '�️ Dynamic Plot Twists that test adaptability and crisis management in real-time',
        '📊 Real-Time Performance Metrics with professional-grade analytics and benchmarking',
        '🛠️ Professional Tools Integration including debuggers, profilers, and testing frameworks',
        '🤖 Collaborative AI Assistant with strategic guidance and professional mentorship',
        '🎯 Adaptive Difficulty Scaling that adjusts to candidate competency in real-time',
        '� Unbreakable Security with sandboxed execution and unlimited exploration capabilities',
        '💎 Revolutionary Experience Design that candidates will never forget',
        '🏆 Professional Excellence Standards calibrated to industry-leading benchmarks',
        '🔬 Deep Competency Analysis that reveals true professional potential and thinking processes'
      ]
    }
  ]

  const difficulties = [
    { value: 'easy', label: 'Easy', description: 'Basic level questions' },
    { value: 'medium', label: 'Medium', description: 'Intermediate complexity' },
    { value: 'hard', label: 'Hard', description: 'Advanced level questions' }
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <Card theme="dark" className={className}>
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="mr-4 text-gray-300 hover:text-white"
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">Create Assessment</h1>
            <p className="text-gray-400">Generate an AI-powered assessment for your job opening</p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Alert variant="error">
              {error}
            </Alert>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
        {/* Job Details */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-white flex items-center">
            <Building className="w-5 h-5 mr-2 text-blue-400" />
            Job Details
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              name="jobTitle"
              label="Job Title"
              placeholder="e.g., Senior Software Engineer"
              value={values.jobTitle}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.jobTitle ? errors.jobTitle : undefined}
              icon={User}
              theme="dark"
              required
            />
            
            <Input
              name="company"
              label="Company Name"
              placeholder="e.g., Tech Corp"
              value={values.company}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.company ? errors.company : undefined}
              icon={Building}
              theme="dark"
              required
            />
          </div>

          <Textarea
            name="jobDescription"
            label="Job Description"
            placeholder="Provide a detailed description of the role, responsibilities, and requirements..."
            value={values.jobDescription}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.jobDescription ? errors.jobDescription : undefined}
            rows={6}
            theme="dark"
            required
            helperText="Minimum 50 characters required for better assessment generation"
          />
        </div>

        {/* Assessment Type Selection */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-white flex items-center">
            <Brain className="w-5 h-5 mr-2 text-purple-400" />
            Assessment Type
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {assessmentTypes.map((type) => {
              const Icon = type.icon
              const isSelected = selectedType === type.id
              
              return (
                <motion.button
                  key={type.id}
                  type="button"
                  onClick={() => setSelectedType(type.id as any)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    'p-6 rounded-lg border-2 text-left transition-all min-h-[160px]',
                    isSelected
                      ? type.id === 'traditional' 
                        ? 'border-blue-500 bg-blue-900/30' 
                        : 'border-purple-500 bg-purple-900/30'
                      : 'bg-gray-700 border-gray-600 hover:border-gray-500'
                  )}
                >
                  <Icon className={cn(
                    'w-6 h-6 mb-2',
                    isSelected 
                      ? type.id === 'traditional' 
                        ? 'text-blue-400' 
                        : 'text-purple-400'
                      : 'text-gray-400'
                  )} />
                  <h3 className={cn(
                    'font-medium mb-1',
                    isSelected 
                      ? type.id === 'traditional' 
                        ? 'text-blue-100' 
                        : 'text-purple-100'
                      : 'text-gray-200'
                  )}>
                    {type.title}
                  </h3>
                  <p className={cn(
                    'text-sm mb-3',
                    isSelected 
                      ? type.id === 'traditional' 
                        ? 'text-blue-200' 
                        : 'text-purple-200'
                      : 'text-gray-400'
                  )}>
                    {type.description}
                  </p>
                  {type.id === 'revolutionary-ai' && (
                    <div className="mt-3 space-y-1">
                      {type.features?.map((feature, index) => (
                        <div key={index} className={cn(
                          'text-xs flex items-center',
                          isSelected ? 'text-purple-300' : 'text-gray-500'
                        )}>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Configuration */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-white flex items-center">
            <Rocket className="w-5 h-5 mr-2 text-green-400" />
            Configuration
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Difficulty Level
              </label>
              <select
                name="difficulty"
                value={values.difficulty}
                onChange={handleChange as any}
                onBlur={handleBlur as any}
                className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {difficulties.map((diff) => (
                  <option key={diff.value} value={diff.value}>
                    {diff.label} - {diff.description}
                  </option>
                ))}
              </select>
            </div>
            
            <Input
              name="duration"
              type="number"
              label="Duration (minutes)"
              value={values.duration}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.duration ? errors.duration : undefined}
              min={15}
              max={180}
              theme="dark"
              helperText="Between 15 and 180 minutes"
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-700">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/recruiter/assessments')}
            className="border-gray-600 text-gray-300 hover:bg-gray-700 px-6 py-3"
          >
            Cancel
          </Button>
          
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={!isValid || isGenerating}
            className="min-w-[200px] bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Assessment...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4 mr-2" />
                Generate Assessment
              </>
            )}
          </Button>
        </div>
      </form>
      </Card>
    </div>
  )
}
