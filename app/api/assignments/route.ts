import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import { AssessmentAssignment } from '@/models'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only candidates can view their assigned assessments
    if (session.user.role !== 'candidate') {
      return NextResponse.json({ error: 'Forbidden - Only candidates can view assigned assessments' }, { status: 403 })
    }

    await dbConnect()

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'all'

    // Build query based on status filter
    const query: any = {
      candidateId: session.user.id,
      isActive: true
    }

    if (status !== 'all') {
      query.status = status
    }

    // Get all assignments for this candidate
    const assignments = await AssessmentAssignment.find(query)
      .populate('assessmentId', 'title description company duration type questions createdBy isActive')
      .populate('assignedBy', 'name company')
      .sort({ createdAt: -1 })

    // Filter out assignments where assessment doesn't exist (deleted assessments)
    const validAssignments = assignments.filter(assignment => assignment.assessmentId)

    return NextResponse.json({ 
      assignments: validAssignments,
      total: validAssignments.length 
    })

  } catch (error: any) {
    console.error('Error fetching assigned assessments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch assigned assessments' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only candidates can update their assignment status
    if (session.user.role !== 'candidate') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await dbConnect()

    const body = await request.json()
    const { assignmentId, status } = body

    if (!assignmentId || !status) {
      return NextResponse.json({ error: 'Assignment ID and status are required' }, { status: 400 })
    }

    if (!['started', 'completed'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    // Update the assignment status
    const updateData: any = { status }
    
    if (status === 'started' && !updateData.startedAt) {
      updateData.startedAt = new Date()
    } else if (status === 'completed') {
      updateData.completedAt = new Date()
    }

    const assignment = await AssessmentAssignment.findOneAndUpdate(
      {
        _id: assignmentId,
        candidateId: session.user.id,
        isActive: true
      },
      updateData,
      { new: true }
    ).populate('assessmentId', 'title description company')

    if (!assignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 })
    }

    return NextResponse.json({ 
      message: 'Assignment status updated',
      assignment 
    })

  } catch (error: any) {
    console.error('Error updating assignment:', error)
    return NextResponse.json(
      { error: 'Failed to update assignment' },
      { status: 500 }
    )
  }
}
