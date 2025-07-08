import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { UserRole } from '@prisma/client'

export async function POST(request) {
  try {
    // Get the admin_auth_token from cookies
    const cookie = request.headers.get('cookie') || ''
    const match = cookie.match(/admin_auth_token=([^;]+)/)
    const adminAuthToken = match ? match[1] : null

    if (!adminAuthToken) {
      return NextResponse.json(
        { message: 'Unauthorized: No admin token' },
        { status: 401 }
      )
    }

    // Look up the user by id (token is user id)
    const currentUser = await prisma.user.findUnique({
      where: { id: adminAuthToken },
    })

    if (!currentUser || currentUser.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json(
        { message: 'Forbidden: Only SUPERADMIN can delete admins' },
        { status: 403 }
      )
    }

    const { id } = await request.json()
    if (!id) {
      return NextResponse.json(
        { message: 'Admin id is required' },
        { status: 400 }
      )
    }

    // Prevent deleting self (superadmin)
    if (id === adminAuthToken) {
      return NextResponse.json(
        { message: 'You cannot delete yourself' },
        { status: 400 }
      )
    }

    // First check if the user exists and get admin details
    const userToDelete = await prisma.user.findUnique({
      where: { id },
      include: { admin: true },
    })

    if (!userToDelete) {
      return NextResponse.json({ message: 'Admin not found' }, { status: 404 })
    }

    // Delete the admin record first, then the user to avoid relation constraint
    await prisma.admin.delete({
      where: { userId: id },
    })

    // Then delete the user
    await prisma.user.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Admin deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting admin:', error)
    return NextResponse.json(
      { error: 'Something went wrong', message: error.message },
      { status: 500 }
    )
  }
}
