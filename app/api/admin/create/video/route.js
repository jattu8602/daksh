// This route expects the FastAPI scraper service to be running from daksh/scraper_service at http://localhost:8000
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { url } = await request.json();
    if (!url) {
      return NextResponse.json({ error: 'No video URL provided' }, { status: 400 });
    }

    // Enqueue a new video job
    const job = await prisma.videoJob.create({
      data: {
        url,
        status: 'pending',
      },
    });

    return NextResponse.json({ jobId: job.id });
  } catch (error) {
    console.error('Error in /api/admin/create/video:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}