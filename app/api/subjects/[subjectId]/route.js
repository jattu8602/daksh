import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/subjects/[subjectId] - Get a specific subject
export async function GET(request, { params }) {
  try {
    const { subjectId } = await params

    const subject = await prisma.subject.findUnique({
      where: { id: subjectId },
      include: {
        board: {
          include: {
            class: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        subjectMentors: {
          include: {
            mentor: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    profileImage: true,
                  },
                },
              },
            },
          },
        },
        subjectPlaylists: {
          where: { isActive: true },
          orderBy: { order: 'asc' },
        },
        subjectNcerts: {
          where: { isActive: true },
          orderBy: { order: 'asc' },
        },
        subjectSheets: {
          where: { isActive: true },
          orderBy: { order: 'asc' },
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

    if (!subject) {
      return NextResponse.json(
        {
          success: false,
          error: 'Subject not found',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      subject,
    })
  } catch (error) {
    console.error('Error fetching subject:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch subject',
      },
      { status: 500 }
    )
  }
}

// PUT /api/subjects/[subjectId] - Update a subject
export async function PUT(request, { params }) {
  try {
    const { subjectId } = await params
    const body = await request.json()
    const { name, photo, description, isActive } = body

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          error: 'Subject name is required',
        },
        { status: 400 }
      )
    }

    // Check if subject exists
    const existingSubject = await prisma.subject.findUnique({
      where: { id: subjectId },
    })

    if (!existingSubject) {
      return NextResponse.json(
        {
          success: false,
          error: 'Subject not found',
        },
        { status: 404 }
      )
    }

    // Check if name is already taken by another subject in the same board
    if (name !== existingSubject.name) {
      const nameExists = await prisma.subject.findFirst({
        where: {
          name: name.trim(),
          boardId: existingSubject.boardId,
          id: { not: subjectId },
          isActive: true,
        },
      })

      if (nameExists) {
        return NextResponse.json(
          {
            success: false,
            error: 'A subject with this name already exists in this board',
          },
          { status: 400 }
        )
      }
    }

    const updatedSubject = await prisma.subject.update({
      where: { id: subjectId },
      data: {
        name: name.trim(),
        photo,
        description: description?.trim(),
        ...(isActive !== undefined && { isActive }),
      },
      include: {
        board: {
          include: {
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
      subject: updatedSubject,
      message: 'Subject updated successfully',
    })
  } catch (error) {
    console.error('Error updating subject:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update subject',
      },
      { status: 500 }
    )
  }
}

// DELETE /api/subjects/[subjectId] - Delete a subject
export async function DELETE(request, { params }) {
  try {
    const { subjectId } = await params

    // Check if subject exists
    const existingSubject = await prisma.subject.findUnique({
      where: { id: subjectId },
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
    })

    if (!existingSubject) {
      return NextResponse.json(
        {
          success: false,
          error: 'Subject not found',
        },
        { status: 404 }
      )
    }

    // Soft delete by setting isActive to false
    await prisma.subject.update({
      where: { id: subjectId },
      data: {
        isActive: false,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Subject deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting subject:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete subject',
      },
      { status: 500 }
    )
  }
}
