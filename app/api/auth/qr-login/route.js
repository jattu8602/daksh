import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { randomBytes } from 'crypto';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Invalid QR code data" },
        { status: 400 }
      );
    }

    // Find user by username
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        student: {
          include: {
            class: {
              include: {
                school: true
              }
            }
          }
        }
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid QR code" },
        { status: 401 }
      );
    }

    // Verify user is a student
    if (user.role !== UserRole.STUDENT) {
      return NextResponse.json(
        { error: "Invalid user role" },
        { status: 403 }
      );
    }

    // Check password in both User and Student tables
    if (user.password !== password && user.student?.password !== password) {
      return NextResponse.json(
        { error: "Invalid QR code" },
        { status: 401 }
      );
    }

    // Generate a random token
    const token = randomBytes(32).toString('hex')

    // Set expiration to 3 months from now
    const expiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)

    // Create new session
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    })

    // Return user data without the password
    const { password: _, ...userData } = user;

    const response = NextResponse.json({
      success: true,
      user: userData,
    });

    // Set secure HTTP-only cookie with proper configuration
    response.cookies.set({
      name: 'student_auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 90 * 24 * 60 * 60, // 90 days in seconds
      path: '/',
    })

    return response;
  } catch (error) {
    console.error("QR Login error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}