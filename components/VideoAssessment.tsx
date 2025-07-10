'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Camera, 
  Square, 
  Play, 
  Pause, 
  RotateCcw, 
  Upload, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Eye,
  Mic
} from 'lucide-react'

interface VideoAssessmentProps {
  question: any
  onInteraction: (data: any) => void
  assessmentType?: 'presentation' | 'interview' | 'leadership' | 'communication'
}

export default function VideoAssessment({ 
  question, 
  onInteraction, 
  assessmentType = 'interview' 
}: VideoAssessmentProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [recordingTime, setRecordingTime] = useState(0)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [hasPermission, setHasPermission] = useState(false)
  const [permissionError, setPermissionError] = useState('')

  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const requestPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setHasPermission(true)
      setPermissionError('')
    } catch (error) {
      console.error('Permission denied:', error)
      setPermissionError('Camera and microphone access required for video assessment')
    }
  }

  const startRecording = () => {
    if (!streamRef.current) {
      requestPermissions()
      return
    }

    chunksRef.current = []
    const mediaRecorder = new MediaRecorder(streamRef.current)
    mediaRecorderRef.current = mediaRecorder

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data)
      }
    }

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' })
      setRecordedBlob(blob)
      const url = URL.createObjectURL(blob)
      setPreviewUrl(url)
      
      // Trigger analysis
      analyzeVideo(blob)
    }

    mediaRecorder.start()
    setIsRecording(true)
    setRecordingTime(0)

    // Start timer
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1)
    }, 1000)
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }

  const resetRecording = () => {
    setRecordedBlob(null)
    setPreviewUrl('')
    setAnalysisResult(null)
    setRecordingTime(0)
    setIsAnalyzing(false)
  }

  const analyzeVideo = async (blob: Blob) => {
    setIsAnalyzing(true)
    try {
      // Convert blob to base64 for API
      const base64 = await blobToBase64(blob)
      
      const response = await fetch('/api/analyze-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoData: base64,
          assessmentType,
          candidateId: 'current-candidate',
          questionContext: question.question
        })
      })

      if (response.ok) {
        const result = await response.json()
        setAnalysisResult(result.analysis)
        
        // Send interaction data
        onInteraction({
          videoBlob: blob,
          analysisResult: result.analysis,
          recordingDuration: recordingTime,
          assessmentType,
          timestamp: Date.now()
        })
      }
    } catch (error) {
      console.error('Video analysis failed:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
          <Camera className="h-5 w-5 mr-2 text-blue-600" />
          Video Assessment
        </h3>
        <p className="text-gray-600 mb-4">{question.question}</p>
        
        {assessmentType && (
          <div className="flex items-center space-x-2 mb-4">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
              {assessmentType.charAt(0).toUpperCase() + assessmentType.slice(1)}
            </span>
            <span className="text-sm text-gray-500">
              Expected duration: 3-5 minutes
            </span>
          </div>
        )}
      </div>

      {!hasPermission ? (
        <div className="text-center py-8">
          <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">Camera Access Required</h4>
          <p className="text-gray-600 mb-4">
            This assessment requires camera and microphone access to record your response.
          </p>
          {permissionError && (
            <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
              <p className="text-red-700 text-sm">{permissionError}</p>
            </div>
          )}
          <button
            onClick={requestPermissions}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center mx-auto"
          >
            <Camera className="h-4 w-4 mr-2" />
            Enable Camera
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Video Recording Area */}
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              muted
              className={`w-full rounded-lg border-2 ${
                isRecording ? 'border-red-500' : 'border-gray-300'
              } ${recordedBlob ? 'hidden' : ''}`}
              style={{ maxHeight: '400px' }}
            />
            
            {previewUrl && (
              <video
                src={previewUrl}
                controls
                className="w-full rounded-lg border-2 border-gray-300"
                style={{ maxHeight: '400px' }}
              />
            )}

            {isRecording && (
              <div className="absolute top-4 left-4 flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-white bg-black bg-opacity-50 px-2 py-1 rounded text-sm">
                  REC {formatTime(recordingTime)}
                </span>
              </div>
            )}
          </div>

          {/* Recording Controls */}
          <div className="flex justify-center space-x-4">
            {!recordedBlob ? (
              <>
                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    className="flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Camera className="h-5 w-5 mr-2" />
                    Start Recording
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    className="flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <Square className="h-5 w-5 mr-2" />
                    Stop Recording
                  </button>
                )}
              </>
            ) : (
              <div className="flex space-x-3">
                <button
                  onClick={resetRecording}
                  className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Re-record
                </button>
                {!isAnalyzing && !analysisResult && (
                  <button
                    onClick={() => analyzeVideo(recordedBlob)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Analyze Video
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Analysis Status */}
          {isAnalyzing && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <Loader2 className="h-5 w-5 animate-spin text-blue-600 mr-2" />
                <span className="text-blue-800">Analyzing your video response...</span>
              </div>
              <p className="text-blue-600 text-sm mt-1">
                AI is evaluating communication skills, body language, and content quality
              </p>
            </div>
          )}

          {/* Analysis Results */}
          {analysisResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-lg p-6"
            >
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                Video Analysis Complete
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Communication Skills */}
                <div>
                  <h5 className="font-medium text-gray-800 mb-3">Communication Skills</h5>
                  <div className="space-y-2">
                    {Object.entries(analysisResult.communicationSkills).map(([skill, score]) => (
                      <div key={skill} className="flex justify-between">
                        <span className="text-sm text-gray-600 capitalize">{skill}:</span>
                        <span className={`text-sm font-medium ${getScoreColor(score as number)}`}>
                          {(score as number)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Non-Verbal Communication */}
                <div>
                  <h5 className="font-medium text-gray-800 mb-3">Body Language</h5>
                  <div className="space-y-2">
                    {Object.entries(analysisResult.nonVerbalCommunication).map(([skill, score]) => (
                      <div key={skill} className="flex justify-between">
                        <span className="text-sm text-gray-600 capitalize">
                          {skill.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                        </span>
                        <span className={`text-sm font-medium ${getScoreColor(score as number)}`}>
                          {(score as number)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Content Quality */}
                <div>
                  <h5 className="font-medium text-gray-800 mb-3">Content Quality</h5>
                  <div className="space-y-2">
                    {Object.entries(analysisResult.contentQuality).map(([skill, score]) => (
                      <div key={skill} className="flex justify-between">
                        <span className="text-sm text-gray-600 capitalize">{skill}:</span>
                        <span className={`text-sm font-medium ${getScoreColor(score as number)}`}>
                          {(score as number)}%
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
                <div className="text-gray-600">Overall Performance</div>
              </div>

              {/* Recommendations */}
              {analysisResult.recommendations && analysisResult.recommendations.length > 0 && (
                <div className="mb-4">
                  <h5 className="font-medium text-gray-800 mb-2">Recommendations</h5>
                  <ul className="space-y-1">
                    {analysisResult.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Insights */}
              {analysisResult.insights && analysisResult.insights.length > 0 && (
                <div>
                  <h5 className="font-medium text-gray-800 mb-2">Key Insights</h5>
                  <ul className="space-y-1">
                    {analysisResult.insights.map((insight: string, index: number) => (
                      <li key={index} className="text-sm text-green-700 flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          )}
        </div>
      )}
    </div>
  )
}
