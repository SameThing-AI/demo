'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Clock, CheckCircle, Eye, FileText } from 'lucide-react'

interface ReviewAssessmentProps {
  assessmentData: any
  results: any
  onBack: () => void
}

export default function ReviewAssessment({ assessmentData, results, onBack }: ReviewAssessmentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600'
    if (score >= 6) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 8) return 'bg-green-100'
    if (score >= 6) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  const currentQ = assessmentData.questions[currentQuestion]
  const currentResult = results.questionScores[currentQuestion]

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
                Back to Results
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Assessment Review: {assessmentData.jobTitle}
                </h1>
                <p className="text-gray-600">{assessmentData.company}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-gray-600">
                <Eye className="h-5 w-5 mr-2" />
                <span>Review Mode</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="h-5 w-5 mr-2" />
                <span>{formatTime(results.timeSpent)}</span>
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
                style={{ width: `${((currentQuestion + 1) / assessmentData.questions.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Question Review */}
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg shadow-lg p-8 mb-6"
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
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBgColor(currentResult.score)} ${getScoreColor(currentResult.score)}`}>
                  {currentResult.score}/10
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

          {/* Your Answer */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Answer:
            </label>
            <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 min-h-[200px]">
              {currentResult.answer || (
                <span className="text-gray-500 italic">No answer provided</span>
              )}
            </div>
          </div>

          {/* AI Feedback */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              AI Feedback & Evaluation
            </h4>
            <p className="text-blue-800 mb-4">{currentResult.feedback}</p>
            <div className="text-sm text-blue-700">
              <strong>Score: {currentResult.score}/10</strong> - 
              {currentResult.score >= 8 ? ' Excellent' : 
               currentResult.score >= 6 ? ' Good' : ' Needs Improvement'}
            </div>
          </div>
        </motion.div>

        {/* Navigation */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous Question
            </button>

            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Overall Score</h3>
              <div className="text-3xl font-bold text-blue-600">
                {results.percentage}%
              </div>
            </div>

            <button
              onClick={() => setCurrentQuestion(Math.min(assessmentData.questions.length - 1, currentQuestion + 1))}
              disabled={currentQuestion === assessmentData.questions.length - 1}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next Question
              <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
            </button>
          </div>

          {/* Question Overview */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Question Overview</h3>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
              {assessmentData.questions.map((_: any, index: number) => {
                const questionResult = results.questionScores[index]
                return (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestion(index)}
                    className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-sm font-medium transition-colors ${
                      index === currentQuestion
                        ? 'border-blue-500 bg-blue-100 text-blue-700'
                        : questionResult.score >= 8
                        ? 'border-green-500 bg-green-100 text-green-700'
                        : questionResult.score >= 6
                        ? 'border-yellow-500 bg-yellow-100 text-yellow-700'
                        : 'border-red-500 bg-red-100 text-red-700'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-xs">{index + 1}</div>
                      <div className="text-xs font-bold">{questionResult.score}</div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
