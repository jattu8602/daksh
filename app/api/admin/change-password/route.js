import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function PUT(request) {
  try {
    const adminAuthToken = request.cookies.get('admin_auth_token')?.value

    if (!adminAuthToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { currentPassword, newPassword, confirmPassword } =
      await request.json()

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { error: 'All password fields are required' },
        { status: 400 }
      )
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: 'New password and confirm password do not match' },
        { status: 400 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'New password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    // Find admin
    const admin = await prisma.admin.findUnique({
      where: { userId: adminAuthToken },
      include: { user: true },
    })

    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 })
    }

    // Verify current password
    if (admin.user.password !== currentPassword) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 400 }
      )
    }

    // Update password
    await prisma.user.update({
      where: { id: admin.userId },
      data: { password: newPassword },
    })

    // Update last active time
    await prisma.admin.update({
      where: { id: admin.id },
      data: { lastActiveAt: new Date() },
    })

    return NextResponse.json({
      success: true,
      message: 'Password changed successfully',
    })
  } catch (error) {
    console.error('Error changing password:', error)
    return NextResponse.json(
      { error: 'Failed to change password' },
      { status: 500 }
    )
  }
}
