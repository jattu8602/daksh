import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const videos = await prisma.video.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ videos });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch videos', message: error.message }, { status: 500 });
  }
}