import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
  const { schoolId } = await params;
  try {

    // Get school details
    const school = await prisma.school.findUnique({
      where: { id: schoolId },
      include: {
        classes: {
          orderBy: {
            name: 'asc',
          },
        },
      },
    });

    if (!school) {
      return NextResponse.json(
        { message: "School not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      school,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching school:", error);
    return NextResponse.json(
      { error: "Something went wrong", message: error.message },
      { status: 500 }
    );
  }
}
