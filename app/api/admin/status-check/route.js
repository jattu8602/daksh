import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// Helper function to format last active time
function formatLastActive(lastActiveAt) {
  if (!lastActiveAt) return 'Never'

  const now = new Date()
  const diffInMs = now - new Date(lastActiveAt)
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
  const diffInHours = Math.floor(diffInMinutes / 60)
  const diffInDays = Math.floor(diffInHours / 24)

  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60)
    return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`
  if (diffInHours < 24)
    return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`
  if (diffInDays === 1) return 'Yesterday'
  if (diffInDays < 7) return `${diffInDays}d ago`

  return new Date(lastActiveAt).toLocaleDateString()
}

// Cleanup inactive admins
async function cleanupInactiveAdmins() {
  try {
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000)

    await prisma.admin.updateMany({
      where: {
        isOnline: true,
        lastActiveAt: {
          lt: twoMinutesAgo,
        },
      },
      data: {
        isOnline: false,
      },
    })
  } catch (error) {
    console.warn('Cleanup failed:', error)
  }
}

// Lightweight status check endpoint for background updates
export async function POST(request) {
  try {
    const adminAuthToken = request.cookies.get('admin_auth_token')?.value

    if (!adminAuthToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // First cleanup inactive admins
    await cleanupInactiveAdmins()

    // Get only essential admin status data
    const admins = await prisma.admin.findMany({
      select: {
        id: true,
        userId: true,
        email: true,
        phone: true,
        emailVerified: true,
        isOnline: true,
        lastActiveAt: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            profileImage: true,
            role: true,
          },
        },
      },
      orderBy: [
        { isOnline: 'desc' },
        { lastActiveAt: 'desc' },
        { createdAt: 'desc' },
      ],
    })

    // Format minimal admin data
    const formattedAdmins = admins.map((admin) => ({
      id: admin.id,
      userId: admin.userId,
      name: admin.user.name,
      username: admin.user.username,
      email: admin.email || 'Not provided',
      phone: admin.phone || 'Not provided',
      profileImage: admin.user.profileImage,
      role: admin.user.role,
      emailVerified: admin.emailVerified,
      isOnline: admin.isOnline,
      lastActive: formatLastActive(admin.lastActiveAt),
      lastActiveAt: admin.lastActiveAt,
      createdAt: admin.createdAt,
    }))

    return NextResponse.json({
      success: true,
      admins: formattedAdmins,
      totalAdmins: formattedAdmins.length,
      onlineAdmins: formattedAdmins.filter((admin) => admin.isOnline).length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error in status check:', error)
    return NextResponse.json(
      { error: 'Failed to check status' },
      { status: 500 }
    )
  }
}
