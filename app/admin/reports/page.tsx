'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import FilterDropdown from '@/components/FilterDropdown'

interface Report {
  id: string
  reason: string
  description?: string
  status: string
  createdAt: string
  review: {
    id: string
    content: string
    rating: number
    user: {
      id: string
      firstName: string
      lastName: string
    }
  }
  user: {
    id: string
    firstName: string
    lastName: string
  }
}

export default function ReportsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')

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
      fetchReports()
    } catch (e) {
      router.push('/auth/login')
    }
  }, [router, statusFilter])

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const params = new URLSearchParams()
      if (statusFilter) params.append('status', statusFilter)

      const response = await fetch(`/api/reports?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setReports(data.reports)
      }
    } catch (error) {
      console.error('Error fetching reports:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (reportId: string, status: string) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const response = await fetch(`/api/reports/${reportId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        fetchReports()
      } else {
        alert('Failed to update report status')
      }
    } catch (error) {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Reports</h1>
          <div className="w-64">
            <FilterDropdown
              label="Filter by Status"
              options={[
                { value: '', label: 'All' },
                { value: 'PENDING', label: 'Pending' },
                { value: 'REVIEWED', label: 'Reviewed' },
                { value: 'RESOLVED', label: 'Resolved' },
                { value: 'DISMISSED', label: 'Dismissed' },
              ]}
              value={statusFilter}
              onChange={setStatusFilter}
            />
          </div>
        </div>

        {reports.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            No reports found.
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Report #{report.id.slice(0, 8)}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Reason: {report.reason} • Status: {report.status}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Reported by: {report.user.firstName} {report.user.lastName} •{' '}
                      {new Date(report.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {report.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(report.id, 'RESOLVED')}
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                        >
                          Resolve
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(report.id, 'DISMISSED')}
                          className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                        >
                          Dismiss
                        </button>
                      </>
                    )}
                  </div>
                </div>
                {report.description && (
                  <p className="text-gray-700 mb-4">{report.description}</p>
                )}
                <div className="bg-gray-50 rounded p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Reported Review:</h4>
                  <p className="text-gray-700">{report.review.content}</p>
                  <p className="text-sm text-gray-600 mt-2">
                    By: {report.review.user.firstName} {report.review.user.lastName} • Rating:{' '}
                    {report.review.rating}/5
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}



