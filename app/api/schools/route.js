import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/schools - Get all schools
export async function GET(request) {
  try {
    // Get all schools
    const schools = await prisma.school.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json({
      schools,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching schools:", error);
    return NextResponse.json(
      { error: "Something went wrong", message: error.message },
      { status: 500 }
    );
  }
}

// POST /api/schools - Create a new school
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, code, email, phone } = body;

    if (!name || !code) {
      return NextResponse.json(
        { error: "School name and code are required" },
        { status: 400 }
      );
    }

    // Check if school code already exists
    const existingSchool = await prisma.school.findUnique({
      where: { code },
    });

    if (existingSchool) {
      return NextResponse.json(
        { error: "School code already exists" },
        { status: 400 }
      );
    }

    const school = await prisma.school.create({
      data: {
        name,
        code,
        email,
        phone,
      },
    });

    return NextResponse.json({
      success: true,
      school,
    });
  } catch (error) {
    console.error("Error creating school:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}