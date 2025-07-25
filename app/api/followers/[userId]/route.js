import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req, { params }) {
  const { userId } = await params;
  if (!userId) {
    return NextResponse.json({ message: 'User ID required' }, { status: 400 });
  }
  try {
    const followers = await prisma.follow.findMany({
      where: { followingId: userId, status: 'accepted' },
      include: {
        follower: {
          select: { id: true, username: true, name: true, profileImage: true },
        },
      },
    });
    return NextResponse.json({
      followers: followers.map(f => f.follower),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
