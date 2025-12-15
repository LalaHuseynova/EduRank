import { prisma } from './prisma'

// Calculate average rating for a course
export async function getCourseAverageRating(courseId: string): Promise<number> {
  const reviews = await prisma.review.findMany({
    where: {
      courseId,
      isApproved: true,
    },
    select: {
      rating: true,
    },
  })

  if (reviews.length === 0) return 0

  const sum = reviews.reduce((acc, review) => acc + review.rating, 0)
  return Math.round((sum / reviews.length) * 10) / 10
}

// Calculate average rating for a professor
export async function getProfessorAverageRating(professorId: string): Promise<number> {
  const reviews = await prisma.review.findMany({
    where: {
      professorId,
      isApproved: true,
    },
    select: {
      rating: true,
    },
  })

  if (reviews.length === 0) return 0

  const sum = reviews.reduce((acc, review) => acc + review.rating, 0)
  return Math.round((sum / reviews.length) * 10) / 10
}

// Get aggregated metrics for a course
export async function getCourseMetrics(courseId: string) {
  const reviews = await prisma.review.findMany({
    where: {
      courseId,
      isApproved: true,
    },
    select: {
      rating: true,
      difficulty: true,
      workload: true,
    },
  })

  if (reviews.length === 0) {
    return {
      averageRating: 0,
      averageDifficulty: 0,
      averageWorkload: 0,
      totalReviews: 0,
    }
  }

  const avgRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length

  const difficultyReviews = reviews.filter((r) => r.difficulty !== null)
  const avgDifficulty =
    difficultyReviews.length > 0
      ? difficultyReviews.reduce((sum, r) => sum + (r.difficulty || 0), 0) /
        difficultyReviews.length
      : 0

  const workloadReviews = reviews.filter((r) => r.workload !== null)
  const avgWorkload =
    workloadReviews.length > 0
      ? workloadReviews.reduce((sum, r) => sum + (r.workload || 0), 0) /
        workloadReviews.length
      : 0

  return {
    averageRating: Math.round(avgRating * 10) / 10,
    averageDifficulty: Math.round(avgDifficulty * 10) / 10,
    averageWorkload: Math.round(avgWorkload * 10) / 10,
    totalReviews: reviews.length,
  }
}

// Get aggregated metrics for a professor
export async function getProfessorMetrics(professorId: string) {
  const reviews = await prisma.review.findMany({
    where: {
      professorId,
      isApproved: true,
    },
    select: {
      rating: true,
      difficulty: true,
      workload: true,
    },
  })

  if (reviews.length === 0) {
    return {
      averageRating: 0,
      averageDifficulty: 0,
      averageWorkload: 0,
      totalReviews: 0,
    }
  }

  const avgRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length

  const difficultyReviews = reviews.filter((r) => r.difficulty !== null)
  const avgDifficulty =
    difficultyReviews.length > 0
      ? difficultyReviews.reduce((sum, r) => sum + (r.difficulty || 0), 0) /
        difficultyReviews.length
      : 0

  const workloadReviews = reviews.filter((r) => r.workload !== null)
  const avgWorkload =
    workloadReviews.length > 0
      ? workloadReviews.reduce((sum, r) => sum + (r.workload || 0), 0) /
        workloadReviews.length
      : 0

  return {
    averageRating: Math.round(avgRating * 10) / 10,
    averageDifficulty: Math.round(avgDifficulty * 10) / 10,
    averageWorkload: Math.round(avgWorkload * 10) / 10,
    totalReviews: reviews.length,
  }
}

// Update course rating when a review is approved
export async function updateCourseRating(courseId: string) {
  const metrics = await getCourseMetrics(courseId)
  // In a real implementation, you might want to cache this or update a denormalized field
  return metrics
}

// Update professor rating when a review is approved
export async function updateProfessorRating(professorId: string) {
  const metrics = await getProfessorMetrics(professorId)
  // In a real implementation, you might want to cache this or update a denormalized field
  return metrics
}



