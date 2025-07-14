'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/contexts/NextAuthContext'
import { useDatabaseData } from '@/contexts/DatabaseDataContext'

interface ChatMessage {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  suggestedActions?: Array<{
    label: string
    action: string
    data?: any
  }>
}

interface Insight {
  id: string
  type: 'trend' | 'recommendation' | 'alert'
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  actionable: boolean
}

export default function RecruiterAIAssistant() {
  const { user } = useAuth()
  const { assessments, responses } = useDatabaseData()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [currentMessage, setCurrentMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [insights, setInsights] = useState<Insight[]>([])
  const [currentView, setCurrentView] = useState<'chat' | 'insights' | 'analytics'>('chat')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initialize with welcome message and insights
    initializeAssistant()
    generateInsights()
  }, [assessments, responses])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const initializeAssistant = () => {
    const welcomeMessage: ChatMessage = {
      id: '1',
      type: 'assistant',
      content: `Hello ${user?.name}! I'm your AI recruiting assistant. I can help you with:

• Analyzing candidate performance trends
• Suggesting interview questions
• Optimizing assessment strategies
• Identifying top talent
• Providing hiring recommendations

What would you like to know about your recruitment process?`,
      timestamp: new Date(),
      suggestedActions: [
        { label: '📊 Show assessment analytics', action: 'analytics' },
        { label: '🎯 Analyze top performers', action: 'top_performers' },
        { label: '💡 Suggest improvements', action: 'improvements' },
        { label: '❓ Generate interview questions', action: 'questions' }
      ]
    }
    setMessages([welcomeMessage])
  }

  const generateInsights = () => {
    const userAssessments = assessments.filter(a => a.createdBy === user?.id)
    const userResponses = responses.filter(r => 
      userAssessments.some(a => a.id === r.assessmentId)
    )

    const newInsights: Insight[] = []

    // Performance trend analysis
    if (userResponses.length > 0) {
      const avgScore = userResponses.reduce((sum, r) => sum + (r.score || 0), 0) / userResponses.length
      
      if (avgScore < 70) {
        newInsights.push({
          id: '1',
          type: 'alert',
          title: 'Low Average Performance',
          description: `Your assessments have an average score of ${Math.round(avgScore)}%. Consider reviewing question difficulty or providing better instructions.`,
          impact: 'high',
          actionable: true
        })
      }

      if (avgScore > 85) {
        newInsights.push({
          id: '2',
          type: 'recommendation',
          title: 'High Performance Detected',
          description: `Excellent! Your assessments show strong candidate performance (${Math.round(avgScore)}% avg). Consider increasing difficulty for better differentiation.`,
          impact: 'medium',
          actionable: true
        })
      }
    }

    // Assessment variety analysis
    const assessmentTypes = Array.from(new Set(userAssessments.map(a => a.type || 'traditional')))
    if (assessmentTypes.length === 1) {
      newInsights.push({
        id: '3',
        type: 'recommendation',
        title: 'Diversify Assessment Types',
        description: 'Using multiple assessment types (creative, video, self-modifying) can provide better candidate insights and improve hiring accuracy.',
        impact: 'medium',
        actionable: true
      })
    }

    // Completion rate analysis
    const completionRate = userResponses.length / (userAssessments.length * 3) // Assuming 3 candidates per assessment
    if (completionRate < 0.5) {
      newInsights.push({
        id: '4',
        type: 'alert',
        title: 'Low Completion Rate',
        description: `Only ${Math.round(completionRate * 100)}% of candidates complete your assessments. Consider reducing length or improving instructions.`,
        impact: 'high',
        actionable: true
      })
    }

    setInsights(newInsights)
  }

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: currentMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setCurrentMessage('')
    setIsTyping(true)

    // Simulate AI processing
    setTimeout(() => {
      const aiResponse = generateAIResponse(currentMessage)
      setMessages(prev => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const generateAIResponse = (userInput: string): ChatMessage => {
    const lowerInput = userInput.toLowerCase()
    let content = ''
    let suggestedActions: Array<{ label: string; action: string; data?: any }> = []

    if (lowerInput.includes('analytic') || lowerInput.includes('performance') || lowerInput.includes('data')) {
      content = `Here's an analysis of your assessment data:

**Assessment Performance:**
• Total assessments created: ${assessments.filter(a => a.createdBy === user?.id).length}
• Total responses received: ${responses.length}
• Average candidate score: ${responses.length > 0 ? Math.round(responses.reduce((sum, r) => sum + (r.score || 0), 0) / responses.length) : 0}%

**Key Insights:**
• Your assessments are performing well with good candidate engagement
• Consider adding more creative assessment types for better differentiation
• Video assessments show 23% higher completion rates

Would you like me to dive deeper into any specific metric?`

      suggestedActions = [
        { label: '📈 Detailed analytics', action: 'detailed_analytics' },
        { label: '🎯 Top performers', action: 'top_performers' },
        { label: '💡 Improvement suggestions', action: 'improvements' }
      ]
    } else if (lowerInput.includes('question') || lowerInput.includes('interview')) {
      content = `I can help you generate targeted interview questions! Based on your assessment data, here are some high-impact questions:

**Behavioral Questions:**
• "Describe a time when you had to adapt your approach to solve a complex problem."
• "Tell me about a project where you had to collaborate with a difficult team member."

**Technical Questions:**
• "Walk me through your problem-solving process for optimizing application performance."
• "How would you approach debugging a production issue with limited information?"

**Situational Questions:**
• "If you disagreed with a key technical decision, how would you handle it?"
• "How do you stay updated with industry trends and technologies?"

Would you like me to generate questions for a specific role or skill area?`

      suggestedActions = [
        { label: '🎯 Role-specific questions', action: 'role_questions' },
        { label: '⚙️ Technical deep-dive', action: 'technical_questions' },
        { label: '🧠 Behavioral scenarios', action: 'behavioral_questions' }
      ]
    } else if (lowerInput.includes('improve') || lowerInput.includes('better') || lowerInput.includes('optimize')) {
      content = `Based on your assessment data, here are my top recommendations:

**Assessment Optimization:**
1. **Add Video Components:** Video assessments show 31% better candidate insights
2. **Implement Self-Modifying Tests:** Adaptive assessments reduce bias and improve accuracy
3. **Include Creative Scenarios:** Scenario-based questions reveal problem-solving skills

**Process Improvements:**
1. **Standardize Evaluation Criteria:** Use consistent scoring rubrics across assessments
2. **Gather Candidate Feedback:** Post-assessment surveys improve the experience
3. **Track Hire Success Rate:** Monitor how assessment scores correlate with job performance

**Engagement Strategies:**
1. **Provide Clear Instructions:** Reduce dropout rates by 40%
2. **Set Realistic Time Limits:** Balance thoroughness with candidate experience
3. **Offer Practice Questions:** Help candidates feel more confident

Which area would you like to focus on first?`

      suggestedActions = [
        { label: '🎥 Setup video assessments', action: 'setup_video' },
        { label: '🔄 Create adaptive tests', action: 'setup_adaptive' },
        { label: '📋 Improve instructions', action: 'improve_instructions' }
      ]
    } else if (lowerInput.includes('top') || lowerInput.includes('best') || lowerInput.includes('talent')) {
      const topCandidates = responses
        .sort((a, b) => (b.score || 0) - (a.score || 0))
        .slice(0, 3)

      content = `Here are your top-performing candidates:

${topCandidates.map((candidate, index) => `
**${index + 1}. ${candidate.candidateName}**
• Score: ${candidate.score}%
• Assessment: ${assessments.find(a => a.id === candidate.assessmentId)?.title || 'Unknown'}
• Completed: ${new Date(candidate.completedAt).toLocaleDateString()}
• Email: ${candidate.candidateEmail}
`).join('')}

**Top Performer Insights:**
• High performers average 23% faster completion times
• They tend to provide more detailed explanations
• Strong correlation with effective communication skills

Would you like me to analyze what makes these candidates successful?`

      suggestedActions = [
        { label: '🔍 Analyze success patterns', action: 'analyze_success' },
        { label: '📧 Contact top candidates', action: 'contact_candidates' },
        { label: '📊 Compare performance metrics', action: 'compare_metrics' }
      ]
    } else {
      content = `I'd be happy to help! Here are some things I can assist you with:

• **Assessment Analytics:** Review performance data and trends
• **Candidate Insights:** Analyze top performers and success patterns  
• **Question Generation:** Create targeted interview questions
• **Process Optimization:** Suggest improvements to your hiring workflow
• **Predictive Analytics:** Forecast candidate success likelihood

What specific aspect of your recruitment process would you like to explore?`

      suggestedActions = [
        { label: '📊 View analytics dashboard', action: 'analytics' },
        { label: '🎯 Find top talent', action: 'top_performers' },
        { label: '❓ Generate questions', action: 'questions' },
        { label: '💡 Get recommendations', action: 'improvements' }
      ]
    }

    return {
      id: Date.now().toString(),
      type: 'assistant',
      content,
      timestamp: new Date(),
      suggestedActions
    }
  }

  const handleSuggestedAction = (action: string) => {
    // Handle suggested action clicks
    const actionMessages: { [key: string]: string } = {
      'analytics': 'Show me detailed analytics for my assessments',
      'top_performers': 'Who are my top-performing candidates?',
      'improvements': 'How can I improve my assessment process?',
      'questions': 'Generate interview questions for my next hire',
      'setup_video': 'Help me set up video assessments',
      'setup_adaptive': 'How do I create adaptive assessments?',
      'role_questions': 'Generate questions for a senior developer role'
    }

    if (actionMessages[action]) {
      setCurrentMessage(actionMessages[action])
      setTimeout(() => handleSendMessage(), 100)
    }
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'trend': return '📈'
      case 'recommendation': return '💡'
      case 'alert': return '⚠️'
      default: return '💡'
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'border-red-200 bg-red-50'
      case 'medium': return 'border-yellow-200 bg-yellow-50'
      case 'low': return 'border-blue-200 bg-blue-50'
      default: return 'border-gray-200 bg-gray-50'
    }
  }

  if (currentView === 'insights') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">AI Insights</h2>
          <button
            onClick={() => setCurrentView('chat')}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Back to Chat
          </button>
        </div>

        <div className="space-y-4">
          {insights.map((insight) => (
            <div key={insight.id} className={`border rounded-lg p-4 ${getImpactColor(insight.impact)}`}>
              <div className="flex items-start space-x-3">
                <span className="text-2xl">{getInsightIcon(insight.type)}</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{insight.title}</h3>
                  <p className="text-gray-700 mb-2">{insight.description}</p>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      insight.impact === 'high' 
                        ? 'bg-red-100 text-red-800'
                        : insight.impact === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {insight.impact} impact
                    </span>
                    {insight.actionable && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Actionable
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">AI Assistant</h2>
          <p className="text-gray-600">Your intelligent recruiting partner</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentView('insights')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Insights ({insights.length})
          </button>
        </div>
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-lg shadow-md flex flex-col h-96">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.type === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <div className="whitespace-pre-wrap">{message.content}</div>
                
                {message.suggestedActions && (
                  <div className="mt-3 space-y-2">
                    {message.suggestedActions.map((action, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestedAction(action.action)}
                        className="block w-full text-left px-3 py-1 text-sm bg-white/20 rounded border border-white/30 hover:bg-white/30 transition-colors"
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
                
                <div className={`text-xs mt-1 ${
                  message.type === 'user' ? 'text-blue-200' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask me about your recruitment process..."
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleSendMessage}
              disabled={!currentMessage.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
