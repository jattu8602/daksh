import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/beyond-school-subjects - Get all beyond school subjects (optionally filter by boardId)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const boardId = searchParams.get('boardId')

    const whereClause = boardId
      ? { boardId, isActive: true }
      : { isActive: true }

    const beyondSchoolSubjects = await prisma.beyondSchoolSubject.findMany({
      where: whereClause,
      include: {
        board: {
          select: {
            id: true,
            name: true,
            class: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        _count: {
          select: {
            subjectMentors: true,
            subjectPlaylists: true,
            subjectNcerts: true,
            subjectSheets: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({
      success: true,
      beyondSchoolSubjects,
    })
  } catch (error) {
    console.error('Error fetching beyond school subjects:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch beyond school subjects',
      },
      { status: 500 }
    )
  }
}

// POST /api/beyond-school-subjects - Create a new beyond school subject
export async function POST(request) {
  try {
    const body = await request.json()
    const { name, photo, boardId, description } = body

    if (!name || !boardId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Subject name and board ID are required',
        },
        { status: 400 }
      )
    }

    // Check if board exists
    const boardExists = await prisma.board.findUnique({
      where: { id: boardId },
    })

    if (!boardExists) {
      return NextResponse.json(
        {
          success: false,
          error: 'Board not found',
        },
        { status: 404 }
      )
    }

    // Check if subject with same name already exists in this board
    const existingSubject = await prisma.beyondSchoolSubject.findFirst({
      where: {
        name: name.trim(),
        boardId,
        isActive: true,
      },
    })

    if (existingSubject) {
      return NextResponse.json(
        {
          success: false,
          error:
            'A beyond school subject with this name already exists in this board',
        },
        { status: 400 }
      )
    }

    const beyondSchoolSubject = await prisma.beyondSchoolSubject.create({
      data: {
        name: name.trim(),
        photo,
        boardId,
        description: description?.trim(),
      },
      include: {
        board: {
          select: {
            id: true,
            name: true,
            class: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        _count: {
          select: {
            subjectMentors: true,
            subjectPlaylists: true,
            subjectNcerts: true,
            subjectSheets: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      beyondSchoolSubject,
      message: 'Beyond school subject created successfully',
    })
  } catch (error) {
    console.error('Error creating beyond school subject:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create beyond school subject',
      },
      { status: 500 }
    )
  }
}
