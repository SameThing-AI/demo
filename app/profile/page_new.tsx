'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
    setSuccess('')
  }

  const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setProfileData(prev => ({ ...prev, [name]: value }))
    setError('')
    setSuccess('')
  }

  const handleArrayChange = (field: string, index: number, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as string[]).map((item, i) => 
        i === index ? value : item
      )
    }))
  }

  const addArrayItem = (field: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: [...(prev[field as keyof typeof prev] as string[]), '']
    }))
  }

  const removeArrayItem = (field: string, index: number) => {
    setProfileData(prev => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as string[]).filter((_, i) => i !== index)
    }))
  }

  const handleSkillsChange = (skills: string) => {
    setProfileData(prev => ({ 
      ...prev, 
      skills: skills.split(',').map(s => s.trim()).filter(s => s.length > 0)
    }))
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

      // Update the role in context
      await updateUserRole(formData.role, formData.company)
      setSuccess('Profile updated successfully!')
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

  const saveProfile = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: profileData })
      })
      if (!response.ok) throw new Error('Failed to save profile')
      setSuccess('Profile saved successfully!')
    } catch (err) {
      setError('Failed to save profile')
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

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation userType={user.role} />
      
      <div className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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

          {/* Tab Navigation for Candidates */}
          {user.role === 'candidate' && (
            <div className="mb-8">
              <div className="border-b border-gray-700">
                <nav className="-mb-px flex space-x-8">
                  {[
                    { id: 'basic', label: 'Basic Info', icon: User },
                    { id: 'profile', label: 'Profile Details', icon: FileText },
                    { id: 'experience', label: 'Experience', icon: Briefcase },
                    { id: 'skills', label: 'Skills & Education', icon: GraduationCap },
                    { id: 'preferences', label: 'Job Preferences', icon: Users }
                  ].map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setActiveTab(id)}
                      className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === id
                          ? 'border-blue-500 text-blue-400'
                          : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="h-5 w-5 mr-2" />
                      {label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Basic Information Tab */}
              {(activeTab === 'basic' || user.role === 'recruiter') && (
                <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden mb-8">
                  <div className="px-6 py-4 border-b border-gray-700">
                    <h2 className="text-xl font-semibold text-white">Basic Information</h2>
                  </div>
                  <form onSubmit={handleProfileUpdate} className="p-6 space-y-6">
                    {/* Name */}
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

                    {/* Email */}
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

                    {/* Role */}
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

                    {/* Company (only for recruiters) */}
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
                        <span>{loading ? 'Saving...' : 'Update Profile'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Profile Details Tab */}
              {activeTab === 'profile' && user.role === 'candidate' && (
                <div className="space-y-8">
                  {/* LinkedIn Import */}
                  <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-700">
                      <h2 className="text-xl font-semibold text-white">LinkedIn Import</h2>
                      <p className="text-gray-400 text-sm mt-1">Import your profile information from LinkedIn</p>
                    </div>
                    <div className="p-6">
                      <div className="flex space-x-4">
                        <div className="flex-1">
                          <input
                            type="url"
                            name="linkedinUrl"
                            value={profileData.linkedinUrl}
                            onChange={handleProfileInputChange}
                            placeholder="https://linkedin.com/in/your-profile"
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <button
                          onClick={handleLinkedInImport}
                          disabled={loading || !profileData.linkedinUrl}
                          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors flex items-center space-x-2"
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span>{loading ? 'Importing...' : 'Import'}</span>
                        </button>
                      </div>
                      {linkedinImportStatus && (
                        <div className="mt-4 p-3 bg-blue-600/20 border border-blue-500/30 rounded-lg">
                          <p className="text-blue-400 text-sm">{linkedinImportStatus}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Personal Information */}
                  <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-700">
                      <h2 className="text-xl font-semibold text-white">Personal Information</h2>
                    </div>
                    <div className="p-6 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                              type="tel"
                              name="phone"
                              value={profileData.phone}
                              onChange={handleProfileInputChange}
                              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Phone number"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                              type="text"
                              name="location"
                              value={profileData.location}
                              onChange={handleProfileInputChange}
                              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="City, State/Country"
                            />
                          </div>
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
                          placeholder="Brief summary of your professional background and goals..."
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">LinkedIn URL</label>
                          <div className="relative">
                            <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                              type="url"
                              name="linkedinUrl"
                              value={profileData.linkedinUrl}
                              onChange={handleProfileInputChange}
                              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="LinkedIn profile"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">GitHub URL</label>
                          <div className="relative">
                            <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                              type="url"
                              name="githubUrl"
                              value={profileData.githubUrl}
                              onChange={handleProfileInputChange}
                              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="GitHub profile"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Portfolio URL</label>
                          <div className="relative">
                            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                              type="url"
                              name="portfolioUrl"
                              value={profileData.portfolioUrl}
                              onChange={handleProfileInputChange}
                              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Portfolio website"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Experience Tab */}
              {activeTab === 'experience' && user.role === 'candidate' && (
                <div className="space-y-8">
                  {/* Work Experience */}
                  <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-700">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-white">Work Experience</h2>
                        <button
                          onClick={() => addArrayItem('workExperience')}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm flex items-center space-x-2"
                        >
                          <Plus className="h-4 w-4" />
                          <span>Add Experience</span>
                        </button>
                      </div>
                    </div>
                    <div className="p-6 space-y-6">
                      {profileData.workExperience.map((exp, index) => (
                        <div key={index} className="p-4 bg-gray-700 rounded-lg relative">
                          <button
                            onClick={() => removeArrayItem('workExperience', index)}
                            className="absolute top-2 right-2 text-gray-400 hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <input
                              type="text"
                              placeholder="Job Title"
                              value={exp.title || ''}
                              onChange={(e) => {
                                const newExp = [...profileData.workExperience]
                                newExp[index] = { ...newExp[index], title: e.target.value }
                                setProfileData(prev => ({ ...prev, workExperience: newExp }))
                              }}
                              className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                              type="text"
                              placeholder="Company"
                              value={exp.company || ''}
                              onChange={(e) => {
                                const newExp = [...profileData.workExperience]
                                newExp[index] = { ...newExp[index], company: e.target.value }
                                setProfileData(prev => ({ ...prev, workExperience: newExp }))
                              }}
                              className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <input
                              type="text"
                              placeholder="Start Date (e.g., Jan 2020)"
                              value={exp.startDate || ''}
                              onChange={(e) => {
                                const newExp = [...profileData.workExperience]
                                newExp[index] = { ...newExp[index], startDate: e.target.value }
                                setProfileData(prev => ({ ...prev, workExperience: newExp }))
                              }}
                              className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                              type="text"
                              placeholder="End Date (e.g., Present)"
                              value={exp.endDate || ''}
                              onChange={(e) => {
                                const newExp = [...profileData.workExperience]
                                newExp[index] = { ...newExp[index], endDate: e.target.value }
                                setProfileData(prev => ({ ...prev, workExperience: newExp }))
                              }}
                              className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <textarea
                            placeholder="Description of your role and achievements..."
                            value={exp.description || ''}
                            onChange={(e) => {
                              const newExp = [...profileData.workExperience]
                              newExp[index] = { ...newExp[index], description: e.target.value }
                              setProfileData(prev => ({ ...prev, workExperience: newExp }))
                            }}
                            rows={3}
                            className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      ))}
                      {profileData.workExperience.length === 0 && (
                        <div className="text-center py-8 text-gray-400">
                          <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No work experience added yet</p>
                          <p className="text-sm">Click "Add Experience" to get started</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Projects */}
                  <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-700">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-white">Projects</h2>
                        <button
                          onClick={() => addArrayItem('projects')}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm flex items-center space-x-2"
                        >
                          <Plus className="h-4 w-4" />
                          <span>Add Project</span>
                        </button>
                      </div>
                    </div>
                    <div className="p-6 space-y-6">
                      {profileData.projects.map((project, index) => (
                        <div key={index} className="p-4 bg-gray-700 rounded-lg relative">
                          <button
                            onClick={() => removeArrayItem('projects', index)}
                            className="absolute top-2 right-2 text-gray-400 hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <input
                              type="text"
                              placeholder="Project Name"
                              value={project.name || ''}
                              onChange={(e) => {
                                const newProjects = [...profileData.projects]
                                newProjects[index] = { ...newProjects[index], name: e.target.value }
                                setProfileData(prev => ({ ...prev, projects: newProjects }))
                              }}
                              className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                              type="url"
                              placeholder="Project URL (optional)"
                              value={project.url || ''}
                              onChange={(e) => {
                                const newProjects = [...profileData.projects]
                                newProjects[index] = { ...newProjects[index], url: e.target.value }
                                setProfileData(prev => ({ ...prev, projects: newProjects }))
                              }}
                              className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <input
                            type="text"
                            placeholder="Technologies used (e.g., React, Node.js, Python)"
                            value={project.technologies || ''}
                            onChange={(e) => {
                              const newProjects = [...profileData.projects]
                              newProjects[index] = { ...newProjects[index], technologies: e.target.value }
                              setProfileData(prev => ({ ...prev, projects: newProjects }))
                            }}
                            className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                          />
                          <textarea
                            placeholder="Project description and your role..."
                            value={project.description || ''}
                            onChange={(e) => {
                              const newProjects = [...profileData.projects]
                              newProjects[index] = { ...newProjects[index], description: e.target.value }
                              setProfileData(prev => ({ ...prev, projects: newProjects }))
                            }}
                            rows={3}
                            className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      ))}
                      {profileData.projects.length === 0 && (
                        <div className="text-center py-8 text-gray-400">
                          <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No projects added yet</p>
                          <p className="text-sm">Click "Add Project" to showcase your work</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Skills & Education Tab */}
              {activeTab === 'skills' && user.role === 'candidate' && (
                <div className="space-y-8">
                  {/* Skills */}
                  <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-700">
                      <h2 className="text-xl font-semibold text-white">Skills</h2>
                    </div>
                    <div className="p-6 space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Technical Skills (comma-separated)
                        </label>
                        <textarea
                          value={profileData.skills.join(', ')}
                          onChange={(e) => handleSkillsChange(e.target.value)}
                          rows={3}
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., JavaScript, React, Node.js, Python, SQL, AWS"
                        />
                        <p className="text-xs text-gray-500 mt-1">Separate skills with commas</p>
                      </div>
                      
                      {profileData.skills.length > 0 && (
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Skills Preview</label>
                          <div className="flex flex-wrap gap-2">
                            {profileData.skills.map((skill, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-blue-600/20 border border-blue-500/30 rounded-full text-blue-400 text-sm"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Education */}
                  <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-700">
                      <h2 className="text-xl font-semibold text-white">Education</h2>
                    </div>
                    <div className="p-6">
                      <textarea
                        name="education"
                        value={profileData.education}
                        onChange={handleProfileInputChange}
                        rows={4}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Education background (degree, institution, year, relevant coursework, etc.)"
                      />
                    </div>
                  </div>

                  {/* Certifications */}
                  <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-700">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-white">Certifications</h2>
                        <button
                          onClick={() => addArrayItem('certifications')}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm flex items-center space-x-2"
                        >
                          <Plus className="h-4 w-4" />
                          <span>Add Certification</span>
                        </button>
                      </div>
                    </div>
                    <div className="p-6 space-y-4">
                      {profileData.certifications.map((cert, index) => (
                        <div key={index} className="flex space-x-2">
                          <input
                            type="text"
                            value={cert}
                            onChange={(e) => handleArrayChange('certifications', index, e.target.value)}
                            className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Certification name and issuing organization"
                          />
                          <button
                            onClick={() => removeArrayItem('certifications', index)}
                            className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      {profileData.certifications.length === 0 && (
                        <div className="text-center py-8 text-gray-400">
                          <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No certifications added yet</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Languages */}
                  <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-700">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-white">Languages</h2>
                        <button
                          onClick={() => addArrayItem('languages')}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm flex items-center space-x-2"
                        >
                          <Plus className="h-4 w-4" />
                          <span>Add Language</span>
                        </button>
                      </div>
                    </div>
                    <div className="p-6 space-y-4">
                      {profileData.languages.map((lang, index) => (
                        <div key={index} className="flex space-x-2">
                          <input
                            type="text"
                            value={lang}
                            onChange={(e) => handleArrayChange('languages', index, e.target.value)}
                            className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Language and proficiency level (e.g., English - Native, Spanish - Fluent)"
                          />
                          <button
                            onClick={() => removeArrayItem('languages', index)}
                            className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      {profileData.languages.length === 0 && (
                        <div className="text-center py-8 text-gray-400">
                          <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No languages added yet</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Job Preferences Tab */}
              {activeTab === 'preferences' && user.role === 'candidate' && (
                <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-700">
                    <h2 className="text-xl font-semibold text-white">Job Preferences</h2>
                  </div>
                  <div className="p-6 space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Preferred Roles</label>
                      <textarea
                        value={profileData.preferredRoles.join(', ')}
                        onChange={(e) => {
                          const roles = e.target.value.split(',').map(r => r.trim()).filter(r => r.length > 0)
                          setProfileData(prev => ({ ...prev, preferredRoles: roles }))
                        }}
                        rows={2}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Software Engineer, Frontend Developer, Full Stack Developer"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Salary Expectation</label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            name="salaryExpectation"
                            value={profileData.salaryExpectation}
                            onChange={handleProfileInputChange}
                            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., $80,000 - $120,000"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Availability</label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <select
                            name="availability"
                            value={profileData.availability}
                            onChange={handleProfileInputChange}
                            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select availability</option>
                            <option value="immediately">Immediately</option>
                            <option value="2-weeks">2 weeks notice</option>
                            <option value="1-month">1 month</option>
                            <option value="2-months">2 months</option>
                            <option value="flexible">Flexible</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Work Authorization</label>
                      <select
                        name="workAuthorization"
                        value={profileData.workAuthorization}
                        onChange={handleProfileInputChange}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select work authorization</option>
                        <option value="us-citizen">US Citizen</option>
                        <option value="permanent-resident">Permanent Resident</option>
                        <option value="h1b">H1B Visa</option>
                        <option value="opt">OPT</option>
                        <option value="f1">F1 Student</option>
                        <option value="other">Other</option>
                        <option value="require-sponsorship">Require Sponsorship</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Profile Button for candidates */}
              {user.role === 'candidate' && activeTab !== 'basic' && (
                <div className="flex justify-end mt-8">
                  <button
                    onClick={saveProfile}
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>{loading ? 'Saving...' : 'Save Profile'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Account Info */}
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Account Information</h3>
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

              {/* Password Change Section */}
              <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-700">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-white">Security</h2>
                    <button
                      onClick={() => setIsChangingPassword(!isChangingPassword)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                    >
                      {isChangingPassword ? 'Cancel' : 'Change Password'}
                    </button>
                  </div>
                </div>

                {isChangingPassword && (
                  <form onSubmit={handlePasswordChange} className="p-6 space-y-6">
                    {/* Current Password */}
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          id="currentPassword"
                          name="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-12 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

                    {/* New Password */}
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          id="newPassword"
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-12 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

                    {/* Confirm New Password */}
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-12 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors flex items-center space-x-2"
                      >
                        <Save className="h-4 w-4" />
                        <span>{loading ? 'Updating...' : 'Update'}</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Profile Completion for Candidates */}
              {user.role === 'candidate' && (
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Profile Completion</h3>
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400 text-sm">Profile Progress</span>
                      <span className="text-blue-400 text-sm font-medium">{profileCompletion}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${profileCompletion}%` }}
                      ></div>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">
                    Complete your profile to improve assessment accuracy and recruiter matching.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${profileData.firstName && profileData.lastName ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                      <span className="text-gray-300">Personal Info</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${profileData.skills.length > 0 ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                      <span className="text-gray-300">Skills</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${profileData.workExperience.length > 0 ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                      <span className="text-gray-300">Work Experience</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${profileData.education ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                      <span className="text-gray-300">Education</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
