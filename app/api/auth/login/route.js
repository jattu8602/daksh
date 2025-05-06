import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { UserRole } from "@prisma/client";

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password, role } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    // Find user by username
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        student: role === UserRole.STUDENT ? true : undefined,
        mentor: role === UserRole.MENTOR ? true : undefined,
        admin: role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN ? true : undefined,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    // In a real application, you would use a proper password hashing library
    // like bcrypt to verify the password
    if (user.password !== password) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    if (role && user.role !== role) {
      return NextResponse.json(
        { error: "User role does not match requested role" },
        { status: 403 }
      );
    }

    // Return user data without the password
    const { password: _, ...userData } = user;

    return NextResponse.json({
      success: true,
      user: userData,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}