import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/subjects - Get all subjects (optionally filter by boardId)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const boardId = searchParams.get('boardId')

    const whereClause = boardId
      ? { boardId, isActive: true }
      : { isActive: true }

    const subjects = await prisma.subject.findMany({
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
      subjects,
    })
  } catch (error) {
    console.error('Error fetching subjects:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch subjects',
      },
      { status: 500 }
    )
  }
}

// POST /api/subjects - Create a new subject
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
    const existingSubject = await prisma.subject.findFirst({
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
          error: 'A subject with this name already exists in this board',
        },
        { status: 400 }
      )
    }

    const subject = await prisma.subject.create({
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
      subject,
      message: 'Subject created successfully',
    })
  } catch (error) {
    console.error('Error creating subject:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create subject',
      },
      { status: 500 }
    )
  }
}
