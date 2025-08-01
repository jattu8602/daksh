import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request, { params }) {
  const { schoolId } = await params

  const url = new URL(request.url)
  const noCache = url.searchParams.get('no-cache') === 'true'

  // Set cache control headers
  const headers = new Headers()
  if (!noCache) {
    headers.append(
      'Cache-Control',
      'max-age=60, s-maxage=60, stale-while-revalidate=300'
    )
  } else {
    headers.append('Cache-Control', 'no-cache, no-store, must-revalidate')
  }

  try {
    const classes = await prisma.class.findMany({
      where: {
        schoolId: schoolId,
        isCommon: false, // Only get school instances, not template classes
      },
      orderBy: {
        name: 'asc',
      },
      select: {
        id: true,
        name: true,
        parentClassId: true,
        totalStudents: true,
        boys: true,
        girls: true,
        startRollNumber: true,
        section: true,
        parentClass: {
          select: {
            id: true,
            name: true,
            isCommon: true,
          },
        },
        _count: {
          select: {
            students: true,
          },
        },
      },
    })

    // Transform the response to include student count
    const transformedClasses = classes.map((cls) => ({
      ...cls,
      studentCount: cls._count?.students || 0,
      _count: undefined,
    }))

    return NextResponse.json(
      {
        classes: transformedClasses,
        success: true,
      },
      { headers }
    )
  } catch (error) {
    console.error('Error fetching classes:', error)
    return NextResponse.json(
      { error: 'Something went wrong', message: error.message },
      { status: 500 }
    )
  }
}
