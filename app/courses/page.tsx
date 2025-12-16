'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import SearchBar from '@/components/SearchBar'
import FilterDropdown from '@/components/FilterDropdown'
import RatingStars from '@/components/RatingStars'

interface Course {
  id: string
  code: string
  name: string
  description?: string
  department: string
  credits: number
  professors: Array<{
    professor: {
      id: string
      firstName: string
      lastName: string
    }
  }>
  _count: {
    reviews: number
  }
}

export default function CoursesPage() {
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('')
  const [departments, setDepartments] = useState<string[]>([])

  useEffect(() => {
    fetchCourses()
  }, [searchQuery, departmentFilter])

  const fetchCourses = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.append('search', searchQuery)
      if (departmentFilter) params.append('department', departmentFilter)

      const response = await fetch(`/api/courses?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setCourses(data.courses)
        // Extract unique departments
        const uniqueDepts = Array.from(
          new Set(data.courses.map((c: Course) => c.department))
        ) as string[]
        setDepartments(uniqueDepts)
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setLoading(false)
    }
  }

  const departmentOptions = departments.map((dept) => ({
    value: dept,
    label: dept,
  }))

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Courses</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <SearchBar
                placeholder="Search courses by name or code..."
                onSearch={setSearchQuery}
              />
            </div>
            <div>
              <FilterDropdown
                label="Department"
                options={departmentOptions}
                value={departmentFilter}
                onChange={setDepartmentFilter}
                placeholder="All Departments"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading courses...</div>
        ) : courses.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            No courses found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Link
                key={course.id}
                href={`/courses/${course.id}`}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="mb-3">
                  <h3 className="text-xl font-semibold text-gray-900">{course.code}</h3>
                  <h4 className="text-lg text-gray-700">{course.name}</h4>
                </div>
                <p className="text-sm text-gray-600 mb-2">{course.department}</p>
                <p className="text-sm text-gray-500 mb-4">
                  {course.credits} credits • {course._count.reviews} reviews
                </p>
                {course.professors.length > 0 && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Professors: </span>
                    {course.professors.map((cp, idx) => (
                      <span key={cp.professor.id}>
                        {cp.professor.firstName} {cp.professor.lastName}
                        {idx < course.professors.length - 1 && ', '}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}



