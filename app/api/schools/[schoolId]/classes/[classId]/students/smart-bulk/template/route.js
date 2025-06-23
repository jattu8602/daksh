import { NextResponse } from "next/server";
import ExcelJS from "exceljs";

export async function GET(request, { params }) {
  try {
    const { searchParams } = new URL(request.url);
    const startRollNumber = parseInt(searchParams.get("startRollNumber"));
    const rows = parseInt(searchParams.get("rows")) || 200;

    if (isNaN(startRollNumber)) {
      return NextResponse.json(
        { error: "startRollNumber is required and must be a number" },
        { status: 400 }
      );
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Students");

    // Define columns
    worksheet.columns = [
      { header: "Roll Number", key: "rollNumber", width: 15 },
      { header: "Name", key: "name", width: 30 },
      { header: "Gender", key: "gender", width: 15 },
      { header: "Image (optional)", key: "image", width: 30 },
    ];

    // Style header
    const header = worksheet.getRow(1);
    header.font = { bold: true };
    header.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFE0E0E0" },
      };
    });

    // Populate Roll Numbers
    for (let i = 0; i < rows; i++) {
      worksheet.addRow({
        rollNumber: startRollNumber + i,
      });
    }

    // Prepare buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Set headers for file download
    const headers = new Headers();
    headers.set(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    headers.set(
      "Content-Disposition",
      `attachment; filename="student_template_${timestamp}.xlsx"`
    );

    return new NextResponse(buffer, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Error generating student template:", error);
    return NextResponse.json(
      { error: "Failed to generate template" },
      { status: 500 }
    );
  }
}