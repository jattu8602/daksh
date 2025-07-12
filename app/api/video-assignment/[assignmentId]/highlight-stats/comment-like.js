import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// POST: Like a comment
export async function POST(request) {
  const { commentId, studentId } = await request.json();
  if (!commentId || !studentId) {
    return NextResponse.json({ error: 'commentId and studentId are required' }, { status: 400 });
  }
  // Upsert like
  const like = await prisma.commentLike.upsert({
    where: {
      commentId_studentId: { commentId, studentId },
    },
    update: {},
    create: { commentId, studentId },
  });
  return NextResponse.json({ success: true, like });
}

// DELETE: Unlike a comment
export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const commentId = searchParams.get('commentId');
  const studentId = searchParams.get('studentId');
  if (!commentId || !studentId) {
    return NextResponse.json({ error: 'commentId and studentId are required' }, { status: 400 });
  }
  await prisma.commentLike.deleteMany({ where: { commentId, studentId } });
  return NextResponse.json({ success: true });
}

// GET: Get like count and whether the user liked the comment
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const commentId = searchParams.get('commentId');
  const studentId = searchParams.get('studentId');
  if (!commentId) {
    return NextResponse.json({ error: 'commentId is required' }, { status: 400 });
  }
  const count = await prisma.commentLike.count({ where: { commentId } });
  let liked = false;
  if (studentId) {
    liked = !!(await prisma.commentLike.findUnique({
      where: { commentId_studentId: { commentId, studentId } },
    }));
  }
  return NextResponse.json({ success: true, count, liked });
}