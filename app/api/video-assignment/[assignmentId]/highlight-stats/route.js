import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

function isValidObjectId(id) {
  return typeof id === 'string' && id.length === 24 && /^[a-fA-F0-9]+$/.test(id);
}

// GET: List all comments or likes for a video assignment
export async function GET(request, context) {
  const { assignmentId } = await context.params;
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type'); // 'comments' or 'likes'
  const studentId = searchParams.get('studentId');

  if (!assignmentId) {
    return NextResponse.json({ error: 'Assignment ID is required' }, { status: 400 });
  }

  if (type === 'comments') {
    // List all comments for this assignment
    const comments = await prisma.highlightStat.findMany({
      where: {
        videoAssignId: assignmentId,
        comment: { not: null },
      },
      include: {
        student: {
          include: { user: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
    return NextResponse.json({ success: true, comments });
  } else if (type === 'likes') {
    // List all likes for this assignment
    const likes = await prisma.highlightStat.findMany({
      where: {
        videoAssignId: assignmentId,
        liked: true,
      },
      include: {
        student: {
          include: { user: true },
        },
      },
    });
    return NextResponse.json({ success: true, likes });
  } else if (studentId) {
    // Return like count and whether this student has liked the post
    const likeCount = await prisma.highlightStat.count({
      where: {
        videoAssignId: assignmentId,
        liked: true,
      },
    });
    let liked = false;
    if (isValidObjectId(studentId)) {
      const stat = await prisma.highlightStat.findUnique({
        where: {
          videoAssignId_studentId: {
            videoAssignId: assignmentId,
            studentId,
          },
        },
      });
      liked = !!(stat && stat.liked);
    }
    return NextResponse.json({ likes: likeCount, liked });
  } else {
    return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
  }
}

// POST: Add a comment or like for a video assignment
export async function POST(request, context) {
  const { assignmentId } = await context.params;
  const body = await request.json();
  const { studentId, comment, like } = body;

  if (!assignmentId || !studentId) {
    return NextResponse.json({ error: 'Assignment ID and student ID are required' }, { status: 400 });
  }
  if (!isValidObjectId(studentId)) {
    return NextResponse.json({ error: 'studentId must be a valid 24-character hex string (ObjectId)' }, { status: 400 });
  }

  // Upsert the highlightStat for this student and assignment
  const data = {};
  if (typeof comment === 'string') data.comment = comment;
  if (typeof like === 'boolean') data.liked = like;

  const highlightStat = await prisma.highlightStat.upsert({
    where: {
      videoAssignId_studentId: {
        videoAssignId: assignmentId,
        studentId,
      },
    },
    update: data,
    create: {
      videoAssignId: assignmentId,
      studentId,
      ...data,
    },
  });

  return NextResponse.json({ success: true, highlightStat });
}

// DELETE: Remove a like for a video assignment
export async function DELETE(request, context) {
  const { assignmentId } = await context.params;
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get('studentId');

  if (!assignmentId || !studentId) {
    return NextResponse.json({ error: 'Assignment ID and student ID are required' }, { status: 400 });
  }
  if (!isValidObjectId(studentId)) {
    return NextResponse.json({ error: 'studentId must be a valid 24-character hex string (ObjectId)' }, { status: 400 });
  }

  // Set liked to false for this student and assignment
  const highlightStat = await prisma.highlightStat.updateMany({
    where: {
      videoAssignId: assignmentId,
      studentId,
    },
    data: { liked: false },
  });

  return NextResponse.json({ success: true, highlightStat });
}