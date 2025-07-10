'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useData } from '../contexts/DataContext'

interface ATSIntegration {
  id: string
  name: string
  type: 'greenhouse' | 'lever' | 'workday' | 'bamboohr' | 'custom'
  status: 'connected' | 'disconnected' | 'syncing' | 'error'
  lastSync?: Date
  candidatesImported?: number
  jobsImported?: number
}

interface ComplianceSettings {
  gdprEnabled: boolean
  ccpaEnabled: boolean
  dataRetentionDays: number
  anonymizeAfterDays: number
  auditLogging: boolean
  encryptionEnabled: boolean
}

interface CollaborativeHiringSettings {
  enableTeamReviews: boolean
  requireMultipleApprovals: boolean
  allowCandidateComments: boolean
  notifyStakeholders: boolean
  scoringWeights: {
    technical: number
    cultural: number
    communication: number
    leadership: number
  }
}

export default function EnterpriseIntegration() {
  const { user } = useAuth()
  const [currentView, setCurrentView] = useState<'dashboard' | 'ats' | 'compliance' | 'collaboration' | 'analytics'>('dashboard')
  const [atsIntegrations, setATSIntegrations] = useState<ATSIntegration[]>([])
  const [complianceSettings, setComplianceSettings] = useState<ComplianceSettings>({
    gdprEnabled: true,
    ccpaEnabled: true,
    dataRetentionDays: 365,
    anonymizeAfterDays: 90,
    auditLogging: true,
    encryptionEnabled: true
  })
  const [collaborativeSettings, setCollaborativeSettings] = useState<CollaborativeHiringSettings>({
    enableTeamReviews: true,
    requireMultipleApprovals: false,
    allowCandidateComments: true,
    notifyStakeholders: true,
    scoringWeights: {
      technical: 40,
      cultural: 25,
      communication: 20,
      leadership: 15
    }
  })

  useEffect(() => {
    loadATSIntegrations()
  }, [])

  const loadATSIntegrations = () => {
    // Simulate loading ATS integrations
    setATSIntegrations([
      {
        id: '1',
        name: 'Greenhouse',
        type: 'greenhouse',
        status: 'connected',
        lastSync: new Date(),
        candidatesImported: 1247,
        jobsImported: 23
      },
      {
        id: '2',
        name: 'Lever',
        type: 'lever',
        status: 'disconnected',
        candidatesImported: 0,
        jobsImported: 0
      },
      {
        id: '3',
        name: 'Workday',
        type: 'workday',
        status: 'syncing',
        lastSync: new Date(Date.now() - 3600000), // 1 hour ago
        candidatesImported: 892,
        jobsImported: 15
      }
    ])
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800'
      case 'disconnected': return 'bg-red-100 text-red-800'
      case 'syncing': return 'bg-yellow-100 text-yellow-800'
      case 'error': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return '✅'
      case 'disconnected': return '❌'
      case 'syncing': return '🔄'
      case 'error': return '⚠️'
      default: return '❓'
    }
  }

  const handleConnectATS = (integration: ATSIntegration) => {
    // Simulate connection process
    setATSIntegrations(prev => prev.map(ats => 
      ats.id === integration.id 
        ? { ...ats, status: 'syncing' }
        : ats
    ))

    setTimeout(() => {
      setATSIntegrations(prev => prev.map(ats => 
        ats.id === integration.id 
          ? { ...ats, status: 'connected', lastSync: new Date() }
          : ats
      ))
    }, 3000)
  }

  const handleDisconnectATS = (integration: ATSIntegration) => {
    setATSIntegrations(prev => prev.map(ats => 
      ats.id === integration.id 
        ? { ...ats, status: 'disconnected', lastSync: undefined }
        : ats
    ))
  }

  const updateComplianceSettings = (updates: Partial<ComplianceSettings>) => {
    setComplianceSettings(prev => ({ ...prev, ...updates }))
  }

  const updateCollaborativeSettings = (updates: Partial<CollaborativeHiringSettings>) => {
    setCollaborativeSettings(prev => ({ ...prev, ...updates }))
  }

  if (currentView === 'ats') {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">ATS Integrations</h2>
            <p className="text-gray-600">Connect your Applicant Tracking Systems</p>
          </div>
          <button
            onClick={() => setCurrentView('dashboard')}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Back to Dashboard
          </button>
        </div>

        {/* ATS Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {atsIntegrations.map((integration) => (
            <div key={integration.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{integration.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(integration.status)}`}>
                  {getStatusIcon(integration.status)} {integration.status}
                </span>
              </div>

              {integration.status === 'connected' && (
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Candidates:</span>
                    <span className="font-medium">{integration.candidatesImported}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Jobs:</span>
                    <span className="font-medium">{integration.jobsImported}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Last Sync:</span>
                    <span className="font-medium">
                      {integration.lastSync?.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {integration.status === 'disconnected' ? (
                  <button
                    onClick={() => handleConnectATS(integration)}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Connect
                  </button>
                ) : integration.status === 'syncing' ? (
                  <button
                    disabled
                    className="w-full bg-yellow-400 text-white py-2 rounded-lg cursor-not-allowed"
                  >
                    Syncing...
                  </button>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={() => handleConnectATS(integration)}
                      className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Sync Now
                    </button>
                    <button
                      onClick={() => handleDisconnectATS(integration)}
                      className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Disconnect
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Add New Integration Card */}
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
            <div className="text-4xl text-gray-400 mb-2">+</div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">Add Integration</h3>
            <p className="text-sm text-gray-500 text-center mb-4">
              Connect a new ATS or custom integration
            </p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Add New
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (currentView === 'compliance') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Compliance & Security</h2>
            <p className="text-gray-600">Manage data privacy and security settings</p>
          </div>
          <button
            onClick={() => setCurrentView('dashboard')}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="space-y-6">
          {/* Privacy Compliance */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy Compliance</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">GDPR Compliance</h4>
                  <p className="text-sm text-gray-600">Enable EU General Data Protection Regulation compliance</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={complianceSettings.gdprEnabled}
                    onChange={(e) => updateComplianceSettings({ gdprEnabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">CCPA Compliance</h4>
                  <p className="text-sm text-gray-600">Enable California Consumer Privacy Act compliance</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={complianceSettings.ccpaEnabled}
                    onChange={(e) => updateComplianceSettings({ ccpaEnabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Audit Logging</h4>
                  <p className="text-sm text-gray-600">Log all assessment and data access events</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={complianceSettings.auditLogging}
                    onChange={(e) => updateComplianceSettings({ auditLogging: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Data Retention */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Retention</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data Retention Period (days)
                </label>
                <input
                  type="number"
                  value={complianceSettings.dataRetentionDays}
                  onChange={(e) => updateComplianceSettings({ dataRetentionDays: parseInt(e.target.value) })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Anonymize After (days)
                </label>
                <input
                  type="number"
                  value={complianceSettings.anonymizeAfterDays}
                  onChange={(e) => updateComplianceSettings({ anonymizeAfterDays: parseInt(e.target.value) })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Security</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">End-to-End Encryption</h4>
                <p className="text-sm text-gray-600">Encrypt all candidate data at rest and in transit</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={complianceSettings.encryptionEnabled}
                  onChange={(e) => updateComplianceSettings({ encryptionEnabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (currentView === 'collaboration') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Collaborative Hiring</h2>
            <p className="text-gray-600">Configure team-based assessment and decision making</p>
          </div>
          <button
            onClick={() => setCurrentView('dashboard')}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="space-y-6">
          {/* Team Reviews */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Reviews</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Enable Team Reviews</h4>
                  <p className="text-sm text-gray-600">Allow multiple team members to review and score assessments</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={collaborativeSettings.enableTeamReviews}
                    onChange={(e) => updateCollaborativeSettings({ enableTeamReviews: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Require Multiple Approvals</h4>
                  <p className="text-sm text-gray-600">Require approval from multiple reviewers before moving candidates forward</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={collaborativeSettings.requireMultipleApprovals}
                    onChange={(e) => updateCollaborativeSettings({ requireMultipleApprovals: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Notify Stakeholders</h4>
                  <p className="text-sm text-gray-600">Send notifications when assessments are completed</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={collaborativeSettings.notifyStakeholders}
                    onChange={(e) => updateCollaborativeSettings({ notifyStakeholders: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Scoring Weights */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Scoring Weights</h3>
            <p className="text-gray-600 mb-4">Configure how different assessment areas are weighted in the final score</p>
            
            <div className="space-y-4">
              {Object.entries(collaborativeSettings.scoringWeights).map(([area, weight]) => (
                <div key={area}>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700 capitalize">{area}</label>
                    <span className="text-sm text-gray-600">{weight}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={weight}
                    onChange={(e) => updateCollaborativeSettings({
                      scoringWeights: {
                        ...collaborativeSettings.scoringWeights,
                        [area]: parseInt(e.target.value)
                      }
                    })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              ))}
              
              <div className="text-sm text-gray-500 mt-2">
                Total: {Object.values(collaborativeSettings.scoringWeights).reduce((sum, weight) => sum + weight, 0)}%
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Dashboard view
  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Enterprise Integration Hub</h1>
        <p className="text-gray-600">Manage integrations, compliance, and collaborative hiring</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🔗</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">ATS Connected</p>
              <p className="text-2xl font-bold text-gray-900">
                {atsIntegrations.filter(ats => ats.status === 'connected').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Candidates Synced</p>
              <p className="text-2xl font-bold text-gray-900">
                {atsIntegrations.reduce((sum, ats) => sum + (ats.candidatesImported || 0), 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🛡️</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Compliance Score</p>
              <p className="text-2xl font-bold text-gray-900">98%</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🤝</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Team Reviews</p>
              <p className="text-2xl font-bold text-gray-900">
                {collaborativeSettings.enableTeamReviews ? 'Active' : 'Inactive'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          onClick={() => setCurrentView('ats')}
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">🔗</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">ATS Integration</h3>
          <p className="text-gray-600 mb-4">Connect with Greenhouse, Lever, Workday, and other ATS platforms</p>
          <div className="flex items-center text-blue-600">
            <span className="text-sm font-medium">Manage Integrations</span>
            <span className="ml-1">→</span>
          </div>
        </div>

        <div 
          onClick={() => setCurrentView('compliance')}
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">🛡️</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Compliance & Security</h3>
          <p className="text-gray-600 mb-4">GDPR, CCPA compliance and enterprise security features</p>
          <div className="flex items-center text-green-600">
            <span className="text-sm font-medium">Configure Settings</span>
            <span className="ml-1">→</span>
          </div>
        </div>

        <div 
          onClick={() => setCurrentView('collaboration')}
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">🤝</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Collaborative Hiring</h3>
          <p className="text-gray-600 mb-4">Team reviews, approval workflows, and scoring collaboration</p>
          <div className="flex items-center text-purple-600">
            <span className="text-sm font-medium">Setup Collaboration</span>
            <span className="ml-1">→</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-red-600 p-6 rounded-lg text-white">
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">📊</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">Global Analytics</h3>
          <p className="mb-4 opacity-90">Cross-region hiring analytics and insights</p>
          <button className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors">
            View Analytics
          </button>
        </div>

        <div className="bg-gradient-to-br from-teal-500 to-blue-600 p-6 rounded-lg text-white">
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">🌍</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">Global Scaling</h3>
          <p className="mb-4 opacity-90">Multi-region deployment and localization</p>
          <button className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors">
            Configure Regions
          </button>
        </div>

        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-lg text-white">
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">⚙️</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">Custom Workflows</h3>
          <p className="mb-4 opacity-90">Build custom assessment and approval workflows</p>
          <button className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors">
            Build Workflows
          </button>
        </div>
      </div>
    </div>
  )
}
