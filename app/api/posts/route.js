// app/api/posts/route.js
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { formatDistanceToNow } from 'date-fns'

const prisma = new PrismaClient()

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit')) || 10

    // Fetch post assignments from the database
    const videoAssignments = await prisma.videoAssignment.findMany({
      where: {
        contentType: 'post',
      },
      include: {
        video: {
          include: {
            videoHashtags: {
              include: {
                hashtag: true,
              },
            },
          },
        },
        mentor: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        video: {
          createdAt: 'desc',
        },
      },
    })

    // Filter to only include mentors with MENTOR role and active mentors
    const validAssignments = videoAssignments.filter(
      (assignment) =>
        assignment.mentor?.user?.role === 'MENTOR' &&
        assignment.mentor.isActive &&
        assignment.video.url // Ensure video URL exists
    )

    if (validAssignments.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        message: 'No posts available in database',
      })
    }

    // Take only the requested limit
    const selectedAssignments = validAssignments.slice(0, limit)

    // Transform the data for the frontend
    const postsData = selectedAssignments.map((assignment) => {
      const { video, mentor } = assignment
      const hashtags = video.videoHashtags.map((vh) => vh.hashtag.tag)

      return {
        id: video.id,
        images: [video.url],
        mediaType: video.mediaType,
        title: video.title,
        caption: video.description || video.title || 'Check out this post!',
        likes: Math.floor(Math.random() * 1000) + 50,
        comments: Math.floor(Math.random() * 100) + 5,
        time: `${formatDistanceToNow(new Date(video.createdAt), {
          addSuffix: true,
        })}`,
        username: mentor.user.username,
        avatar: mentor.profilePhoto || '/placeholder.png',
        hashtags: hashtags,
      }
    })

    return NextResponse.json({
      success: true,
      data: postsData,
      total: validAssignments.length,
      returned: postsData.length,
    })
  } catch (error) {
    console.error('Error fetching posts:', error)

    return NextResponse.json(
      {
        success: false,
        data: [],
        error: 'Failed to fetch posts from database',
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
