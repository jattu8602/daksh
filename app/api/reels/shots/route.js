// app/api/reels/shots/route.js
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit')) || 3

    // Fetch random mentor shots from database only
    const videoAssignments = await prisma.videoAssignment.findMany({
      where: {
        contentType: 'shorts',
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
    })

    // Filter to only include mentors with MENTOR role and active mentors
    const validAssignments = videoAssignments.filter(
      (assignment) =>
        assignment.mentor.user.role === 'MENTOR' &&
        assignment.mentor.isActive &&
        assignment.video.url // Ensure video URL exists
    )

    if (validAssignments.length === 0) {
      return NextResponse.json({
        success: false,
        data: [],
        message: 'No mentor shots available in database',
      })
    }

    // Shuffle the array to get random order every time
    const shuffled = validAssignments
      .sort(() => 0.5 - Math.random())
      .sort(() => Math.random() - 0.5) // Double shuffle for better randomization

    // Take only the requested limit
    const selectedAssignments = shuffled.slice(0, limit)

    // Transform the data for the frontend
    const reelsData = selectedAssignments.map((assignment) => {
      const { video, mentor } = assignment
      const hashtags = video.videoHashtags.map((vh) => vh.hashtag.tag)

      return {
        id: video.id,
        videoUrl: video.url,
        mentor: {
          username: mentor.user.username,
          avatar: mentor.profilePhoto || '/icons/girl.png',
          isDaksh: !mentor.isOrganic, // inorganic mentors get daksh tag
          userId: mentor.user.id, // Add mentor's user ID for follow functionality
        },
        description:
          video.metaDescription ||
          video.title ||
          'Educational content by mentor',
        title: video.title,
        hashtags: hashtags,
        likes: Math.floor(Math.random() * 50000) + 1000,
        comments: Math.floor(Math.random() * 200) + 10,
        shares: Math.floor(Math.random() * 10000) + 100,
        isLiked: false,
      }
    })

    return NextResponse.json({
      success: true,
      data: reelsData,
      total: validAssignments.length,
      returned: reelsData.length,
    })
  } catch (error) {
    console.error('Error fetching mentor shots:', error)

    return NextResponse.json(
      {
        success: false,
        data: [],
        error: 'Failed to fetch mentor shots from database',
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
