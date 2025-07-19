import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request) {
  try {
    const { classId, schoolId, startRollNumber, section } = await request.json()

    if (!classId || !schoolId) {
      return NextResponse.json(
        { message: 'Class ID and School ID are required' },
        { status: 400 }
      )
    }

    // Check if the school exists
    const school = await prisma.school.findUnique({
      where: { id: schoolId },
    })

    if (!school) {
      return NextResponse.json({ message: 'School not found' }, { status: 404 })
    }

    // Find the common/template class by its ID
    const templateClass = await prisma.class.findUnique({
      where: { id: classId },
    })

    // Verify it's a template class
    if (
      !templateClass ||
      !templateClass.isCommon ||
      templateClass.schoolId !== null
    ) {
      return NextResponse.json(
        { message: 'Template class not found or invalid' },
        { status: 404 }
      )
    }

    // Check if this template class is already instantiated in this school with this section
    const existingClassInSchool = await prisma.class.findFirst({
      where: {
        parentClassId: classId,
        schoolId,
        section: section || null,
      },
    })

    if (existingClassInSchool) {
      return NextResponse.json(
        {
          message: `Class "${templateClass.name}" with section "${section || 'default'}" already exists in this school`,
        },
        { status: 400 }
      )
    }

    // Create a new school-specific class instance that references the template
    const newClass = await prisma.class.create({
      data: {
        name: templateClass.name, // Copy name for easier queries
        parentClassId: classId, // Reference to template class
        schoolId,
        startRollNumber: startRollNumber ? parseInt(startRollNumber) : 1,
        isCommon: false, // This is a school-specific instance
        section: section || null,
      },
      include: {
        school: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        parentClass: {
          select: {
            id: true,
            name: true,
            isCommon: true,
          },
        },
      },
    })

    // Clear any cached data for this school
    const cacheKey = `school:${schoolId}:classes`
    if (typeof window !== 'undefined') {
      localStorage.removeItem(cacheKey)
      localStorage.removeItem(`${cacheKey}:timestamp`)
    }

    return NextResponse.json({
      message: 'Class created successfully',
      class: newClass,
      success: true,
    })
  } catch (error) {
    console.error('Error creating class:', error)
    return NextResponse.json(
      { message: error.message || 'Failed to create class' },
      { status: 500 }
    )
  }
}
