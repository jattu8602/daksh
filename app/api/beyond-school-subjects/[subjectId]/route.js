import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/beyond-school-subjects/[subjectId] - Get a specific beyond school subject
export async function GET(request, { params }) {
  try {
    const { subjectId } = await params

    const beyondSchoolSubject = await prisma.beyondSchoolSubject.findUnique({
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

    if (!beyondSchoolSubject) {
      return NextResponse.json(
        {
          success: false,
          error: 'Beyond school subject not found',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      beyondSchoolSubject,
    })
  } catch (error) {
    console.error('Error fetching beyond school subject:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch beyond school subject',
      },
      { status: 500 }
    )
  }
}

// PUT /api/beyond-school-subjects/[subjectId] - Update a beyond school subject
export async function PUT(request, { params }) {
  try {
    const { subjectId } = await params
    const body = await request.json()
    const { name, photo, description, isActive } = body

    // Validate required fields
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
    const existingSubject = await prisma.beyondSchoolSubject.findUnique({
      where: { id: subjectId },
      include: { board: true },
    })

    if (!existingSubject) {
      return NextResponse.json(
        {
          success: false,
          error: 'Beyond school subject not found',
        },
        { status: 404 }
      )
    }

    // Check if name is already taken by another subject in the same board
    if (name !== existingSubject.name) {
      const nameExists = await prisma.beyondSchoolSubject.findFirst({
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
            error:
              'A beyond school subject with this name already exists in this board',
          },
          { status: 400 }
        )
      }
    }

    const updatedSubject = await prisma.beyondSchoolSubject.update({
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
      beyondSchoolSubject: updatedSubject,
      message: 'Beyond school subject updated successfully',
    })
  } catch (error) {
    console.error('Error updating beyond school subject:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update beyond school subject',
      },
      { status: 500 }
    )
  }
}

// DELETE /api/beyond-school-subjects/[subjectId] - Delete a beyond school subject
export async function DELETE(request, { params }) {
  try {
    const { subjectId } = await params

    // Check if subject exists
    const existingSubject = await prisma.beyondSchoolSubject.findUnique({
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
          error: 'Beyond school subject not found',
        },
        { status: 404 }
      )
    }

    // Delete all related content
    await prisma.subjectMentor.deleteMany({
      where: { subjectId },
    })

    await prisma.subjectPlaylist.deleteMany({
      where: { subjectId },
    })

    await prisma.subjectNcert.deleteMany({
      where: { subjectId },
    })

    await prisma.subjectSheet.deleteMany({
      where: { subjectId },
    })

    // Delete the subject
    await prisma.beyondSchoolSubject.delete({
      where: { id: subjectId },
    })

    return NextResponse.json({
      success: true,
      message: 'Beyond school subject deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting beyond school subject:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete beyond school subject',
      },
      { status: 500 }
    )
  }
}
