import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request) {
  try {
    const token = request.cookies.get('student_auth_token')?.value
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }
    const session = await prisma.session.findUnique({
      where: { token },
      include: {
        user: {
          include: { student: true },
        },
      },
    })
    if (!session || !session.user?.student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }
    const studentId = session.user.student.id
    const data = await request.json()
    await prisma.onboarding.upsert({
      where: { studentId },
      update: {
        interests: data.interests || [],
        completed: true,
      },
      create: {
        studentId,
        interests: data.interests || [],
        completed: true,
      },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Onboarding complete error:', error)
    return NextResponse.json(
      { error: 'Failed to save onboarding data' },
      { status: 500 }
    )
  }
}
