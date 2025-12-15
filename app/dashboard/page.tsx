'use client'

// React hooks for state and lifecycle management
import { useEffect, useState } from 'react'

// Next.js router for client-side navigation
import { useRouter } from 'next/navigation'

// Link component for navigation
import Link from 'next/link'

// Shared UI components
import Navbar from '@/components/Navbar'
import ReviewCard from '@/components/ReviewCard'

// Review data structure
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
  }
}

// User dashboard page
export default function DashboardPage() {
  const router = useRouter()

  // Logged-in user data
  const [user, setUser] = useState<any>(null)

  // Reviews submitted by the user
  const [reviews, setReviews] = useState<Review[]>([])

  // Loading state for dashboard data
  const [loading, setLoading] = useState(true)

  // Load user data and fetch reviews on page load
  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (token && userData) {
      try {
        setUser(JSON.parse(userData))
        fetchUserReviews()
      } catch (e) {
        console.error('Error parsing user data:', e)
        setLoading(false)
      }
    } else {
      setLoading(false)
    }
  }, [router])

  // Fetch reviews created by the logged-in user
  const fetchUserReviews = async () => {
    try {
      const token = localStorage.getItem('token')
      const userData = localStorage.getItem('user')
      if (!token || !userData) return

      const user = JSON.parse(userData)
      const response = await fetch(`/api/reviews?userId=${user.id}`, {
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

  // Like a review
  const handleLike = async (reviewId: string) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const response = await fetch(`/api/reviews/${reviewId}/like`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        fetchUserReviews()
      }
    } catch (error) {
      console.error('Error liking review:', error)
    }
  }

  // Navigate to review edit page
  const handleEdit = (reviewId: string) => {
    router.push(`/reviews/${reviewId}/edit`)
  }

  // Delete a review
  const handleDelete = async (reviewId: string) => {
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        fetchUserReviews()
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to delete review')
      }
    } catch (error) {
      alert('An error occurred. Please try again.')
    }
  }

  // Loading state
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
        {/* Dashboard header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {user ? `Welcome, ${user.firstName} ${user.lastName}` : 'Dashboard'}
          </h1>
          <p className="mt-2 text-gray-600">
            {user
              ? 'Your review dashboard'
              : 'Please log in to view your personal dashboard'}
          </p>
        </div>

        {/* Login prompt for unauthenticated users */}
        {!user && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <p className="text-blue-800 mb-4">
              You need to be logged in to view your personal reviews and dashboard features.
            </p>
            <Link
              href="/auth/login"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 inline-block"
            >
              Log In
            </Link>
          </div>
        )}

        {/* Quick navigation links */}
        <div className="mb-6 flex gap-4">
          <Link
            href="/courses"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Browse Courses
          </Link>
          <Link
            href="/professors"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
          >
            Browse Professors
          </Link>
        </div>

        {/* User reviews section */}
        {user && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Your Reviews
            </h2>

            {reviews.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                <p>You haven't submitted any reviews yet.</p>
                <Link
                  href="/courses"
                  className="text-blue-600 hover:underline mt-2 inline-block"
                >
                  Start reviewing courses and professors
                </Link>
              </div>
            ) : (
              <div>
                {reviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    onLike={handleLike}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    currentUserId={user?.id}
                    currentUserRole={user?.role}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
