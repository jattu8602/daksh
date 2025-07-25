import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request, { params }) {
  const schoolId = params.schoolId;
  const classId = params.classId;

  // Use URL to check for any cache-control settings
  const url = new URL(request.url)
  const noCache = url.searchParams.get('no-cache') === 'true'
  const minimal = url.searchParams.get('minimal') === 'true'

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
    // Get school class details with school and students in a single query
    const classData = await prisma.schoolClass.findUnique({
      where: { id: classId },
      include: {
        school: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        students: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                password: true,
                qrCode: true,
                profileImage: true,
              },
            },
          },
          orderBy: {
            rollNo: 'asc',
          },
          ...(minimal ? { take: 10 } : {}),
        },
      },
    })

    if (!classData) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 })
    }

    // Format the response data
    const formattedClassData = {
      ...classData,
      students: classData.students.map((student) => ({
        id: student.id,
        name: student.user.name,
        rollNo: student.rollNo,
        username: student.user.username,
        password: student.user.password,
        qrCode: student.user.qrCode ? true : false,
        profileImage: student.profileImage || student.user.profileImage,
        gender: student.gender,
      })),
    }

    return NextResponse.json(
      {
        success: true,
        class: formattedClassData,
      },
      { headers }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch class details' },
      { status: 500 }
    )
  }
}
