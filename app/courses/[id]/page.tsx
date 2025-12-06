'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import ReviewCard from '@/components/ReviewCard'
import RatingStars from '@/components/RatingStars'
import Modal from '@/components/Modal'

interface Course {
  id: string
  code: string
  name: string
  description?: string
  department: string
  credits: number
  averageRating: number
  professors: Array<{
    professor: {
      id: string
      firstName: string
      lastName: string
    }
  }>
  reviews: Review[]
  _count: {
    reviews: number
  }
}

interface Review {
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
  _count: {
    likes: number
    comments: number
  }
}

export default function CourseDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    difficulty: 3,
    workload: 3,
    content: '',
    isAnonymous: false,
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    if (token && userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (e) {
        console.error('Error parsing user data:', e)
      }
    }
  }, [])

  useEffect(() => {
    if (params.id) fetchCourse()
  }, [params.id])

  const fetchCourse = async () => {
    try {
      const response = await fetch(`/api/courses/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setCourse(data)
      }
    } catch (error) {
      console.error('Error fetching course:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitReview = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/auth/login')
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...reviewForm,
          courseId: params.id,
        }),
      })

      if (response.ok) {
        setShowReviewModal(false)
        setReviewForm({
          rating: 5,
          difficulty: 3,
          workload: 3,
          content: '',
          isAnonymous: false,
        })
        fetchCourse()
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to submit review')
      }
    } catch (error) {
      alert('An error occurred. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleLike = async (reviewId: string) => {
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const response = await fetch(`/api/reviews/${reviewId}/like`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) fetchCourse()
    } catch (error) {
      console.error('Error liking review:', error)
    }
  }

  const handleEdit = (reviewId: string) => {
    router.push(`/reviews/${reviewId}/edit`)
  }

  const handleDelete = async (reviewId: string) => {
    const token = localStorage.getItem('token')
    if (!token) return

    if (!confirm('Are you sure you want to delete this review?')) return

    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) fetchCourse()
      else {
        const data = await response.json()
        alert(data.error || 'Failed to delete review')
      }
    } catch (error) {
      alert('An error occurred. Please try again.')
    }
  }

  const handleReport = async (reviewId: string) => {
    const reason = prompt(
      'Reason for reporting (SPAM, HARASSMENT, INAPPROPRIATE_CONTENT, FALSE_INFORMATION, OTHER):'
    )
    if (!reason) return

    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/auth/login')
      return
    }

    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reviewId, reason }),
      })

      if (response.ok) alert('Report submitted successfully')
      else {
        const data = await response.json()
        alert(data.error || 'Failed to submit report')
      }
    } catch (error) {
      alert('An error occurred. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto p-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto p-8">
          <div className="text-center">Course not found</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto p-8">

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{course.code}</h1>
              <h2 className="text-2xl text-gray-700 mt-2">{course.name}</h2>
              <p className="text-gray-600 mt-2">
                {course.department} • {course.credits} credits
              </p>
              {course.description && (
                <p className="text-gray-700 mt-4">{course.description}</p>
              )}

              {course.professors.length > 0 && (
                <div className="mt-4">
                  <span className="font-medium text-gray-700">Professors: </span>
                  {course.professors.map((cp, idx) => (
                    <Link
                      key={cp.professor.id}
                      href={`/professors/${cp.professor.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {cp.professor.firstName} {cp.professor.lastName}
                      {idx < course.professors.length - 1 && ', '}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="text-right">
              <RatingStars rating={course.averageRating} size={24} />
              <p className="text-sm text-gray-600 mt-2">
                {course._count.reviews}{' '}
                {course._count.reviews === 1 ? 'review' : 'reviews'}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <button
            onClick={() => {
              const token = localStorage.getItem('token')
              if (!token) router.push('/auth/login')
              else setShowReviewModal(true)
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Write a Review
          </button>
        </div>

        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Reviews</h2>

        {course.reviews.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            No reviews yet. Be the first to review this course!
          </div>
        ) : (
          <div>
            {course.reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onLike={handleLike}
                onReport={handleReport}
                onEdit={handleEdit}
                onDelete={handleDelete}
                currentUserId={user?.id}
                currentUserRole={user?.role}
              />
            ))}
          </div>
        )}

        <Modal
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          title="Write a Review"
          size="lg"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating (1-5 stars)
              </label>
              <RatingStars
                rating={reviewForm.rating}
                interactive
                onRatingChange={(rating) =>
                  setReviewForm((prev) => ({ ...prev, rating }))
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty (1-5)
              </label>
              <input
                type="number"
                min="1"
                max="5"
                value={reviewForm.difficulty}
                onChange={(e) =>
                  setReviewForm((prev) => ({
                    ...prev,
                    difficulty: parseInt(e.target.value),
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Workload (1-5)
              </label>
              <input
                type="number"
                min="1"
                max="5"
                value={reviewForm.workload}
                onChange={(e) =>
                  setReviewForm((prev) => ({
                    ...prev,
                    workload: parseInt(e.target.value),
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Review Content
              </label>
              <textarea
                value={reviewForm.content}
                onChange={(e) =>
                  setReviewForm((prev) => ({ ...prev, content: e.target.value }))
                }
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Share your experience with this course..."
                minLength={10}
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="anonymous"
                checked={reviewForm.isAnonymous}
                onChange={(e) =>
                  setReviewForm((prev) => ({
                    ...prev,
                    isAnonymous: e.target.checked,
                  }))
                }
                className="mr-2"
              />
              <label htmlFor="anonymous" className="text-sm text-gray-700">
                Post anonymously
              </label>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowReviewModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReview}
                disabled={submitting || reviewForm.content.length < 10}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  )
}
