import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import { CandidateResponse, Assessment } from '@/models'

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

    const response = await CandidateResponse.findById(params.id)
      .populate('assessmentId', 'title company type createdBy')
      .populate('candidateId', 'name email')

    if (!response) {
      return NextResponse.json({ error: 'Response not found' }, { status: 404 })
    }

    // Check permissions
    if (session.user.role === 'candidate' && response.candidateId._id.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    if (session.user.role === 'recruiter' && response.assessmentId.createdBy.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const formattedResponse = {
      id: response._id.toString(),
      assessmentId: response.assessmentId._id.toString(),
      candidateId: response.candidateId._id.toString(),
      candidateName: response.candidateName,
      candidateEmail: response.candidateEmail,
      score: response.score,
      answers: response.answers,
      feedback: response.feedback,
      status: response.status,
      startedAt: response.startedAt.toISOString(),
      completedAt: response.completedAt?.toISOString(),
      timeSpent: response.timeSpent,
      assessment: {
        title: response.assessmentId.title,
        company: response.assessmentId.company,
        type: response.assessmentId.type,
      }
    }

    return NextResponse.json(formattedResponse)

  } catch (error) {
    console.error('Error fetching response:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    const response = await CandidateResponse.findById(params.id)

    if (!response) {
      return NextResponse.json({ error: 'Response not found' }, { status: 404 })
    }

    // Check permissions - candidates can only update their own responses
    if (session.user.role === 'candidate' && response.candidateId.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Recruiters can update scores and feedback for responses to their assessments
    if (session.user.role === 'recruiter') {
      const assessment = await Assessment.findById(response.assessmentId)
      if (!assessment || assessment.createdBy.toString() !== session.user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    const updateData = await request.json()
    
    const updatedResponse = await CandidateResponse.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true }
    ).populate('assessmentId', 'title company type')

    const formattedResponse = {
      id: updatedResponse._id.toString(),
      assessmentId: updatedResponse.assessmentId._id.toString(),
      candidateId: updatedResponse.candidateId.toString(),
      candidateName: updatedResponse.candidateName,
      candidateEmail: updatedResponse.candidateEmail,
      score: updatedResponse.score,
      answers: updatedResponse.answers,
      feedback: updatedResponse.feedback,
      status: updatedResponse.status,
      startedAt: updatedResponse.startedAt.toISOString(),
      completedAt: updatedResponse.completedAt?.toISOString(),
      timeSpent: updatedResponse.timeSpent,
    }

    return NextResponse.json(formattedResponse)

  } catch (error) {
    console.error('Error updating response:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
