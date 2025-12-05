import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/middleware'

// GET /api/admin/stats - Get platform statistics (Admin only)
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request)
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const [
      totalUsers,
      totalCourses,
      totalProfessors,
      totalReviews,
      approvedReviews,
      pendingReviews,
      totalReports,
      pendingReports,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.course.count(),
      prisma.professor.count(),
      prisma.review.count(),
      prisma.review.count({ where: { isApproved: true } }),
      prisma.review.count({ where: { isApproved: false } }),
      prisma.report.count(),
      prisma.report.count({ where: { status: 'PENDING' } }),
    ])

    // Calculate average ratings
    const allReviews = await prisma.review.findMany({
      where: { isApproved: true },
      select: { rating: true },
    })

    const avgRating =
      allReviews.length > 0
        ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
        : 0

    return NextResponse.json({
      users: {
        total: totalUsers,
      },
      courses: {
        total: totalCourses,
      },
      professors: {
        total: totalProfessors,
      },
      reviews: {
        total: totalReviews,
        approved: approvedReviews,
        pending: pendingReviews,
        averageRating: Math.round(avgRating * 10) / 10,
      },
      reports: {
        total: totalReports,
        pending: pendingReports,
      },
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

