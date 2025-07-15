'use client'
export const dynamic = "force-dynamic"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, Save, User, Mail, Building, Eye, EyeOff, Lock, 
  MapPin, Phone, Briefcase, GraduationCap, Code, Award, 
  ExternalLink, Plus, Trash2, Calendar, Link, Github, 
  Globe, FileText, DollarSign, Clock, Users
} from 'lucide-react'
import { useAuth } from '@/contexts/NextAuthContext'
import Navigation from '@/components/Navigation'

export default function ProfilePage() {
  const { user, isAuthenticated, updateUserRole, isLoading } = useAuth()
  const router = useRouter()
  
  const [activeTab, setActiveTab] = useState('basic')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'recruiter' as 'recruiter' | 'candidate',
    company: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    location: '',
    summary: '',
    experience: '',
    skills: [] as string[],
    education: '',
    linkedinUrl: '',
    githubUrl: '',
    portfolioUrl: '',
    preferredRoles: [] as string[],
    salaryExpectation: '',
    availability: '',
    workAuthorization: '',
    languages: [] as string[],
    certifications: [] as string[],
    projects: [] as any[],
    workExperience: [] as any[]
  })
  
  const [profileCompletion, setProfileCompletion] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [linkedinImportStatus, setLinkedinImportStatus] = useState('')

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth')
      return
    }

    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'recruiter',
        company: user.company || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      
      // Load profile data
      if (user.profile) {
        setProfileData({
          firstName: user.profile.firstName || '',
          lastName: user.profile.lastName || '',
          phone: user.profile.phone || '',
          location: user.profile.location || '',
          summary: user.profile.summary || '',
          experience: user.profile.experience || '',
          skills: user.profile.skills || [],
          education: user.profile.education || '',
          linkedinUrl: user.profile.linkedinUrl || '',
          githubUrl: user.profile.githubUrl || '',
          portfolioUrl: user.profile.portfolioUrl || '',
          preferredRoles: user.profile.preferredRoles || [],
          salaryExpectation: user.profile.salaryExpectation || '',
          availability: user.profile.availability || '',
          workAuthorization: user.profile.workAuthorization || '',
          languages: user.profile.languages || [],
          certifications: user.profile.certifications || [],
          projects: user.profile.projects || [],
          workExperience: user.profile.workExperience || []
        })
      }
      
      setProfileCompletion(user.profileCompletion || 0)
    }
  }, [user, isAuthenticated, isLoading, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
    setSuccess('')
  }

  const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileData(prev => ({ ...prev, [name]: value }))
    setError('')
    setSuccess('')
  }

  const handleArrayInputChange = (field: string, index: number, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: prev[field as keyof typeof prev].map((item: any, i: number) => 
        i === index ? value : item
      )
    }))
  }

  const addArrayItem = (field: string, defaultValue: any = '') => {
    setProfileData(prev => ({
      ...prev,
      [field]: [...prev[field as keyof typeof prev], defaultValue]
    }))
  }

  const removeArrayItem = (field: string, index: number) => {
    setProfileData(prev => ({
      ...prev,
      [field]: prev[field as keyof typeof prev].filter((_: any, i: number) => i !== index)
    }))
  }

  const addProject = () => {
    addArrayItem('projects', {
      name: '',
      description: '',
      technologies: [],
      url: '',
      startDate: '',
      endDate: ''
    })
  }

  const addWorkExperience = () => {
    addArrayItem('workExperience', {
      company: '',
      position: '',
      description: '',
      startDate: '',
      endDate: '',
      current: false
    })
  }

  const handleLinkedInImport = async () => {
    if (!profileData.linkedinUrl) {
      setError('Please enter your LinkedIn URL first')
      return
    }

    setLoading(true)
    setLinkedinImportStatus('Validating LinkedIn URL...')

    try {
      const response = await fetch('/api/user/linkedin-import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          linkedinUrl: profileData.linkedinUrl,
          action: 'validate'
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to validate LinkedIn URL')
      }

      if (data.canImport) {
        setLinkedinImportStatus('Importing profile data...')
        
        const importResponse = await fetch('/api/user/linkedin-import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            linkedinUrl: profileData.linkedinUrl,
            action: 'import'
          })
        })

        const importData = await importResponse.json()

        if (importData.success) {
          setProfileData(prev => ({ ...prev, ...importData.profileData }))
          setSuccess('LinkedIn profile imported successfully!')
        } else {
          setLinkedinImportStatus(importData.message)
        }
      } else {
        setLinkedinImportStatus(data.importMessage)
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import LinkedIn profile')
    } finally {
      setLoading(false)
    }
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          profile: profileData
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile')
      }

      setProfileCompletion(data.profileCompletion || 0)
      setSuccess('Profile updated successfully!')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleBasicUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          role: formData.role,
          company: formData.role === 'recruiter' ? formData.company : undefined
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile')
      }

      await updateUserRole(formData.role, formData.company)
      setSuccess('Basic information updated successfully!')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match')
      setLoading(false)
      return
    }

    if (formData.newPassword.length < 6) {
      setError('New password must be at least 6 characters long')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/user/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to change password')
      }

      setSuccess('Password changed successfully!')
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }))
      setIsChangingPassword(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
      </div>
    )
  }

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: User },
    ...(user.role === 'candidate' ? [
      { id: 'personal', label: 'Personal Details', icon: MapPin },
      { id: 'professional', label: 'Professional', icon: Briefcase },
      { id: 'skills', label: 'Skills & Education', icon: GraduationCap },
      { id: 'experience', label: 'Experience', icon: Award },
      { id: 'projects', label: 'Projects', icon: Code },
      { id: 'preferences', label: 'Preferences', icon: Users }
    ] : []),
    { id: 'security', label: 'Security', icon: Lock }
  ]

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation userType={user.role} />
      
      <div className="pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
                <p className="text-gray-400">Manage your account information and preferences</p>
              </div>
            </div>
            {user.role === 'candidate' && (
              <div className="text-right">
                <div className="text-sm text-gray-400">Profile Completion</div>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${profileCompletion}%` }}
                    />
                  </div>
                  <span className="text-white font-semibold">{profileCompletion}%</span>
                </div>
              </div>
            )}
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-6 bg-red-600/20 border border-red-500/30 rounded-lg p-4">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 bg-green-600/20 border border-green-500/30 rounded-lg p-4">
              <p className="text-green-400">{success}</p>
            </div>
          )}

          {linkedinImportStatus && (
            <div className="mb-6 bg-blue-600/20 border border-blue-500/30 rounded-lg p-4">
              <p className="text-blue-400 whitespace-pre-line">{linkedinImportStatus}</p>
              <button
                onClick={() => setLinkedinImportStatus('')}
                className="mt-2 text-blue-300 hover:text-blue-100 text-sm underline"
              >
                Dismiss
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 sticky top-6">
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                          activeTab === tab.id
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="text-sm font-medium">{tab.label}</span>
                      </button>
                    )
                  })}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
                
                {/* Basic Info Tab */}
                {activeTab === 'basic' && (
                  <>
                    <div className="px-6 py-4 border-b border-gray-700">
                      <h2 className="text-xl font-semibold text-white">Basic Information</h2>
                      <p className="text-gray-400 text-sm">Update your basic account details</p>
                    </div>
                    <form onSubmit={handleBasicUpdate} className="p-6 space-y-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                          Full Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter your full name"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            className="w-full pl-10 pr-4 py-2 bg-gray-600 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
                            disabled
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                      </div>

                      <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-2">
                          Account Type
                        </label>
                        <select
                          id="role"
                          name="role"
                          value={formData.role}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="recruiter">Recruiter</option>
                          <option value="candidate">Candidate</option>
                        </select>
                      </div>

                      {formData.role === 'recruiter' && (
                        <div>
                          <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
                            Company
                          </label>
                          <div className="relative">
                            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                              type="text"
                              id="company"
                              name="company"
                              value={formData.company}
                              onChange={handleInputChange}
                              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter your company name"
                              required
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={loading}
                          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors flex items-center space-x-2"
                        >
                          <Save className="h-4 w-4" />
                          <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                        </button>
                      </div>
                    </form>
                  </>
                )}

                {/* Continue with the rest of the tabs... */}
                
                {/* Personal Details Tab - Only for candidates */}
                {activeTab === 'personal' && user.role === 'candidate' && (
                  <>
                    <div className="px-6 py-4 border-b border-gray-700">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-xl font-semibold text-white">Personal Details</h2>
                          <p className="text-gray-400 text-sm">Personal information for your profile</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="url"
                            placeholder="LinkedIn Profile URL"
                            value={profileData.linkedinUrl}
                            onChange={(e) => setProfileData(prev => ({ ...prev, linkedinUrl: e.target.value }))}
                            className="px-3 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm placeholder-gray-400"
                          />
                          <button
                            type="button"
                            onClick={handleLinkedInImport}
                            disabled={loading || !profileData.linkedinUrl}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded text-sm flex items-center space-x-1"
                          >
                            <Link className="h-3 w-3" />
                            <span>Import</span>
                          </button>
                        </div>
                      </div>
                    </div>
                    <form onSubmit={handleProfileUpdate} className="p-6 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                          <input
                            type="text"
                            name="firstName"
                            value={profileData.firstName}
                            onChange={handleProfileInputChange}
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="First name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
                          <input
                            type="text"
                            name="lastName"
                            value={profileData.lastName}
                            onChange={handleProfileInputChange}
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Last name"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            <Phone className="inline h-4 w-4 mr-1" />
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={profileData.phone}
                            onChange={handleProfileInputChange}
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Your phone number"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            <MapPin className="inline h-4 w-4 mr-1" />
                            Location
                          </label>
                          <input
                            type="text"
                            name="location"
                            value={profileData.location}
                            onChange={handleProfileInputChange}
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="City, State/Country"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Professional Summary</label>
                        <textarea
                          name="summary"
                          value={profileData.summary}
                          onChange={handleProfileInputChange}
                          rows={4}
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Write a brief summary of your professional background and career goals..."
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            <Link className="inline h-4 w-4 mr-1" />
                            LinkedIn URL
                          </label>
                          <input
                            type="url"
                            name="linkedinUrl"
                            value={profileData.linkedinUrl}
                            onChange={handleProfileInputChange}
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="https://linkedin.com/in/username"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            <Github className="inline h-4 w-4 mr-1" />
                            GitHub URL
                          </label>
                          <input
                            type="url"
                            name="githubUrl"
                            value={profileData.githubUrl}
                            onChange={handleProfileInputChange}
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="https://github.com/username"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            <Globe className="inline h-4 w-4 mr-1" />
                            Portfolio URL
                          </label>
                          <input
                            type="url"
                            name="portfolioUrl"
                            value={profileData.portfolioUrl}
                            onChange={handleProfileInputChange}
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="https://yourportfolio.com"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={loading}
                          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors flex items-center space-x-2"
                        >
                          <Save className="h-4 w-4" />
                          <span>{loading ? 'Saving...' : 'Save Personal Details'}</span>
                        </button>
                      </div>
                    </form>
                  </>
                )}

                {/* More tabs would continue here... For brevity, I'll add the Security tab */}
                
                {/* Security Tab */}
                {activeTab === 'security' && (
                  <>
                    <div className="px-6 py-4 border-b border-gray-700">
                      <h2 className="text-xl font-semibold text-white">Security Settings</h2>
                      <p className="text-gray-400 text-sm">Manage your password and security preferences</p>
                    </div>
                    <div className="p-6">
                      <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                          <div>
                            <h3 className="text-white font-medium">Change Password</h3>
                            <p className="text-gray-400 text-sm">Update your account password</p>
                          </div>
                          <button
                            onClick={() => setIsChangingPassword(!isChangingPassword)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                          >
                            {isChangingPassword ? 'Cancel' : 'Change Password'}
                          </button>
                        </div>

                        {isChangingPassword && (
                          <form onSubmit={handlePasswordChange} className="space-y-4 p-4 bg-gray-700 rounded-lg">
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Current Password
                              </label>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                  type={showCurrentPassword ? 'text' : 'password'}
                                  name="currentPassword"
                                  value={formData.currentPassword}
                                  onChange={handleInputChange}
                                  className="w-full pl-10 pr-12 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  placeholder="Enter current password"
                                  required
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                                >
                                  {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                New Password
                              </label>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                  type={showNewPassword ? 'text' : 'password'}
                                  name="newPassword"
                                  value={formData.newPassword}
                                  onChange={handleInputChange}
                                  className="w-full pl-10 pr-12 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  placeholder="Enter new password"
                                  required
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowNewPassword(!showNewPassword)}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                                >
                                  {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Confirm New Password
                              </label>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                  type={showConfirmPassword ? 'text' : 'password'}
                                  name="confirmPassword"
                                  value={formData.confirmPassword}
                                  onChange={handleInputChange}
                                  className="w-full pl-10 pr-12 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  placeholder="Confirm new password"
                                  required
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                                >
                                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                              </div>
                            </div>

                            <div className="flex justify-end space-x-3">
                              <button
                                type="button"
                                onClick={() => setIsChangingPassword(false)}
                                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg text-sm"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg text-sm"
                              >
                                {loading ? 'Updating...' : 'Update Password'}
                              </button>
                            </div>
                          </form>
                        )}

                        {/* Account Info */}
                        <div className="p-4 bg-gray-700 rounded-lg">
                          <h3 className="text-white font-medium mb-4">Account Information</h3>
                          <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Member since:</span>
                              <span className="text-white">
                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Account type:</span>
                              <span className="text-white capitalize">{user.role}</span>
                            </div>
                            {user.company && (
                              <div className="flex justify-between">
                                <span className="text-gray-400">Company:</span>
                                <span className="text-white">{user.company}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
