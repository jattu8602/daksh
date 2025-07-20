import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// POST /api/follow - Follow a user
export async function POST(request) {
  try {
    const { followerId, followingId } = await request.json()

    if (!followerId || !followingId) {
      return NextResponse.json(
        { error: 'Follower ID and Following ID are required' },
        { status: 400 }
      )
    }

    if (followerId === followingId) {
      return NextResponse.json(
        { error: 'Cannot follow yourself' },
        { status: 400 }
      )
    }

    // Check if already following
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    })

    if (existingFollow) {
      return NextResponse.json(
        { error: 'Already following this user' },
        { status: 400 }
      )
    }

    // Create follow relationship
    const follow = await prisma.follow.create({
      data: {
        followerId,
        followingId,
      },
      include: {
        follower: {
          select: {
            id: true,
            name: true,
            username: true,
            role: true,
          },
        },
        following: {
          select: {
            id: true,
            name: true,
            username: true,
            role: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Successfully followed user',
      follow,
    })
  } catch (error) {
    console.error('Error following user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/follow - Unfollow a user
export async function DELETE(request) {
  try {
    const { followerId, followingId } = await request.json()

    if (!followerId || !followingId) {
      return NextResponse.json(
        { error: 'Follower ID and Following ID are required' },
        { status: 400 }
      )
    }

    // Delete follow relationship
    const deletedFollow = await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Successfully unfollowed user',
      deletedFollow,
    })
  } catch (error) {
    console.error('Error unfollowing user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
