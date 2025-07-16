'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  Users, 
  Star, 
  Building, 
  Loader2,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

interface JobFormatterProps {
  jobDescription: string
  jobTitle: string
  company: string
  assessmentId?: string
}

interface FormattedJob {
  summary: string
  skills: string[]
  experience: string
  type: string
  location: string
  benefits: string[]
  teamSize: string
  industry: string
}

export default function JobDescriptionFormatter({ 
  jobDescription, 
  jobTitle, 
  company,
  assessmentId
}: JobFormatterProps) {
  const [formattedData, setFormattedData] = useState<FormattedJob | null>(null)
  const [loading, setLoading] = useState(true)
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    const formatJobDescription = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/format-job-description', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jobDescription,
            jobTitle,
            company,
            assessmentId
          })
        })

        if (response.ok) {
          const data = await response.json()
          setFormattedData(data)
        } else {
          setError(true)
        }
      } catch (err) {
        console.error('Error formatting job description:', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    if (jobDescription) {
      formatJobDescription()
    } else {
      setLoading(false)
    }
  }, [jobDescription, jobTitle, company, assessmentId])

  if (loading) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 text-blue-400 animate-spin mr-3" />
          <span className="text-gray-400">Analyzing job description...</span>
        </div>
      </div>
    )
  }

  if (error || !formattedData) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Job Description</h3>
        <p className="text-gray-300 text-sm leading-relaxed">
          {jobDescription || 'No job description available'}
        </p>
      </div>
    )
  }

  const getExperienceColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'entry': return 'bg-green-600/20 text-green-400 border-green-500/30'
      case 'mid-level': return 'bg-blue-600/20 text-blue-400 border-blue-500/30'
      case 'senior': return 'bg-purple-600/20 text-purple-400 border-purple-500/30'
      case 'lead': 
      case 'principal': return 'bg-amber-600/20 text-amber-400 border-amber-500/30'
      default: return 'bg-gray-600/20 text-gray-400 border-gray-500/30'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'full-time': return 'bg-green-600/20 text-green-400 border-green-500/30'
      case 'part-time': return 'bg-yellow-600/20 text-yellow-400 border-yellow-500/30'
      case 'contract': return 'bg-orange-600/20 text-orange-400 border-orange-500/30'
      case 'freelance': return 'bg-pink-600/20 text-pink-400 border-pink-500/30'
      default: return 'bg-gray-600/20 text-gray-400 border-gray-500/30'
    }
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Job Overview</h3>
        <span className="text-xs text-gray-500">✨ AI-Analyzed</span>
      </div>

      {/* Summary */}
      <div>
        <p className="text-gray-300 text-sm leading-relaxed mb-4">
          {formattedData.summary}
        </p>
      </div>

      {/* Key Info Tags */}
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg border border-gray-600/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-600/20 rounded-lg">
              <Briefcase className="h-4 w-4 text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">Experience</p>
              <p className="text-white font-medium">{formattedData.experience}</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getExperienceColor(formattedData.experience)}`}>
            {formattedData.experience}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg border border-gray-600/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-600/20 rounded-lg">
              <Clock className="h-4 w-4 text-green-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">Employment</p>
              <p className="text-white font-medium">{formattedData.type}</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(formattedData.type)}`}>
            {formattedData.type}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg border border-gray-600/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600/20 rounded-lg">
              <MapPin className="h-4 w-4 text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400 uppercase tracking-wide">Location</p>
              <p className="text-white font-medium break-words">{formattedData.location}</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-medium border bg-blue-600/20 text-blue-400 border-blue-500/30 ml-3 flex-shrink-0">
            <MapPin className="h-3 w-3" />
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg border border-gray-600/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-600/20 rounded-lg">
              <Building className="h-4 w-4 text-indigo-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400 uppercase tracking-wide">Industry</p>
              <p className="text-white font-medium break-words">{formattedData.industry}</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-medium border bg-indigo-600/20 text-indigo-400 border-indigo-500/30 ml-3 flex-shrink-0">
            <Building className="h-3 w-3" />
          </span>
        </div>
      </div>

      {/* Required Skills */}
      {formattedData.skills && formattedData.skills.length > 0 && (
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Star className="h-4 w-4 text-yellow-400" />
            <h4 className="text-sm font-medium text-white">Required Skills</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {formattedData.skills.map((skill, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="px-3 py-1 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-full text-sm font-medium break-words"
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </div>
      )}

      {/* Benefits */}
      {formattedData.benefits && formattedData.benefits.length > 0 && (
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Star className="h-4 w-4 text-green-400" />
            <h4 className="text-sm font-medium text-white">Benefits</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {formattedData.benefits.map((benefit, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-green-600/20 text-green-400 border border-green-500/30 rounded-full text-sm font-medium break-words"
              >
                {benefit}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Team Info */}
      {formattedData.teamSize && formattedData.teamSize !== 'Not specified' && (
        <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg border border-gray-600/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-600/20 rounded-lg">
              <Users className="h-4 w-4 text-purple-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400 uppercase tracking-wide">Team Size</p>
              <p className="text-white font-medium break-words">{formattedData.teamSize}</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-medium border bg-purple-600/20 text-purple-400 border-purple-500/30 ml-3 flex-shrink-0">
            <Users className="h-3 w-3" />
          </span>
        </div>
      )}

      {/* Full Description Toggle */}
      <div>
        <button
          onClick={() => setShowFullDescription(!showFullDescription)}
          className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors text-sm"
        >
          {showFullDescription ? (
            <>
              <ChevronUp className="h-4 w-4" />
              <span>Hide full description</span>
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4" />
              <span>Show full description</span>
            </>
          )}
        </button>

        {showFullDescription && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-4 bg-gray-700 rounded-lg"
          >
            <h4 className="text-sm font-medium text-white mb-2">Full Job Description</h4>
            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
              {jobDescription}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
