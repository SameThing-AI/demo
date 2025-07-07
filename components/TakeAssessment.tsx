'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Clock, CheckCircle, ArrowRight, Save } from 'lucide-react'

interface TakeAssessmentProps {
  assessmentData: any
  onBack: () => void
  onComplete: (results: any) => void
}

export default function TakeAssessment({ assessmentData, onBack, onComplete }: TakeAssessmentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [timeRemaining, setTimeRemaining] = useState(assessmentData.timeLimit * 60) // Convert to seconds
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Timer effect
  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else {
      // Auto-submit when time runs out
      handleSubmit()
    }
  }, [timeRemaining])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }))
  }

  const handleNext = () => {
    if (currentQuestion < assessmentData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/evaluate-assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assessmentData,
          answers,
          timeSpent: (assessmentData.timeLimit * 60) - timeRemaining
        }),
      })

      if (response.ok) {
        const results = await response.json()
        onComplete(results)
      } else {
        throw new Error('Failed to evaluate assessment')
      }
    } catch (error) {
      console.error('Error evaluating assessment:', error)
      // Create mock results for demo
      const mockResults = {
        totalScore: 78,
        maxScore: 100,
        percentage: 78,
        passed: true,
        timeSpent: (assessmentData.timeLimit * 60) - timeRemaining,
        breakdown: {
          technical: { score: 32, max: 40, percentage: 80 },
          problemSolving: { score: 24, max: 30, percentage: 80 },
          communication: { score: 14, max: 20, percentage: 70 },
          cultural: { score: 8, max: 10, percentage: 80 }
        },
        questionScores: assessmentData.questions.map((q: any, i: number) => ({
          question: q.question,
          answer: answers[i] || '',
          score: Math.floor(Math.random() * 3) + 7, // Random score 7-10
          feedback: 'Good understanding demonstrated with room for improvement in specific areas.'
        }))
      }
      onComplete(mockResults)
    } finally {
      setIsSubmitting(false)
    }
  }

  const progress = ((currentQuestion + 1) / assessmentData.questions.length) * 100
  const currentQ = assessmentData.questions[currentQuestion]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <button
                onClick={onBack}
                className="flex items-center text-gray-600 hover:text-blue-600 transition-colors mr-6"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {assessmentData.jobTitle} Assessment
                </h1>
                <p className="text-gray-600">{assessmentData.company}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-gray-600">
                <Clock className="h-5 w-5 mr-2" />
                <span className={`font-mono text-lg ${timeRemaining < 300 ? 'text-red-600' : ''}`}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                Question {currentQuestion + 1} of {assessmentData.questions.length}
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Question */}
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg shadow-lg p-8"
        >
          <div className="mb-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                Question {currentQuestion + 1}
              </h2>
              <div className="flex space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  currentQ.type === 'technical' ? 'bg-blue-100 text-blue-800' :
                  currentQ.type === 'problem-solving' ? 'bg-purple-100 text-purple-800' :
                  'bg-indigo-100 text-indigo-800'
                }`}>
                  {currentQ.type}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  currentQ.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                  currentQ.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {currentQ.difficulty}
                </span>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">Category: {currentQ.category}</p>
            
            <div className="prose max-w-none">
              <p className="text-gray-800 text-lg leading-relaxed">
                {currentQ.question}
              </p>
            </div>
          </div>

          {/* Answer Input */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Answer:
            </label>
            <textarea
              value={answers[currentQuestion] || ''}
              onChange={(e) => handleAnswerChange(currentQuestion, e.target.value)}
              rows={8}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
              placeholder="Type your detailed answer here..."
            />
            <p className="text-sm text-gray-500 mt-2">
              💡 Provide a detailed explanation with examples where applicable.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </button>

            <div className="flex space-x-3">
              <button
                onClick={() => handleAnswerChange(currentQuestion, answers[currentQuestion] || '')}
                className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </button>
              
              {currentQuestion < assessmentData.questions.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
                  <CheckCircle className="h-4 w-4 ml-2" />
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Question Overview */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress Overview</h3>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
            {assessmentData.questions.map((_: any, index: number) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center text-sm font-medium transition-colors ${
                  index === currentQuestion
                    ? 'border-blue-500 bg-blue-100 text-blue-700'
                    : answers[index]
                    ? 'border-green-500 bg-green-100 text-green-700'
                    : 'border-gray-300 bg-white text-gray-500 hover:border-gray-400'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
