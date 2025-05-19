const { PrismaClient } = require('@prisma/client');
const path = require('path');
const { downloadYouTubeVideo } = require('../../_lib/video_processor');

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'No video URL provided' });
    }

    console.log('Starting video download for URL:', url);

    // Download video and extract metadata
    const { title, description, localPath } = await downloadYouTubeVideo(url);
    console.log('Video downloaded successfully:', { title, localPath });

    // Create a job record to track this video fetch
    const job = await prisma.videoJob.create({
      data: {
        url,
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
      },
    });

    console.log('Job created:', job.id);

    return res.status(200).json({
      success: true,
      jobId: job.id,
      title,
      description,
      localPath,
      message: 'Video fetched successfully'
    });
  } catch (error) {
    console.error('Error in /api/admin/create/video:', error);

    // Create a failed job record
    try {
      const failedJob = await prisma.videoJob.create({
        data: {
          url: req.body?.url || 'unknown',
          status: 'error',
          error: error.message,
          result: null,
          progress: 0,
          currentStage: 'failed'
        },
      });
      console.log('Failed job recorded:', failedJob.id);
    } catch (dbError) {
      console.error('Failed to record failed job:', dbError);
    }

    return res.status(500).json({
      success: false,
      error: 'Failed to process video',
      message: error.message,
      details: error.stack
    });
  } finally {
    await prisma.$disconnect();
  }
}