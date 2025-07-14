import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import { CandidateResponse, Assessment } from '@/models'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    const { searchParams } = new URL(request.url)
    const assessmentId = searchParams.get('assessmentId')
    const candidateId = searchParams.get('candidateId')

    let responses

    if (session.user.role === 'recruiter') {
      // Recruiters can see responses to their assessments
      const query: any = {}
      
      if (assessmentId) {
        // Verify the recruiter owns this assessment
        const assessment = await Assessment.findById(assessmentId)
        if (!assessment || assessment.createdBy.toString() !== session.user.id) {
          return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }
        query.assessmentId = assessmentId
      } else {
        // Get all assessments by this recruiter
        const assessments = await Assessment.find({ createdBy: session.user.id })
        query.assessmentId = { $in: assessments.map(a => a._id) }
      }

      if (candidateId) {
        query.candidateId = candidateId
      }

      responses = await CandidateResponse.find(query)
        .populate('assessmentId', 'title company type')
        .populate('candidateId', 'name email')
        .sort({ createdAt: -1 })
    } else {
      // Candidates see only their own responses
      const query: any = { candidateId: session.user.id }
      
      if (assessmentId) {
        query.assessmentId = assessmentId
      }

      responses = await CandidateResponse.find(query)
        .populate('assessmentId', 'title company type')
        .sort({ createdAt: -1 })
    }

    const formattedResponses = responses.map(response => ({
      id: response._id.toString(),
      assessmentId: response.assessmentId._id.toString(),
      candidateId: response.candidateId.toString(),
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
    }))

    return NextResponse.json(formattedResponses)

  } catch (error) {
    console.error('Error fetching responses:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id || session.user.role !== 'candidate') {
      return NextResponse.json({ error: 'Unauthorized - Candidates only' }, { status: 401 })
    }

    await dbConnect()

    const responseData = await request.json()

    // Verify the assessment exists and is active
    const assessment = await Assessment.findById(responseData.assessmentId)
    if (!assessment || !assessment.isActive) {
      return NextResponse.json({ error: 'Assessment not found or inactive' }, { status: 404 })
    }

    // Check if response already exists
    const existingResponse = await CandidateResponse.findOne({
      assessmentId: responseData.assessmentId,
      candidateId: session.user.id
    })

    if (existingResponse) {
      return NextResponse.json({ error: 'Response already exists for this assessment' }, { status: 409 })
    }

    const response = await CandidateResponse.create({
      ...responseData,
      candidateId: session.user.id,
      candidateName: session.user.name,
      candidateEmail: session.user.email,
    })

    const populatedResponse = await CandidateResponse.findById(response._id)
      .populate('assessmentId', 'title company type')

    const formattedResponse = {
      id: populatedResponse._id.toString(),
      assessmentId: populatedResponse.assessmentId._id.toString(),
      candidateId: populatedResponse.candidateId.toString(),
      candidateName: populatedResponse.candidateName,
      candidateEmail: populatedResponse.candidateEmail,
      score: populatedResponse.score,
      answers: populatedResponse.answers,
      feedback: populatedResponse.feedback,
      status: populatedResponse.status,
      startedAt: populatedResponse.startedAt.toISOString(),
      completedAt: populatedResponse.completedAt?.toISOString(),
      timeSpent: populatedResponse.timeSpent,
    }

    return NextResponse.json(formattedResponse, { status: 201 })

  } catch (error) {
    console.error('Error creating response:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
