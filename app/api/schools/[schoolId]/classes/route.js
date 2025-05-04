import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
  try {
    const schoolId = params.schoolId;

    // Check if the school exists
    const school = await prisma.school.findUnique({
      where: { id: schoolId },
    });

    if (!school) {
      return NextResponse.json(
        { message: "School not found" },
        { status: 404 }
      );
    }

    // Get all classes for this school
    const classes = await prisma.class.findMany({
      where: {
        schoolId: schoolId,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json({
      school,
      classes,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching classes:", error);
    return NextResponse.json(
      { error: "Something went wrong", message: error.message },
      { status: 500 }
    );
  }
}