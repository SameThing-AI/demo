import { NextRequest, NextResponse } from 'next/server'
import bcryptjs from 'bcryptjs'
import dbConnect from '@/lib/mongodb'
import { User } from '@/models'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role, company } = await request.json()

    // Validation
    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!['recruiter', 'candidate'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }

    if (role === 'recruiter' && !company) {
      return NextResponse.json({ error: 'Company is required for recruiters' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
    }

    await dbConnect()

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists with this email' }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 12)

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      ...(company && { company }),
      emailVerified: new Date(), // Consider implementing email verification later
    })

    // Return user data (without password)
    const userData = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      company: user.company,
    }

    return NextResponse.json({ 
      message: 'User created successfully',
      user: userData
    }, { status: 201 })

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
