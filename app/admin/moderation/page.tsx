'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import ReviewCard from '@/components/ReviewCard'
import FilterDropdown from '@/components/FilterDropdown'

interface Review {
  id: string
  rating: number
  difficulty?: number | null
  workload?: number | null
  content: string
  isAnonymous: boolean
  isApproved: boolean
  helpfulCount: number
  createdAt: string
  user: {
    id: string
    email: string
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
  _count: {
    likes: number
    comments: number
    reports: number
  }
}

export default function ModerationPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('pending')

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (!token || !userData) {
      router.push('/auth/login')
      return
    }

    try {
      const parsedUser = JSON.parse(userData)
      if (parsedUser.role !== 'ADMIN') {
        router.push('/dashboard')
        return
      }
      setUser(parsedUser)
      fetchReviews()
    } catch {
      router.push('/auth/login')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter])

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const response = await fetch(`/api/admin/reviews?status=${statusFilter}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setReviews(data.reviews)
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (reviewId: string) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const response = await fetch(`/api/admin/reviews/${reviewId}/approve`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        fetchReviews()
      } else {
        alert('Failed to approve review')
      }
    } catch {
      alert('An error occurred')
    }
  }

  const handleReject = async (reviewId: string) => {
    if (!confirm('Are you sure you want to reject and delete this review?')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const response = await fetch(`/api/admin/reviews/${reviewId}/reject`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        fetchReviews()
      } else {
        alert('Failed to reject review')
      }
    } catch {
      alert('An error occurred')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#262626] mb-4">Review Moderation</h1>
          <div className="w-64">
            <FilterDropdown
              label="Filter by Status"
              options={[
                { value: 'pending', label: 'Pending' },
                { value: 'approved', label: 'Approved' },
                { value: 'all', label: 'All' },
              ]}
              value={statusFilter}
              onChange={setStatusFilter}
            />
          </div>
        </div>

        {reviews.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-[#262626]">
            No reviews found.
          </div>
        ) : (
          <div>
            {reviews.map((review) => (
              <div key={review.id} className="mb-4">
                <ReviewCard review={review} showActions={false} />
                <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                  <div className="flex items-center gap-4 text-sm text-[#262626] mb-2">
                    <span>Author: {review.user.email}</span>
                    <span>Reports: {review._count.reports}</span>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleApprove(review.id)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(review.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
