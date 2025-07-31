'use client'

import { motion } from 'framer-motion'
import { Brain, Target, Users, Zap, ArrowRight, CheckCircle, Video, BarChart3, Bot } from 'lucide-react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import { Button } from '@/components/ui'

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
    <div className="min-h-screen-responsive bg-gray-900">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-gray-900 to-purple-900 safe-area-padding">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container-responsive pt-16 sm:pt-20 pb-20 sm:pb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6 sm:mb-8">
              <div className="flex items-center space-x-2 sm:space-x-3 bg-blue-600/20 backdrop-blur-sm border border-blue-500/30 rounded-full px-4 py-2 sm:px-6 sm:py-3">
                <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400 flex-shrink-0" />
                <span className="text-blue-400 font-semibold text-sm sm:text-lg">AI-Powered Hiring Platform</span>
              </div>
            </div>
            
            <h1 className="text-fluid-4xl font-bold text-white mb-4 sm:mb-6">
              Revolutionize Your
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Hiring Process
              </span>
            </h1>
            
            <p className="text-fluid-lg text-gray-300 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed">
              Create dynamic, AI-powered assessments that adapt to candidates, provide deep insights, 
              and deliver exceptional hiring experiences for both recruiters and candidates.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
              <Link href="/auth">
                <Button
                  variant="primary"
                  size="lg"
                  className="rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all duration-200 transform hover:scale-105"
                >
                  <span>Get Started</span>
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-gray-600 hover:border-blue-500 text-white rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all duration-200 hover:bg-blue-600/10"
                >
                  <span>Try Demo</span>
                  <Zap className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 bg-gray-800">
        <div className="container-responsive">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-fluid-3xl font-bold text-white mb-4 sm:mb-6">
              Powered by Advanced AI Technology
            </h2>
            <p className="text-fluid-lg text-gray-300 max-w-3xl mx-auto">
              Our platform combines cutting-edge AI with practical hiring needs to deliver 
              the most comprehensive assessment solution available.
            </p>
          </motion.div>

          <div className="grid-responsive-1-2-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-900 border border-gray-700 rounded-xl card-responsive hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="flex flex-col sm:flex-row sm:items-center mb-4 gap-3">
                  <div className="bg-blue-600/20 p-3 rounded-lg flex-shrink-0 w-fit">
                    <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
                  </div>
                  <h3 className="text-fluid-lg font-semibold text-white">{feature.title}</h3>
                </div>
                <p className="text-gray-300 text-fluid-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Assessment Types Section */}
      <section className="py-16 sm:py-24 bg-gray-900">
        <div className="container-responsive">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12 lg:mb-16"
          >
            <h2 className="text-fluid-3xl font-bold text-white mb-4 sm:mb-6">
              Complete Assessment Suite
            </h2>
            <p className="text-fluid-lg text-gray-300 max-w-none sm:max-w-2xl lg:max-w-3xl mx-auto px-4 sm:px-0">
              From traditional Q&A to advanced multi-modal evaluations, 
              our platform supports every type of assessment you need.
            </p>
          </motion.div>

          <div className="grid-responsive-1-2-3 gap-4 sm:gap-6">
            {assessmentTypes.map((type, index) => (
              <motion.div
                key={type.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card-responsive bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300"
              >
                <div className="flex items-start sm:items-center mb-3 flex-col xs:flex-row xs:gap-3">
                  <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-400 mb-2 xs:mb-0 flex-shrink-0" />
                  <h3 className="text-fluid-lg font-semibold text-white leading-tight">{type.name}</h3>
                </div>
                <p className="text-gray-300 text-fluid-sm leading-relaxed">{type.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-r from-blue-900 to-purple-900">
        <div className="container-responsive text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-none sm:max-w-3xl lg:max-w-4xl mx-auto"
          >
            <h2 className="text-fluid-3xl font-bold text-white mb-4 sm:mb-6">
              Ready to Transform Your Hiring?
            </h2>
            <p className="text-fluid-lg text-gray-200 mb-6 sm:mb-8 px-4 sm:px-0">
              Join forward-thinking companies using AI to make better hiring decisions
            </p>
            <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
              <Link href="/auth">
                <Button
                  variant="primary"
                  size="lg"
                  className="bg-white text-blue-900 hover:bg-gray-100 flex items-center justify-center space-x-2 min-w-0 sm:min-w-[180px]"
                >
                  <span className="truncate">Start Free Trial</span>
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10 flex items-center justify-center space-x-2 min-w-0 sm:min-w-[180px]"
                >
                  <span className="truncate">Watch Demo</span>
                  <Video className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-700 py-8 sm:py-12">
        <div className="container-responsive">
          <div className="flex flex-col xs:flex-row items-center justify-between gap-4 xs:gap-0">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400 flex-shrink-0" />
              <span className="text-fluid-lg font-bold text-white">AI Hiring Platform</span>
            </div>
            <p className="text-gray-400 text-fluid-xs text-center xs:text-right">
              © 2025 AI Hiring Platform. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
