'use client'

import Link from 'next/link'
import RatingStars from './RatingStars'
import { formatDate } from '@/lib/utils'

interface ReviewCardProps {
  review: {
    id: string
    rating: number
    difficulty?: number | null
    workload?: number | null
    content: string
    isAnonymous: boolean
    helpfulCount: number
    createdAt: string
    user: {
      id: string
      firstName: string
      lastName: string
    }
    course?: {
      id: string
      code: string
      name: string
    } | null
    professor?: {
      id: string
      firstName: string
      lastName: string
    } | null
    _count?: {
      likes: number
      comments: number
    }
  }
  showActions?: boolean
  onLike?: (reviewId: string) => void
  onReport?: (reviewId: string) => void
  onEdit?: (reviewId: string) => void
  onDelete?: (reviewId: string) => void
  currentUserId?: string | null
  currentUserRole?: string | null
}

export default function ReviewCard({
  review,
  showActions = true,
  onLike,
  onReport,
  onEdit,
  onDelete,
  currentUserId,
  currentUserRole,
}: ReviewCardProps) {
  const canEditDelete =
    currentUserId &&
    (review.user.id === currentUserId || currentUserRole === 'ADMIN')

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <RatingStars rating={review.rating} />

            {review.difficulty && (
              <span className="text-sm text-gray-600">
                Difficulty: {review.difficulty}/5
              </span>
            )}

            {review.workload && (
              <span className="text-sm text-gray-600">
                Workload: {review.workload}/5
              </span>
            )}
          </div>

          <div className="text-sm text-gray-500 mb-2">
            {review.isAnonymous ? (
              <span>Anonymous User</span>
            ) : (
              <span>
                {review.user.firstName} {review.user.lastName}
              </span>
            )}
            {' • '}
            {formatDate(review.createdAt)}
          </div>

          {review.course && (
            <Link
              href={`/courses/${review.course.id}`}
              className="text-blue-600 hover:underline text-sm"
            >
              {review.course.code}: {review.course.name}
            </Link>
          )}

          {review.professor && (
            <Link
              href={`/professors/${review.professor.id}`}
              className="text-blue-600 hover:underline text-sm"
            >
              Prof. {review.professor.firstName} {review.professor.lastName}
            </Link>
          )}
        </div>
      </div>

      <p className="text-gray-800 mb-4 whitespace-pre-wrap">
        {review.content}
      </p>

      {showActions && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <button
              onClick={() => onLike?.(review.id)}
              className="flex items-center gap-1 hover:text-blue-600"
            >
              <span>👍</span>
              <span>{review.helpfulCount || review._count?.likes || 0} helpful</span>
            </button>

            <Link
              href={`/reviews/${review.id}`}
              className="hover:text-blue-600"
            >
              {review._count?.comments || 0} comments
            </Link>

            {onReport && (
              <button
                onClick={() => onReport(review.id)}
                className="text-red-600 hover:text-red-700"
              >
                Report
              </button>
            )}
          </div>

          {canEditDelete && (
            <div className="flex items-center gap-2">
              {onEdit && (
                <button
                  onClick={() => onEdit(review.id)}
                  className="text-sm text-blue-600 hover:text-blue-700 px-2 py-1"
                >
                  Edit
                </button>
              )}

              {onDelete && (
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this review?')) {
                      onDelete(review.id)
                    }
                  }}
                  className="text-sm text-red-600 hover:text-red-700 px-2 py-1"
                >
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}