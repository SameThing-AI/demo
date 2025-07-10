'use client'

import React, { useState } from 'react'
import { Assessment } from '../contexts/DataContext'
import { useAuth } from '../contexts/AuthContext'
import { useData } from '../contexts/DataContext'

interface MultiModalAssessmentBuilderProps {
  onSave: (assessment: Assessment) => void
  onCancel: () => void
}

export default function MultiModalAssessmentBuilder({ onSave, onCancel }: MultiModalAssessmentBuilderProps) {
  const { user } = useAuth()
  const { addAssessment } = useData()

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    duration: 30,
    modalType: 'video' as 'video' | 'audio' | 'both',
    videoInstructions: '',
    audioInstructions: ''
  })

  const [questions, setQuestions] = useState([
    { id: '1', text: '', type: 'video', timeLimit: 120 }
  ])

  const [currentStep, setCurrentStep] = useState(1)

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleQuestionChange = (index: number, field: string, value: any) => {
    const updated = questions.map((q, i) => 
      i === index ? { ...q, [field]: value } : q
    )
    setQuestions(updated)
  }

  const addQuestion = () => {
    const newQuestion = {
      id: String(questions.length + 1),
      text: '',
      type: formData.modalType,
      timeLimit: 120
    }
    setQuestions([...questions, newQuestion])
  }

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index))
    }
  }

  const handleSave = () => {
    const assessment: Assessment = {
      id: Date.now().toString(),
      title: formData.title,
      company: formData.company,
      description: formData.description,
      questions: questions,
      createdAt: new Date().toISOString(),
      createdBy: user?.id || '',
      duration: formData.duration,
      type: 'multi-modal',
      modalType: formData.modalType,
      videoInstructions: formData.videoInstructions,
      audioInstructions: formData.audioInstructions
    }

    addAssessment(assessment)
    onSave(assessment)
  }

  const generateQuestions = async () => {
    try {
      const response = await fetch('/api/generate-modal-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          company: formData.company,
          description: formData.description,
          modalType: formData.modalType,
          count: 5
        })
      })

      if (response.ok) {
        const generated = await response.json()
        setQuestions(generated.questions)
      }
    } catch (error) {
      console.error('Error generating questions:', error)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-2xl font-bold text-gray-900">Create Multi-Modal Assessment</h2>
          <p className="text-gray-600 mt-1">Build video and audio-based assessments</p>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                <span className={`ml-2 text-sm ${
                  currentStep >= step ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {step === 1 ? 'Basic Info' : step === 2 ? 'Questions' : 'Instructions'}
                </span>
                {step < 3 && <div className="w-8 h-px bg-gray-300 ml-4" />}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assessment Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Senior Product Manager Video Interview"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Company name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe the role and what this assessment evaluates..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="5"
                    max="120"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assessment Type
                  </label>
                  <select
                    value={formData.modalType}
                    onChange={(e) => handleInputChange('modalType', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="video">Video Only</option>
                    <option value="audio">Audio Only</option>
                    <option value="both">Video + Audio</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Questions */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Assessment Questions</h3>
                <div className="space-x-2">
                  <button
                    onClick={generateQuestions}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    ✨ AI Generate
                  </button>
                  <button
                    onClick={addQuestion}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    + Add Question
                  </button>
                </div>
              </div>

              {questions.map((question, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-medium text-gray-900">Question {index + 1}</h4>
                    {questions.length > 1 && (
                      <button
                        onClick={() => removeQuestion(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Question Text
                      </label>
                      <textarea
                        value={question.text}
                        onChange={(e) => handleQuestionChange(index, 'text', e.target.value)}
                        rows={3}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your question..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Response Type
                        </label>
                        <select
                          value={question.type}
                          onChange={(e) => handleQuestionChange(index, 'type', e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="video">Video Response</option>
                          <option value="audio">Audio Response</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Time Limit (seconds)
                        </label>
                        <input
                          type="number"
                          value={question.timeLimit}
                          onChange={(e) => handleQuestionChange(index, 'timeLimit', parseInt(e.target.value))}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          min="30"
                          max="300"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Step 3: Instructions */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Assessment Instructions</h3>
              
              {(formData.modalType === 'video' || formData.modalType === 'both') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video Recording Instructions
                  </label>
                  <textarea
                    value={formData.videoInstructions}
                    onChange={(e) => handleInputChange('videoInstructions', e.target.value)}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Provide instructions for video recording (lighting, camera position, etc.)"
                  />
                </div>
              )}

              {(formData.modalType === 'audio' || formData.modalType === 'both') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Audio Recording Instructions
                  </label>
                  <textarea
                    value={formData.audioInstructions}
                    onChange={(e) => handleInputChange('audioInstructions', e.target.value)}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Provide instructions for audio recording (microphone, environment, etc.)"
                  />
                </div>
              )}

              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Preview</h4>
                <div className="space-y-2 text-sm text-blue-800">
                  <p><strong>Title:</strong> {formData.title}</p>
                  <p><strong>Type:</strong> {formData.modalType} Assessment</p>
                  <p><strong>Questions:</strong> {questions.length}</p>
                  <p><strong>Duration:</strong> {formData.duration} minutes</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <div>
              {currentStep > 1 && (
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Previous
                </button>
              )}
            </div>

            <div className="space-x-3">
              <button
                onClick={onCancel}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              
              {currentStep < 3 ? (
                <button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={currentStep === 1 && (!formData.title || !formData.company)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  disabled={questions.some(q => !q.text)}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Create Assessment
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
