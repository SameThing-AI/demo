'use client'

import { useState, useEffect, useMemo } from 'react'
import { AlertTriangle, Loader2 } from 'lucide-react'

interface DynamicComponentRendererProps {
  componentCode: string
  question: any
  onInteraction: (data: any) => void
  fallbackComponent?: React.ComponentType<any>
}

export default function DynamicComponentRenderer({ 
  componentCode, 
  question, 
  onInteraction,
  fallbackComponent: FallbackComponent 
}: DynamicComponentRendererProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [compiledComponent, setCompiledComponent] = useState<React.ComponentType<any> | null>(null)

  // Safe component compilation with security checks
  const compileComponent = useMemo(() => {
    if (!componentCode) return null

    try {
      // Security validation
      if (!isSecureCode(componentCode)) {
        throw new Error('Component code contains potentially unsafe patterns')
      }

      // Transform the component code for safe execution
      const transformedCode = transformComponentCode(componentCode)
      
      // Create a safe evaluation environment
      const safeEval = createSafeEvalEnvironment()
      
      // Compile the component
      const compiledFunction = safeEval(transformedCode)
      
      return compiledFunction
    } catch (err) {
      console.error('Component compilation error:', err)
      setError(err instanceof Error ? err.message : 'Failed to compile component')
      return null
    }
  }, [componentCode])

  useEffect(() => {
    setIsLoading(true)
    setError(null)
    
    if (compileComponent) {
      setCompiledComponent(() => compileComponent)
    } else if (componentCode) {
      setError('Failed to compile dynamic component')
    }
    
    setIsLoading(false)
  }, [compileComponent, componentCode])

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600 mr-2" />
        <span className="text-gray-600">Compiling interactive component...</span>
      </div>
    )
  }

  // Error state with fallback
  if (error || !compiledComponent) {
    if (FallbackComponent) {
      return <FallbackComponent question={question} onInteraction={onInteraction} />
    }
    
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
          <h3 className="text-lg font-semibold text-red-800">Component Error</h3>
        </div>
        <p className="text-red-700 mb-4">
          Failed to load the interactive component: {error}
        </p>
        <div className="bg-white p-4 rounded border">
          <FallbackTextComponent question={question} onInteraction={onInteraction} />
        </div>
      </div>
    )
  }

  // Render the dynamic component with error boundary
  try {
    const DynamicComponent = compiledComponent
    return (
      <div className="dynamic-component-container">
        <DynamicComponent 
          question={question} 
          onInteraction={onInteraction}
          isPreview={false}
        />
      </div>
    )
  } catch (renderError) {
    console.error('Component render error:', renderError)
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
          <h3 className="text-lg font-semibold text-yellow-800">Render Error</h3>
        </div>
        <p className="text-yellow-700 mb-4">
          The component encountered an error while rendering.
        </p>
        <FallbackTextComponent question={question} onInteraction={onInteraction} />
      </div>
    )
  }
}

// Security validation function
function isSecureCode(code: string): boolean {
  const dangerousPatterns = [
    /eval\s*\(/gi,
    /Function\s*\(/gi,
    /document\./gi,
    /window\./gi,
    /global\./gi,
    /process\./gi,
    /__proto__/gi,
    /constructor\s*\(/gi,
    /innerHTML/gi,
    /outerHTML/gi,
    /importScripts/gi,
    /fetch\s*\(/gi,
    /XMLHttpRequest/gi
  ]

  return !dangerousPatterns.some(pattern => pattern.test(code))
}

// Transform component code for safe execution
function transformComponentCode(code: string): string {
  // Remove imports and replace with safe alternatives
  let transformed = code.replace(/import\s+.*?from\s+['"][^'"]*['"];?\s*/gi, '')
  
  // Ensure React hooks are available
  const hookImports = `
    const { useState, useEffect, useMemo, useCallback } = React;
  `
  
  // Wrap the component in a safe function
  transformed = `
    ${hookImports}
    
    ${transformed}
    
    return GeneratedComponent;
  `
  
  return transformed
}

// Create a safe evaluation environment
function createSafeEvalEnvironment() {
  return (code: string) => {
    // Create a restricted environment
    const safeGlobals = {
      React: require('react'),
      console: {
        log: console.log,
        error: console.error,
        warn: console.warn
      },
      Math: Math,
      Date: Date,
      JSON: JSON,
      Array: Array,
      Object: Object,
      String: String,
      Number: Number,
      Boolean: Boolean
    }
    
    // Use Function constructor with restricted scope
    const func = new Function(
      ...Object.keys(safeGlobals),
      code
    )
    
    return func(...Object.values(safeGlobals))
  }
}

// Fallback text component for when dynamic components fail
function FallbackTextComponent({ question, onInteraction }: { question: any, onInteraction: (data: any) => void }) {
  const [response, setResponse] = useState('')
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        {question.title || question.question || 'Assessment Question'}
      </h3>
      <div className="prose max-w-none">
        <p className="text-gray-700">
          {question.description || question.question || 'Please provide your response to this assessment question.'}
        </p>
      </div>
      <textarea
        value={response}
        onChange={(e) => {
          setResponse(e.target.value)
          onInteraction({ response: e.target.value, fallback: true })
        }}
        placeholder="Enter your response here..."
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        rows={6}
      />
    </div>
  )
}
