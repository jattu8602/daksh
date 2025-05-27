import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/students/[studentId]
export async function GET(request, { params }) {
  try {
    const { studentId } = params

    if (!studentId) {
      return NextResponse.json(
        { error: 'Student ID is required' },
        { status: 400 }
      )
    }

    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        user: true,
        class: true,
      },
    })

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      student: {
        id: student.id,
        name: student.name,
        rollNo: student.rollNo,
        username: student.user.username,
        qrCode: !!student.user.qrCode,
        class: student.class.name,
        profileImage: student.profileImage,
      },
    })
  } catch (error) {
    console.error('Error fetching student:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/students/[studentId]
export async function PUT(request, { params }) {
  try {
    const { studentId } = params

    if (!studentId) {
      return NextResponse.json(
        { error: 'Student ID is required' },
        { status: 400 }
      )
    }

    const data = await request.json()
    const { name, rollNo, profileImage } = data

    // Validate required fields
    if (!name || !rollNo) {
      return NextResponse.json(
        { error: 'Name and roll number are required' },
        { status: 400 }
      )
    }

    // Check if student exists
    const existingStudent = await prisma.student.findUnique({
      where: { id: studentId },
      include: { class: true },
    })

    if (!existingStudent) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    // Check if roll number is already taken by another student in the same class
    const duplicateRollNo = await prisma.student.findFirst({
      where: {
        id: { not: studentId },
        classId: existingStudent.classId,
        rollNo: parseInt(rollNo),
      },
    })

    if (duplicateRollNo) {
      return NextResponse.json(
        { error: 'Roll number is already taken in this class' },
        { status: 400 }
      )
    }

    // Update student
    const updatedStudent = await prisma.student.update({
      where: { id: studentId },
      data: {
        name,
        rollNo: parseInt(rollNo),
        profileImage: profileImage || null,
      },
      include: {
        user: true,
        class: true,
      },
    })

    return NextResponse.json({
      success: true,
      student: {
        id: updatedStudent.id,
        name: updatedStudent.name,
        rollNo: updatedStudent.rollNo,
        username: updatedStudent.user.username,
        qrCode: !!updatedStudent.user.qrCode,
        class: updatedStudent.class.name,
        profileImage: updatedStudent.profileImage,
      },
    })
  } catch (error) {
    console.error('Error updating student:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/students/[studentId]
export async function DELETE(request, { params }) {
  try {
    const { studentId } = params

    if (!studentId) {
      return NextResponse.json(
        { error: 'Student ID is required' },
        { status: 400 }
      )
    }

    // Check if student exists and get class info
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        user: true,
        class: true,
      },
    })

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    // Delete student and associated user, then update class counts
    await prisma.$transaction(async (tx) => {
      // Delete student and user
      await tx.student.delete({ where: { id: studentId } })
      await tx.user.delete({ where: { id: student.userId } })

      // Update class counts
      const currentClass = student.class
      const updatedTotalStudents = Math.max(
        0,
        (currentClass.totalStudents || 0) - 1
      )

      let updatedBoys = currentClass.boys || 0
      let updatedGirls = currentClass.girls || 0

      // Decrease count based on student's gender
      if (student.gender === 'M') {
        updatedBoys = Math.max(0, updatedBoys - 1)
      } else if (student.gender === 'F') {
        updatedGirls = Math.max(0, updatedGirls - 1)
      }

      await tx.class.update({
        where: { id: student.classId },
        data: {
          totalStudents: updatedTotalStudents,
          boys: updatedBoys,
          girls: updatedGirls,
        },
      })
    })

    return NextResponse.json({
      success: true,
      message: 'Student deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting student:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
