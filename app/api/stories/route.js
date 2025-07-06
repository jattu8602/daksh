import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')
    const limit = parseInt(searchParams.get('limit')) || 15

    // 15-day threshold
    const threshold = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)

    const highlightAssignments = await prisma.videoAssignment.findMany({
      where: {
        contentType: 'highlights',
        createdAt: {
          gte: threshold,
        },
        mentor: {
          isActive: true,
          user: {
            role: 'MENTOR',
          },
        },
      },
      include: {
        video: true,
        mentor: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    })

    let watchedMap = {}
    if (studentId) {
      const stats = await prisma.highlightStat.findMany({
        where: {
          studentId,
          videoAssignId: {
            in: highlightAssignments.map((h) => h.id),
          },
          watched: true,
        },
      })
      watchedMap = Object.fromEntries(stats.map((s) => [s.videoAssignId, true]))
    }

    const stories = highlightAssignments.map((h) => ({
      id: h.id,
      url: h.video.url,
      mediaType: h.video.mediaType,
      mentorUsername: h.mentor.user.username,
      mentorId: h.mentor.id,
      mentorAvatar: h.mentor.profilePhoto || '/placeholder.png',
      createdAt: h.createdAt,
      isWatched: watchedMap[h.id] || false,
    }))

    return NextResponse.json({ success: true, data: stories })
  } catch (error) {
    console.error('Error fetching stories:', error)
    return NextResponse.json(
      { success: false, data: [], error: 'Failed to fetch stories' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
