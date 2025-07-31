'use client'

import { useState, useEffect } from 'react'
import BusinessSimulationEngine from './BusinessSimulationEngine'

interface LiveSimulationEngineProps {
  scenario: any
  onComplete: (results: any) => void
  onBack: () => void
}

// Original coding interface for technical roles
const CodingSimulationEngine = ({ scenario, onComplete, onBack }: LiveSimulationEngineProps) => {
  const [code, setCode] = useState('')
  const [output, setOutput] = useState('')
  
  const executeCode = () => {
    setOutput('Code executed successfully! Technical assessment complete.')
    setTimeout(() => {
      onComplete({
        type: 'coding',
        code,
        output,
        timestamp: new Date().toISOString()
      })
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={onBack}
            className="text-gray-400 hover:text-white mb-4"
          >
            ← Back to Assessments
          </button>
          <h2 className="text-2xl font-bold mb-2">Coding Assessment</h2>
          <p className="text-gray-300">{scenario.description}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Code Editor</h3>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-96 p-4 bg-gray-800 text-gray-100 rounded border border-gray-600 focus:border-blue-500 outline-none resize-none font-mono"
              placeholder="// Write your code here..."
            />
            <button
              onClick={executeCode}
              className="mt-4 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Execute Code
            </button>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Output</h3>
            <div className="w-full h-96 p-4 bg-gray-800 rounded border border-gray-600 font-mono text-sm">
              {output || 'Run your code to see output...'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LiveSimulationEngine({ scenario, onComplete, onBack }: LiveSimulationEngineProps) {
  console.log('🎯 LiveSimulationEngine initialized with scenario:', scenario)
  
  // Determine interface type based on role and scenario content
  const determineInterfaceType = () => {
    const title = scenario.title?.toLowerCase() || ''
    const description = scenario.description?.toLowerCase() || ''
    
    console.log('🔍 Analyzing scenario for interface type:', { title, description })
    
    // Business roles get business simulation
    const businessRoles = [
      'product manager', 'product management', 'business analyst', 'program manager',
      'project manager', 'marketing manager', 'sales manager', 'operations manager',
      'strategy', 'business development', 'account manager', 'customer success'
    ]
    
    // Check if it's a business role
    const isBusinessRole = businessRoles.some(role => 
      title.includes(role) || description.includes(role)
    )
    
    // Check if content mentions business scenarios
    const hasBusinessContent = [
      'crisis', 'stakeholder', 'strategy', 'communication', 'team management',
      'business', 'customer', 'revenue', 'market', 'launch', 'budget'
    ].some(keyword => description.includes(keyword))
    
    if (isBusinessRole || hasBusinessContent) {
      console.log('✅ Routing to BusinessSimulationEngine')
      return 'business'
    }
    
    console.log('🔧 Routing to CodingSimulationEngine')
    return 'coding'
  }

  const interfaceType = determineInterfaceType()
  
  if (interfaceType === 'business') {
    return (
      <BusinessSimulationEngine 
        scenario={scenario}
        onComplete={onComplete}
        onBack={onBack}
      />
    )
  }
  
  return (
    <CodingSimulationEngine 
      scenario={scenario}
      onComplete={onComplete}
      onBack={onBack}
    />
  )
}
