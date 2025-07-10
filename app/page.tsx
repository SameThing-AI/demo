'use client'

import { motion } from 'framer-motion'
import { Brain, Target, Users, Zap, ArrowRight, CheckCircle, Video, BarChart3, Bot } from 'lucide-react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'

export default function LandingPage() {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Assessment Generation',
      description: 'Create dynamic, role-specific assessments using advanced AI technology'
    },
    {
      icon: Target,
      title: 'Adaptive Question Engine',
      description: 'Questions that evolve based on candidate responses for deeper insights'
    },
    {
      icon: Video,
      title: 'Multi-Modal Evaluation',
      description: 'Video and audio assessments with AI-powered analysis'
    },
    {
      icon: Users,
      title: 'Enterprise Integration',
      description: 'Seamless integration with ATS systems and compliance management'
    },
    {
      icon: Bot,
      title: 'AI Coaching & Mentorship',
      description: 'Personalized learning paths and recruiter assistance'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Comprehensive insights and performance tracking'
    }
  ]

  const assessmentTypes = [
    { name: 'Traditional Q&A', description: 'Multiple choice, text responses, coding challenges' },
    { name: 'Creative AI Scenarios', description: 'Dynamic role-playing and problem-solving simulations' },
    { name: 'Self-Modifying', description: 'Adaptive assessments that evolve in real-time' },
    { name: 'Video Interviews', description: 'AI-powered video analysis and evaluation' },
    { name: 'Audio Assessments', description: 'Voice-based evaluations with speech analysis' },
    { name: 'Multi-Modal', description: 'Combined video/audio assessments for comprehensive evaluation' }
  ]

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-gray-900 to-purple-900">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex justify-center mb-8">
              <div className="flex items-center space-x-3 bg-blue-600/20 backdrop-blur-sm border border-blue-500/30 rounded-full px-6 py-3">
                <Brain className="h-8 w-8 text-blue-400" />
                <span className="text-blue-400 font-semibold text-lg">AI-Powered Hiring Platform</span>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Revolutionize Your
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Hiring Process
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto">
              Create dynamic, AI-powered assessments that adapt to candidates, provide deep insights, 
              and deliver exceptional hiring experiences for both recruiters and candidates.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold flex items-center justify-center space-x-2 transition-all duration-200 transform hover:scale-105"
              >
                <span>Get Started</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/demo"
                className="border border-gray-600 hover:border-blue-500 text-white px-8 py-4 rounded-lg text-lg font-semibold flex items-center justify-center space-x-2 transition-all duration-200 hover:bg-blue-600/10"
              >
                <span>Try Demo</span>
                <Zap className="h-5 w-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Powered by Advanced AI Technology
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our platform combines cutting-edge AI with practical hiring needs to deliver 
              the most comprehensive assessment solution available.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-900 border border-gray-700 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-blue-600/20 p-3 rounded-lg mr-4">
                    <feature.icon className="h-6 w-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                </div>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Assessment Types Section */}
      <section className="py-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Complete Assessment Suite
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              From traditional Q&A to advanced multi-modal evaluations, 
              our platform supports every type of assessment you need.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assessmentTypes.map((type, index) => (
              <motion.div
                key={type.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-xl p-6"
              >
                <div className="flex items-center mb-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  <h3 className="text-lg font-semibold text-white">{type.name}</h3>
                </div>
                <p className="text-gray-300 text-sm">{type.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-900 to-purple-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Hiring?
            </h2>
            <p className="text-xl text-gray-200 mb-8">
              Join forward-thinking companies using AI to make better hiring decisions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth"
                className="bg-white text-blue-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/demo"
                className="border border-white/30 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/10 transition-colors flex items-center justify-center space-x-2"
              >
                <span>Watch Demo</span>
                <Video className="h-5 w-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="h-6 w-6 text-blue-400" />
              <span className="text-xl font-bold text-white">AI Hiring Platform</span>
            </div>
            <p className="text-gray-400 text-sm">
              © 2025 AI Hiring Platform. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
