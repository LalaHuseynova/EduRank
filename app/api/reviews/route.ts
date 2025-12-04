import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/middleware'
import { createReviewSchema } from '@/lib/validation'

// GET /api/reviews - List reviews with filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const courseId = searchParams.get('courseId')
    const professorId = searchParams.get('professorId')
    const userId = searchParams.get('userId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const where: any = {
      isApproved: true, // Only show approved reviews
    }

    if (courseId) where.courseId = courseId
    if (professorId) where.professorId = professorId
    if (userId) where.userId = userId

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          course: {
            select: {
              id: true,
              code: true,
              name: true,
            },
          },
          professor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.review.count({ where }),
    ])

    // Mask anonymous reviews
    const maskedReviews = reviews.map((review) => {
      if (review.isAnonymous) {
        return {
          ...review,
          user: {
            id: 'anonymous',
            firstName: 'Anonymous',
            lastName: 'User',
          },
        }
      }
      return review
    })

    return NextResponse.json({
      reviews: maskedReviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/reviews - Create a new review
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = createReviewSchema.parse(body)

    // Validate that either courseId or professorId is provided
    if (!validatedData.courseId && !validatedData.professorId) {
      return NextResponse.json(
        { error: 'Either courseId or professorId must be provided' },
        { status: 400 }
      )
    }

    // Check for duplicate review (user can only review once per course/professor)
    const existingReview = await prisma.review.findFirst({
      where: {
        userId: user.id,
        ...(validatedData.courseId && { courseId: validatedData.courseId }),
        ...(validatedData.professorId && { professorId: validatedData.professorId }),
      },
    })

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already submitted a review for this course/professor' },
        { status: 409 }
      )
    }

    // Create review (initially not approved, requires moderation)
    const review = await prisma.review.create({
      data: {
        ...validatedData,
        userId: user.id,
        isApproved: false, // Requires admin approval
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        course: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
        professor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    })

    // Mask if anonymous
    const maskedReview = review.isAnonymous
      ? {
          ...review,
          user: {
            id: 'anonymous',
            firstName: 'Anonymous',
            lastName: 'User',
          },
        }
      : review

    return NextResponse.json(maskedReview, { status: 201 })
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating review:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

