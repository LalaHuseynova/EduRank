import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/middleware'
import { updateReportStatusSchema } from '@/lib/validation'

// GET /api/reports/[id] - Get report details (Admin only)
export async function GET(
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

    const report = await prisma.report.findUnique({
      where: { id: params.id },
      include: {
        review: {
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
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    })

    if (!report) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(report)
  } catch (error) {
    console.error('Error fetching report:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/reports/[id] - Update report status (Admin only)
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
    const validatedData = updateReportStatusSchema.parse(body)

    const report = await prisma.report.update({
      where: { id: params.id },
      data: {
        status: validatedData.status,
        resolvedBy: validatedData.resolvedBy || user.id,
        resolvedAt: validatedData.status === 'RESOLVED' ? new Date() : undefined,
      },
      include: {
        review: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    })

    // If report is resolved and review should be removed
    if (validatedData.status === 'RESOLVED') {
      // Optionally delete or hide the review
      // await prisma.review.update({
      //   where: { id: report.reviewId },
      //   data: { isApproved: false },
      // })
    }

    return NextResponse.json(report)
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      )
    }

    console.error('Error updating report:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

