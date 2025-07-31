'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Brain, Target, Rocket } from 'lucide-react'

interface LiveSimulationEngineTestProps {
  scenario: any
  onComplete: (results: any) => void
  onBack: () => void
}

export default function LiveSimulationEngineTest({ scenario, onComplete, onBack }: LiveSimulationEngineTestProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="text-center">
            <Brain className="mx-auto h-16 w-16 text-purple-500 mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              🚀 Test Live Simulation
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Testing the live simulation component import/export.
            </p>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Target className="mr-2 h-5 w-5 text-purple-600" />
              Test Scenario
            </h3>
            <p>Scenario: {JSON.stringify(scenario, null, 2)}</p>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={onBack}
              className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Back to Assessment
            </button>
            <button
              onClick={() => onComplete({ test: true, score: 100 })}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
            >
              <Rocket className="mr-2 h-4 w-4" />
              Complete Test
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
