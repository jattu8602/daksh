import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

async function getUserFromSession(request) {
  const token = request.cookies.get('student_auth_token')?.value
  if (!token) return null

  const session = await prisma.session.findUnique({
    where: { token },
    include: {
      user: {
        include: {
          student: true,
        },
      },
    },
  })

  if (!session || session.expiresAt < new Date()) {
    return null
  }

  return session.user
}

export async function POST(request) {
  try {
    const user = await getUserFromSession(request)

    if (!user || !user.student) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { description, rating } = await request.json()

    if (!description || !rating) {
      return NextResponse.json(
        { error: 'Description and rating are required' },
        { status: 400 }
      )
    }

    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be a number between 1 and 5' },
        { status: 400 }
      )
    }

    const review = await prisma.review.create({
      data: {
        studentId: user.student.id,
        description,
        rating,
      },
    })

    return NextResponse.json({ success: true, review })
  } catch (error) {
    console.error('Failed to create review:', error)
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    )
  }
}
