import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import { Assessment } from '@/models'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    const assessment = await Assessment.findById(params.id)
      .populate('createdBy', 'name email company')

    if (!assessment || !assessment.isActive) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 })
    }

    // Check permissions
    if (session.user.role === 'recruiter' && assessment.createdBy._id.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const formattedAssessment = {
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
    }

    return NextResponse.json(formattedAssessment)

  } catch (error) {
    console.error('Error fetching assessment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id || session.user.role !== 'recruiter') {
      return NextResponse.json({ error: 'Unauthorized - Recruiters only' }, { status: 401 })
    }

    await dbConnect()

    const assessment = await Assessment.findById(params.id)

    if (!assessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 })
    }

    if (assessment.createdBy.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const updateData = await request.json()
    
    const updatedAssessment = await Assessment.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true }
    ).populate('createdBy', 'name email company')

    const formattedAssessment = {
      id: updatedAssessment._id.toString(),
      title: updatedAssessment.title,
      company: updatedAssessment.company,
      description: updatedAssessment.description,
      questions: updatedAssessment.questions,
      createdAt: updatedAssessment.createdAt.toISOString(),
      createdBy: updatedAssessment.createdBy._id.toString(),
      duration: updatedAssessment.duration,
      type: updatedAssessment.type,
      creativeType: updatedAssessment.creativeType,
      scenario: updatedAssessment.scenario,
      concept: updatedAssessment.concept,
      selfModifying: updatedAssessment.selfModifying,
      modalType: updatedAssessment.modalType,
      videoInstructions: updatedAssessment.videoInstructions,
      audioInstructions: updatedAssessment.audioInstructions,
    }

    return NextResponse.json(formattedAssessment)

  } catch (error) {
    console.error('Error updating assessment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id || session.user.role !== 'recruiter') {
      return NextResponse.json({ error: 'Unauthorized - Recruiters only' }, { status: 401 })
    }

    await dbConnect()

    const assessment = await Assessment.findById(params.id)

    if (!assessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 })
    }

    if (assessment.createdBy.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await Assessment.findByIdAndUpdate(params.id, { isActive: false })

    return NextResponse.json({ message: 'Assessment deleted successfully' })

  } catch (error) {
    console.error('Error deleting assessment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
