import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateQRCode } from "@/lib/qrcode";

export async function POST(request) {
  try {
    // Authentication is handled by middleware
    // Continue with request processing

    const { students, classId } = await request.json();

    // Validate required fields
    if (!students || !Array.isArray(students) || !classId) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    // Get the class information
    const classData = await prisma.class.findUnique({
      where: { id: classId },
      include: {
        school: true,
        students: true
      }
    });

    if (!classData) {
      return NextResponse.json(
        { error: "Class not found" },
        { status: 404 }
      );
    }

    // Validate gender distribution
    const boysCount = students.filter(student => student.gender === "M").length;
    const girlsCount = students.filter(student => student.gender === "F").length;

    if (boysCount + girlsCount !== students.length) {
      return NextResponse.json(
        { error: "All students must have a valid gender (M or F)" },
        { status: 400 }
      );
    }

    // Check if we have enough available slots
    const currentBoys = classData.students.filter(s => s.gender === "M").length;
    const currentGirls = classData.students.filter(s => s.gender === "F").length;

    if (currentBoys + boysCount > classData.boys || currentGirls + girlsCount > classData.girls) {
      return NextResponse.json(
        { error: "Not enough available slots for the specified gender distribution" },
        { status: 400 }
      );
    }

    // Check if all roll numbers are unique within this class
    const existingRollNumbers = classData.students.map(s => s.rollNo);
    const newRollNumbers = students.map(student => student.rollNo);

    const duplicateRollNumbers = newRollNumbers.filter(rollNo =>
      existingRollNumbers.includes(rollNo) ||
      newRollNumbers.filter(n => n === rollNo).length > 1
    );

    if (duplicateRollNumbers.length > 0) {
      return NextResponse.json(
        { error: `Duplicate roll numbers found: ${duplicateRollNumbers.join(", ")}` },
        { status: 400 }
      );
    }

    // Prepare student data with QR codes
    const studentData = await Promise.all(students.map(async (student) => {
      // Generate username based on name and roll number
      const firstName = student.name.split(' ')[0].toLowerCase();
      const classShortName = classData.name.toLowerCase().replace(/\s+/g, '').substring(0, 3);
      const schoolCode = classData.school.code.toLowerCase();
      const username = `${firstName}_${classShortName}_${schoolCode}_${student.rollNo}`;

      // Generate password
      const password = Math.random().toString(36).substring(2, 15);

      // Generate QR code data
      const qrData = {
        username,
        password,
        class: classData.name,
        school: classData.school.name,
        rollNo: student.rollNo
      };

      // Generate QR code image
      const qrCode = await generateQRCode(JSON.stringify(qrData));

      return {
        rollNo: parseInt(student.rollNo),
        name: student.name,
        gender: student.gender,
        username,
        password,
        qrCode,
        user: {
          create: {
            name: student.name,
            username,
            password,
            role: "STUDENT",
            qrCode
          }
        },
        class: {
          connect: { id: classId }
        }
      };
    }));

    // Create students in bulk
    const createdStudents = await prisma.$transaction(
      studentData.map(data =>
        prisma.student.create({
          data,
          include: {
            user: true
          }
        })
      )
    );

    return NextResponse.json({
      success: true,
      students: createdStudents.map(student => ({
        id: student.id,
        name: student.user.name,
        rollNo: student.rollNo,
        username: student.user.username,
        password: student.user.password,
        qrCode: true,
        userId: student.userId
      }))
    });

  } catch (error) {
    console.error("Error in bulk student import:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
