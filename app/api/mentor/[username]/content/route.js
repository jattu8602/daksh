import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request, { params }) {
  try {
    const { username } = await params
    console.log('Fetching content for mentor username:', username)

    // First get the mentor by username
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        mentor: true,
      },
    })

    if (!user || user.role !== 'MENTOR') {
      return NextResponse.json({ error: 'Mentor not found' }, { status: 404 })
    }

    const mentorId = user.mentor.id

    // Fetch video assignments for this mentor
    const videoAssignments = await prisma.videoAssignment.findMany({
      where: { mentorId },
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
      },
    })

    // Group content by type with enhanced data
    const content = {
      videos: [],
      posts: [],
      highlights: [],
      reels: [],
    }

    videoAssignments.forEach((assignment) => {
      // Generate thumbnail for YouTube videos
      const isYouTube =
        assignment.video.url.includes('youtube.com') ||
        assignment.video.url.includes('youtu.be')
      const videoId = isYouTube
        ? assignment.video.url.match(
            /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
          )?.[1]
        : null
      const thumbnailUrl = videoId
        ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
        : assignment.video.url

      const contentItem = {
        id: assignment.id,
        title: assignment.video.title,
        description: assignment.video.description,
        thumbnail: thumbnailUrl,
        image: thumbnailUrl,
        url: assignment.video.url,
        contentType: assignment.contentType,
        createdAt: assignment.createdAt,
        hashtags: assignment.video.videoHashtags.map((vh) => vh.hashtag.tag),
        sourcePlatform: assignment.video.sourcePlatform,
        mediaType: assignment.video.mediaType,
        likes: Math.floor(Math.random() * 1000) + 100, // Mock likes for now
        views: Math.floor(Math.random() * 5000) + 500, // Mock views for now
      }

      switch (assignment.contentType) {
        case 'videos':
          content.videos.push(contentItem)
          break
        case 'post':
          content.posts.push(contentItem)
          break
        case 'highlights':
          content.highlights.push(contentItem)
          break
        case 'shorts': // Assuming shorts are reels
          content.reels.push(contentItem)
          break
        default:
          content.videos.push(contentItem)
      }
    })

    return NextResponse.json(content)
  } catch (error) {
    console.error('Error fetching mentor content:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
