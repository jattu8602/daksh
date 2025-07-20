import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request, { params }) {
  try {
    const { username } = await params
    console.log('Searching for mentor with username:', username)

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        mentor: true,
      },
    })

    console.log('User found:', user ? 'Yes' : 'No')
    if (user) {
      console.log('User role:', user.role)
    }

    if (!user || user.role !== 'MENTOR') {
      return NextResponse.json(
        {
          error: 'Mentor not found',
          searchedUsername: username,
          userRole: user?.role,
        },
        { status: 404 }
      )
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching mentor:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
