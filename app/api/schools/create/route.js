import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request) {
  try {
    const { name, code, email, phone } = await request.json();

    if (!name || !code) {
      return NextResponse.json(
        { message: "School name and code are required" },
        { status: 400 }
      );
    }

    // Check if school code already exists
    const existingSchool = await prisma.school.findUnique({
      where: { code },
    });

    if (existingSchool) {
      return NextResponse.json(
        { message: "School with this code already exists" },
        { status: 400 }
      );
    }

    // Check if email already exists (if provided)
    if (email) {
      const existingEmail = await prisma.school.findUnique({
        where: { email },
      });

      if (existingEmail) {
        return NextResponse.json(
          { message: "School with this email already exists" },
          { status: 400 }
        );
      }
    }

    // Create school
    const school = await prisma.school.create({
      data: {
        name,
        code,
        email,
        phone,
      },
    });

    return NextResponse.json({
      message: "School created successfully",
      school,
      success: true,
    });
  } catch (error) {
    console.error("Error creating school:", error);
    return NextResponse.json(
      { error: "Something went wrong", message: error.message },
      { status: 500 }
    );
  }
}