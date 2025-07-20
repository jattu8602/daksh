import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const { followerId, followingId } = await request.json()

    if (!followerId || !followingId) {
      return NextResponse.json(
        { error: 'Follower ID and Following ID are required' },
        { status: 400 }
      )
    }

    // Check if follow relationship already exists
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    })

    if (existingFollow) {
      // Unfollow - delete the relationship
      await prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId,
            followingId,
          },
        },
      })

      return NextResponse.json({
        success: true,
        following: false,
        message: 'Unfollowed successfully',
      })
    } else {
      // Follow - create the relationship
      await prisma.follow.create({
        data: {
          followerId,
          followingId,
        },
      })

      return NextResponse.json({
        success: true,
        following: true,
        message: 'Followed successfully',
      })
    }
  } catch (error) {
    console.error('Follow error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to follow/unfollow',
        message: error.message,
      },
      { status: 500 }
    )
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const followerId = searchParams.get('followerId')
    const followingId = searchParams.get('followingId')

    if (!followerId || !followingId) {
      return NextResponse.json(
        { error: 'Follower ID and Following ID are required' },
        { status: 400 }
      )
    }

    // Check if follow relationship exists
    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    })

    return NextResponse.json({
      success: true,
      following: !!follow,
    })
  } catch (error) {
    console.error('Follow check error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to check follow status',
        message: error.message,
      },
      { status: 500 }
    )
  }
}
