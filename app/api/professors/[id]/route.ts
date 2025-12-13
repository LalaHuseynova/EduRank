import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/middleware'
import { updateProfessorSchema } from '@/lib/validation'

// GET /api/professors/[id] - Get professor details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const professor = await prisma.professor.findUnique({
      where: { id: params.id },
      include: {
        courses: {
          include: {
            course: true,
          },
        },
        reviews: {
          where: {
            isApproved: true,
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
        },
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    })

    if (!professor) {
      return NextResponse.json(
        { error: 'Professor not found' },
        { status: 404 }
      )
    }

    // Calculate average rating
    const avgRating =
      professor.reviews.length > 0
        ? professor.reviews.reduce((sum, r) => sum + r.rating, 0) / professor.reviews.length
        : 0

    return NextResponse.json({
      ...professor,
      averageRating: avgRating,
    })
  } catch (error) {
    console.error('Error fetching professor:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/professors/[id] - Update professor (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser(request)
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validatedData = updateProfessorSchema.parse(body)

    const professor = await prisma.professor.update({
      where: { id: params.id },
      data: validatedData,
    })

    return NextResponse.json(professor)
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Professor not found' },
        { status: 404 }
      )
    }

    console.error('Error updating professor:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/professors/[id] - Delete professor (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser(request)
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    await prisma.professor.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Professor deleted successfully' })
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Professor not found' },
        { status: 404 }
      )
    }

    console.error('Error deleting professor:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

