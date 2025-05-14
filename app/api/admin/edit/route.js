import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { UserRole } from "@prisma/client";

export async function POST(request) {
  try {
    // Get the admin_auth_token from cookies
    const cookie = request.headers.get("cookie") || "";
    const match = cookie.match(/admin_auth_token=([^;]+)/);
    const adminAuthToken = match ? match[1] : null;

    if (!adminAuthToken) {
      return NextResponse.json(
        { message: "Unauthorized: No admin token" },
        { status: 401 }
      );
    }

    // Look up the user by id (token is user id)
    const currentUser = await prisma.user.findUnique({
      where: { id: adminAuthToken },
    });

    if (!currentUser || currentUser.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json(
        { message: "Forbidden: Only SUPERADMIN can edit admins" },
        { status: 403 }
      );
    }

    const { id, name, email, username } = await request.json();
    if (!id || !name || !email || !username) {
      return NextResponse.json(
        { message: "id, name, email, and username are required" },
        { status: 400 }
      );
    }

    // Check if username is taken by another user
    const existingUser = await prisma.user.findFirst({
      where: {
        username,
        id: { not: id },
      },
    });
    if (existingUser) {
      return NextResponse.json(
        { message: "Username already exists" },
        { status: 400 }
      );
    }

    // Update user and admin tables
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        username,
        admin: {
          update: {
            email,
          },
        },
      },
      include: { admin: true },
    });

    return NextResponse.json({ success: true, admin: updatedUser });
  } catch (error) {
    console.error("Error editing admin:", error);
    return NextResponse.json(
      { error: "Something went wrong", message: error.message },
      { status: 500 }
    );
  }
}