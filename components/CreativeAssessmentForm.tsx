'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Sparkles, Zap, Brain, Gamepad2, Target, Clock } from 'lucide-react'

interface CreativeAssessmentFormProps {
  onAssessmentGenerated: (assessment: any) => void
  onBack: () => void
}

export default function CreativeAssessmentForm({ onAssessmentGenerated, onBack }: CreativeAssessmentFormProps) {
  const [formData, setFormData] = useState({
    jobTitle: '',
    company: '',
    jobDescription: '',
    difficulty: 'Medium',
    duration: 60,
    creativityLevel: 'High',
    assessmentType: 'adaptive'
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    
    try {
      const response = await fetch('/api/generate-creative-assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const creativeAssessment = await response.json()
        
        // Transform the creative concept into our assessment format
        const assessment = {
          id: Date.now().toString(),
          title: creativeAssessment.title,
          jobTitle: formData.jobTitle,
          company: formData.company,
          description: creativeAssessment.description,
          type: creativeAssessment.type,
          difficulty: formData.difficulty,
          duration: creativeAssessment.duration || formData.duration,
          isCreative: true,
          interactiveElements: creativeAssessment.interactiveElements,
          components: creativeAssessment.components,
          evaluationCriteria: creativeAssessment.evaluationCriteria,
          questions: generateQuestionsFromConcept(creativeAssessment),
          timeLimit: creativeAssessment.duration || formData.duration,
          instructions: `Welcome to "${creativeAssessment.title}" - an interactive assessment experience. ${creativeAssessment.description}`,
          createdAt: new Date().toISOString()
        }
        
        onAssessmentGenerated(assessment)
      } else {
        throw new Error('Failed to generate creative assessment')
      }
    } catch (error) {
      console.error('Error generating creative assessment:', error)
      // Generate a fallback creative assessment
      const fallbackAssessment = generateFallbackCreativeAssessment(formData)
      onAssessmentGenerated(fallbackAssessment)
    } finally {
      setIsGenerating(false)
    }
  }

  const nextStep = () => setCurrentStep(Math.min(currentStep + 1, 3))
  const prevStep = () => setCurrentStep(Math.max(currentStep - 1, 1))

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white p-8">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={onBack}
                className="flex items-center text-purple-100 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </button>
              <div className="flex items-center space-x-2">
                <Brain className="h-6 w-6" />
                <span className="text-sm font-medium">AI Assessment Architect</span>
              </div>
            </div>
            
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2 flex items-center justify-center">
                <Sparkles className="h-8 w-8 mr-3 text-yellow-300" />
                Create Revolutionary Assessment
              </h1>
              <p className="text-purple-100 text-lg">
                Let AI design interactive, engaging experiences that test real-world skills
              </p>
            </div>

            {/* Progress Steps */}
            <div className="flex justify-center mt-8">
              <div className="flex space-x-4">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                      step <= currentStep ? 'bg-white text-purple-600' : 'bg-purple-500 text-purple-200'
                    }`}>
                      {step}
                    </div>
                    {step < 3 && <div className={`w-12 h-0.5 mx-2 transition-colors ${
                      step < currentStep ? 'bg-white' : 'bg-purple-500'
                    }`} />}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-8">
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <Target className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Define Your Role</h2>
                  <p className="text-gray-600">Tell us about the position you're hiring for</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Title
                    </label>
                    <input
                      type="text"
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="e.g., Senior Software Engineer"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="e.g., TechCorp Inc."
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Description
                  </label>
                  <textarea
                    name="jobDescription"
                    value={formData.jobDescription}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Describe the role, key responsibilities, and required skills..."
                    required
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={nextStep}
                    disabled={!formData.jobTitle || !formData.company || !formData.jobDescription}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    Next: Customize Experience
                    <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                  </button>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <Gamepad2 className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Customize Experience</h2>
                  <p className="text-gray-600">Configure the assessment difficulty and interaction style</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Difficulty Level
                    </label>
                    <select
                      name="difficulty"
                      value={formData.difficulty}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="Easy">Easy - Entry Level</option>
                      <option value="Medium">Medium - Mid Level</option>
                      <option value="Hard">Hard - Senior Level</option>
                      <option value="Expert">Expert - Leadership Level</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (minutes)
                    </label>
                    <select
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value={30}>30 minutes - Quick Challenge</option>
                      <option value={45}>45 minutes - Standard</option>
                      <option value={60}>60 minutes - Comprehensive</option>
                      <option value={90}>90 minutes - Deep Dive</option>
                      <option value={120}>120 minutes - Epic Challenge</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Creativity Level
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { value: 'Moderate', label: 'Moderate', desc: 'Enhanced traditional format', icon: '📝' },
                      { value: 'High', label: 'High', desc: 'Interactive simulations', icon: '🎮' },
                      { value: 'Revolutionary', label: 'Revolutionary', desc: 'Cutting-edge experiences', icon: '🚀' }
                    ].map((level) => (
                      <label key={level.value} className="cursor-pointer">
                        <input
                          type="radio"
                          name="creativityLevel"
                          value={level.value}
                          checked={formData.creativityLevel === level.value}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <div className={`p-4 border-2 rounded-lg text-center transition-colors ${
                          formData.creativityLevel === level.value
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-purple-300'
                        }`}>
                          <div className="text-2xl mb-2">{level.icon}</div>
                          <div className="font-medium text-gray-900">{level.label}</div>
                          <div className="text-sm text-gray-500">{level.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={prevStep}
                    className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </button>
                  <button
                    onClick={nextStep}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                  >
                    Next: Generate Assessment
                    <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                  </button>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <Zap className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Generate Assessment</h2>
                  <p className="text-gray-600">AI will create a unique, interactive assessment experience</p>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Assessment Preview</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Position:</span>
                      <span className="font-medium">{formData.jobTitle} at {formData.company}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Difficulty:</span>
                      <span className="font-medium">{formData.difficulty}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{formData.duration} minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Creativity Level:</span>
                      <span className="font-medium">{formData.creativityLevel}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={prevStep}
                    className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </button>
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors disabled:opacity-50 flex items-center"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                        AI is Creating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate Revolutionary Assessment
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function generateQuestionsFromConcept(concept: any) {
  // Convert interactive elements into question format for compatibility
  const questions = []
  
  if (concept.interactiveElements) {
    concept.interactiveElements.forEach((element: string, index: number) => {
      questions.push({
        id: index + 1,
        question: `Interactive Challenge ${index + 1}: ${element}`,
        type: 'interactive',
        difficulty: 'Medium',
        category: concept.type || 'Interactive',
        expectedAnswer: `This would be an interactive component: ${element}`,
        componentType: concept.components?.[index]?.type || 'TextInput',
        componentProps: concept.components?.[index]?.props || {}
      })
    })
  }

  // Add some traditional questions as fallback
  if (questions.length === 0) {
    questions.push({
      id: 1,
      question: concept.description || 'Describe how you would approach this challenge.',
      type: 'scenario',
      difficulty: 'Medium',
      category: 'Problem Solving',
      expectedAnswer: 'A thoughtful approach to the given scenario.'
    })
  }

  return questions
}

function generateFallbackCreativeAssessment(formData: any) {
  return {
    id: Date.now().toString(),
    title: `Creative Challenge: ${formData.jobTitle}`,
    jobTitle: formData.jobTitle,
    company: formData.company,
    description: `An innovative assessment designed specifically for ${formData.jobTitle} candidates.`,
    type: 'creative-simulation',
    difficulty: formData.difficulty,
    duration: formData.duration,
    isCreative: true,
    questions: [
      {
        id: 1,
        question: `You're starting as a ${formData.jobTitle} at ${formData.company}. Describe your first 90 days.`,
        type: 'scenario',
        difficulty: formData.difficulty,
        category: 'Strategic Thinking',
        expectedAnswer: 'A comprehensive plan for the first 90 days in the role.'
      }
    ],
    timeLimit: formData.duration,
    instructions: `Welcome to your creative assessment for the ${formData.jobTitle} position at ${formData.company}.`,
    createdAt: new Date().toISOString()
  }
}
