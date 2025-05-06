import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { generateQRCode } from "@/lib/qrcode";

export async function POST(request) {
  try {
    const { name, email, phone } = await request.json();

    if (!name) {
      return NextResponse.json(
        { message: "Name is required" },
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

    // Generate QR code for the new mentor
    const qrData = JSON.stringify({
      username,
      role: UserRole.MENTOR,
    });
    const qrCode = await generateQRCode(qrData);

    // Create mentor user
    const mentorUser = await prisma.user.create({
      data: {
        name,
        username,
        password,
        role: UserRole.MENTOR,
        qrCode,
        mentor: {
          create: {},
        },
      },
      include: {
        mentor: true,
      },
    });

    // Remove password from response
    const { password: _, ...mentorData } = mentorUser;

    return NextResponse.json({
      message: "Mentor created successfully",
      mentor: mentorData,
      password, // Include the generated password in the response
      success: true,
    });
  } catch (error) {
    console.error("Error creating mentor:", error);
    return NextResponse.json(
      { error: "Something went wrong", message: error.message },
      { status: 500 }
    );
  }
}