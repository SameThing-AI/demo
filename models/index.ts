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
    enum: ['traditional', 'creative', 'self-modifying', 'video', 'audio', 'multi-modal'],
    default: 'traditional',
  },
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

export const User = mongoose.models.User || mongoose.model('User', userSchema)
export const Assessment = mongoose.models.Assessment || mongoose.model('Assessment', assessmentSchema)
export const CandidateResponse = mongoose.models.CandidateResponse || mongoose.model('CandidateResponse', candidateResponseSchema)
