'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Clock, CheckCircle, Download, Share2, Star, Zap, Cpu, AlertTriangle, Brain, Target, Play } from 'lucide-react'

interface AssessmentDisplayProps {
  assessmentData: any
  onBack: () => void
  onTakeAssessment: () => void
  hideTestButtons?: boolean
}

export default function AssessmentDisplay({ assessmentData, onBack, onTakeAssessment, hideTestButtons = false }: AssessmentDisplayProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'questions' | 'criteria'>('overview')

  // Handle case where assessmentData is null or undefined
  if (!assessmentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Assessment Not Found</h2>
          <p className="text-gray-600 mb-6">The assessment data could not be loaded.</p>
          <button
            onClick={onBack}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  const handleExport = () => {
    if (!assessmentData) return
    
    const dataStr = JSON.stringify(assessmentData, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    const exportFileDefaultName = `${assessmentData.jobTitle}_assessment.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'technical': return 'bg-blue-100 text-blue-800'
      case 'problem-solving': return 'bg-purple-100 text-purple-800'
      case 'behavioral': return 'bg-indigo-100 text-indigo-800'
      default: return 'bg-gray-100 text-gray-800'
    }
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
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={onBack}
                className="flex items-center text-blue-100 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Form
              </button>
              <div className="flex space-x-4">
                {!hideTestButtons && (
                  <button
                    onClick={onTakeAssessment}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center transition-colors"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Take Assessment
                  </button>
                )}
                <button
                  onClick={handleExport}
                  className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg flex items-center transition-colors"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </button>
                <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg flex items-center transition-colors">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </button>
              </div>
            </div>
            
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2">
                {assessmentData.jobTitle || assessmentData.title || 'Untitled'} Assessment
              </h1>
              <p className="text-blue-100 text-lg">
                {assessmentData.company || 'Company'}
              </p>
              
              {/* Job Description */}
              {assessmentData.jobDescription && (
                <div className="mt-4 max-w-2xl mx-auto">
                  <p className="text-blue-100 text-sm leading-relaxed">
                    {assessmentData.jobDescription}
                  </p>
                </div>
              )}
              
              {/* Revolutionary Assessment Indicators */}
              {(assessmentData.assessmentType === 'revolutionary' || 
                assessmentData.assessmentType === 'revolutionary-simulation' ||
                assessmentData.generated ||
                assessmentData.questions?.some((q: any) => q.type === 'revolutionary-simulation')) && (
                <div className="flex justify-center items-center space-x-3 mt-4 mb-4">
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-100 text-sm font-medium rounded-full flex items-center">
                    <Zap className="h-4 w-4 mr-1" />
                    Revolutionary Assessment
                  </span>
                  {assessmentData.scenarios?.some((s: any) => s.type === 'simulation') && (
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-100 text-sm font-medium rounded-full flex items-center">
                      <Cpu className="h-4 w-4 mr-1" />
                      Live Simulation
                    </span>
                  )}
                  {assessmentData.uniqueFeatures?.includes('plot-twists') && (
                    <span className="px-3 py-1 bg-orange-500/20 text-orange-100 text-sm font-medium rounded-full flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      Plot Twists
                    </span>
                  )}
                </div>
              )}
              
              <div className="flex justify-center items-center mt-4 space-x-6">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>{assessmentData.timeLimit || 60} minutes</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span>{assessmentData.questions?.length || 0} questions</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-5 w-5 mr-2" />
                  <span>AI Generated</span>
                </div>
                {assessmentData.scenarios?.some((s: any) => s.type === 'simulation') && (
                  <div className="flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    <span>Interactive</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-8">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'questions', label: 'Questions' },
                { id: 'criteria', label: 'Evaluation Criteria' }
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
                {/* Check if this is a revolutionary assessment */}
                {assessmentData.assessmentType && assessmentData.title && (
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg p-6">
                    <div className="text-center">
                      <h2 className="text-3xl font-bold mb-2">🚀 {assessmentData.title}</h2>
                      <p className="text-lg text-white/90 mb-4">{assessmentData.description}</p>
                      <div className="flex justify-center items-center space-x-4 text-sm">
                        <span className="bg-white/20 px-3 py-1 rounded-full">
                          {assessmentData.assessmentType.toUpperCase()}
                        </span>
                        <span className="bg-white/20 px-3 py-1 rounded-full">
                          ⏱️ {assessmentData.totalTime || assessmentData.timeLimit}min
                        </span>
                        <span className="bg-white/20 px-3 py-1 rounded-full">
                          🎯 {assessmentData.aiAssistanceMode} mode
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Unique Features */}
                {assessmentData.uniqueFeatures && assessmentData.uniqueFeatures.length > 0 && (
                  <div className="bg-yellow-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-yellow-900 mb-3 flex items-center">
                      ✨ What Makes This Assessment Revolutionary
                    </h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      {assessmentData.uniqueFeatures.map((feature: string, index: number) => (
                        <div key={index} className="flex items-center space-x-2">
                          <span className="text-yellow-600">🎮</span>
                          <span className="text-yellow-800">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">
                    🎯 Assessment Experience
                  </h3>
                  <p className="text-blue-800">
                    {assessmentData.instructions || 'Get ready for an unprecedented assessment experience that will challenge you in ways you never imagined. This is not your typical Q&A - it\'s an adventure that tests your real-world capabilities.'}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">🎪 Experience Breakdown</h4>
                    <div className="space-y-2">
                      {assessmentData.questions && assessmentData.questions.length > 0 ? (
                        Object.entries(
                          assessmentData.questions.reduce((acc: any, q: any) => {
                            const type = q.scenario ? q.scenario.type : q.type
                            acc[type] = (acc[type] || 0) + 1
                            return acc
                          }, {})
                        ).map(([type, count]) => (
                          <div key={type} className="flex justify-between">
                            <span className="capitalize text-gray-700 flex items-center">
                              {type === 'simulation' && '🎮'} 
                              {type === 'mystery' && '🔍'} 
                              {type === 'crisis' && '🚨'} 
                              {type === 'creative' && '🎨'} 
                              {type === 'survival' && '⚡'} 
                              {type === 'technical' && '⚙️'} 
                              {type === 'behavioral' && '🤝'} 
                              {type === 'problem-solving' && '🧩'} 
                              &nbsp;{type}:
                            </span>
                            <span className="font-medium text-gray-900">{count as number}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm">No experiences available</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">🔥 Challenge Levels</h4>
                    <div className="space-y-2">
                      {assessmentData.questions && assessmentData.questions.length > 0 ? (
                        Object.entries(
                          assessmentData.questions.reduce((acc: any, q: any) => {
                            acc[q.difficulty] = (acc[q.difficulty] || 0) + 1
                            return acc
                          }, {})
                        ).map(([difficulty, count]) => (
                          <div key={difficulty} className="flex justify-between">
                            <span className="text-gray-700">{difficulty}:</span>
                            <span className="font-medium text-gray-900">{count as number}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm">No difficulty data available</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'questions' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                {assessmentData.questions && assessmentData.questions.length > 0 ? (
                  assessmentData.questions.map((question: any, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                      {/* Check if this is a revolutionary scenario-based question */}
                      {question.type === 'revolutionary-simulation' ? (
                        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                          {/* Revolutionary Scenario Header */}
                          <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="text-2xl font-bold text-white mb-2 flex items-center">
                                  🎮 {question.scenario?.title || question.question}
                                </h3>
                                <div className="flex items-center space-x-4 text-sm">
                                  <span className="bg-white/20 px-3 py-1 rounded-full">
                                    REVOLUTIONARY
                                  </span>
                                  <span className="bg-white/20 px-3 py-1 rounded-full">
                                    ⏱️ {Math.floor((question.timeLimit || 1800) / 60)}min
                                  </span>
                                  <span className="bg-white/20 px-3 py-1 rounded-full">
                                    🔥 {question.difficulty?.toUpperCase() || 'MEDIUM'}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-6 mb-6">
                              <div>
                                <h4 className="text-white font-medium mb-2 flex items-center">
                                  🌟 The Scenario
                                </h4>
                                <p className="text-blue-100 text-sm">
                                  {question.scenario?.description || question.description}
                                </p>
                              </div>
                              
                              <div>
                                <h4 className="text-white font-medium mb-2 flex items-center">
                                  🚨 Your Mission
                                </h4>
                                <ul className="text-blue-100 text-sm space-y-1">
                                  {question.scenario?.victoryConditions?.map((condition: string, i: number) => (
                                    <li key={i}>• {condition}</li>
                                  )) || [
                                    '• Complete the revolutionary challenge',
                                    '• Adapt to plot twists',
                                    '• Demonstrate expertise'
                                  ].map((condition, i) => (
                                    <li key={i}>{condition}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                            
                            {/* Revolutionary Features */}
                            <div className="bg-white/10 rounded-lg p-4">
                              <h4 className="text-white font-medium mb-3 flex items-center">
                                🌪️ Plot Twists & Features
                              </h4>
                              <div className="grid md:grid-cols-2 gap-4 text-sm">
                                <div>
                                  <ul className="text-blue-100 space-y-1">
                                    <li>• 🎮 Live simulation environment</li>
                                    <li>• ⚡ Dynamic plot twists</li>
                                    <li>• 📊 Real-time performance metrics</li>
                                  </ul>
                                </div>
                                <div>
                                  <ul className="text-blue-100 space-y-1">
                                    <li>• 🛠️ Professional tools arsenal</li>
                                    <li>• 🎯 Adaptive difficulty scaling</li>
                                    <li>• 🏆 Victory condition tracking</li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                            
                            {/* Skills Tested */}
                            <div className="mt-4">
                              <h4 className="text-white font-medium mb-2 flex items-center">
                                📚 Skills Tested:
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {(question.scenario?.skillsTested || ['Problem Solving', 'Adaptability', 'Innovation']).map((skill: string, i: number) => (
                                  <span key={i} className="bg-white/20 px-2 py-1 rounded text-xs">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : question.scenario ? (
                        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                          {/* Regular Scenario Header */}
                          <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="text-2xl font-bold text-white mb-2">
                                  🎮 {question.scenario.title}
                                </h3>
                                <div className="flex items-center space-x-4 text-sm">
                                  <span className="bg-white/20 px-3 py-1 rounded-full">
                                    {question.scenario.type.toUpperCase()}
                                  </span>
                                  <span className="bg-white/20 px-3 py-1 rounded-full">
                                    ⏱️ {question.scenario.estimatedTime}min
                                  </span>
                                  <span className="bg-white/20 px-3 py-1 rounded-full">
                                    🔥 {question.scenario.difficulty}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Scenario Description */}
                            <div className="bg-white/10 rounded-lg p-4 mb-4">
                              <h4 className="font-semibold mb-2">🌟 The Scenario</h4>
                              <p className="text-white/90 leading-relaxed">
                                {question.scenario.scenario}
                              </p>
                            </div>

                            {/* Initial Challenge */}
                            <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                              <h4 className="font-semibold mb-2">🚨 Your Mission</h4>
                              <p className="text-white/90">
                                {question.scenario.initialChallenge}
                              </p>
                            </div>
                          </div>

                          {/* Scenario Details */}
                          <div className="bg-white p-6">
                            <div className="grid md:grid-cols-2 gap-6">
                              {/* Plot Twists */}
                              <div className="bg-orange-50 rounded-lg p-4">
                                <h4 className="font-semibold text-orange-900 mb-3 flex items-center">
                                  🌪️ Plot Twists
                                </h4>
                                <ul className="space-y-2">
                                  {question.scenario.plotTwists?.map((twist: string, twistIndex: number) => (
                                    <li key={twistIndex} className="text-orange-800 text-sm">
                                      • {twist}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Tools & Resources */}
                              <div className="bg-green-50 rounded-lg p-4">
                                <h4 className="font-semibold text-green-900 mb-3 flex items-center">
                                  🛠️ Your Arsenal
                                </h4>
                                <ul className="space-y-2">
                                  {question.scenario.tools?.map((tool: string, toolIndex: number) => (
                                    <li key={toolIndex} className="text-green-800 text-sm">
                                      • {tool}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Constraints */}
                              <div className="bg-red-50 rounded-lg p-4">
                                <h4 className="font-semibold text-red-900 mb-3 flex items-center">
                                  ⚠️ The Catch
                                </h4>
                                <ul className="space-y-2">
                                  {question.scenario.constraints?.map((constraint: string, constraintIndex: number) => (
                                    <li key={constraintIndex} className="text-red-800 text-sm">
                                      • {constraint}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Success Criteria */}
                              <div className="bg-blue-50 rounded-lg p-4">
                                <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                                  🏆 Victory Conditions
                                </h4>
                                <p className="text-blue-800 text-sm">
                                  {question.scenario.successCriteria}
                                </p>
                              </div>
                            </div>

                            {/* Category Badge */}
                            <div className="mt-6 text-center">
                              <span className="inline-block bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium">
                                📚 Skills Tested: {question.scenario.category}
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Traditional Question Display */
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                              Question {index + 1}
                            </h3>
                            <div className="flex space-x-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(question.type)}`}>
                                {question.type}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                                {question.difficulty}
                              </span>
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <span className="text-sm text-gray-500 font-medium">Category: {question.category}</span>
                          </div>
                          
                          <div className="mb-4">
                            <h4 className="font-medium text-gray-900 mb-2">Question:</h4>
                            <p className="text-gray-700">{question.question}</p>
                          </div>
                          
                          <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 mb-2">Expected Answer / Evaluation Points:</h4>
                            <p className="text-gray-700 text-sm">{question.expectedAnswer}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No questions available for this assessment.</p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'criteria' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    🏆 Revolutionary Evaluation System
                  </h3>
                  <div className="space-y-4">
                    {assessmentData.criteria && Object.entries(assessmentData.criteria).length > 0 ? (
                      Object.entries(assessmentData.criteria).map(([criterion, weight]) => (
                        <div key={criterion} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-4 h-4 rounded-full ${
                              criterion === 'creativity' ? 'bg-purple-500' :
                              criterion === 'problemSolving' ? 'bg-blue-500' :
                              criterion === 'technical' ? 'bg-green-500' :
                              criterion === 'adaptability' ? 'bg-orange-500' :
                              'bg-gray-500'
                            }`}></div>
                            <span className="font-medium text-gray-900 capitalize flex items-center">
                              {criterion === 'creativity' && '🎨 '}
                              {criterion === 'problemSolving' && '🧩 '}
                              {criterion === 'technical' && '⚙️ '}
                              {criterion === 'adaptability' && '🔄 '}
                              {criterion === 'communication' && '💬 '}
                              {criterion === 'cultural' && '🤝 '}
                              {criterion.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  criterion === 'creativity' ? 'bg-purple-500' :
                                  criterion === 'problemSolving' ? 'bg-blue-500' :
                                  criterion === 'technical' ? 'bg-green-500' :
                                  criterion === 'adaptability' ? 'bg-orange-500' :
                                  'bg-gray-500'
                                }`}
                                style={{ width: `${weight}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-600">
                              {weight as number}%
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        <p>No evaluation criteria defined for this assessment.</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <h4 className="font-semibold text-yellow-900 mb-4 flex items-center">
                    🎯 Revolutionary Scoring System
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h5 className="font-medium text-yellow-900">🌟 What We Look For:</h5>
                      <ul className="text-yellow-800 text-sm space-y-1">
                        <li>• Creative problem-solving under pressure</li>
                        <li>• Adaptability to unexpected situations</li>
                        <li>• Real-world application of technical skills</li>
                        <li>• Innovative thinking beyond conventional solutions</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h5 className="font-medium text-yellow-900">📊 Performance Levels:</h5>
                      <ul className="text-yellow-800 text-sm space-y-1">
                        <li>• 🚀 <strong>Exceptional (90%+):</strong> Ready for leadership</li>
                        <li>• 🎯 <strong>Outstanding (80-89%):</strong> Strong hire</li>
                        <li>• ✅ <strong>Solid (70-79%):</strong> Good fit</li>
                        <li>• 🔄 <strong>Developing (&lt;70%):</strong> Growth potential</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Revolutionary Assessment Features */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                  <h4 className="font-semibold text-purple-900 mb-4 flex items-center">
                    🎮 This Isn't Your Average Assessment
                  </h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl mb-2">🌪️</div>
                      <h5 className="font-medium text-purple-900">Unpredictable</h5>
                      <p className="text-purple-800 text-sm">Every scenario includes unexpected twists that test adaptability</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl mb-2">🎯</div>
                      <h5 className="font-medium text-purple-900">Job-Realistic</h5>
                      <p className="text-purple-800 text-sm">Scenarios mirror real challenges you'll face in this role</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl mb-2">🚀</div>
                      <h5 className="font-medium text-purple-900">AI-Powered</h5>
                      <p className="text-purple-800 text-sm">Each assessment is uniquely generated and impossible to prepare for</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
