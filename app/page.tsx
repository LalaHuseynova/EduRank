'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import ReviewCard from '@/components/ReviewCard'

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

export default function Home() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

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
          <h1 className="text-3xl font-bold text-gray-900">
            {user ? `Welcome, ${user.firstName} ${user.lastName}` : 'Dashboard'}
          </h1>
          <p className="mt-2 text-gray-600">
            {user ? 'Your review dashboard' : 'Please log in to view your personal dashboard'}
          </p>
        </div>

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

        {user && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Reviews</h2>
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