import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import QRCode from 'qrcode'

export async function GET(request, { params }) {
  try {
    const schoolId = params.schoolId
    const classId = params.classId

    // Check if the class exists and belongs to the specified school
    const classData = await prisma.class.findFirst({
      where: {
        id: classId,
        schoolId: schoolId,
      },
      include: {
        school: true,
      },
    })

    if (!classData) {
      return NextResponse.json(
        {
          message: "Class not found or doesn't belong to the specified school",
        },
        { status: 404 }
      )
    }

    // Get all students for this class
    const students = await prisma.student.findMany({
      where: {
        classId: classId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            qrCode: true,
            role: true,
            profileImage: true,
          },
        },
      },
      orderBy: {
        rollNo: 'asc',
      },
    })

    // Format the students data for easier consumption by the frontend
    const formattedStudents = students.map((student) => ({
      id: student.id,
      userId: student.userId,
      name: student.user.name,
      rollNo: student.rollNo,
      username: student.user.username,
      qrCode: student.user.qrCode ? true : false,
      role: student.user.role,
      profileImage: student.profileImage || student.user.profileImage, // Prefer student.profileImage, fallback to user.profileImage
      gender: student.gender,
    }))

    return NextResponse.json({
      class: classData,
      students: formattedStudents,
      success: true,
    })
  } catch (error) {
    console.error('Error fetching students:', error)
    return NextResponse.json(
      { error: 'Something went wrong', message: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const { students, classId } = await request.json()

    // Validate required fields
    if (!students || !Array.isArray(students) || !classId) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      )
    }

    // Get the class information
    const classData = await prisma.class.findUnique({
      where: { id: classId },
      include: {
        school: true,
        students: true,
      },
    })

    if (!classData) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 })
    }

    // Generate usernames and passwords for all students
    const newStudents = students.map((student, index) => {
      const currentRollNo = classData.students.length + index + 1
      const username = `${student.name
        .toLowerCase()
        .replace(/\s+/g, '')}${currentRollNo}`
      const password = Math.random().toString(36).substring(2, 15)

      // Generate QR code data
      const qrData = {
        username,
        password,
        class: classData.name,
        school: classData.school.name,
        rollNo: currentRollNo,
      }

      return {
        ...student,
        rollNo: currentRollNo,
        username,
        password,
        qrCode: JSON.stringify(qrData),
      }
    })

    // Create students in bulk
    const createdStudents = await prisma.$transaction(
      newStudents.map((student) =>
        prisma.student.create({
          data: {
            rollNo: student.rollNo,
            name: student.name,
            gender: student.gender,
            username: student.username,
            password: student.password,
            qrCode: student.qrCode,
            user: {
              create: {
                name: student.name,
                username: student.username,
                password: student.password,
                role: 'STUDENT',
              },
            },
            class: {
              connect: { id: classId },
            },
          },
          include: {
            user: true,
          },
        })
      )
    )

    // Generate QR codes for all students
    await Promise.all(
      createdStudents.map(async (student) => {
        const qrData = JSON.parse(student.qrCode)
        const qrCode = await QRCode.toDataURL(JSON.stringify(qrData))

        await prisma.student.update({
          where: { id: student.id },
          data: { qrCode },
        })
      })
    )

    return NextResponse.json({
      success: true,
      students: createdStudents.map((student) => ({
        ...student,
        user: {
          ...student.user,
          password: student.qrCode ? JSON.parse(student.qrCode).password : null,
        },
      })),
    })
  } catch (error) {
    console.error('Error in bulk student import:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
