import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req, { params }) {
  const { userId } = await params;
  if (!userId) {
    return NextResponse.json({ message: 'User ID required' }, { status: 400 });
  }
  try {
    const following = await prisma.follow.findMany({
      where: { followerId: userId, status: 'accepted' },
      include: {
        following: {
          select: { id: true, username: true, name: true, profileImage: true },
        },
      },
    });
    return NextResponse.json({
      following: following.map(f => f.following),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
