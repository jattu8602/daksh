import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { UserRole } from '@prisma/client'
import { randomBytes } from 'crypto'

export async function POST(request) {
  try {
    const body = await request.json()
    const { username, password, role } = body

    console.log('Login attempt:', { username, role }) // Log login attempt

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      )
    }

    // Find user by username
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        student:
          role === UserRole.STUDENT
            ? {
                include: {
                  class: {
                    include: {
                      school: true,
                    },
                  },
                },
              }
            : undefined,
        mentor: role === UserRole.MENTOR ? true : undefined,
        admin:
          role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN
            ? true
            : undefined,
      },
    })

    console.log('Found user:', user ? 'Yes' : 'No') // Log if user was found

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      )
    }

    // For students, check both User and Student tables for password
    if (role === UserRole.STUDENT) {
      const student = user.student
      if (!student) {
        return NextResponse.json(
          { error: 'Student account not found' },
          { status: 401 }
        )
      }

      // Check password in both User and Student tables
      if (user.password !== password && student.password !== password) {
        console.log('Password mismatch for student') // Log password mismatch
        return NextResponse.json(
          { error: 'Invalid username or password' },
          { status: 401 }
        )
      }
    } else {
      // For other roles, only check User table
      if (user.password !== password) {
        console.log('Password mismatch for non-student') // Log password mismatch
        return NextResponse.json(
          { error: 'Invalid username or password' },
          { status: 401 }
        )
      }
    }

    if (role && user.role !== role) {
      console.log('Role mismatch:', { expected: role, actual: user.role }) // Log role mismatch
      return NextResponse.json(
        { error: 'User role does not match requested role' },
        { status: 403 }
      )
    }

    // Generate a random token
    const token = randomBytes(32).toString('hex')

    // Set expiration to 3 months from now
    const expiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)

    // Create new session
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    })

    // Return user data without the password
    const { password: _, ...userData } = user

    const response = NextResponse.json({
      success: true,
      user: userData,
    })

    // Set secure HTTP-only cookie with proper configuration
    response.cookies.set({
      name: 'student_auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 90 * 24 * 60 * 60, // 90 days in seconds
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
