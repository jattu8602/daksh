import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request) {
  try {
    const token = request.cookies.get('student_auth_token')?.value
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }
    const session = await prisma.session.findUnique({
      where: { token },
      include: {
        user: {
          include: {
            student: {
              include: { onboarding: true },
            },
          },
        },
      },
    })
    if (!session || !session.user?.student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }
    const onboarding = session.user.student.onboarding
    return NextResponse.json({
      completed: !!(onboarding && onboarding.completed),
    })
  } catch (error) {
    console.error('Onboarding status error:', error)
    return NextResponse.json(
      { error: 'Failed to check onboarding status' },
      { status: 500 }
    )
  }
}
