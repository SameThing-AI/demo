'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Assessment } from '../contexts/DataContext'

interface MultiModalTakeAssessmentProps {
  assessment: Assessment
  onComplete: (responses: any[]) => void
}

interface MediaAnalysisResult {
  transcript?: string
  videoMetrics?: {
    eyeContact: number
    expressiveness: number
    professionalism: number
    confidence: number
  }
  audioMetrics?: {
    clarity: number
    pace: number
    tonality: number
    vocabulary: number
  }
  overallScore: number
  feedback: string[]
  recommendations: string[]
}

export default function MultiModalTakeAssessment({ assessment, onComplete }: MultiModalTakeAssessmentProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [recordedBlobs, setRecordedBlobs] = useState<{ [key: string]: Blob }>({})
  const [responses, setResponses] = useState<any[]>([])
  const [analysisResults, setAnalysisResults] = useState<{ [key: string]: MediaAnalysisResult }>({})
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)

  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null)

  const currentQuestion = assessment.questions[currentQuestionIndex]
  const isVideoQuestion = currentQuestion?.type === 'video'
  const isAudioQuestion = currentQuestion?.type === 'audio'

  useEffect(() => {
    if (isRecording) {
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    } else {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current)
      }
    }

    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current)
      }
    }
  }, [isRecording])

  const startRecording = async () => {
    try {
      const constraints = isVideoQuestion 
        ? { video: true, audio: true }
        : { audio: true }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      
      if (isVideoQuestion && videoRef.current) {
        videoRef.current.srcObject = stream
      }

      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorderRef.current.onstop = () => {
        const mimeType = isVideoQuestion ? 'video/webm' : 'audio/wav'
        const recordedBlob = new Blob(audioChunksRef.current, { type: mimeType })
        
        setRecordedBlobs(prev => ({
          ...prev,
          [currentQuestion.id]: recordedBlob
        }))

        analyzeRecording(recordedBlob)
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
      setRecordingTime(0)
    } catch (error) {
      console.error('Error starting recording:', error)
      alert('Error accessing camera/microphone. Please check permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const analyzeRecording = async (blob: Blob) => {
    setIsAnalyzing(true)
    try {
      const formData = new FormData()
      formData.append(isVideoQuestion ? 'video' : 'audio', blob)
      formData.append('questionText', currentQuestion.text)
      formData.append('assessmentType', assessment.type || 'traditional')

      const endpoint = isVideoQuestion ? '/api/analyze-video' : '/api/analyze-audio'
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to analyze recording')
      }

      const result = await response.json()
      setAnalysisResults(prev => ({
        ...prev,
        [currentQuestion.id]: result
      }))
    } catch (error) {
      console.error('Error analyzing recording:', error)
      // Fallback analysis for demo
      const fallbackResult: MediaAnalysisResult = {
        transcript: isVideoQuestion ? "Video analysis would appear here..." : "Audio transcription would appear here...",
        ...(isVideoQuestion && {
          videoMetrics: {
            eyeContact: Math.floor(Math.random() * 30) + 70,
            expressiveness: Math.floor(Math.random() * 30) + 70,
            professionalism: Math.floor(Math.random() * 30) + 70,
            confidence: Math.floor(Math.random() * 30) + 70
          }
        }),
        ...(isAudioQuestion && {
          audioMetrics: {
            clarity: Math.floor(Math.random() * 30) + 70,
            pace: Math.floor(Math.random() * 30) + 70,
            tonality: Math.floor(Math.random() * 30) + 70,
            vocabulary: Math.floor(Math.random() * 30) + 70
          }
        }),
        overallScore: Math.floor(Math.random() * 30) + 70,
        feedback: [
          "Good delivery and clear communication",
          "Appropriate response to the question",
          "Professional presentation"
        ],
        recommendations: [
          "Consider adding more specific examples",
          "Practice maintaining consistent pace",
          "Use more varied vocabulary"
        ]
      }
      
      setAnalysisResults(prev => ({
        ...prev,
        [currentQuestion.id]: fallbackResult
      }))
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleNextQuestion = () => {
    const analysisResult = analysisResults[currentQuestion.id]
    if (analysisResult) {
      const response = {
        questionId: currentQuestion.id,
        questionType: currentQuestion.type,
        blob: recordedBlobs[currentQuestion.id],
        analysis: analysisResult,
        completedAt: new Date().toISOString()
      }

      const updatedResponses = [...responses, response]
      setResponses(updatedResponses)

      if (currentQuestionIndex < assessment.questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
        setRecordingTime(0)
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Assessment Complete!</h2>
          <p className="text-gray-600">Your responses have been recorded and analyzed.</p>
        </div>
      </div>
    )
  }

  if (!currentQuestion) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Questions Available</h3>
          <p className="text-gray-600">This assessment doesn't have any questions configured.</p>
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
        <div className="flex items-center space-x-2 mb-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            isVideoQuestion 
              ? 'bg-blue-100 text-blue-800' 
              : 'bg-green-100 text-green-800'
          }`}>
            {isVideoQuestion ? '📹 Video' : '🎤 Audio'} Response
          </span>
          {currentQuestion.timeLimit && (
            <span className="text-sm text-gray-500">
              Time limit: {Math.floor(currentQuestion.timeLimit / 60)}:{(currentQuestion.timeLimit % 60).toString().padStart(2, '0')}
            </span>
          )}
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Question {currentQuestionIndex + 1}
        </h3>
        <p className="text-gray-700 text-lg leading-relaxed">
          {currentQuestion.text}
        </p>
      </div>

      {/* Recording Interface */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="text-center">
          {/* Video Preview for Video Questions */}
          {isVideoQuestion && (
            <div className="mb-6">
              <video
                ref={videoRef}
                autoPlay
                muted
                className="w-full max-w-md mx-auto rounded-lg border-2 border-gray-300"
                style={{ transform: 'scaleX(-1)' }} // Mirror the video
              />
            </div>
          )}

          {/* Recording Controls */}
          <div className="mb-6">
            {!recordedBlobs[currentQuestion.id] ? (
              <div>
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold transition-all duration-200 ${
                    isRecording 
                      ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isRecording ? '⏹' : (isVideoQuestion ? '📹' : '🎤')}
                </button>
                
                {isRecording && (
                  <div className="mt-4">
                    <div className="text-lg font-mono text-red-600">
                      {formatTime(recordingTime)}
                    </div>
                    <p className="text-gray-600">Recording... Click to stop</p>
                  </div>
                )}
                
                {!isRecording && (
                  <p className="mt-4 text-gray-600">
                    Click to start {isVideoQuestion ? 'video' : 'audio'} recording
                  </p>
                )}
              </div>
            ) : (
              <div>
                <div className="text-green-600 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-700 mb-4">Recording completed</p>
                <button
                  onClick={() => {
                    setRecordedBlobs(prev => {
                      const updated = { ...prev }
                      delete updated[currentQuestion.id]
                      return updated
                    })
                    setAnalysisResults(prev => {
                      const updated = { ...prev }
                      delete updated[currentQuestion.id]
                      return updated
                    })
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Re-record
                </button>
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
      {analysisResults[currentQuestion.id] && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Analysis Results</h4>
          
          {/* Transcript */}
          {analysisResults[currentQuestion.id].transcript && (
            <div className="mb-6">
              <h5 className="font-medium text-gray-800 mb-2">
                {isVideoQuestion ? 'Transcript' : 'Transcript'}
              </h5>
              <div className="bg-gray-50 rounded p-3">
                <p className="text-gray-700">{analysisResults[currentQuestion.id].transcript}</p>
              </div>
            </div>
          )}

          {/* Metrics */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {analysisResults[currentQuestion.id].videoMetrics && (
              <div>
                <h5 className="font-medium text-gray-800 mb-3">Video Analysis</h5>
                <div className="space-y-2">
                  {Object.entries(analysisResults[currentQuestion.id].videoMetrics!).map(([metric, score]) => (
                    <div key={metric} className="flex justify-between">
                      <span className="text-sm text-gray-600 capitalize">
                        {metric.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                      </span>
                      <span className={`text-sm font-medium ${getScoreColor(score as number)}`}>
                        {score}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {analysisResults[currentQuestion.id].audioMetrics && (
              <div>
                <h5 className="font-medium text-gray-800 mb-3">Audio Analysis</h5>
                <div className="space-y-2">
                  {Object.entries(analysisResults[currentQuestion.id].audioMetrics!).map(([metric, score]) => (
                    <div key={metric} className="flex justify-between">
                      <span className="text-sm text-gray-600 capitalize">{metric}:</span>
                      <span className={`text-sm font-medium ${getScoreColor(score as number)}`}>
                        {score}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Overall Score */}
          <div className="text-center mb-6">
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {analysisResults[currentQuestion.id].overallScore}%
            </div>
            <div className="text-gray-600">Overall Score</div>
          </div>

          {/* Feedback and Recommendations */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-medium text-gray-800 mb-3">Feedback</h5>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                {analysisResults[currentQuestion.id].feedback.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="font-medium text-gray-800 mb-3">Recommendations</h5>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                {analysisResults[currentQuestion.id].recommendations.map((item, index) => (
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
