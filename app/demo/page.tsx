'use client'
export const dynamic = "force-dynamic"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import AssessmentForm from '@/components/AssessmentForm'
import AssessmentDisplay from '@/components/AssessmentDisplay'
import TakeAssessment from '@/components/TakeAssessment'
import AssessmentResults from '@/components/AssessmentResults'
import ReviewAssessment from '@/components/ReviewAssessment'

export default function DemoPage() {
  const [currentStep, setCurrentStep] = useState<'form' | 'assessment' | 'take' | 'results' | 'review'>('form')
  const [assessmentData, setAssessmentData] = useState<any>(null)
  const [results, setResults] = useState<any>(null)

  const handleAssessmentGenerated = (data: any) => {
    setAssessmentData(data)
    setCurrentStep('assessment')
  }

  const handleTakeAssessment = () => {
    setCurrentStep('take')
  }

  const handleAssessmentSubmitted = (resultsData: any) => {
    setResults(resultsData)
    setCurrentStep('results')
  }

  const handleBackToForm = () => {
    setCurrentStep('form')
    setAssessmentData(null)
    setResults(null)
  }

  const handleReviewAssessment = () => {
    setCurrentStep('review')
  }

  if (currentStep === 'form') {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navigation />
        <div className="pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
            <Link
              href="/"
              className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
          </div>
          <AssessmentForm 
            onAssessmentGenerated={handleAssessmentGenerated}
            onBack={() => {}}
          />
        </div>
      </div>
    )
  }

  if (currentStep === 'assessment') {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navigation />
        <div className="pt-20">
          <AssessmentDisplay 
            assessmentData={assessmentData}
            onTakeAssessment={handleTakeAssessment}
            onBack={handleBackToForm}
          />
        </div>
      </div>
    )
  }

  if (currentStep === 'take') {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navigation />
        <div className="pt-20">
          <TakeAssessment 
            assessmentData={assessmentData}
            onComplete={handleAssessmentSubmitted}
            onBack={() => setCurrentStep('assessment')}
          />
        </div>
      </div>
    )
  }

  if (currentStep === 'results') {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navigation />
        <div className="pt-20">
          <AssessmentResults 
            results={results}
            onBack={handleBackToForm}
            onStartNew={handleReviewAssessment}
          />
        </div>
      </div>
    )
  }

  if (currentStep === 'review') {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navigation />
        <div className="pt-20">
          <ReviewAssessment 
            results={results}
            assessmentData={assessmentData}
            onBack={handleBackToForm}
          />
        </div>
      </div>
    )
  }

  return null
}
