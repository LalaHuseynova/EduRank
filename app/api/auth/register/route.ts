import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, validateADAEmail, generateToken } from '@/lib/auth'
import { registerSchema } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    // Check if database is configured
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL is not set in environment variables')
      return NextResponse.json(
        { error: 'Database configuration error. Please check server configuration.' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const validatedData = registerSchema.parse(body)

    // Validate ADA email domain
    if (!validateADAEmail(validatedData.email)) {
      return NextResponse.json(
        { error: 'Only ADA University email addresses are allowed (@ada.edu.az)' },
        { status: 400 }
      )
    }

    // Check if user already exists
    let existingUser
    try {
      existingUser = await prisma.user.findUnique({
        where: { email: validatedData.email },
      })
    } catch (dbError: any) {
      console.error('Database connection error:', dbError)
      return NextResponse.json(
        { 
          error: 'Database connection failed. Please ensure the database is running and properly configured.',
          ...(process.env.NODE_ENV === 'development' && { details: dbError.message })
        },
        { status: 500 }
      )
    }

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(validatedData.password)

    // Create user
    let user
    try {
      user = await prisma.user.create({
        data: {
          email: validatedData.email,
          password: hashedPassword,
          firstName: validatedData.firstName,
          lastName: validatedData.lastName,
          role: validatedData.role || 'STUDENT',
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
        },
      })
    } catch (dbError: any) {
      console.error('Database create error:', dbError)
      // Check for unique constraint violation
      if (dbError.code === 'P2002') {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 409 }
        )
      }
      return NextResponse.json(
        { 
          error: 'Failed to create user. Please try again.',
          ...(process.env.NODE_ENV === 'development' && { details: dbError.message })
        },
        { status: 500 }
      )
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    return NextResponse.json(
      {
        message: 'User registered successfully',
        user,
        token,
      },
      { status: 201 }
    )
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Registration error:', error)
    
    // Provide more detailed error information in development
    const errorMessage = process.env.NODE_ENV === 'development' 
      ? error.message || 'Internal server error'
      : 'Internal server error'
    
    return NextResponse.json(
      { error: errorMessage, ...(process.env.NODE_ENV === 'development' && { stack: error.stack }) },
      { status: 500 }
    )
  }
}

