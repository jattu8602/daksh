import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request) {
  try {
    const { name, schoolId, totalStudents, boys, girls, startRollNumber } = await request.json();

    if (!name || !schoolId) {
      return NextResponse.json(
        { message: "Class name and school ID are required" },
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

    // Check if a class with the same name already exists in this school
    const existingClass = await prisma.class.findFirst({
      where: {
        name,
        schoolId,
      },
    });

    if (existingClass) {
      return NextResponse.json(
        { message: "A class with this name already exists in this school" },
        { status: 400 }
      );
    }

    // Create class with proper data types
    const newClass = await prisma.class.create({
      data: {
        name,
        schoolId,
        totalStudents: totalStudents ? parseInt(totalStudents) : 0,
        boys: boys ? parseInt(boys) : 0,
        girls: girls ? parseInt(girls) : 0,
        startRollNumber: startRollNumber ? parseInt(startRollNumber) : 1,
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
      { error: "Something went wrong", message: error.message },
      { status: 500 }
    );
  }
}