import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import * as XLSX from 'xlsx';

export async function GET(request, { params }) {
  const schoolId = params.schoolId;

  try {
    // Get school details with all classes and students in a single query
    const schoolData = await prisma.school.findUnique({
      where: { id: schoolId },
      include: {
        classes: {
          include: {
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
                    password: true,
                    qrCode: true,
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!schoolData) {
      return NextResponse.json(
        { error: "School not found" },
        { status: 404 }
      );
    }

    // Create workbook with separate worksheet for each class
    const workbook = XLSX.utils.book_new();

    // Add a school overview sheet
    const classOverview = schoolData.classes.map(cls => ({
      "Class Name": cls.name,
      "Total Students": cls.totalStudents || cls.students.length,
      "Boys": cls.boys || 0,
      "Girls": cls.girls || 0,
      "Start Roll No.": cls.startRollNumber || 1
    }));

    const overviewSheet = XLSX.utils.json_to_sheet(classOverview);
    XLSX.utils.book_append_sheet(workbook, overviewSheet, 'Classes Overview');

    // Create a worksheet for each class
    schoolData.classes.forEach(cls => {
      const studentsData = cls.students.map(student => ({
        "Roll No": student.rollNo,
        "Name": student.user.name,
        "Username": student.user.username,
        "Password": student.user.password || "",
        "QR Code Available": student.user.qrCode ? "Yes" : "No",
        "Class": cls.name
      }));

      if (studentsData.length > 0) {
        const worksheet = XLSX.utils.json_to_sheet(studentsData);
        XLSX.utils.book_append_sheet(workbook, worksheet, `${cls.name.substring(0, 30)}`);
      }
    });

    // Create a "All Students" sheet with all students from the school
    const allStudents = schoolData.classes.flatMap(cls =>
      cls.students.map(student => ({
        "Roll No": student.rollNo,
        "Name": student.user.name,
        "Username": student.user.username,
        "Password": student.user.password || "",
        "QR Code Available": student.user.qrCode ? "Yes" : "No",
        "Class": cls.name
      }))
    );

    if (allStudents.length > 0) {
      const allStudentsSheet = XLSX.utils.json_to_sheet(allStudents);
      XLSX.utils.book_append_sheet(workbook, allStudentsSheet, 'All Students');
    }

    // Generate buffer
    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Set response headers for file download
    const headers = new Headers();
    headers.append('Content-Disposition', `attachment; filename="${schoolData.name}_students.xlsx"`);
    headers.append('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    return new NextResponse(excelBuffer, {
      status: 200,
      headers
    });
  } catch (error) {
    console.error("Error exporting school data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}