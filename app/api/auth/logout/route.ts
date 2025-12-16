import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  // Since we're using JWT tokens, logout is handled client-side
  // by removing the token from storage
  // Optionally, we could implement token blacklisting here

  return NextResponse.json({
    message: 'Logged out successfully',
  })
}

