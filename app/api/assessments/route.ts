import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import { Assessment } from '@/models'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    const { searchParams } = new URL(request.url)
    const role = session.user.role

    let assessments

    if (role === 'recruiter') {
      // Recruiters see only their own active assessments
      assessments = await Assessment.find({ 
        createdBy: session.user.id,
        isActive: true 
      })
        .populate('createdBy', 'name email company')
        .sort({ createdAt: -1 })
    } else {
      // Candidates see all active assessments (for now)
      assessments = await Assessment.find({ isActive: true })
        .populate('createdBy', 'name email company')
        .sort({ createdAt: -1 })
    }

    const formattedAssessments = assessments.map(assessment => ({
      id: assessment._id.toString(),
      title: assessment.title,
      company: assessment.company,
      description: assessment.description,
      questions: assessment.questions,
      createdAt: assessment.createdAt.toISOString(),
      createdBy: assessment.createdBy._id.toString(),
      duration: assessment.duration,
      type: assessment.type,
      creativeType: assessment.creativeType,
      scenario: assessment.scenario,
      concept: assessment.concept,
      selfModifying: assessment.selfModifying,
      modalType: assessment.modalType,
      videoInstructions: assessment.videoInstructions,
      audioInstructions: assessment.audioInstructions,
      isActive: assessment.isActive,
      status: assessment.status,
    }))

    return NextResponse.json(formattedAssessments)

  } catch (error) {
    console.error('Error fetching assessments:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id || session.user.role !== 'recruiter') {
      return NextResponse.json({ error: 'Unauthorized - Recruiters only' }, { status: 401 })
    }

    await dbConnect()

    const assessmentData = await request.json()

    const assessment = await Assessment.create({
      ...assessmentData,
      createdBy: session.user.id,
    })

    const populatedAssessment = await Assessment.findById(assessment._id)
      .populate('createdBy', 'name email company')

    const formattedAssessment = {
      id: populatedAssessment._id.toString(),
      title: populatedAssessment.title,
      company: populatedAssessment.company,
      description: populatedAssessment.description,
      questions: populatedAssessment.questions,
      createdAt: populatedAssessment.createdAt.toISOString(),
      createdBy: populatedAssessment.createdBy._id.toString(),
      duration: populatedAssessment.duration,
      type: populatedAssessment.type,
      creativeType: populatedAssessment.creativeType,
      scenario: populatedAssessment.scenario,
      concept: populatedAssessment.concept,
      selfModifying: populatedAssessment.selfModifying,
      modalType: populatedAssessment.modalType,
      videoInstructions: populatedAssessment.videoInstructions,
      audioInstructions: populatedAssessment.audioInstructions,
    }

    return NextResponse.json(formattedAssessment, { status: 201 })

  } catch (error) {
    console.error('Error creating assessment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
