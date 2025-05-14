import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { generateQRCode } from "@/lib/qrcode";

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
        { message: "Forbidden: Only SUPERADMIN can create admins" },
        { status: 403 }
      );
    }

    const { name, email, phone, createdBy } = await request.json();

    if (!name || !email) {
      return NextResponse.json(
        { message: "Name and email are required" },
        { status: 400 }
      );
    }

    // Generate a username based on the name (lowercase, no spaces)
    const username = name.toLowerCase().replace(/\s+/g, "_");

    // Check if username already exists
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Username already exists" },
        { status: 400 }
      );
    }

    // Generate a random password
    const password = Math.random().toString(36).slice(-8);

    // Generate QR code for the new admin
    const qrData = JSON.stringify({
      username,
      role: UserRole.ADMIN,
    });
    const qrCode = await generateQRCode(qrData);

    // Create admin user
    const adminUser = await prisma.user.create({
      data: {
        name,
        username,
        password,
        role: UserRole.ADMIN,
        qrCode,
        admin: {
          create: {
            email,
            phone,
            createdBy,
          },
        },
      },
      include: {
        admin: true,
      },
    });

    // Remove password from response
    const { password: _, ...adminData } = adminUser;

    return NextResponse.json({
      message: "Admin created successfully",
      admin: adminData,
      password, // Include the generated password in the response
      success: true,
    });
  } catch (error) {
    console.error("Error creating admin:", error);
    return NextResponse.json(
      { error: "Something went wrong", message: error.message },
      { status: 500 }
    );
  }
}