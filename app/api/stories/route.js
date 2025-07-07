import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Cache for response data (in-memory cache for this instance)
const responseCache = new Map()
const CACHE_TTL = 3 * 60 * 1000 // 3 minutes

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')
    const limit = parseInt(searchParams.get('limit')) || 15

    // Create cache key
    const cacheKey = `stories-${studentId || 'anonymous'}-${limit}`

    // Check cache first
    if (responseCache.has(cacheKey)) {
      const cached = responseCache.get(cacheKey)
      if (Date.now() - cached.timestamp < CACHE_TTL) {
        return NextResponse.json({
          success: true,
          data: cached.data,
          cached: true,
        })
      }
      // Remove expired cache
      responseCache.delete(cacheKey)
    }

    // 15-day threshold
    const threshold = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)

    // Optimized query with reduced nesting and better field selection
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
      select: {
        id: true,
        createdAt: true,
        video: {
          select: {
            url: true,
            mediaType: true,
          },
        },
        mentor: {
          select: {
            id: true,
            profilePhoto: true,
            user: {
              select: {
                username: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    })

    // Optimize watched status query - only if studentId provided and we have assignments
    let watchedMap = {}
    if (studentId && highlightAssignments.length > 0) {
      const assignmentIds = highlightAssignments.map((h) => h.id)

      // Use Promise to not block if this query is slow
      const watchedPromise = prisma.highlightStat.findMany({
        where: {
          studentId,
          videoAssignId: {
            in: assignmentIds,
          },
          watched: true,
        },
        select: {
          videoAssignId: true,
        },
      })

      try {
        const stats = await Promise.race([
          watchedPromise,
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Query timeout')), 500)
          ),
        ])
        watchedMap = Object.fromEntries(
          stats.map((s) => [s.videoAssignId, true])
        )
      } catch (error) {
        console.warn('Watched status query failed or timed out:', error)
        // Continue without watched status - better to show stories than fail
      }
    }

    // Transform data
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

    // Cache the result
    responseCache.set(cacheKey, {
      data: stories,
      timestamp: Date.now(),
    })

    // Clean old cache entries periodically
    if (responseCache.size > 50) {
      const now = Date.now()
      for (const [key, value] of responseCache.entries()) {
        if (now - value.timestamp > CACHE_TTL) {
          responseCache.delete(key)
        }
      }
    }

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
