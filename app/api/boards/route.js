import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/boards - Get all boards (optionally filter by classId)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const classId = searchParams.get('classId')

    const whereClause = classId
      ? { classId, isActive: true }
      : { isActive: true }

    const boards = await prisma.board.findMany({
      where: whereClause,
      include: {
        class: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            subjects: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({
      success: true,
      boards,
    })
  } catch (error) {
    console.error('Error fetching boards:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch boards',
      },
      { status: 500 }
    )
  }
}

// POST /api/boards - Create a new board
export async function POST(request) {
  try {
    const body = await request.json()
    const { name, code, description, classId } = body

    if (!name || !code || !classId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Board name, code, and class ID are required',
        },
        { status: 400 }
      )
    }

    // Check if class exists
    const classExists = await prisma.class.findUnique({
      where: { id: classId },
    })

    if (!classExists) {
      return NextResponse.json(
        {
          success: false,
          error: 'Class not found',
        },
        { status: 404 }
      )
    }

    // Check if board with same name already exists in this class
    const existingBoard = await prisma.board.findFirst({
      where: {
        name: name.trim(),
        classId,
        isActive: true,
      },
    })

    if (existingBoard) {
      return NextResponse.json(
        {
          success: false,
          error: 'A board with this name already exists in this class',
        },
        { status: 400 }
      )
    }

    // Check if board with same code already exists in this class
    const existingBoardCode = await prisma.board.findFirst({
      where: {
        code: code.trim().toLowerCase(),
        classId,
        isActive: true,
      },
    })

    if (existingBoardCode) {
      return NextResponse.json(
        {
          success: false,
          error: 'A board with this code already exists in this class',
        },
        { status: 400 }
      )
    }

    const board = await prisma.board.create({
      data: {
        name: name.trim(),
        code: code.trim().toLowerCase(),
        description: description?.trim(),
        classId,
      },
      include: {
        class: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            subjects: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      board,
      message: 'Board created successfully',
    })
  } catch (error) {
    console.error('Error creating board:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create board',
      },
      { status: 500 }
    )
  }
}
