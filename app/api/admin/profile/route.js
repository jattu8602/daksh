import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// Get current admin profile
export async function GET(request) {
  try {
    // Get admin ID from session/cookie (you should implement proper session validation)
    const adminAuthToken = request.cookies.get('admin_auth_token')?.value

    if (!adminAuthToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Find admin by userId (simplified - you should validate session properly)
    const admin = await prisma.admin.findUnique({
      where: { userId: adminAuthToken },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            profileImage: true,
            role: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    })

    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        userId: admin.userId,
        name: admin.user.name,
        username: admin.user.username,
        email: admin.email,
        phone: admin.phone,
        emailVerified: admin.emailVerified,
        profileImage: admin.user.profileImage,
        role: admin.user.role,
        lastActiveAt: admin.lastActiveAt,
        isOnline: admin.isOnline,
        createdAt: admin.createdAt,
      },
    })
  } catch (error) {
    console.error('Error fetching admin profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

// Update admin profile
export async function PUT(request) {
  try {
    const adminAuthToken = request.cookies.get('admin_auth_token')?.value

    if (!adminAuthToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { name, username, email, phone, profileImage } = await request.json()

    // Find admin by userId
    const admin = await prisma.admin.findUnique({
      where: { userId: adminAuthToken },
      include: { user: true },
    })

    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 })
    }

    // Check if username is unique (if being changed)
    if (username && username !== admin.user.username) {
      const existingUser = await prisma.user.findUnique({
        where: { username },
      })
      if (existingUser) {
        return NextResponse.json(
          { error: 'Username already exists' },
          { status: 400 }
        )
      }
    }

    // Check if email is unique (if being changed)
    if (email && email !== admin.email) {
      const existingAdmin = await prisma.admin.findUnique({
        where: { email },
      })
      if (existingAdmin) {
        return NextResponse.json(
          { error: 'Email already exists' },
          { status: 400 }
        )
      }
    }

    // Update user fields
    const updatedUser = await prisma.user.update({
      where: { id: admin.userId },
      data: {
        ...(name && { name }),
        ...(username && { username }),
        ...(profileImage && { profileImage }),
      },
    })

    // Update admin fields
    const updatedAdmin = await prisma.admin.update({
      where: { id: admin.id },
      data: {
        ...(email && {
          email,
          emailVerified: email !== admin.email ? false : admin.emailVerified,
        }),
        ...(phone && { phone }),
        lastActiveAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      admin: {
        id: updatedAdmin.id,
        userId: updatedAdmin.userId,
        name: updatedUser.name,
        username: updatedUser.username,
        email: updatedAdmin.email,
        phone: updatedAdmin.phone,
        emailVerified: updatedAdmin.emailVerified,
        profileImage: updatedUser.profileImage,
        role: updatedUser.role,
        lastActiveAt: updatedAdmin.lastActiveAt,
        isOnline: updatedAdmin.isOnline,
      },
    })
  } catch (error) {
    console.error('Error updating admin profile:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}
