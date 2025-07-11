import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const limit = parseInt(searchParams.get('limit')) || 20;

    // Build where clause for search
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { user: { username: { contains: search, mode: 'insensitive' } } },
          ],
        }
      : {};

    // Query students with user info
    const students = await prisma.student.findMany({
      where,
      take: limit,
      include: {
        user: {
          select: {
            username: true,
            profileImage: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    // Format response
    const formatted = students.map((student) => ({
      id: student.id,
      name: student.name,
      username: student.user.username,
      profileImage: student.profileImage || student.user.profileImage,
    }));

    return NextResponse.json({ students: formatted });
  } catch (error) {
    console.error('Error searching students:', error);
    return NextResponse.json(
      { message: 'Failed to search students', error: error.message },
      { status: 500 }
    );
  }
}