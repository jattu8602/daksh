import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { generateQRCode } from "@/lib/qrcode";

export async function POST(request) {
  try {
    const { name, classId, rollNo, gender } = await request.json();

    if (!name || !classId || !rollNo || !gender) {
      return NextResponse.json(
        { message: "Student name, class ID, roll number, and gender are required" },
        { status: 400 }
      );
    }

    // Check if the class exists and get class details including current students
    const classData = await prisma.class.findUnique({
      where: { id: classId },
      include: {
        students: true,
        school: true, // Include school data to get school code
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

    // Generate username based on full name, school code, class name, and roll number
    const cleanName = name.toLowerCase().replace(/\s+/g, '');
    const username = `${cleanName}_${classData.school.code.toLowerCase()}_${classData.name.toLowerCase().replace(/\s+/g, '')}_${rollNo}`;

    // Generate a random password
    const password = Math.random().toString(36).slice(-8);

    // Generate QR code data
    const qrData = JSON.stringify({
      username,
      role: UserRole.STUDENT,
      classId,
      rollNo: parseInt(rollNo),
    });
    const qrCode = await generateQRCode(qrData);

    // Create student user and nested student
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
            gender: gender.toUpperCase(), // Store gender as uppercase
          },
        },
      },
      include: {
        student: true,
      },
    });

    // Update class student counts
    const updatedTotalStudents = (classData.totalStudents || 0) + 1;
    const updatedBoys = gender.toUpperCase() === 'M' ? (classData.boys || 0) + 1 : (classData.boys || 0);
    const updatedGirls = gender.toUpperCase() === 'F' ? (classData.girls || 0) + 1 : (classData.girls || 0);

    await prisma.class.update({
      where: { id: classId },
      data: {
        totalStudents: updatedTotalStudents,
        boys: updatedBoys,
        girls: updatedGirls,
      },
    });

    // Remove password from response for security
    const { password: _, ...studentData } = studentUser;

    return NextResponse.json({
      message: "Student created successfully",
      student: studentData,
      password, // Include the generated password in the response
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong", message: error.message },
      { status: 500 }
    );
  }
}