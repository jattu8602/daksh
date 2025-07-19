import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/classes/[classId] - Get a specific class
export async function GET(request, { params }) {
  try {
    const { classId } = await params

    if (!classId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Class ID is required',
        },
        { status: 400 }
      )
    }

    const classData = await prisma.class.findUnique({
      where: { id: classId },
      include: {
        school: true,
        _count: {
          select: {
            students: true,
            boards: true,
            schoolClasses: true,
          },
        },
      },
    })

    if (!classData) {
      return NextResponse.json(
        {
          success: false,
          error: 'Class not found',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      class: classData,
    })
  } catch (error) {
    console.error('Error fetching class:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch class',
      },
      { status: 500 }
    )
  }
}

// PUT /api/classes/[classId] - Update a class
export async function PUT(request, { params }) {
  try {
    const { classId } = await params

    if (!classId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Class ID is required',
        },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { name, totalStudents, boys, girls, startRollNumber } = body

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        {
          success: false,
          error: 'Class name is required',
        },
        { status: 400 }
      )
    }

    // Check if the class exists
    const existingClass = await prisma.class.findUnique({
      where: { id: classId },
      include: {
        school: true,
      },
    })

    if (!existingClass) {
      return NextResponse.json(
        {
          success: false,
          error: 'Class not found',
        },
        { status: 404 }
      )
    }

    // Check if the name is already taken by another class in the same school
    if (name !== existingClass.name) {
      const nameExists = await prisma.class.findFirst({
        where: {
          name,
          schoolId: existingClass.schoolId,
          id: { not: classId },
        },
      })

      if (nameExists) {
        return NextResponse.json(
          {
            success: false,
            error: 'A class with this name already exists in this school',
          },
          { status: 400 }
        )
      }
    }

    // Update the class
    const updatedClass = await prisma.class.update({
      where: { id: classId },
      data: {
        name,
        totalStudents: totalStudents ? parseInt(totalStudents) : undefined,
        boys: boys ? parseInt(boys) : undefined,
        girls: girls ? parseInt(girls) : undefined,
        startRollNumber: startRollNumber
          ? parseInt(startRollNumber)
          : undefined,
      },
      include: {
        school: true,
      },
    })

    return NextResponse.json({
      success: true,
      class: updatedClass,
      message: 'Class updated successfully',
    })
  } catch (error) {
    console.error('Error updating class:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update class',
      },
      { status: 500 }
    )
  }
}

// DELETE /api/classes/[classId] - Delete a class
export async function DELETE(request, { params }) {
  try {
    const { classId } = await params

    if (!classId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Class ID is required',
        },
        { status: 400 }
      )
    }

    // Check if the class exists
    const existingClass = await prisma.class.findUnique({
      where: { id: classId },
      include: {
        students: true,
        messages: true,
      },
    })

    if (!existingClass) {
      return NextResponse.json(
        {
          success: false,
          error: 'Class not found',
        },
        { status: 404 }
      )
    }

    // Delete all messages associated with this class
    if (existingClass.messages.length > 0) {
      await prisma.message.deleteMany({
        where: {
          classId: classId,
        },
      })
    }

    // Delete all students associated with this class
    if (existingClass.students.length > 0) {
      await prisma.student.deleteMany({
        where: {
          classId: classId,
        },
      })
    }

    // Delete the class
    await prisma.class.delete({
      where: { id: classId },
    })

    return NextResponse.json({
      success: true,
      message: 'Class and all associated data deleted successfully',
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete class: ' + error.message,
      },
      { status: 500 }
    )
  }
}
