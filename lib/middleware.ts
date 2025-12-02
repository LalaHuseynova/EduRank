import { NextRequest, NextResponse } from 'next/server'
import { getUserFromToken } from './auth'

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string
    email: string
    firstName: string
    lastName: string
    role: string
    isActive: boolean
  }
}

// Authentication middleware
export async function requireAuth(
  request: NextRequest
): Promise<NextResponse | null> {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')

  if (!token) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    )
  }

  const user = await getUserFromToken(token)
  if (!user || !user.isActive) {
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 }
    )
  }

  // Attach user to request (we'll handle this differently in route handlers)
  return null
}

// Role-based access control middleware
export function requireRole(allowedRoles: string[]) {
  return async (request: NextRequest): Promise<NextResponse | null> => {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    const user = await getUserFromToken(token || '')

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    if (!allowedRoles.includes(user.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    return null
  }
}

// Helper to get authenticated user from request
export async function getAuthUser(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  return await getUserFromToken(token || '')
}