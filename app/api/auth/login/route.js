import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { UserRole } from "@prisma/client";

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password, role } = body;

    console.log("Login attempt:", { username, role }); // Log login attempt

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
        student: role === UserRole.STUDENT ? {
          include: {
            class: {
              include: {
                school: true
              }
            }
          }
        } : undefined,
        mentor: role === UserRole.MENTOR ? true : undefined,
        admin: role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN ? true : undefined,
      },
    });

    console.log("Found user:", user ? "Yes" : "No"); // Log if user was found

    if (!user) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    // For students, check both User and Student tables for password
    if (role === UserRole.STUDENT) {
      const student = user.student;
      if (!student) {
        return NextResponse.json(
          { error: "Student account not found" },
          { status: 401 }
        );
      }

      // Check password in both User and Student tables
      if (user.password !== password && student.password !== password) {
        console.log("Password mismatch for student"); // Log password mismatch
        return NextResponse.json(
          { error: "Invalid username or password" },
          { status: 401 }
        );
      }
    } else {
      // For other roles, only check User table
      if (user.password !== password) {
        console.log("Password mismatch for non-student"); // Log password mismatch
        return NextResponse.json(
          { error: "Invalid username or password" },
          { status: 401 }
        );
      }
    }

    if (role && user.role !== role) {
      console.log("Role mismatch:", { expected: role, actual: user.role }); // Log role mismatch
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