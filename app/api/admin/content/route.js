import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const total = await prisma.video.count();

    // Fetch videos with pagination
    const videos = await prisma.video.findMany({
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        videoHashtags: {
          include: {
            hashtag: true
          }
        }
      }
    });

    // Transform videos to include duration and hashtags
    const transformedVideos = videos.map(video => ({
      ...video,
      hashtags: video.videoHashtags.map(vh => vh.hashtag.tag),
      // Extract video ID from URL for thumbnail
      thumbnailUrl: video.url.includes('youtube.com') || video.url.includes('youtu.be')
        ? `https://img.youtube.com/vi/${video.url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1]}/maxresdefault.jpg`
        : null
    }));

    return NextResponse.json({
      videos: transformedVideos,
      pagination: {
        total,
        page,
        limit,
        hasMore: skip + limit < total
      }
    });
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}