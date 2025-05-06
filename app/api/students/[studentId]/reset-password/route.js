import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateQRCode } from "@/lib/qrcode";

// POST /api/students/[studentId]/reset-password
export async function POST(request, { params }) {
  try {
    const { studentId } = params;

    if (!studentId) {
      return NextResponse.json(
        { error: "Student ID is required" },
        { status: 400 }
      );
    }

    // Find student with user and class info
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        user: true,
        class: {
          include: {
            school: true,
          },
        },
      },
    });

    if (!student) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    // Generate new random password
    const newPassword = Math.random().toString(36).slice(-8);

    // Generate QR code with student info
    const qrData = {
      username: student.user.username,
      password: newPassword,
      class: student.class.name,
      school: student.class.school.name,
      rollNo: student.rollNo,
    };

    const qrCode = await generateQRCode(JSON.stringify(qrData));

    // Update user password and QR code
    const updatedUser = await prisma.user.update({
      where: { id: student.userId },
      data: {
        password: newPassword,
        qrCode,
      },
    });

    return NextResponse.json({
      success: true,
      student: {
        id: student.id,
        name: student.name,
        rollNo: student.rollNo,
        username: student.user.username,
        password: newPassword,
        qrCode: true,
      },
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}