import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    select: false, // Don't include password in queries by default
  },
  image: {
    type: String,
  },
  role: {
    type: String,
    enum: ['recruiter', 'candidate'],
    required: true,
  },
  company: {
    type: String,
    required: function(this: any) {
      return this.role === 'recruiter'
    }
  },
  emailVerified: {
    type: Date,
  },
  // Profile fields for candidates
  profile: {
    firstName: String,
    lastName: String,
    phone: String,
    location: String,
    summary: String,
    experience: String,
    skills: [String],
    education: String,
    linkedinUrl: String,
    githubUrl: String,
    portfolioUrl: String,
    resume: String, // URL to uploaded resume
    preferredRoles: [String],
    salaryExpectation: String,
    availability: String,
    workAuthorization: String,
    languages: [String],
    certifications: [String],
    projects: [{
      name: String,
      description: String,
      technologies: [String],
      url: String,
      startDate: Date,
      endDate: Date,
    }],
    workExperience: [{
      company: String,
      position: String,
      description: String,
      startDate: Date,
      endDate: Date,
      current: Boolean,
    }],
    profileCompletion: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
}, {
  timestamps: true,
})

const assessmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  jobAnalysis: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  questions: [{
    type: mongoose.Schema.Types.Mixed,
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  duration: {
    type: Number,
    default: 60, // minutes
  },
  type: {
    type: String,
    enum: ['traditional', 'revolutionary-ai', 'creative', 'self-modifying', 'video', 'audio', 'multi-modal', 'revolutionary'],
    default: 'traditional',
  },
  // AI-Generated Assessment Fields
  assessmentType: String, // Type from AI generator
  assessmentInterface: mongoose.Schema.Types.Mixed, // Complete AI interface specification
  scenarios: mongoose.Schema.Types.Mixed, // AI-generated scenarios
  revolutionaryTitle: String,
  instructions: String,
  totalTime: Number,
  aiAssistanceMode: String,
  uniqueFeatures: [String],
  criteria: mongoose.Schema.Types.Mixed,
  generated: Boolean, // Whether this was AI-generated
  aiGeneratedAt: Date, // When AI generation occurred
  
  // Existing fields
  creativeType: String,
  scenario: String,
  concept: mongoose.Schema.Types.Mixed,
  selfModifying: {
    type: Boolean,
    default: false,
  },
  modalType: {
    type: String,
    enum: ['video', 'audio', 'both'],
  },
  videoInstructions: String,
  audioInstructions: String,
  isActive: {
    type: Boolean,
    default: true,
  },
  status: {
    type: String,
    enum: ['active', 'closed', 'archived', 'draft'],
    default: 'active',
  },
}, {
  timestamps: true,
})

const assessmentAssignmentSchema = new mongoose.Schema({
  assessmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessment',
    required: true,
  },
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['assigned', 'started', 'completed', 'expired'],
    default: 'assigned',
  },
  dueDate: {
    type: Date,
    required: true,
  },
  assignedAt: {
    type: Date,
    default: Date.now,
  },
  startedAt: Date,
  completedAt: Date,
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
})

const candidateResponseSchema = new mongoose.Schema({
  assessmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessment',
    required: true,
  },
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  candidateName: {
    type: String,
    required: true,
  },
  candidateEmail: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    min: 0,
    max: 100,
  },
  answers: [{
    type: mongoose.Schema.Types.Mixed,
  }],
  feedback: {
    type: mongoose.Schema.Types.Mixed,
  },
  status: {
    type: String,
    enum: ['started', 'in-progress', 'completed', 'abandoned'],
    default: 'started',
  },
  startedAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: Date,
  timeSpent: Number, // in minutes
}, {
  timestamps: true,
})

// Add indexes for better performance
// Note: email index is already created by unique: true in schema definition
assessmentSchema.index({ createdBy: 1, createdAt: -1 })
candidateResponseSchema.index({ assessmentId: 1, candidateId: 1 })
candidateResponseSchema.index({ candidateId: 1, createdAt: -1 })
assessmentAssignmentSchema.index({ candidateId: 1, status: 1 })
assessmentAssignmentSchema.index({ assessmentId: 1, assignedBy: 1 })
assessmentAssignmentSchema.index({ candidateId: 1, assessmentId: 1 }, { unique: true })

export const User = mongoose.models.User || mongoose.model('User', userSchema)
export const Assessment = mongoose.models.Assessment || mongoose.model('Assessment', assessmentSchema)
export const CandidateResponse = mongoose.models.CandidateResponse || mongoose.model('CandidateResponse', candidateResponseSchema)
export const AssessmentAssignment = mongoose.models.AssessmentAssignment || mongoose.model('AssessmentAssignment', assessmentAssignmentSchema)
