import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import { Assessment } from '@/models'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id || session.user.role !== 'recruiter') {
      return NextResponse.json({ error: 'Unauthorized - Recruiters only' }, { status: 401 })
    }

    const body = await request.json()
    const { action, assessmentIds } = body

    if (!action || !assessmentIds || !Array.isArray(assessmentIds)) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 })
    }

    await dbConnect()

    // Verify all assessments belong to the current user
    const assessments = await Assessment.find({
      _id: { $in: assessmentIds },
      createdBy: session.user.id
    })

    if (assessments.length !== assessmentIds.length) {
      return NextResponse.json({ error: 'Some assessments not found or unauthorized' }, { status: 403 })
    }

    let updateData: any = {}
    let message = ''

    switch (action) {
      case 'delete':
        updateData = { isActive: false }
        message = `${assessmentIds.length} assessment(s) deleted successfully`
        break
      
      case 'close':
        updateData = { status: 'closed' }
        message = `${assessmentIds.length} assessment(s) closed successfully`
        break
        
      case 'activate':
        updateData = { status: 'active', isActive: true }
        message = `${assessmentIds.length} assessment(s) activated successfully`
        break
        
      case 'archive':
        updateData = { status: 'archived' }
        message = `${assessmentIds.length} assessment(s) archived successfully`
        break
        
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    // Perform bulk update
    await Assessment.updateMany(
      { _id: { $in: assessmentIds }, createdBy: session.user.id },
      updateData
    )

    return NextResponse.json({ 
      message,
      updatedCount: assessmentIds.length
    })

  } catch (error) {
    console.error('Error performing bulk action:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
