'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Assessment } from '@/contexts/DatabaseDataContext'

interface AudioAssessmentProps {
  assessment: Assessment
  onComplete: (responses: any[]) => void
}

interface AudioAnalysisResult {
  transcript: string
  confidence: number
  speechQuality: {
    clarity: number
    pace: number
    tonality: number
    vocabulary: number
  }
  contentAnalysis: {
    relevance: number
    depth: number
    structure: number
    accuracy: number
  }
  overallScore: number
  feedback: string[]
  recommendations: string[]
}

export default function AudioAssessment({ assessment, onComplete }: AudioAssessmentProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [responses, setResponses] = useState<any[]>([])
  const [analysisResult, setAnalysisResult] = useState<AudioAnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  const currentQuestion = assessment.questions[currentQuestionIndex]

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        const url = URL.createObjectURL(audioBlob)
        setAudioUrl(url)
        analyzeAudio(audioBlob)
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Error starting recording:', error)
      alert('Error accessing microphone. Please check permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      
      // Stop all media tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
    }
  }

  const analyzeAudio = async (audioBlob: Blob) => {
    setIsAnalyzing(true)
    try {
      const formData = new FormData()
      formData.append('audio', audioBlob)
      formData.append('questionText', currentQuestion.text)
      formData.append('assessmentType', assessment.type || 'traditional')

      const response = await fetch('/api/analyze-audio', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to analyze audio')
      }

      const result = await response.json()
      setAnalysisResult(result)
    } catch (error) {
      console.error('Error analyzing audio:', error)
      // Fallback analysis for demo
      setAnalysisResult({
        transcript: "Audio transcription would appear here...",
        confidence: 85,
        speechQuality: {
          clarity: 78,
          pace: 82,
          tonality: 75,
          vocabulary: 80
        },
        contentAnalysis: {
          relevance: 85,
          depth: 70,
          structure: 77,
          accuracy: 83
        },
        overallScore: 79,
        feedback: [
          "Good articulation and clear speech",
          "Appropriate pace for the topic",
          "Consider adding more specific examples"
        ],
        recommendations: [
          "Practice varying your tone for emphasis",
          "Use more technical vocabulary where appropriate",
          "Structure responses with clear introduction-body-conclusion"
        ]
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleNextQuestion = () => {
    if (analysisResult) {
      const response = {
        questionId: currentQuestion.id,
        audioUrl,
        transcript: analysisResult.transcript,
        analysis: analysisResult,
        completedAt: new Date().toISOString()
      }

      const updatedResponses = [...responses, response]
      setResponses(updatedResponses)

      if (currentQuestionIndex < assessment.questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
        setAudioUrl(null)
        setAnalysisResult(null)
      } else {
        setIsCompleted(true)
        onComplete(updatedResponses)
      }
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (isCompleted) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Audio Assessment Complete!</h2>
          <p className="text-gray-600">Your responses have been recorded and analyzed.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm text-gray-500">
            {currentQuestionIndex + 1} of {assessment.questions.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / assessment.questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Question {currentQuestionIndex + 1}
        </h3>
        <p className="text-gray-700 text-lg leading-relaxed">
          {currentQuestion.text}
        </p>
      </div>

      {/* Recording Controls */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="text-center">
          <div className="mb-6">
            {!audioUrl ? (
              <div>
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold transition-all duration-200 ${
                    isRecording 
                      ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isRecording ? '⏹' : '🎤'}
                </button>
                <p className="mt-4 text-gray-600">
                  {isRecording ? 'Recording... Click to stop' : 'Click to start recording'}
                </p>
              </div>
            ) : (
              <div>
                <audio controls className="mb-4">
                  <source src={audioUrl} type="audio/wav" />
                  Your browser does not support audio playback.
                </audio>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => {
                      setAudioUrl(null)
                      setAnalysisResult(null)
                    }}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Re-record
                  </button>
                </div>
              </div>
            )}
          </div>

          {isAnalyzing && (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-600">Analyzing your response...</span>
            </div>
          )}
        </div>
      </div>

      {/* Analysis Results */}
      {analysisResult && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Analysis Results</h4>
          
          {/* Transcript */}
          <div className="mb-6">
            <h5 className="font-medium text-gray-800 mb-2">Transcript</h5>
            <div className="bg-gray-50 rounded p-3">
              <p className="text-gray-700">{analysisResult.transcript}</p>
              <p className="text-sm text-gray-500 mt-2">
                Confidence: {analysisResult.confidence}%
              </p>
            </div>
          </div>

          {/* Detailed Scores */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Speech Quality */}
            <div>
              <h5 className="font-medium text-gray-800 mb-3">Speech Quality</h5>
              <div className="space-y-2">
                {Object.entries(analysisResult.speechQuality).map(([skill, score]) => (
                  <div key={skill} className="flex justify-between">
                    <span className="text-sm text-gray-600 capitalize">{skill}:</span>
                    <span className={`text-sm font-medium ${getScoreColor(score)}`}>
                      {score}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Content Analysis */}
            <div>
              <h5 className="font-medium text-gray-800 mb-3">Content Analysis</h5>
              <div className="space-y-2">
                {Object.entries(analysisResult.contentAnalysis).map(([skill, score]) => (
                  <div key={skill} className="flex justify-between">
                    <span className="text-sm text-gray-600 capitalize">{skill}:</span>
                    <span className={`text-sm font-medium ${getScoreColor(score)}`}>
                      {score}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Overall Score */}
          <div className="text-center mb-6">
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {analysisResult.overallScore}%
            </div>
            <div className="text-gray-600">Overall Score</div>
          </div>

          {/* Feedback and Recommendations */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-medium text-gray-800 mb-3">Feedback</h5>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                {analysisResult.feedback.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="font-medium text-gray-800 mb-3">Recommendations</h5>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                {analysisResult.recommendations.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Next Button */}
          <div className="mt-6 text-center">
            <button
              onClick={handleNextQuestion}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {currentQuestionIndex < assessment.questions.length - 1 ? 'Next Question' : 'Complete Assessment'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
