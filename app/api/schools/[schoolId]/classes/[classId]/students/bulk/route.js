import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateQRCode } from "@/lib/qrcode";
import QRCode from 'qrcode';
import { revalidatePath } from 'next/cache';

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

    // Get the class information including current students
    const classData = await prisma.class.findUnique({
      where: { id: classId },
      include: {
        students: true
      }
    });

    if (!classData) {
      return NextResponse.json(
        { error: "Class not found" },
        { status: 404 }
      );
    }

    // Validate gender distribution in the import data
    const boysCount = students.filter(student => student.gender === "M").length;
    const girlsCount = students.filter(student => student.gender === "F").length;

    if (boysCount + girlsCount !== students.length) {
      return NextResponse.json(
        { error: "All students in the import must have a valid gender (M or F)" },
        { status: 400 }
      );
    }

    // Check if all roll numbers are unique within this class (including existing students)
    const existingRollNumbers = classData.students.map(s => s.rollNo);
    const newRollNumbers = students.map(student => parseInt(student.rollNo));

    const duplicateRollNumbers = newRollNumbers.filter(rollNo =>
      existingRollNumbers.includes(rollNo) ||
      newRollNumbers.filter(n => n === rollNo).length > 1
    );

    if (duplicateRollNumbers.length > 0) {
      return NextResponse.json(
        { error: `Duplicate roll numbers found in import or existing in class: ${duplicateRollNumbers.join(", ")}` },
        { status: 400 }
      );
    }

    // Prepare student data with QR codes and user creation
    const studentData = await Promise.all(students.map(async (student) => {
      // Generate username based on name and roll number (simplified)
      const firstName = student.name.split(' ')[0].toLowerCase();
      // Note: Class name and school code might not be available for common classes,
      // so we'll simplify the username generation here.
      const username = `${firstName}_${classId.substring(0, 4)}_${student.rollNo}`;

      // Generate password
      const password = Math.random().toString(36).substring(2, 15);

      // Generate QR code data
      const qrData = JSON.stringify({
        username,
        password,
        classId,
        rollNo: parseInt(student.rollNo),
      });

      // Generate QR code image
      const qrCode = await generateQRCode(qrData);

      return {
        rollNo: parseInt(student.rollNo),
        name: student.name,
        gender: student.gender.toUpperCase(),
        username,
        password,
        qrCode,
        profileImage: student.profileImage || null,
        user: {
          create: {
            name: student.name,
            username,
            password,
            role: "STUDENT",
            qrCode,
            profileImage: student.profileImage || null
          }
        },
        class: {
          connect: { id: classId }
        }
      };
    }));

    // Create students in bulk transaction
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

    // Calculate and update class student counts after successful creation
    const totalAdded = createdStudents.length;
    const boysAdded = createdStudents.filter(s => s.gender === 'M').length;
    const girlsAdded = createdStudents.filter(s => s.gender === 'F').length;

    const updatedTotalStudents = (classData.totalStudents || 0) + totalAdded;
    const updatedBoys = (classData.boys || 0) + boysAdded;
    const updatedGirls = (classData.girls || 0) + girlsAdded;

    await prisma.class.update({
      where: { id: classId },
      data: {
        totalStudents: updatedTotalStudents,
        boys: updatedBoys,
        girls: updatedGirls,
      },
    });

    // Revalidate the cache for the class details page
    revalidatePath(`/admin/schools/${classData.schoolId}/classes/${classId}`);

    return NextResponse.json({
      success: true,
      students: createdStudents.map(student => ({
        id: student.id,
        name: student.user.name,
        rollNo: student.rollNo,
        username: student.user.username,
        password: student.user.password,
        qrCode: true,
        userId: student.userId,
      }))
    });

  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
