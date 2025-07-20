import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const limit = parseInt(searchParams.get('limit')) || 10

    if (!query.trim()) {
      return NextResponse.json({
        success: true,
        students: [],
        mentors: [],
        total: 0,
      })
    }

    // Search for students
    const students = await prisma.student.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { user: { username: { contains: query, mode: 'insensitive' } } },
          { user: { name: { contains: query, mode: 'insensitive' } } },
        ],
      },
      include: {
        user: {
          select: {
            name: true,
            username: true,
            profileImage: true,
          },
        },
        class: {
          select: {
            name: true,
            school: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Search for mentors
    const mentors = await prisma.mentor.findMany({
      where: {
        AND: [
          { isActive: true },
          {
            OR: [
              { user: { name: { contains: query, mode: 'insensitive' } } },
              { user: { username: { contains: query, mode: 'insensitive' } } },
            ],
          },
        ],
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
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Format students
    const formattedStudents = students.map((student) => ({
      id: student.id,
      name: student.user.name,
      username: student.user.username,
      profileImage: student.user.profileImage || student.profileImage,
      type: 'student',
      class: student.class.name,
      school: student.class.school.name,
      rollNo: student.rollNo,
    }))

    // Format mentors
    const formattedMentors = mentors.map((mentor) => ({
      id: mentor.id,
      name: mentor.user.name,
      username: mentor.user.username,
      profileImage: mentor.user.profileImage || mentor.profilePhoto,
      type: 'mentor',
      bio: mentor.bio,
      tag: mentor.tag,
      isOrganic: mentor.isOrganic,
    }))

    return NextResponse.json({
      success: true,
      students: formattedStudents,
      mentors: formattedMentors,
      total: formattedStudents.length + formattedMentors.length,
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to search users',
        message: error.message,
      },
      { status: 500 }
    )
  }
}
