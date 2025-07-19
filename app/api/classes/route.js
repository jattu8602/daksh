import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/classes - Get all common classes
export async function GET(request) {
  try {
    const url = new URL(request.url)
    const isCommon = url.searchParams.get('isCommon')

    const whereClause =
      isCommon === 'true'
        ? { isCommon: true }
        : isCommon === 'false'
          ? { isCommon: false }
          : {} // Return all classes if no filter

    const classes = await prisma.class.findMany({
      where: whereClause,
      include: {
        _count: {
          select: {
            boards: true,
            schoolClasses: true,
            students: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Transform the data to match the frontend format
    const transformedClasses = classes.map((cls) => {
      return {
        id: cls.id,
        name: cls.name,
        totalStudents: cls._count.students || 0,
        totalSchools: cls._count.schoolClasses || 0,
        totalBoards: cls._count.boards || 0,
        isCommon: cls.isCommon,
        hasImage: false,
        _count: cls._count,
      }
    })

    return NextResponse.json({
      success: true,
      classes: transformedClasses,
    })
  } catch (error) {
    console.error('Error fetching common classes:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch common classes',
      },
      {
        status: 500,
      }
    )
  }
}

// POST /api/classes - Create a new common class
export async function POST(request) {
  try {
    const body = await request.json()

    const { name } = body

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          error: 'Class name is required',
        },
        { status: 400 }
      )
    }

    // Check if a common class with the same name already exists
    const existingClass = await prisma.class.findFirst({
      where: {
        name: name.trim(),
        isCommon: true,
      },
    })

    if (existingClass) {
      return NextResponse.json(
        {
          success: false,
          error: 'A common class with this name already exists',
        },
        { status: 400 }
      )
    }

    // Create the class as common
    const newClass = await prisma.class.create({
      data: {
        name: name.trim(),
        isCommon: true,
        schoolId: null, // Explicitly set to null for template classes
        parentClassId: null, // Template classes don't have parents
        startRollNumber: 1, // Default for template classes
      },
      include: {
        _count: {
          select: {
            students: true,
          },
        },
      },
    })

    // Get the count of schools using this template class
    const schoolCount = await prisma.class.count({
      where: {
        parentClassId: newClass.id,
        isCommon: false,
      },
    })

    // Transform the response to match the frontend format (for the new class card)
    const transformedClass = {
      id: newClass.id,
      name: newClass.name,
      totalStudents: newClass._count.students,
      totalSchools: schoolCount,
      isCommon: true,
      hasImage: false,
    }

    return NextResponse.json({
      success: true,
      class: transformedClass,
      message: 'Common class created successfully',
    })
  } catch (error) {
    console.error('Error creating common class:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create common class',
      },
      { status: 500 }
    )
  }
}
