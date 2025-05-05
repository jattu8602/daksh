import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
  const studentId = params.studentId;

  try {
    // Get student details
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            password: true,
            qrCode: true,
          }
        },
        class: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    });

    if (!student) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    // Return the QR code data
    return NextResponse.json({
      success: true,
      qrCode: student.user.qrCode,
      studentInfo: {
        id: student.id,
        name: student.user.name,
        rollNo: student.rollNo,
        username: student.user.username,
        password: student.user.password,
        class: student.class.name
      }
    });
  } catch (error) {
    console.error("Error fetching student QR code:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}