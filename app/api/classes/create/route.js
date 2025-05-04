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

    // Create class
    const newClass = await prisma.class.create({
      data: {
        name,
        schoolId,
        totalStudents: totalStudents ? parseInt(totalStudents) : null,
        boys: boys ? parseInt(boys) : null,
        girls: girls ? parseInt(girls) : null,
        startRollNumber: startRollNumber ? parseInt(startRollNumber) : 1,
      },
      include: {
        school: true,
      },
    });

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