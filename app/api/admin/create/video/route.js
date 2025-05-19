import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { downloadYouTubeVideo } from '../../../_lib/video_processor';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { url } = await request.json();
    if (!url) {
      return NextResponse.json({ error: 'No video URL provided' }, { status: 400 });
    }

    // Create initial job record
    const job = await prisma.videoJob.create({
      data: {
        url,
        status: 'processing',
        progress: 0,
        currentStage: 'starting'
      }
    });

    try {
      console.log('Starting video download for URL:', url);

      // Update job status
      await prisma.videoJob.update({
        where: { id: job.id },
        data: {
          progress: 25,
          currentStage: 'downloading'
        }
      });

      // Download video and extract metadata
      const { title, description, localPath } = await downloadYouTubeVideo(url);
      console.log('Video downloaded successfully:', { title, localPath });

      // Update job with success status
      await prisma.videoJob.update({
        where: { id: job.id },
        data: {
          status: 'success',
          result: {
            metadata: {
              title,
              description,
              localPath,
              timestamp: new Date().toISOString()
            }
          },
          progress: 100,
          currentStage: 'completed'
        }
      });

      return NextResponse.json({
        success: true,
        jobId: job.id,
        title,
        description,
        localPath,
        message: 'Video fetched successfully'
      });
    } catch (error) {
      console.error('Error processing video:', error);

      // Update job with error status
      await prisma.videoJob.update({
        where: { id: job.id },
        data: {
          status: 'error',
          error: error.message,
          progress: 0,
          currentStage: 'failed'
        }
      });

      return NextResponse.json({
        success: false,
        error: 'Failed to process video',
        message: error.message
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in video creation:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: error.message
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}