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
    const { classId: newParentClassId, startRollNumber, section } = body

    // Check if the class exists
    const existingClass = await prisma.class.findUnique({
      where: { id: classId },
      include: {
        school: true,
        students: true,
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

    // Use a transaction to ensure data consistency and prevent race conditions
    const result = await prisma.$transaction(async (tx) => {
      // If this is a school class (not a template), allow changing the parent class
      if (!existingClass.isCommon && newParentClassId) {
        // Get the new parent class (template class) within transaction
        const newParentClass = await tx.class.findUnique({
          where: { id: newParentClassId },
        })

        if (!newParentClass) {
          throw new Error('Selected template class not found')
        }

        if (!newParentClass.isCommon) {
          throw new Error('Only template classes can be selected as parent')
        }

        // Check if the new parent class is different from current
        if (existingClass.parentClassId === newParentClassId) {
          throw new Error('Class is already using this template')
        }

        // Update the class with new parent and other fields
        const updatedClass = await tx.class.update({
          where: { id: classId },
          data: {
            parentClassId: newParentClassId,
            startRollNumber: startRollNumber
              ? parseInt(startRollNumber)
              : existingClass.startRollNumber,
            section: section || existingClass.section,
            updatedAt: new Date(), // Ensure updatedAt is set
          },
          include: {
            school: true,
            parentClass: true,
          },
        })

        // Update all students in this class to reflect the new class template
        if (existingClass.students.length > 0) {
          console.log(
            `Updating ${existingClass.students.length} students for class template change`
          )

          // Import the QR code generation function
          const { generateQRCode } = await import('@/lib/qrcode')

          // Update each student's username to reflect the new class template
          for (const student of existingClass.students) {
            const cleanName = student.name.toLowerCase().replace(/\s+/g, '')
            const newUsername = `${cleanName}_${existingClass.school.code.toLowerCase()}_${newParentClass.name.toLowerCase().replace(/\s+/g, '')}_${student.rollNo}`

            // Generate new QR code data with updated username
            const qrData = JSON.stringify({
              username: newUsername,
              password: student.password, // Keep the same password
              classId: classId,
              rollNo: student.rollNo,
            })

            // Generate new QR code image
            const newQrCode = await generateQRCode(qrData)

            // Update the user's username and QR code
            await tx.user.update({
              where: { id: student.userId },
              data: {
                username: newUsername,
                qrCode: newQrCode,
                updatedAt: new Date(),
              },
            })

            // Update the student's username as well
            await tx.student.update({
              where: { id: student.id },
              data: {
                username: newUsername,
                updatedAt: new Date(),
              },
            })

            console.log(
              `Updated student ${student.name} username from ${student.username} to ${newUsername} and regenerated QR code`
            )
          }
        }

        return updatedClass
      } else {
        // For template classes or when no parent class change, update other fields
        const updatedClass = await tx.class.update({
          where: { id: classId },
          data: {
            startRollNumber: startRollNumber
              ? parseInt(startRollNumber)
              : existingClass.startRollNumber,
            section: section || existingClass.section,
            updatedAt: new Date(), // Ensure updatedAt is set
          },
          include: {
            school: true,
            parentClass: true,
          },
        })

        return updatedClass
      }
    })

    return NextResponse.json({
      success: true,
      class: result,
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
