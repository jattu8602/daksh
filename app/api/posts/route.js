// app/api/posts/route.js
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { formatDistanceToNow } from 'date-fns'

const prisma = new PrismaClient()

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    let page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 4
    let skip = (page - 1) * limit

    const whereClause = {
      contentType: 'post',
      mentor: {
        isActive: true,
        user: {
          role: 'MENTOR',
        },
      },
      video: {
        url: {
          not: '',
        },
      },
    }

    const totalAssignments = await prisma.videoAssignment.count({
      where: whereClause,
    })
    const totalPages = Math.ceil(totalAssignments / limit)

    if (page === 1 && totalPages > 1) {
      const randomPage = Math.floor(Math.random() * totalPages) + 1
      page = randomPage
      skip = (page - 1) * limit
    }

    const videoAssignments = await prisma.videoAssignment.findMany({
      skip,
      take: limit,
      where: whereClause,
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

    if (videoAssignments.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        message: 'No more posts available',
      })
    }

    // Transform the data for the frontend
    const postsData = await Promise.all(videoAssignments.map(async (assignment) => {
      const { video, mentor } = assignment
      const hashtags = video.videoHashtags.map((vh) => vh.hashtag.tag)

      // Fetch real like and comment counts from HighlightStat
      const [likeCount, commentCount] = await Promise.all([
        prisma.highlightStat.count({
          where: { videoAssignId: assignment.id, liked: true },
        }),
        prisma.highlightStat.count({
          where: { videoAssignId: assignment.id, comment: { not: null } },
        }),
      ])

      return {
        id: assignment.id, // Use assignment.id as the unique post id
        videoId: video.id,
        images: [video.url],
        mediaType: video.mediaType,
        title: video.title,
        caption: video.description || video.title || 'Check out this post!',
        likes: likeCount,
        comments: commentCount,
        time: `${formatDistanceToNow(new Date(video.createdAt), {
          addSuffix: true,
        })}`,
        username: mentor.user.username,
        avatar: mentor.profilePhoto || '/placeholder.png',
        hashtags: hashtags,
        mentorUserId: mentor.user.id, // Add mentor's user ID for follow functionality
      }
    }))

    return NextResponse.json({
      success: true,
      data: postsData,
      total: totalAssignments,
      returned: postsData.length,
      currentPage: page,
      totalPages: Math.ceil(totalAssignments / limit),
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
