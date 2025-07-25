import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req) {
  try {
    // Get all users with their basic info
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        mentor: {
          select: {
            id: true,
            isOrganic: true
          }
        },
        student: {
          select: {
            id: true,
            class: {
              select: {
                name: true
              }
            }
          }
        }
      },
      take: 20
    });

    console.log('All users in database:', users);

    return NextResponse.json({
      total: users.length,
      users: users.map(user => ({
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        type: user.mentor ? (user.mentor.isOrganic ? 'mentor' : 'daksh') : user.student ? 'student' : 'user',
        class: user.student?.class?.name
      }))
    });
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}