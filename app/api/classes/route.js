import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/classes - Get all classes
export async function GET() {
  try {
    const classes = await prisma.class.findMany({
      include: {
        school: true,
        students: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform the data to match the frontend format
    const transformedClasses = classes.map(cls => ({
      id: cls.id,
      name: cls.name,
      students: cls.students.length,
      schools: 1, // Since each class belongs to one school
      hasImage: false, // You can add a logo field to the Class model if needed
    }));

    return NextResponse.json({
      success: true,
      classes: transformedClasses,
    });
  } catch (error) {
    console.error("Error fetching classes:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch classes",
      },
      {
        status: 500,
      }
    );
  }
}

// POST /api/classes - Create a new class
export async function POST(request) {
  try {
    const { name, schoolId } = await request.json();

    if (!name || !schoolId) {
      return NextResponse.json(
        {
          success: false,
          error: "Class name and school ID are required",
        },
        { status: 400 }
      );
    }

    // Check if the school exists
    const school = await prisma.school.findUnique({
      where: { id: schoolId },
    });

    if (!school) {
      return NextResponse.json(
        {
          success: false,
          error: "School not found",
        },
        { status: 404 }
      );
    }

    // Create the class
    const newClass = await prisma.class.create({
      data: {
        name,
        schoolId,
        startRollNumber: 1,
      },
      include: {
        school: true,
      },
    });

    // Transform the response to match the frontend format
    const transformedClass = {
      id: newClass.id,
      name: newClass.name,
      students: 0,
      schools: 1,
      hasImage: false,
    };

    return NextResponse.json({
      success: true,
      class: transformedClass,
    });
  } catch (error) {
    console.error("Error creating class:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create class",
      },
      { status: 500 }
    );
  }
}