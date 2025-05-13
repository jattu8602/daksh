import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { UserRole } from "@prisma/client";

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

    // Return user data without the password
    const { password: _, ...userData } = user;

    return NextResponse.json({
      success: true,
      user: userData,
    });
  } catch (error) {
    console.error("QR Login error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}