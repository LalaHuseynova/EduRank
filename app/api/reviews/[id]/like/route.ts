import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/middleware'

// POST /api/reviews/[id]/like - Like/unlike a review
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const review = await prisma.review.findUnique({
      where: { id: params.id },
    })

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      )
    }

    // Check if already liked
    const existingLike = await prisma.like.findUnique({
      where: {
        reviewId_userId: {
          reviewId: params.id,
          userId: user.id,
        },
      },
    })

    if (existingLike) {
      // Unlike
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      })

      // Decrement helpful count
      await prisma.review.update({
        where: { id: params.id },
        data: {
          helpfulCount: {
            decrement: 1,
          },
        },
      })

      return NextResponse.json({ message: 'Review unliked', liked: false })
    } else {
      // Like
      await prisma.like.create({
        data: {
          reviewId: params.id,
          userId: user.id,
        },
      })

      // Increment helpful count
      await prisma.review.update({
        where: { id: params.id },
        data: {
          helpfulCount: {
            increment: 1,
          },
        },
      })

      return NextResponse.json({ message: 'Review liked', liked: true })
    }
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Already liked' },
        { status: 409 }
      )
    }

    console.error('Error toggling like:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

