import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { generateQRCode } from '@/lib/qrcode'

export async function GET(request, { params }) {
  try {
    const { studentId } = await params

    if (!studentId) {
      return NextResponse.json(
        { error: 'Student ID is required' },
        { status: 400 }
      )
    }

    // Find the student with their user data
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            password: true,
            role: true,
            qrCode: true,
          },
        },
        class: {
          include: {
            school: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
          },
        },
      },
    })

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    // If QR code already exists, return it
    if (student.user.qrCode) {
      return NextResponse.json({
        success: true,
        qrCode: student.user.qrCode,
        studentInfo: {
          username: student.user.username,
          password: student.user.password,
          role: student.user.role,
        },
      })
    }

    // Generate QR code data
    const qrData = {
      username: student.user.username,
      password: student.user.password,
      role: student.user.role,
      classId: student.classId,
      rollNo: student.rollNo,
      schoolCode: student.class.school.code,
    }

    // Generate QR code
    const qrCode = await generateQRCode(JSON.stringify(qrData))

    // Update the user with the generated QR code
    await prisma.user.update({
      where: { id: student.user.id },
      data: { qrCode },
    })

    return NextResponse.json({
      success: true,
      qrCode,
      studentInfo: {
        username: student.user.username,
        password: student.user.password,
        role: student.user.role,
      },
    })
  } catch (error) {
    console.error('Error fetching QR code:', error)
    return NextResponse.json(
      { error: 'Failed to fetch QR code' },
      { status: 500 }
    )
  }
}
