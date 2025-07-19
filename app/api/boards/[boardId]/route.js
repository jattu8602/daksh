import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/boards/[boardId] - Get a specific board
export async function GET(request, { params }) {
  try {
    const { boardId } = await params

    if (!boardId) {
      return NextResponse.json(
        { error: 'Board ID is required' },
        { status: 400 }
      )
    }

    const board = await prisma.board.findUnique({
      where: { id: boardId },
      include: {
        class: true,
        subjects: {
          include: {
            _count: {
              select: {
                subjectMentors: true,
                subjectPlaylists: true,
                subjectNcerts: true,
                subjectSheets: true,
              },
            },
          },
        },
        beyondSchoolSubjects: {
          include: {
            _count: {
              select: {
                subjectMentors: true,
                subjectPlaylists: true,
                subjectNcerts: true,
                subjectSheets: true,
              },
            },
          },
        },
        _count: {
          select: {
            subjects: true,
            beyondSchoolSubjects: true,
          },
        },
      },
    })

    if (!board) {
      return NextResponse.json({ error: 'Board not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      board,
    })
  } catch (error) {
    console.error('Error fetching board:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/boards/[boardId] - Update a board
export async function PUT(request, { params }) {
  try {
    const { boardId } = await params

    if (!boardId) {
      return NextResponse.json(
        { error: 'Board ID is required' },
        { status: 400 }
      )
    }

    const data = await request.json()
    const { name, code, description } = data

    // Validate required fields
    if (!name || !code) {
      return NextResponse.json(
        { error: 'Board name and code are required' },
        { status: 400 }
      )
    }

    // Check if board exists
    const existingBoard = await prisma.board.findUnique({
      where: { id: boardId },
      include: { class: true },
    })

    if (!existingBoard) {
      return NextResponse.json({ error: 'Board not found' }, { status: 404 })
    }

    // Check if name is already taken by another board in the same class
    if (name !== existingBoard.name) {
      const nameExists = await prisma.board.findFirst({
        where: {
          name,
          classId: existingBoard.classId,
          id: { not: boardId },
        },
      })

      if (nameExists) {
        return NextResponse.json(
          { error: 'A board with this name already exists in this class' },
          { status: 400 }
        )
      }
    }

    // Check if code is already taken by another board in the same class
    if (code !== existingBoard.code) {
      const codeExists = await prisma.board.findFirst({
        where: {
          code: code.trim().toLowerCase(),
          classId: existingBoard.classId,
          id: { not: boardId },
        },
      })

      if (codeExists) {
        return NextResponse.json(
          { error: 'A board with this code already exists in this class' },
          { status: 400 }
        )
      }
    }

    // Update the board
    const updatedBoard = await prisma.board.update({
      where: { id: boardId },
      data: {
        name,
        code: code.trim().toLowerCase(),
        description: description?.trim(),
      },
      include: {
        class: true,
      },
    })

    return NextResponse.json({
      success: true,
      board: updatedBoard,
      message: 'Board updated successfully',
    })
  } catch (error) {
    console.error('Error updating board:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/boards/[boardId] - Delete a board
export async function DELETE(request, { params }) {
  try {
    const { boardId } = await params

    if (!boardId) {
      return NextResponse.json(
        { error: 'Board ID is required' },
        { status: 400 }
      )
    }

    // Check if board exists
    const existingBoard = await prisma.board.findUnique({
      where: { id: boardId },
      include: {
        subjects: true,
      },
    })

    if (!existingBoard) {
      return NextResponse.json({ error: 'Board not found' }, { status: 404 })
    }

    // Delete all subjects associated with this board
    if (existingBoard.subjects.length > 0) {
      await prisma.subject.deleteMany({
        where: {
          boardId: boardId,
        },
      })
    }

    // Delete the board
    await prisma.board.delete({
      where: { id: boardId },
    })

    return NextResponse.json({
      success: true,
      message: 'Board and all associated subjects deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting board:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
