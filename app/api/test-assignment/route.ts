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

    await dbConnect()

    // Create sample data for testing
    const sampleQuestions = [
      {
        id: 1,
        question: "What is React and how does it differ from vanilla JavaScript?",
        type: "text",
        points: 10
      },
      {
        id: 2,
        question: "Explain the concept of state management in modern web applications.",
        type: "text",
        points: 15
      },
      {
        id: 3,
        question: "What are the benefits of using TypeScript over JavaScript?",
        type: "text",
        points: 10
      }
    ]

    // Create a test assessment if it doesn't exist
    let testAssessment = await Assessment.findOne({ title: 'Test Frontend Assessment' })
    
    if (!testAssessment) {
      testAssessment = await Assessment.create({
        title: 'Test Frontend Assessment',
        company: 'Test Company',
        description: 'A sample assessment for testing the assignment system',
        questions: sampleQuestions,
        createdBy: session.user.id,
        duration: 30,
        type: 'traditional',
        isActive: true
      })
    }

    // Find or create a test candidate
    let testCandidate = await User.findOne({ role: 'candidate' })
    
    if (!testCandidate) {
      return NextResponse.json({ 
        error: 'No candidate users found. Please create a candidate account first.',
        assessment: testAssessment 
      }, { status: 400 })
    }

    // Create a test assignment if it doesn't exist
    const existingAssignment = await AssessmentAssignment.findOne({
      assessmentId: testAssessment._id,
      candidateId: testCandidate._id
    })

    if (!existingAssignment) {
      const dueDate = new Date()
      dueDate.setDate(dueDate.getDate() + 7) // Due in 7 days

      await AssessmentAssignment.create({
        assessmentId: testAssessment._id,
        candidateId: testCandidate._id,
        assignedBy: session.user.id,
        status: 'assigned',
        dueDate,
        isActive: true
      })
    }

    return NextResponse.json({
      message: 'Test data created successfully',
      assessment: testAssessment,
      candidate: {
        id: testCandidate._id,
        name: testCandidate.name,
        email: testCandidate.email
      }
    })

  } catch (error: any) {
    console.error('Error creating test data:', error)
    return NextResponse.json(
      { error: 'Failed to create test data: ' + error.message },
      { status: 500 }
    )
  }
}
