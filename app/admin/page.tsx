'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

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

export default function AdminDashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

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
      fetchStats()
    } catch {
      router.push('/auth/login')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
          <h1 className="text-3xl font-bold text-[#262626]">Admin Dashboard</h1>
          <p className="mt-2 text-[#262626]">Platform overview and management</p>
        </div>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-sm font-medium text-[#262626]">Total Users</h3>
              <p className="text-3xl font-bold text-[#262626] mt-2">{stats.users.total}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-sm font-medium text-[#262626]">Total Courses</h3>
              <p className="text-3xl font-bold text-[#262626] mt-2">{stats.courses.total}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-sm font-medium text-[#262626]">Total Professors</h3>
              <p className="text-3xl font-bold text-[#262626] mt-2">
                {stats.professors.total}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-sm font-medium text-[#262626]">Total Reviews</h3>
              <p className="text-3xl font-bold text-[#262626] mt-2">
                {stats.reviews.total}
              </p>
              <p className="text-sm text-[#262626] mt-1">
                Avg Rating: {stats.reviews.averageRating.toFixed(1)}/5
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-[#262626] mb-4">Reports</h2>
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
