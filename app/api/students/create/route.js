import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { generateQRCode } from "@/lib/qrcode";

export async function POST(request) {
  try {
    const { name, classId, rollNo } = await request.json();

    if (!name || !classId || !rollNo) {
      return NextResponse.json(
        { message: "Student name, class ID, and roll number are required" },
        { status: 400 }
      );
    }

    // Check if the class exists and get class and school details
    const classData = await prisma.class.findUnique({
      where: { id: classId },
      include: {
        school: true,
      },
    });

    if (!classData) {
      return NextResponse.json(
        { message: "Class not found" },
        { status: 404 }
      );
    }

    // Check if a student with this roll number already exists in this class
    const existingStudent = await prisma.student.findFirst({
      where: {
        classId,
        rollNo: parseInt(rollNo),
      },
    });

    if (existingStudent) {
      return NextResponse.json(
        { message: "A student with this roll number already exists in this class" },
        { status: 400 }
      );
    }

    // Generate username based on name, class and school code
    // Format: firstname_classShortName_schoolCode
    const firstName = name.split(' ')[0].toLowerCase();
    const classShortName = classData.name.toLowerCase().replace(/\s+/g, '').substring(0, 3);
    const schoolCode = classData.school.code.toLowerCase();
    const username = `${firstName}_${classShortName}_${schoolCode}`;

    // Generate a random password
    const password = Math.random().toString(36).slice(-8);

    // Generate QR code for the new student
    const qrData = JSON.stringify({
      username,
      role: UserRole.STUDENT,
    });
    const qrCode = await generateQRCode(qrData);

    // Create student user
    const studentUser = await prisma.user.create({
      data: {
        name,
        username,
        password,
        role: UserRole.STUDENT,
        qrCode,
        student: {
          create: {
            rollNo: parseInt(rollNo),
            classId,
          },
        },
      },
      include: {
        student: {
          include: {
            class: {
              include: {
                school: true,
              },
            },
          },
        },
      },
    });

    // Remove password from response
    const { password: _, ...studentData } = studentUser;

    return NextResponse.json({
      message: "Student created successfully",
      student: studentData,
      password, // Include the generated password in the response
      success: true,
    });
  } catch (error) {
    console.error("Error creating student:", error);
    return NextResponse.json(
      { error: "Something went wrong", message: error.message },
      { status: 500 }
    );
  }
}