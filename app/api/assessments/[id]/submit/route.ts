import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import { Assessment, CandidateResponse } from '@/models'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { answers, timeSpent, finalScore } = await request.json()
    const assessmentId = params.id

    await dbConnect()

    // Get the assessment
    const assessment = await Assessment.findById(assessmentId)
    if (!assessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 })
    }

    // Find existing response or create new one
    let response = await CandidateResponse.findOne({
      assessmentId,
      candidateId: session.user.id
    })

    if (response) {
      // Update existing response
      response.answers = answers
      response.timeSpent = timeSpent
      response.score = finalScore || 0
      response.status = 'completed'
      response.completedAt = new Date()
      await response.save()
    } else {
      // Create new response
      response = new CandidateResponse({
        assessmentId,
        candidateId: session.user.id,
        candidateName: session.user.name || 'Anonymous',
        candidateEmail: session.user.email || '',
        answers,
        timeSpent: timeSpent || 0,
        score: finalScore || 0,
        status: 'completed',
        startedAt: new Date(),
        completedAt: new Date()
      })
      await response.save()
    }

    console.log('✅ Assessment submission saved:', {
      assessmentId,
      candidateId: session.user.id,
      score: finalScore,
      answersCount: answers?.length || 0
    })

    return NextResponse.json({
      success: true,
      responseId: response._id,
      score: finalScore,
      message: 'Assessment submitted successfully'
    })

  } catch (error) {
    console.error('❌ Assessment submission error:', error)
    return NextResponse.json(
      { error: 'Failed to submit assessment' },
      { status: 500 }
    )
  }
}
