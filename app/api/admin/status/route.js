import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// Update admin online/offline status
export async function PUT(request) {
  try {
    const adminAuthToken = request.cookies.get('admin_auth_token')?.value

    if (!adminAuthToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { isOnline, lastActivity } = await request.json()

    // Find admin by userId
    const admin = await prisma.admin.findUnique({
      where: { userId: adminAuthToken },
    })

    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 })
    }

    // Update admin status
    const updatedAdmin = await prisma.admin.update({
      where: { id: admin.id },
      data: {
        isOnline: isOnline,
        lastActiveAt: lastActivity ? new Date(lastActivity) : new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      admin: {
        id: updatedAdmin.id,
        isOnline: updatedAdmin.isOnline,
        lastActiveAt: updatedAdmin.lastActiveAt,
      },
    })
  } catch (error) {
    console.error('Error updating admin status:', error)
    return NextResponse.json(
      { error: 'Failed to update status' },
      { status: 500 }
    )
  }
}

// Handle sendBeacon POST requests (when page is unloading)
export async function POST(request) {
  try {
    const adminAuthToken = request.cookies.get('admin_auth_token')?.value

    if (!adminAuthToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { isOnline, lastActivity } = await request.json()

    // Find admin by userId
    const admin = await prisma.admin.findUnique({
      where: { userId: adminAuthToken },
    })

    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 })
    }

    // Mark admin as offline when page is unloading
    await prisma.admin.update({
      where: { id: admin.id },
      data: {
        isOnline: false,
        lastActiveAt: lastActivity ? new Date(lastActivity) : new Date(),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error marking admin offline:', error)
    return NextResponse.json(
      { error: 'Failed to mark offline' },
      { status: 500 }
    )
  }
}
