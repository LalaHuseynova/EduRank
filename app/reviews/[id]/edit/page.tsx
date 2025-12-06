'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import RatingStars from '@/components/RatingStars'

interface Review {
  id: string
  rating: number
  difficulty?: number | null
  workload?: number | null
  content: string
  isAnonymous: boolean
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
}

export default function EditReviewPage() {
  const router = useRouter()
  const params = useParams()
  const [review, setReview] = useState<Review | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    rating: 5,
    difficulty: 3,
    workload: 3,
    content: '',
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/auth/login')
      return
    }

    if (params.id) {
      fetchReview()
    }
  }, [params.id])

  const fetchReview = async () => {
    try {
      const token = localStorage.getItem('token')

      const response = await fetch(`/api/reviews/${params.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setReview(data)

        setFormData({
          rating: data.rating,
          difficulty: data.difficulty || 3,
          workload: data.workload || 3,
          content: data.content,
        })
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Failed to load review')
        router.back()
      }
    } catch (error) {
      console.error('Error fetching review:', error)
      alert('An error occurred. Please try again.')
      router.back()
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/auth/login')
      return
    }

    if (formData.content.length < 10) {
      alert('Review must be at least 10 characters')
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch(`/api/reviews/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rating: formData.rating,
          difficulty: formData.difficulty,
          workload: formData.workload,
          content: formData.content,
        }),
      })

      if (response.ok) {
        router.push(`/reviews/${params.id}`)
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to update review')
      }
    } catch (error) {
      alert('An error occurred. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-2xl mx-auto py-8 text-center">Loading...</div>
      </div>
    )
  }

  if (!review) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-2xl mx-auto py-8 text-center text-gray-500">
          Review not found
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Review</h1>

          {review.course && (
            <div className="mb-4 text-sm text-gray-600">
              Course: {review.course.code}: {review.course.name}
            </div>
          )}
          {review.professor && (
            <div className="mb-4 text-sm text-gray-600">
              Professor: {review.professor.firstName} {review.professor.lastName}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>

              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={formData.rating}
                  onChange={(e) =>
                    setFormData({ ...formData, rating: parseInt(e.target.value) })
                  }
                  className="flex-1"
                />
                <div className="flex items-center gap-1">
                  <RatingStars rating={formData.rating} />
                  <span className="text-sm text-gray-600">{formData.rating}/5</span>
                </div>
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty
              </label>

              <input
                type="range"
                min="1"
                max="5"
                value={formData.difficulty}
                onChange={(e) =>
                  setFormData({ ...formData, difficulty: parseInt(e.target.value) })
                }
                className="w-full"
              />
              <div className="text-sm text-gray-600 mt-1">
                {formData.difficulty}/5
              </div>
            </div>

            {/* Workload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Workload
              </label>

              <input
                type="range"
                min="1"
                max="5"
                value={formData.workload}
                onChange={(e) =>
                  setFormData({ ...formData, workload: parseInt(e.target.value) })
                }
                className="w-full"
              />
              <div className="text-sm text-gray-600 mt-1">
                {formData.workload}/5
              </div>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Review Content
              </label>

              <textarea
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg"
                rows={8}
                minLength={10}
                required
              />
              <div className="text-sm text-gray-500 mt-1">
                {formData.content.length}/10 characters
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={submitting || formData.content.length < 10}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? 'Updating...' : 'Update Review'}
              </button>

              <button
                type="button"
                onClick={() => router.back()}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}
