'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Brain, Target, Users, Zap, ArrowRight, CheckCircle } from 'lucide-react'
import AssessmentForm from '@/components/AssessmentForm'
import AssessmentDisplay from '@/components/AssessmentDisplay'
import TakeAssessment from '@/components/TakeAssessment'
import AssessmentResults from '@/components/AssessmentResults'
import ReviewAssessment from '@/components/ReviewAssessment'

export default function Home() {
  const [currentStep, setCurrentStep] = useState<'landing' | 'form' | 'assessment' | 'take' | 'results' | 'review'>('landing')
  const [assessmentData, setAssessmentData] = useState<any>(null)
  const [results, setResults] = useState<any>(null)

  const handleStartAssessment = () => {
    setCurrentStep('form')
  }

  const handleAssessmentGenerated = (data: any) => {
    setAssessmentData(data)
    setCurrentStep('assessment')
  }

  const handleTakeAssessment = () => {
    setCurrentStep('take')
  }

  const handleAssessmentComplete = (resultsData: any) => {
    setResults(resultsData)
    setCurrentStep('results')
  }

  const handleStartNew = () => {
    setCurrentStep('landing')
    setAssessmentData(null)
    setResults(null)
  }

  const handleReviewAssessment = () => {
    setCurrentStep('review')
  }

  if (currentStep === 'form') {
    return (
      <AssessmentForm 
        onAssessmentGenerated={handleAssessmentGenerated}
        onBack={() => setCurrentStep('landing')}
      />
    )
  }

  if (currentStep === 'assessment') {
    return (
      <AssessmentDisplay 
        assessmentData={assessmentData}
        onBack={() => setCurrentStep('form')}
        onTakeAssessment={handleTakeAssessment}
      />
    )
  }

  if (currentStep === 'take') {
    return (
      <TakeAssessment
        assessmentData={assessmentData}
        onBack={() => setCurrentStep('assessment')}
        onComplete={handleAssessmentComplete}
      />
    )
  }

  if (currentStep === 'results') {
    return (
      <AssessmentResults
        results={results}
        onBack={handleReviewAssessment}
        onStartNew={handleStartNew}
      />
    )
  }

  if (currentStep === 'review') {
    return (
      <ReviewAssessment
        assessmentData={assessmentData}
        results={results}
        onBack={() => setCurrentStep('results')}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">SameThing.AI</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-blue-600">How it Works</a>
              <a href="#pricing" className="text-gray-600 hover:text-blue-600">Pricing</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Complete AI-Powered
            <span className="text-blue-600 block">Assessment Platform</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Create custom assessments with AI, let candidates take them online, and get instant 
            AI-powered evaluation with detailed feedback. End-to-end hiring intelligence.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartAssessment}
            className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors flex items-center mx-auto"
          >
            Create & Take Assessment Demo
            <ArrowRight className="ml-2 h-5 w-5" />
          </motion.button>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Why Choose SameThing.AI?
        </h3>
        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white p-8 rounded-lg shadow-lg"
          >
            <Target className="h-12 w-12 text-blue-600 mb-4" />
            <h4 className="text-xl font-semibold text-gray-900 mb-4">Custom Assessments</h4>
            <p className="text-gray-600">
              AI generates tailored assessments based on job role, company culture, and requirements.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white p-8 rounded-lg shadow-lg"
          >
            <Zap className="h-12 w-12 text-blue-600 mb-4" />
            <h4 className="text-xl font-semibold text-gray-900 mb-4">Smart Test Taking</h4>
            <p className="text-gray-600">
              Candidates take assessments online with real-time AI proctoring and instant evaluation.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="bg-white p-8 rounded-lg shadow-lg"
          >
            <Users className="h-12 w-12 text-blue-600 mb-4" />
            <h4 className="text-xl font-semibold text-gray-900 mb-4">AI Evaluation</h4>
            <p className="text-gray-600">
              Get instant, detailed feedback and scoring powered by advanced AI analysis.
            </p>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h3>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: 1, title: "Create Assessment", desc: "AI generates custom questions from job description" },
              { step: 2, title: "Candidate Takes Test", desc: "Online assessment with timer and progress tracking" },
              { step: 3, title: "AI Evaluation", desc: "Instant scoring and detailed feedback analysis" },
              { step: 4, title: "Hire Best Talent", desc: "Get comprehensive results and recommendations" }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {item.step}
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h4>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-6">
            Ready to Experience the Future of Hiring?
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            See the complete end-to-end AI assessment platform in action.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartAssessment}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Try Complete Demo
          </motion.button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Brain className="h-6 w-6 mr-2" />
              <span className="text-lg font-semibold">SameThing.AI</span>
            </div>
            <p className="text-gray-400">© 2025 SameThing.AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
