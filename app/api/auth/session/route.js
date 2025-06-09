import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { randomBytes } from 'crypto'

// Create a new session with both access and refresh tokens
export async function POST(request) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Generate tokens
    const accessToken = randomBytes(32).toString('hex')
    const refreshToken = randomBytes(32).toString('hex')

    // Set token expiry times
    const accessTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
    const refreshTokenExpiresAt = new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    ) // 30 days

    // Delete any existing sessions for this user to prevent multiple active sessions
    await prisma.session.deleteMany({
      where: { userId },
    })

    // Create new session with both tokens
    const session = await prisma.session.create({
      data: {
        userId,
        token: accessToken,
        refreshToken,
        expiresAt: accessTokenExpiresAt,
        refreshTokenExpiresAt,
      },
    })

    return NextResponse.json({
      success: true,
      session: {
        accessToken: session.token,
        refreshToken: session.refreshToken,
        accessTokenExpiresAt: session.expiresAt,
        refreshTokenExpiresAt: session.refreshTokenExpiresAt,
      },
    })
  } catch (error) {
    console.error('Session creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    )
  }
}

// Validate a session or refresh token
export async function GET(request) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1]

    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    const session = await prisma.session.findUnique({
      where: { token },
    })

    if (!session) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }

    // Check if access token is expired
    if (session.expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'Access token expired', code: 'TOKEN_EXPIRED' },
        { status: 401 }
      )
    }

    // Fetch the user with student data
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: {
        student: {
          include: {
            class: {
              include: {
                school: true,
              },
            },
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 })
    }

    // Remove sensitive data before sending
    const { password, ...userWithoutPassword } = user

    // Add profile image to student data if it exists
    if (userWithoutPassword.student) {
      userWithoutPassword.student.profileImage =
        userWithoutPassword.student.profileImage || null
    }

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error('Session validation error:', error)
    return NextResponse.json(
      { error: 'Failed to validate session' },
      { status: 500 }
    )
  }
}

// Refresh access token using refresh token
export async function PUT(request) {
  try {
    const { refreshToken } = await request.json()

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token is required' },
        { status: 400 }
      )
    }

    // Find session by refresh token
    const session = await prisma.session.findUnique({
      where: { refreshToken },
    })

    if (!session) {
      return NextResponse.json(
        { error: 'Invalid refresh token' },
        { status: 401 }
      )
    }

    // Check if refresh token is expired
    if (session.refreshTokenExpiresAt < new Date()) {
      // Delete expired session
      await prisma.session.delete({
        where: { id: session.id },
      })
      return NextResponse.json(
        { error: 'Refresh token expired' },
        { status: 401 }
      )
    }

    // Generate new access token
    const newAccessToken = randomBytes(32).toString('hex')
    const newAccessTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    // Update session with new access token
    const updatedSession = await prisma.session.update({
      where: { id: session.id },
      data: {
        token: newAccessToken,
        expiresAt: newAccessTokenExpiresAt,
      },
    })

    return NextResponse.json({
      success: true,
      session: {
        accessToken: updatedSession.token,
        refreshToken: updatedSession.refreshToken,
        accessTokenExpiresAt: updatedSession.expiresAt,
        refreshTokenExpiresAt: updatedSession.refreshTokenExpiresAt,
      },
    })
  } catch (error) {
    console.error('Token refresh error:', error)
    return NextResponse.json(
      { error: 'Failed to refresh token' },
      { status: 500 }
    )
  }
}

// Delete a session (logout)
export async function DELETE(request) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1]

    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    await prisma.session.delete({
      where: { token },
    })

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error('Session deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete session' },
      { status: 500 }
    )
  }
}
