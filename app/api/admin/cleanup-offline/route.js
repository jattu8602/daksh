import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// Cleanup inactive admins - mark as offline if no activity for 5 minutes
export async function POST(request) {
  try {
    // Calculate time threshold (5 minutes ago)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)

    // Find admins who are marked as online but haven't been active recently
    const inactiveAdmins = await prisma.admin.findMany({
      where: {
        isOnline: true,
        lastActiveAt: {
          lt: fiveMinutesAgo,
        },
      },
    })

    // Mark inactive admins as offline
    if (inactiveAdmins.length > 0) {
      await prisma.admin.updateMany({
        where: {
          id: {
            in: inactiveAdmins.map((admin) => admin.id),
          },
        },
        data: {
          isOnline: false,
        },
      })

      console.log(`Marked ${inactiveAdmins.length} inactive admins as offline`)
    }

    return NextResponse.json({
      success: true,
      message: `Marked ${inactiveAdmins.length} inactive admins as offline`,
      affectedAdmins: inactiveAdmins.length,
    })
  } catch (error) {
    console.error('Error cleaning up inactive admins:', error)
    return NextResponse.json(
      { error: 'Failed to cleanup inactive admins' },
      { status: 500 }
    )
  }
}

// GET endpoint for manual cleanup
export async function GET(request) {
  return POST(request)
}
