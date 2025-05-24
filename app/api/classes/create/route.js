import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request) {
  try {
    const { classId, schoolId, startRollNumber } = await request.json();

    if (!classId || !schoolId) {
      return NextResponse.json(
        { message: "Class ID and School ID are required" },
        { status: 400 }
      );
    }

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

    // Find the common class by its ID
    const commonClass = await prisma.class.findUnique({
      where: { id: classId },
    });

    if (!commonClass) {
       return NextResponse.json(
         { message: "Common class not found" },
         { status: 404 }
       );
     }

    // Check if a class with the same name already exists in this school
    const existingClassInSchool = await prisma.class.findFirst({
      where: {
        name: commonClass.name,
        schoolId,
      },
    });

    if (existingClassInSchool) {
      return NextResponse.json(
        { message: `Class "${commonClass.name}" already exists in this school` },
        { status: 400 }
      );
    }

    // Create a new school-specific class using the common class's name
    const newClass = await prisma.class.create({
      data: {
        name: commonClass.name,
        schoolId,
        startRollNumber: startRollNumber ? parseInt(startRollNumber) : 1,
        isCommon: false, // This is a school-specific class
      },
      include: {
        school: {
          select: {
            id: true,
            name: true,
            code: true
          }
        }
      },
    });

    // Clear any cached data for this school
    const cacheKey = `school:${schoolId}:classes`;
    if (typeof window !== 'undefined') {
      localStorage.removeItem(cacheKey);
      localStorage.removeItem(`${cacheKey}:timestamp`);
    }

    return NextResponse.json({
      message: "Class created successfully",
      class: newClass,
      success: true,
    });
  } catch (error) {
    console.error("Error creating class:", error);
    return NextResponse.json(
      { message: error.message || "Failed to create class" },
      { status: 500 }
    );
  }
}