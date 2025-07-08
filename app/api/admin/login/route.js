import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request) {
  try {
    const { email, password } = await request.json()
    console.log('Login attempt with email:', email)

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find admin with this email and include the associated user
    console.log('Searching for admin with email:', email)
    const admin = await prisma.admin.findUnique({
      where: {
        email: email,
      },
      include: {
        user: true,
      },
    })

    console.log('Admin found:', admin ? 'Yes' : 'No')

    if (admin) {
      console.log('User role:', admin.user.role)
      console.log('Password match:', admin.user.password === password)
    }

    // If admin not found or password doesn't match
    if (!admin || admin.user.password !== password) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Mark admin as online upon successful login
    await prisma.admin.update({
      where: { id: admin.id },
      data: {
        isOnline: true,
        lastActiveAt: new Date(),
      },
    })

    // Admin is authenticated, return success response
    console.log('Login successful for:', admin.user.name)
    return NextResponse.json({
      message: 'Login successful',
      user: {
        id: admin.user.id,
        name: admin.user.name,
        role: admin.user.role,
        email: admin.email, // Include email from Admin model
        adminId: admin.id, // Include admin ID as well
      },
    })
  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { message: 'Authentication failed' },
      { status: 500 }
    )
  }
}
