'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import ReviewCard from '@/components/ReviewCard'

interface Comment {
  id: string
  content: string
  createdAt: string
  user: {
    id: string
    firstName: string
    lastName: string
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
  _count?: {
    likes: number
    comments: number
  }
}

export default function ReviewDetailPage() {
  const params = useParams()
  const router = useRouter()

  const [review, setReview] = useState<Review | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  /* ---------------- FETCH REVIEW ---------------- */
  const fetchReview = async () => {
    try {
      const res = await fetch(`/api/reviews/${params.id}`)
      if (!res.ok) throw new Error('Failed to fetch review')
      const data = await res.json()
      setReview(data)
    } catch (err) {
      console.error(err)
    }
  }

  /* ---------------- FETCH COMMENTS ---------------- */
  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/reviews/${params.id}/comments`)
      if (!res.ok) throw new Error('Failed to fetch comments')
      const data = await res.json()
      setComments(data.comments)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (!params.id) return

    Promise.all([fetchReview(), fetchComments()]).finally(() =>
      setLoading(false)
    )
  }, [params.id])

  /* ---------------- ADD COMMENT ---------------- */
  const handleAddComment = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/auth/login')
      return
    }

    if (newComment.trim().length < 2) return

    setSubmitting(true)
    try {
      const res = await fetch(`/api/reviews/${params.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newComment }),
      })

      if (!res.ok) throw new Error('Failed to post comment')

      setNewComment('')
      fetchComments()
    } catch {
      alert('Failed to post comment')
    } finally {
      setSubmitting(false)
    }
  }

  /* ---------------- LOADING ---------------- */
  if (loading || !review) {
    return (
      <div className="min-h-screen bg-gray-200">
        <Navbar />
        <div className="text-center py-10 text-gray-800">
          Loading review...
        </div>
      </div>
    )
  }

  /* ---------------- RENDER ---------------- */
  return (
    <div className="min-h-screen bg-gray-200">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* REVIEW */}
        <ReviewCard review={review} showActions={false} />

        {/* COMMENTS */}
        <h2 className="text-xl font-semibold mb-4 text-gray-900">
          Comments
        </h2>

        {comments.length === 0 ? (
          <p className="text-gray-700 mb-6">No comments yet</p>
        ) : (
          <div className="space-y-4 mb-6">
            {comments.map((c) => (
              <div
                key={c.id}
                className="bg-gray-100 border border-gray-400 rounded-lg p-4"
              >
                <p className="text-gray-900">{c.content}</p>
                <p className="text-sm text-gray-700 mt-1">
                  {c.user.firstName} {c.user.lastName}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* ADD COMMENT */}
        <div className="bg-gray-100 border border-gray-400 rounded-lg p-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            placeholder="Write a comment..."
            className="
              w-full
              border border-gray-400
              rounded-lg
              p-2
              mb-3
              bg-gray-200
              text-gray-900
              placeholder:text-gray-600
              focus:ring-2
              focus:ring-blue-800
              focus:border-blue-800
            "
          />

          <button
            onClick={handleAddComment}
            disabled={submitting || newComment.trim().length < 2}
            className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 disabled:opacity-50"
          >
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      </div>
    </div>
  )
}
