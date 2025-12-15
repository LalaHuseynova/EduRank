import { z } from 'zod'

// Auth validation schemas
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  role: z.enum(['STUDENT', 'PROFESSOR']).optional(),
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

// Course validation schemas
export const createCourseSchema = z.object({
  code: z.string().min(1, 'Course code is required'),
  name: z.string().min(1, 'Course name is required'),
  description: z.string().optional(),
  department: z.string().min(1, 'Department is required'),
  credits: z.number().int().min(1).max(10),
})

export const updateCourseSchema = createCourseSchema.partial()

// Professor validation schemas
export const createProfessorSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address').optional(),
  department: z.string().min(1, 'Department is required'),
  bio: z.string().optional(),
})

export const updateProfessorSchema = createProfessorSchema.partial()

// Review validation schemas
export const createReviewSchema = z.object({
  courseId: z.string().optional(),
  professorId: z.string().optional(),
  rating: z.number().int().min(1).max(5),
  difficulty: z.number().int().min(1).max(5).optional(),
  workload: z.number().int().min(1).max(5).optional(),
  content: z.string().min(10, 'Review must be at least 10 characters'),
  isAnonymous: z.boolean().default(false),
})

export const updateReviewSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  difficulty: z.number().int().min(1).max(5).optional(),
  workload: z.number().int().min(1).max(5).optional(),
  content: z.string().min(10, 'Review must be at least 10 characters').optional(),
})

// Comment validation schemas
export const createCommentSchema = z.object({
  reviewId: z.string().min(1, 'Review ID is required'),
  content: z.string().min(1, 'Comment cannot be empty'),
})

// Report validation schemas
export const createReportSchema = z.object({
  reviewId: z.string().min(1, 'Review ID is required'),
  reason: z.enum(['SPAM', 'HARASSMENT', 'INAPPROPRIATE_CONTENT', 'FALSE_INFORMATION', 'OTHER']),
  description: z.string().optional(),
})

// Admin validation schemas
export const updateReportStatusSchema = z.object({
  status: z.enum(['PENDING', 'REVIEWED', 'RESOLVED', 'DISMISSED']),
  resolvedBy: z.string().optional(),
})

