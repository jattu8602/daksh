import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// Heartbeat endpoint to maintain online status
export async function POST(request) {
  try {
    const adminAuthToken = request.cookies.get('admin_auth_token')?.value

    if (!adminAuthToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { lastActivity } = await request.json()

    // Find admin by userId
    const admin = await prisma.admin.findUnique({
      where: { userId: adminAuthToken },
    })

    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 })
    }

    // Update admin's last activity and ensure they're marked as online
    const updatedAdmin = await prisma.admin.update({
      where: { id: admin.id },
      data: {
        isOnline: true,
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
    console.error('Error processing heartbeat:', error)
    return NextResponse.json(
      { error: 'Failed to process heartbeat' },
      { status: 500 }
    )
  }
}
