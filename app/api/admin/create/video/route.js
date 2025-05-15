// This route expects the FastAPI scraper service to be running from daksh/scraper_service at http://localhost:8000
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { url, type, title } = await request.json();
    if (!url || !type) {
      return NextResponse.json({ message: 'URL and type are required' }, { status: 400 });
    }
    const endpoint = type === 'youtube' ? '/download/youtube' : '/download/instagram';
    // FastAPI service should be running at http://localhost:8000 from daksh/scraper_service
    const fastapiUrl = `http://localhost:8000${endpoint}`;
    const response = await axios.post(fastapiUrl, { url }, { responseType: 'stream' });
    const filename = `${Date.now()}.mp4`;
    const uploadDir = path.join(process.cwd(), 'public', 'videos');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, filename);
    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);
    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
    // Save metadata to DB
    const video = await prisma.video.create({
      data: {
        title: title || filename,
        source: type,
        url: `/videos/${filename}`,
      },
    });
    return NextResponse.json({ message: 'Video uploaded', video, success: true });
  } catch (error) {
    console.error('Error downloading video:', error);
    return NextResponse.json({ error: 'Failed to download video', message: error.message }, { status: 500 });
  }
}