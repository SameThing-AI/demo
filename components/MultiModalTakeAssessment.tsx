'use client'

import React from 'react'

interface MultiModalTakeAssessmentProps {
  assessment: any
  onComplete: (responses: any[]) => void
}

export default function MultiModalTakeAssessment({ assessment, onComplete }: MultiModalTakeAssessmentProps) {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold text-yellow-800 mb-2">Feature Deprecated</h2>
        <p className="text-yellow-700 mb-4">
          Multi-modal assessments have been consolidated into our simplified assessment flow. Please use the regular assessment interface.
        </p>
        <div className="flex space-x-4">
          <button
            onClick={() => onComplete([])}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue with Standard Assessment
          </button>
        </div>
      </div>
    </div>
  )
}
