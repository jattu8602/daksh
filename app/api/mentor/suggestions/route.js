import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit')) || 10

    // First check if there are any mentors at all
    const totalMentors = await prisma.mentor.count({
      where: {
        isActive: true,
      },
    })

    if (totalMentors === 0) {
      return NextResponse.json({
        success: true,
        mentors: [],
        message: 'No mentors available',
      })
    }

    // Get recently added mentors (active mentors) - exactly 10
    const mentors = await prisma.mentor.findMany({
      where: {
        isActive: true,
      },
      include: {
        user: {
          select: {
            name: true,
            username: true,
            profileImage: true,
          },
        },
      },
      take: 10, // Exactly 10 mentors
      orderBy: {
        createdAt: 'desc', // Most recently added first
      },
    })

    // Format mentors for suggestions
    const formattedMentors = mentors.map((mentor) => ({
      id: mentor.id,
      name: mentor.user.name,
      username: mentor.user.username,
      profileImage: mentor.user.profileImage || mentor.profilePhoto,
      bio: mentor.bio,
      tag: mentor.tag,
      isOrganic: mentor.isOrganic,
      createdAt: mentor.createdAt,
    }))

    return NextResponse.json({
      success: true,
      mentors: formattedMentors,
      total: totalMentors,
    })
  } catch (error) {
    console.error('Error fetching mentor suggestions:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch mentor suggestions',
        message: error.message,
      },
      { status: 500 }
    )
  }
}
