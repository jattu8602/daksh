import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { randomBytes } from "crypto";

// Create a new session
export async function POST(request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Generate a random token
    const token = randomBytes(32).toString('hex');

    // Set session expiry to 24 hours from now
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Create new session
    const session = await prisma.session.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });

    return NextResponse.json({
      success: true,
      session: {
        token: session.token,
        expiresAt: session.expiresAt,
      },
    });
  } catch (error) {
    console.error("Session creation error:", error);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 }
    );
  }
}

// Validate a session
export async function GET(request) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json(
        { error: "No token provided" },
        { status: 401 }
      );
    }

    const session = await prisma.session.findUnique({
      where: { token },
    });

    if (!session) {
      return NextResponse.json(
        { error: "Invalid session" },
        { status: 401 }
      );
    }

    if (session.expiresAt < new Date()) {
      // Delete expired session
      await prisma.session.delete({
        where: { id: session.id },
      });
      return NextResponse.json(
        { error: "Session expired" },
        { status: 401 }
      );
    }

    // Fetch the user with student data
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
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
      }
    });

    // Remove sensitive data before sending
    const { password, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Session validation error:", error);
    return NextResponse.json(
      { error: "Failed to validate session" },
      { status: 500 }
    );
  }
}

// Delete a session (logout)
export async function DELETE(request) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json(
        { error: "No token provided" },
        { status: 401 }
      );
    }

    await prisma.session.delete({
      where: { token },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Session deletion error:", error);
    return NextResponse.json(
      { error: "Failed to delete session" },
      { status: 500 }
    );
  }
}