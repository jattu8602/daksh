import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
  const { schoolId, classId } = await params;

  try {
    // Get class details with school and students in a single query
    const classData = await prisma.class.findUnique({
      where: { id: classId },
      include: {
        school: true,
        students: {
          orderBy: {
            rollNo: 'asc',
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                qrCode: true,
                password: true,
              }
            }
          }
        }
      }
    });

    if (!classData) {
      return NextResponse.json(
        { error: "Class not found" },
        { status: 404 }
      );
    }

    // Format the response
    const response = {
      success: true,
      class: {
        ...classData,
        students: classData.students.map(student => ({
          id: student.id,
          name: student.user.name,
          rollNo: student.rollNo,
          username: student.user.username,
          password: student.user.password,
          qrCode: student.user.qrCode ? true : false,
          userId: student.userId
        }))
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching class details:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
