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

  if (diffInMinutes < 1) return 'Now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  if (diffInHours < 24) return `${diffInHours}h ago`
  if (diffInDays === 1) return 'Yesterday'
  if (diffInDays < 7) return `${diffInDays}d ago`

  return new Date(lastActiveAt).toLocaleDateString()
}

// Determine if admin is online based on last activity
function isAdminOnline(lastActiveAt) {
  if (!lastActiveAt) return false

  const now = new Date()
  const diffInMs = now - new Date(lastActiveAt)
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))

  // Consider online if active within last 5 minutes
  return diffInMinutes < 5
}

export async function GET(request) {
  try {
    const adminAuthToken = request.cookies.get('admin_auth_token')?.value

    if (!adminAuthToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Get all admins with their user information
    const admins = await prisma.admin.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            profileImage: true,
            role: true,
            createdAt: true,
          },
        },
      },
      orderBy: [{ lastActiveAt: 'desc' }, { createdAt: 'desc' }],
    })

    // Format admin data with online status
    const formattedAdmins = admins.map((admin) => {
      const isOnline = isAdminOnline(admin.lastActiveAt)

      return {
        id: admin.id,
        userId: admin.userId,
        name: admin.user.name,
        username: admin.user.username,
        email: admin.email || 'Not provided',
        phone: admin.phone || 'Not provided',
        profileImage: admin.user.profileImage,
        role: admin.user.role,
        emailVerified: admin.emailVerified,
        isOnline,
        lastActive: formatLastActive(admin.lastActiveAt),
        lastActiveAt: admin.lastActiveAt,
        createdAt: admin.createdAt,
      }
    })

    // Update online status in database for all admins
    await Promise.all(
      admins.map(async (admin) => {
        const isOnline = isAdminOnline(admin.lastActiveAt)
        if (admin.isOnline !== isOnline) {
          await prisma.admin.update({
            where: { id: admin.id },
            data: { isOnline },
          })
        }
      })
    )

    return NextResponse.json({
      success: true,
      admins: formattedAdmins,
      totalAdmins: formattedAdmins.length,
      onlineAdmins: formattedAdmins.filter((admin) => admin.isOnline).length,
    })
  } catch (error) {
    console.error('Error fetching admins:', error)
    return NextResponse.json(
      { error: 'Failed to fetch admins' },
      { status: 500 }
    )
  }
}

// Update admin activity (called periodically to track online status)
export async function POST(request) {
  try {
    const adminAuthToken = request.cookies.get('admin_auth_token')?.value

    if (!adminAuthToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Update current admin's last active time
    await prisma.admin.update({
      where: { userId: adminAuthToken },
      data: {
        lastActiveAt: new Date(),
        isOnline: true,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Activity updated',
    })
  } catch (error) {
    console.error('Error updating activity:', error)
    return NextResponse.json(
      { error: 'Failed to update activity' },
      { status: 500 }
    )
  }
}
