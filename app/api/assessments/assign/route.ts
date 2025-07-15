import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import { Assessment, User, AssessmentAssignment } from '@/models'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only recruiters can assign assessments
    if (session.user.role !== 'recruiter') {
      return NextResponse.json({ error: 'Forbidden - Only recruiters can assign assessments' }, { status: 403 })
    }

    await dbConnect()

    const body = await request.json()
    const { assessmentId, candidateIds, dueDate } = body

    if (!assessmentId || !candidateIds || !Array.isArray(candidateIds) || candidateIds.length === 0) {
      return NextResponse.json({ error: 'Assessment ID and candidate IDs are required' }, { status: 400 })
    }

    if (!dueDate) {
      return NextResponse.json({ error: 'Due date is required' }, { status: 400 })
    }

    // Verify the assessment exists and belongs to the recruiter
    const assessment = await Assessment.findOne({
      _id: assessmentId,
      createdBy: session.user.id
    })

    if (!assessment) {
      return NextResponse.json({ error: 'Assessment not found or unauthorized' }, { status: 404 })
    }

    // Verify all candidates exist and are candidates
    const candidates = await User.find({
      _id: { $in: candidateIds },
      role: 'candidate'
    })

    if (candidates.length !== candidateIds.length) {
      return NextResponse.json({ error: 'Some candidates not found or not valid candidates' }, { status: 400 })
    }

    // Create assignments (using upsert to avoid duplicates)
    const assignments = []
    for (const candidateId of candidateIds) {
      try {
        const assignment = await AssessmentAssignment.findOneAndUpdate(
          {
            assessmentId,
            candidateId
          },
          {
            assessmentId,
            candidateId,
            assignedBy: session.user.id,
            dueDate: new Date(dueDate),
            status: 'assigned',
            isActive: true,
            assignedAt: new Date()
          },
          {
            upsert: true,
            new: true,
            runValidators: true
          }
        )
        assignments.push(assignment)
      } catch (error: any) {
        console.error('Error creating assignment:', error)
        // Continue with other assignments even if one fails
      }
    }

    return NextResponse.json({
      message: `Assessment assigned to ${assignments.length} candidates`,
      assignments,
      assessment: {
        id: assessment._id,
        title: assessment.title,
        company: assessment.company
      }
    })

  } catch (error: any) {
    console.error('Error assigning assessment:', error)
    return NextResponse.json(
      { error: 'Failed to assign assessment' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    const { searchParams } = new URL(request.url)
    const assessmentId = searchParams.get('assessmentId')

    if (!assessmentId) {
      return NextResponse.json({ error: 'Assessment ID is required' }, { status: 400 })
    }

    // Verify the assessment exists and belongs to the recruiter (if recruiter)
    if (session.user.role === 'recruiter') {
      const assessment = await Assessment.findOne({
        _id: assessmentId,
        createdBy: session.user.id
      })

      if (!assessment) {
        return NextResponse.json({ error: 'Assessment not found or unauthorized' }, { status: 404 })
      }
    }

    // Get all assignments for this assessment
    const assignments = await AssessmentAssignment.find({
      assessmentId,
      isActive: true
    })
    .populate('candidateId', 'name email')
    .populate('assignedBy', 'name email')
    .sort({ createdAt: -1 })

    return NextResponse.json({ assignments })

  } catch (error: any) {
    console.error('Error fetching assignments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch assignments' },
      { status: 500 }
    )
  }
}
