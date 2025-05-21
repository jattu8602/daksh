import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { videoId, mentorId, contentType } = await request.json();

    if (!videoId || !mentorId || !contentType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate content type
    const validContentTypes = ['videos', 'shorts', 'post', 'highlights'];
    if (!validContentTypes.includes(contentType)) {
      return NextResponse.json(
        { error: 'Invalid content type' },
        { status: 400 }
      );
    }

    // Check if video exists
    const video = await prisma.video.findUnique({
      where: { id: videoId },
      include: {
        assignments: {
          include: {
            mentor: {
              include: {
                user: {
                  select: {
                    name: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    // Check if mentor exists with user data
    const mentor = await prisma.mentor.findUnique({
      where: { id: mentorId },
      include: {
        user: {
          select: {
            name: true
          }
        }
      }
    });

    if (!mentor) {
      return NextResponse.json(
        { error: 'Mentor not found' },
        { status: 404 }
      );
    }

    if (!mentor.user) {
      return NextResponse.json(
        { error: 'Mentor user data not found' },
        { status: 404 }
      );
    }

    // Check if video is already assigned to any mentor
    const alreadyAssigned = await prisma.videoAssignment.findFirst({
      where: { videoId },
      include: {
        mentor: {
          include: {
            user: { select: { name: true } }
          }
        }
      }
    });
    if (alreadyAssigned) {
      return NextResponse.json({
        error: 'This video is already assigned to a mentor',
        assignment: alreadyAssigned
      }, { status: 400 });
    }

    // Check if assignment already exists
    const existingAssignment = await prisma.videoAssignment.findFirst({
      where: {
        videoId,
        mentorId,
        contentType
      },
      include: {
        mentor: {
          include: {
            user: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    if (existingAssignment) {
      return NextResponse.json({
        success: true,
        assignment: existingAssignment,
        message: 'Video already assigned to this mentor with this content type'
      });
    }

    // Create assignment
    const assignment = await prisma.videoAssignment.create({
      data: {
        videoId,
        mentorId,
        contentType
      },
      include: {
        mentor: {
          include: {
            user: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      assignment
    });
  } catch (error) {
    console.error('Error assigning video:', error);
    return NextResponse.json(
      { error: 'Failed to assign video' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get('videoId');

    if (!videoId) {
      return NextResponse.json(
        { error: 'Video ID is required' },
        { status: 400 }
      );
    }

    const assignments = await prisma.videoAssignment.findMany({
      where: { videoId },
      include: {
        mentor: {
          include: {
            user: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      assignments
    });
  } catch (error) {
    console.error('Error fetching video assignments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch video assignments' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}