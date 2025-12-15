'use client'

// React hooks for state and lifecycle management
import { useEffect, useState } from 'react'

// Next.js router for client-side redirects
import { useRouter } from 'next/navigation'

// Next.js link component for navigation
import Link from 'next/link'

// Shared navigation component
import Navbar from '@/components/Navbar'

// Shape of admin dashboard statistics returned from the API
interface Stats {
  users: { total: number }
  courses: { total: number }
  professors: { total: number }
  reviews: {
    total: number
    approved: number
    pending: number
    averageRating: number
  }
  reports: {
    total: number
    pending: number
  }
}

// Admin dashboard overview page
export default function AdminDashboardPage() {
  const router = useRouter()

  // Logged-in admin user
  const [user, setUser] = useState<any>(null)

  // Platform statistics for dashboard display
  const [stats, setStats] = useState<Stats | null>(null)

  // Loading state for initial data fetch
  const [loading, setLoading] = useState(true)

  // Authentication check and initial stats fetch
  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    // Redirect unauthenticated users
    if (!token || !userData) {
      router.push('/auth/login')
      return
    }

    try {
      const parsedUser = JSON.parse(userData)

      // Restrict access to admin users only
      if (parsedUser.role !== 'ADMIN') {
        router.push('/dashboard')
        return
      }

      setUser(parsedUser)
      fetchStats()
    } catch {
      // Handle invalid stored user data
      router.push('/auth/login')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Fetch platform statistics for admin dashboard
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const response = await fetch('/api/admin/stats', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  // Loading screen while dashboard data is being fetched
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
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#262626]">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-[#262626]">
            Platform overview and management
          </p>
        </div>

        {/* Platform statistics cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-sm font-medium text-[#262626]">
                Total Users
              </h3>
              <p className="text-3xl font-bold text-[#262626] mt-2">
                {stats.users.total}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-sm font-medium text-[#262626]">
                Total Courses
              </h3>
              <p className="text-3xl font-bold text-[#262626] mt-2">
                {stats.courses.total}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-sm font-medium text-[#262626]">
                Total Professors
              </h3>
              <p className="text-3xl font-bold text-[#262626] mt-2">
                {stats.professors.total}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-sm font-medium text-[#262626]">
                Total Reviews
              </h3>
              <p className="text-3xl font-bold text-[#262626] mt-2">
                {stats.reviews.total}
              </p>
              <p className="text-sm text-[#262626] mt-1">
                Avg Rating: {stats.reviews.averageRating.toFixed(1)}/5
              </p>
            </div>
          </div>
        )}

        {/* Admin action panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Review moderation panel */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-[#262626] mb-4">
              Review Moderation
            </h2>
            <p className="text-[#262626] mb-4">
              {stats?.reviews.pending || 0} reviews pending approval
            </p>
            <Link
              href="/admin/moderation"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 inline-block"
            >
              Go to Moderation Panel
            </Link>
          </div>

          {/* Reports management panel */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-[#262626] mb-4">
              Reports
            </h2>
            <p className="text-[#262626] mb-4">
              {stats?.reports.pending || 0} reports pending review
            </p>
            <Link
              href="/admin/reports"
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 inline-block"
            >
              View Reports
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
