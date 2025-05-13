import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/schools - Get all schools
export async function GET() {
  try {
    const schools = await prisma.school.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      schools,
    });
  } catch (error) {
    console.error("Error fetching schools:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch schools",
      },
      {
        status: 500,
      }
    );
  }
}

// POST /api/schools - Create a new school
export async function POST(request) {
  try {
    const { name, code, email, phone } = await request.json();

    // Validate required fields
    if (!name || !code) {
      return NextResponse.json(
        {
          success: false,
          error: "Name and code are required",
        },
        {
          status: 400,
        }
      );
    }

    // Check if school with same code already exists
    const existingSchool = await prisma.school.findFirst({
      where: {
        OR: [
          { code },
          ...(email ? [{ email }] : []),
        ],
      },
    });

    if (existingSchool) {
      return NextResponse.json(
        {
          success: false,
          error: existingSchool.code === code
            ? "A school with this code already exists"
            : "A school with this email already exists",
        },
        {
          status: 400,
        }
      );
    }

    const school = await prisma.school.create({
      data: {
        name,
        code,
        ...(email && { email }),
        ...(phone && { phone }),
      },
    });

    return NextResponse.json({
      success: true,
      school,
    });
  } catch (error) {
    console.error("Error creating school:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create school",
      },
      {
        status: 500,
      }
    );
  }
}