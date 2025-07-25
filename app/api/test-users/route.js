import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req) {
  try {
    console.log('Testing database connection...');

    // Simple query to get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        name: true,
        role: true
      }
    });

    console.log('Found users:', users);

    return NextResponse.json({
      success: true,
      count: users.length,
      users: users
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}