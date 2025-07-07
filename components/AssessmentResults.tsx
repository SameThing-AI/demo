'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle, XCircle, Trophy, Clock, Download, Share2, Star } from 'lucide-react'

interface AssessmentResultsProps {
  results: any
  onBack: () => void
  onStartNew: () => void
}

export default function AssessmentResults({ results, onBack, onStartNew }: AssessmentResultsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'detailed' | 'feedback'>('overview')

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600'
    if (percentage >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-100'
    if (percentage >= 60) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  const handleExport = () => {
    const dataStr = JSON.stringify(results, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    const exportFileDefaultName = `assessment_results_${Date.now()}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          {/* Header */}
          <div className={`${results.passed ? 'bg-gradient-to-r from-green-600 to-emerald-600' : 'bg-gradient-to-r from-red-600 to-pink-600'} text-white p-8`}>
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={onBack}
                className="flex items-center text-white/80 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Assessment
              </button>
              <div className="flex space-x-4">
                <button
                  onClick={handleExport}
                  className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg flex items-center transition-colors"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Results
                </button>
                <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg flex items-center transition-colors">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </button>
              </div>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center mb-4">
                {results.passed ? (
                  <Trophy className="h-16 w-16 text-yellow-300" />
                ) : (
                  <XCircle className="h-16 w-16 text-red-300" />
                )}
              </div>
              <h1 className="text-4xl font-bold mb-2">
                {results.passed ? 'Congratulations!' : 'Assessment Complete'}
              </h1>
              <p className="text-xl text-white/90 mb-6">
                {results.passed ? 
                  'You have successfully passed the assessment!' : 
                  'Thank you for completing the assessment.'
                }
              </p>
              
              <div className="flex justify-center items-center space-x-8">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-1">
                    {results.percentage}%
                  </div>
                  <div className="text-white/80">Overall Score</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-1">
                    {results.totalScore}/{results.maxScore}
                  </div>
                  <div className="text-white/80">Points</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-1">
                    {formatTime(results.timeSpent)}
                  </div>
                  <div className="text-white/80">Time Spent</div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-8">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'detailed', label: 'Detailed Scores' },
                { id: 'feedback', label: 'AI Feedback' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="p-8">
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {Object.entries(results.breakdown).map(([category, data]: [string, any]) => (
                    <div key={category} className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 capitalize">
                        {category.replace(/([A-Z])/g, ' $1').trim()}
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-bold text-gray-900">
                            {data.score}/{data.max}
                          </span>
                          <span className={`text-lg font-semibold ${getScoreColor(data.percentage)}`}>
                            {data.percentage}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              data.percentage >= 80 ? 'bg-green-500' :
                              data.percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${data.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">
                    Overall Performance Summary
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-blue-800 mb-2">Strengths:</h4>
                      <ul className="text-blue-700 space-y-1">
                        {Object.entries(results.breakdown)
                          .filter(([_, data]: [string, any]) => data.percentage >= 75)
                          .map(([category]) => (
                            <li key={category} className="flex items-center">
                              <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                              {category.replace(/([A-Z])/g, ' $1').trim()}
                            </li>
                          ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-800 mb-2">Areas for Improvement:</h4>
                      <ul className="text-blue-700 space-y-1">
                        {Object.entries(results.breakdown)
                          .filter(([_, data]: [string, any]) => data.percentage < 75)
                          .map(([category]) => (
                            <li key={category} className="flex items-center">
                              <XCircle className="h-4 w-4 mr-2 text-red-600" />
                              {category.replace(/([A-Z])/g, ' $1').trim()}
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'detailed' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                {results.questionScores.map((item: any, index: number) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Question {index + 1}
                      </h3>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBgColor(item.score * 10)} ${getScoreColor(item.score * 10)}`}>
                        {item.score}/10
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Question:</h4>
                      <p className="text-gray-700">{item.question}</p>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Your Answer:</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-700">{item.answer || 'No answer provided'}</p>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-2">AI Feedback:</h4>
                      <p className="text-blue-800">{item.feedback}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'feedback' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <Star className="h-8 w-8 text-blue-600 mr-3" />
                    <h3 className="text-xl font-semibold text-gray-900">
                      AI-Generated Feedback Report
                    </h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Overall Assessment:</h4>
                      <p className="text-gray-700">
                        Based on your responses, you demonstrate {results.percentage >= 80 ? 'excellent' : results.percentage >= 60 ? 'good' : 'developing'} understanding 
                        of the key concepts required for this role. Your technical knowledge appears 
                        {results.breakdown.technical.percentage >= 75 ? ' strong' : ' to need development'}, 
                        and your problem-solving approach shows 
                        {results.breakdown.problemSolving.percentage >= 75 ? ' clear analytical thinking' : ' room for improvement in structured thinking'}.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Recommendations:</h4>
                      <ul className="text-gray-700 space-y-2">
                        {results.breakdown.technical.percentage < 75 && (
                          <li>• Focus on strengthening core technical skills through hands-on practice</li>
                        )}
                        {results.breakdown.problemSolving.percentage < 75 && (
                          <li>• Practice breaking down complex problems into smaller, manageable parts</li>
                        )}
                        {results.breakdown.communication.percentage < 75 && (
                          <li>• Work on explaining technical concepts clearly and concisely</li>
                        )}
                        {results.breakdown.cultural.percentage < 75 && (
                          <li>• Consider learning more about collaborative work environments and team dynamics</li>
                        )}
                        <li>• Continue building on your existing strengths while addressing areas for improvement</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Next Steps:</h4>
                      <p className="text-gray-700">
                        {results.passed ? 
                          'Congratulations on passing! We recommend discussing your results with the hiring team to understand the next steps in the interview process.' :
                          'While you didn\'t pass this time, your effort is commendable. We encourage you to work on the recommended areas and consider retaking the assessment in the future.'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="border-t border-gray-200 p-6">
            <div className="flex justify-center space-x-4">
              <button
                onClick={onStartNew}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Take Another Assessment
              </button>
              <button
                onClick={onBack}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Review Assessment
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
