import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get('id');
  if (!jobId) {
    return NextResponse.json({ error: 'No job ID provided' }, { status: 400 });
  }
  const job = await prisma.videoJob.findUnique({ where: { id: jobId } });
  if (!job) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 });
  }
  return NextResponse.json({
    status: job.status,
    result: job.result,
    error: job.error,
    progress: job.progress || 0,
    currentStage: job.currentStage || ''
  });
}