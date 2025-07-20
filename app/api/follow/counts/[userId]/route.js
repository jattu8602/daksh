import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/follow/counts/[userId]
export async function GET(request, { params }) {
  try {
    const { userId } = await params

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Get follower count (how many people follow this user)
    const followersCount = await prisma.follow.count({
      where: { followingId: userId },
    })

    // Get following count (how many people this user follows)
    const followingCount = await prisma.follow.count({
      where: { followerId: userId },
    })

    return NextResponse.json({
      followersCount,
      followingCount,
    })
  } catch (error) {
    console.error('Error getting follow counts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
