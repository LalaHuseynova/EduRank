'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import RatingStars from '@/components/RatingStars'

export default function ProfessorsPage() {
  const [professors, setProfessors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [department, setDepartment] = useState('')

  useEffect(() => {
    fetchProfessors()
  }, [])

  const fetchProfessors = async () => {
    try {
      const response = await fetch('/api/professors')
      if (!response.ok) {
        throw new Error('Failed to fetch professors')
      }

      const data = await response.json()

      // ⬅ IMPORTANT: API returns { professors: [...], pagination: {...} }
      setProfessors(data.professors)
    } catch (error) {
      console.error('Error loading professors:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Browse Professors
        </h1>

        {loading ? (
          <div className="text-center text-gray-600">Loading...</div>
        ) : professors.length === 0 ? (
          <div className="text-center text-gray-500">No professors found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {professors.map((prof) => (
              <Link
                key={prof.id}
                href={`/professors/${prof.id}`}
                className="block bg-white p-5 rounded-lg shadow hover:shadow-md transition"
              >
                <h2 className="text-xl font-semibold">
                  {prof.firstName} {prof.lastName}
                </h2>
                <p className="text-gray-600">{prof.department}</p>

                <p className="text-gray-700 mt-2">{prof.email}</p>

                <div className="mt-3 flex items-center">
                  <RatingStars rating={prof.averageRating || 0} size={20} />
                  <span className="text-sm text-gray-500 ml-2">
                    {prof._count?.reviews ?? 0} reviews
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
