import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import { User } from '@/models'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()
    
    const user = await User.findOne({ email: session.user.email })
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Return user profile with profile completion calculation
    const profileData = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      image: user.image,
      role: user.role,
      company: user.company,
      profile: user.profile || {},
      profileCompletion: calculateProfileCompletion(user)
    }

    return NextResponse.json(profileData)

  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { role, company, name } = await request.json()

    if (role && !['recruiter', 'candidate'].includes(role)) {
      return NextResponse.json({ error: 'Valid role is required' }, { status: 400 })
    }

    if (role === 'recruiter' && !company) {
      return NextResponse.json({ error: 'Company is required for recruiters' }, { status: 400 })
    }

    await dbConnect()

    const updateData: any = {}
    if (role) updateData.role = role
    if (company) updateData.company = company
    if (name) updateData.name = name

    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      updateData,
      { new: true }
    )

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      id: updatedUser._id.toString(),
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      company: updatedUser.company,
    })

  } catch (error) {
    console.error('Error updating user profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { profile, name, image } = body

    await dbConnect()
    
    const user = await User.findOne({ email: session.user.email })
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Update user fields
    const updateData: any = {}
    
    if (name !== undefined) updateData.name = name
    if (image !== undefined) updateData.image = image
    
    if (profile) {
      // Merge with existing profile data
      updateData.profile = {
        ...user.profile?.toObject?.() || {},
        ...profile,
        lastUpdated: new Date(),
      }
    }

    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      updateData,
      { new: true, runValidators: true }
    )

    if (!updatedUser) {
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
    }

    // Calculate and update profile completion
    const profileCompletion = calculateProfileCompletion(updatedUser)
    await User.findByIdAndUpdate(updatedUser._id, {
      'profile.profileCompletion': profileCompletion
    })

    const responseData = {
      id: updatedUser._id.toString(),
      name: updatedUser.name,
      email: updatedUser.email,
      image: updatedUser.image,
      role: updatedUser.role,
      company: updatedUser.company,
      profile: updatedUser.profile,
      profileCompletion
    }

    return NextResponse.json(responseData)

  } catch (error) {
    console.error('Error updating user profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function calculateProfileCompletion(user: any): number {
  if (user.role !== 'candidate') return 100 // Only calculate for candidates
  
  const profile = user.profile || {}
  const fields = [
    'firstName',
    'lastName',
    'phone',
    'location',
    'summary',
    'experience',
    'skills',
    'education',
  ]
  
  const optionalFields = [
    'linkedinUrl',
    'githubUrl',
    'portfolioUrl',
    'resume',
    'preferredRoles',
    'workExperience',
    'projects'
  ]
  
  let completedRequired = 0
  let completedOptional = 0
  
  // Check required fields
  fields.forEach(field => {
    const value = profile[field]
    if (value && (Array.isArray(value) ? value.length > 0 : value.toString().trim().length > 0)) {
      completedRequired++
    }
  })
  
  // Check optional fields
  optionalFields.forEach(field => {
    const value = profile[field]
    if (value && (Array.isArray(value) ? value.length > 0 : value.toString().trim().length > 0)) {
      completedOptional++
    }
  })
  
  // Base score from required fields (80% max)
  const requiredScore = (completedRequired / fields.length) * 80
  
  // Bonus score from optional fields (20% max)
  const optionalScore = (completedOptional / optionalFields.length) * 20
  
  return Math.round(requiredScore + optionalScore)
}
