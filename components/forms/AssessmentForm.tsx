'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Loader2, Building, User, FileText, Brain, Sparkles, Rocket } from 'lucide-react'
import { useAuth } from '../../contexts/NextAuthContext'
import { useDatabaseData } from '../../contexts/DatabaseDataContext'
import { Button, Input, Textarea, Card, Alert } from '../ui'
import { useForm, useAsync } from '../../hooks'
import { cn } from '../../utils'

interface AssessmentFormData {
  jobTitle: string
  company: string
  jobDescription: string
  difficulty: 'easy' | 'medium' | 'hard'
  duration: number
  assessmentType: 'traditional' | 'ai-powered' | 'creative'
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
  
  const [selectedType, setSelectedType] = useState<'traditional' | 'ai-powered' | 'creative'>('traditional')

  const { execute: generateAssessment, loading: isGenerating, error } = useAsync(
    async (data: AssessmentFormData) => {
      const payload = {
        prompt: `Create an assessment for ${data.jobTitle} at ${data.company}. 
                Job Description: ${data.jobDescription}
                Difficulty: ${data.difficulty}
                Duration: ${data.duration} minutes
                Type: ${data.assessmentType}`,
        type: data.assessmentType,
        difficulty: data.difficulty,
        duration: data.duration
      }

      const response = await fetch('/api/ai/generate', {
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
        title: `${data.jobTitle} Assessment`,
        company: data.company,
        description: `Assessment for ${data.jobTitle} position`,
        createdAt: new Date().toISOString(),
        createdBy: user?.id || '',
        duration: data.duration,
        type: data.assessmentType,
        questions: result.questions || [],
        jobTitle: data.jobTitle,
        jobDescription: data.jobDescription,
        difficulty: data.difficulty
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
      const errors: Partial<AssessmentFormData> = {}
      
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
      id: 'ai-powered',
      title: 'AI-Powered',
      description: 'Dynamic questions that adapt based on responses',
      icon: Brain,
      color: 'purple'
    },
    {
      id: 'creative',
      title: 'Creative Challenge',
      description: 'Open-ended creative problem-solving tasks',
      icon: Sparkles,
      color: 'green'
    }
  ]

  const difficulties = [
    { value: 'easy', label: 'Easy', description: 'Basic level questions' },
    { value: 'medium', label: 'Medium', description: 'Intermediate complexity' },
    { value: 'hard', label: 'Hard', description: 'Advanced level questions' }
  ]

  return (
    <Card className={cn('max-w-4xl mx-auto p-8', className)}>
      {/* Header */}
      <div className="flex items-center mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="mr-4"
          icon={<ArrowLeft className="w-4 h-4" />}
        >
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create Assessment</h1>
          <p className="text-gray-600">Generate an AI-powered assessment for your job opening</p>
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
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Building className="w-5 h-5 mr-2 text-blue-600" />
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
            required
            helperText="Minimum 50 characters required for better assessment generation"
          />
        </div>

        {/* Assessment Type Selection */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Brain className="w-5 h-5 mr-2 text-purple-600" />
            Assessment Type
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    'p-4 rounded-lg border-2 text-left transition-all',
                    isSelected
                      ? `border-${type.color}-500 bg-${type.color}-50`
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <Icon className={cn(
                    'w-6 h-6 mb-2',
                    isSelected ? `text-${type.color}-600` : 'text-gray-400'
                  )} />
                  <h3 className={cn(
                    'font-medium mb-1',
                    isSelected ? `text-${type.color}-900` : 'text-gray-900'
                  )}>
                    {type.title}
                  </h3>
                  <p className={cn(
                    'text-sm',
                    isSelected ? `text-${type.color}-700` : 'text-gray-600'
                  )}>
                    {type.description}
                  </p>
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Configuration */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Rocket className="w-5 h-5 mr-2 text-green-600" />
            Configuration
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty Level
              </label>
              <select
                name="difficulty"
                value={values.difficulty}
                onChange={handleChange as any}
                onBlur={handleBlur as any}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              helperText="Between 15 and 180 minutes"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-6 border-t border-gray-200">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={!isValid || isGenerating}
            className="min-w-[200px]"
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
  )
}
