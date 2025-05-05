import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import * as XLSX from 'xlsx';

export async function GET(request, { params }) {
  const schoolId = params.schoolId;
  const classId = params.classId;

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
                password: true,
                qrCode: true,
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

    // Format the student data for export
    const studentsData = classData.students.map(student => ({
      "Roll No": student.rollNo,
      "Name": student.user.name,
      "Username": student.user.username,
      "Password": student.user.password || "",
      "QR Code Available": student.user.qrCode ? "Yes" : "No"
    }));

    // Create a worksheet
    const worksheet = XLSX.utils.json_to_sheet(studentsData);

    // Create a workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');

    // Generate buffer
    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Set response headers for file download
    const headers = new Headers();
    headers.append('Content-Disposition', `attachment; filename="${classData.school.name}_${classData.name}_students.xlsx"`);
    headers.append('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    return new NextResponse(excelBuffer, {
      status: 200,
      headers
    });
  } catch (error) {
    console.error("Error exporting class data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}