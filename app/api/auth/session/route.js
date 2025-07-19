import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { randomBytes } from 'crypto'

// Create a new session
export async function POST(request) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Generate a random token
    const token = randomBytes(32).toString('hex')

    const expiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days (approx. 3 months)

    // Create new session
    const session = await prisma.session.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    })

    return NextResponse.json({
      success: true,
      session: {
        token: session.token,
        expiresAt: session.expiresAt,
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

// Validate a session
export async function GET(request) {
  try {
    const token = request.cookies.get('student_auth_token')?.value

    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    const session = await prisma.session.findUnique({
      where: { token },
    })

    if (!session) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }

    if (session.expiresAt < new Date()) {
      // Delete expired session
      await prisma.session.delete({
        where: { id: session.id },
      })
      return NextResponse.json({ error: 'Session expired' }, { status: 401 })
    }

    // Extend session if it's close to expiring (less than 7 days left)
    const daysUntilExpiry =
      (session.expiresAt - new Date()) / (1000 * 60 * 60 * 24)
    if (daysUntilExpiry < 7) {
      const newExpiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days
      await prisma.session.update({
        where: { id: session.id },
        data: { expiresAt: newExpiresAt },
      })
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
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
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

// Delete a session (logout)
export async function DELETE(request) {
  try {
    const token = request.cookies.get('student_auth_token')?.value

    if (token) {
      await prisma.session.deleteMany({
        where: { token },
      })
    }

    const response = NextResponse.json({ success: true })
    response.cookies.delete('student_auth_token')
    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({ error: 'Failed to logout' }, { status: 500 })
  }
}
