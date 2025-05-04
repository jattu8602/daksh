import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
  try {
    const { schoolId, classId } = params;

    // Check if the class exists and belongs to the specified school
    const classData = await prisma.class.findFirst({
      where: {
        id: classId,
        schoolId: schoolId
      },
      include: {
        school: true,
      }
    });

    if (!classData) {
      return NextResponse.json(
        { message: "Class not found or doesn't belong to the specified school" },
        { status: 404 }
      );
    }

    // Get all students for this class
    const students = await prisma.student.findMany({
      where: {
        classId: classId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            qrCode: true,
            role: true,
          }
        }
      },
      orderBy: {
        rollNo: 'asc',
      },
    });

    // Format the students data for easier consumption by the frontend
    const formattedStudents = students.map(student => ({
      id: student.id,
      userId: student.userId,
      name: student.user.name,
      rollNo: student.rollNo,
      username: student.user.username,
      qrCode: student.user.qrCode ? true : false,
      role: student.user.role,
    }));

    return NextResponse.json({
      class: classData,
      students: formattedStudents,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { error: "Something went wrong", message: error.message },
      { status: 500 }
    );
  }
}