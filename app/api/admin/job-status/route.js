import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('id');

    if (!jobId) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
    }

    const job = await prisma.videoJob.findUnique({
      where: { id: jobId }
    });

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: job.id,
      status: job.status,
      progress: job.progress,
      currentStage: job.currentStage,
      error: job.error,
      result: job.result
    });
  } catch (error) {
    console.error('Error fetching job status:', error);
    return NextResponse.json({
      error: 'Failed to fetch job status',
      message: error.message
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}