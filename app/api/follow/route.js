import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Helper to get user from session cookie
async function getCurrentUser(req) {
  const token = req.cookies.get('student_auth_token')?.value;
  if (!token) return null;
  const session = await prisma.session.findUnique({ where: { token } });
  if (!session || session.expiresAt < new Date()) return null;
  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) return null;
  return user;
}

export async function POST(req) {
  try {
    const { action, targetUserId } = await req.json();
    console.log('Follow API called with:', { action, targetUserId });

    if (!['follow', 'unfollow'].includes(action)) {
      return NextResponse.json({ message: 'Invalid action' }, { status: 400 });
    }
    if (!targetUserId) {
      return NextResponse.json({ message: 'Target user ID required' }, { status: 400 });
    }

    // Get current user from session
    const currentUser = await getCurrentUser(req);
    if (!currentUser) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const userId = currentUser.id;

    // Check if targetUserId is a username or user ID
    let targetUser;
    if (targetUserId.length === 24) {
      // Likely a MongoDB ObjectId (24 characters)
      console.log('Looking for user by ID:', targetUserId);
      targetUser = await prisma.user.findUnique({ where: { id: targetUserId } });
    } else {
      // Likely a username
      console.log('Looking for user by username:', targetUserId);
      targetUser = await prisma.user.findUnique({ where: { username: targetUserId } });
    }

    console.log('Found target user:', targetUser ? { id: targetUser.id, username: targetUser.username } : 'null');

    if (!targetUser) {
      return NextResponse.json({ message: 'Target user not found' }, { status: 404 });
    }

    const actualTargetUserId = targetUser.id;

    if (userId === actualTargetUserId) {
      return NextResponse.json({ message: 'Cannot follow yourself' }, { status: 400 });
    }

    if (action === 'follow') {
      // Prevent duplicate follows
      const existing = await prisma.follow.findUnique({
        where: { followerId_followingId: { followerId: userId, followingId: actualTargetUserId } },
      });
      if (existing) {
        return NextResponse.json({ message: 'Already following' }, { status: 400 });
      }
      await prisma.follow.create({
        data: {
          followerId: userId,
          followingId: actualTargetUserId,
          status: 'accepted',
        },
      });
      // Optional: trigger notification here
      return NextResponse.json({ message: 'Followed successfully' });
    } else if (action === 'unfollow') {
      await prisma.follow.deleteMany({
        where: { followerId: userId, followingId: actualTargetUserId },
      });
      return NextResponse.json({ message: 'Unfollowed successfully' });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}