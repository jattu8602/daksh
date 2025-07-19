import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request) {
  try {
    const { classId, schoolId, startRollNumber, section } = await request.json();

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

    // Check if a school class with the same name and section already exists in this school
    const existingSchoolClass = await prisma.schoolClass.findFirst({
      where: {
        name: section ? `${commonClass.name} ${section}` : commonClass.name,
        schoolId,
      },
    });

    if (existingSchoolClass) {
      return NextResponse.json(
        { message: `Class "${section ? `${commonClass.name} ${section}` : commonClass.name}" already exists in this school` },
        { status: 400 }
      );
    }

    // Create a new school-specific class using the common class's name and section
    const newSchoolClass = await prisma.schoolClass.create({
      data: {
        name: section ? `${commonClass.name} ${section}` : commonClass.name,
        schoolId,
        commonClassId: classId,
        startRollNumber: startRollNumber ? parseInt(startRollNumber) : 1,
        section: section || null,
      },
      include: {
        school: {
          select: {
            id: true,
            name: true,
            code: true
          }
        },
        commonClass: {
          select: {
            id: true,
            name: true
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
      class: newSchoolClass,
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