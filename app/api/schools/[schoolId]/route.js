import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
  // Ensure params is awaited
  const { schoolId } = params;

  // Parse URL for cache control options
  const url = new URL(request.url);
  const noCache = url.searchParams.get('no-cache') === 'true';
  const includeClassDetails = url.searchParams.get('include-details') === 'true';

  // Set cache control headers
  const headers = new Headers();
  if (!noCache) {
    headers.append('Cache-Control', 'max-age=60, s-maxage=60, stale-while-revalidate=300');
  } else {
    headers.append('Cache-Control', 'no-cache, no-store, must-revalidate');
  }

  try {
    // Construct query based on requested details level
    let queryOptions = {
      where: { id: schoolId },
      select: {
        id: true,
        name: true,
        code: true,
        email: true,
        phone: true,
        classes: {
          orderBy: {
            name: 'asc',
          },
          select: {
            id: true,
            name: true,
            totalStudents: true,
            boys: true,
            girls: true,
            startRollNumber: true
          }
        },
      }
    };

    // Include student counts if detailed info requested
    if (includeClassDetails) {
      queryOptions.select.classes.select._count = {
        select: {
          students: true
        }
      };
    }

    // Get school details
    const school = await prisma.school.findUnique(queryOptions);

    if (!school) {
      return NextResponse.json(
        { message: "School not found" },
        { status: 404 }
      );
    }

    // Transform classes if we have detailed info
    if (includeClassDetails) {
      school.classes = school.classes.map(cls => ({
        ...cls,
        studentCount: cls._count?.students || 0,
        _count: undefined
      }));
    }

    return NextResponse.json({
      school,
      success: true,
    }, { headers });
  } catch (error) {
    console.error("Error fetching school:", error);
    return NextResponse.json(
      { error: "Something went wrong", message: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/schools/[schoolId] - Delete a school
export async function DELETE(request, { params }) {
  try {
    const { schoolId } = params;

    if (!schoolId) {
      return NextResponse.json(
        {
          success: false,
          error: "School ID is required",
        },
        { status: 400 }
      );
    }

    // Check if the school exists
    const school = await prisma.school.findUnique({
      where: { id: schoolId },
      include: {
        classes: {
          include: {
            students: true,
          },
        },
      },
    });

    if (!school) {
      return NextResponse.json(
        {
          success: false,
          error: "School not found",
        },
        { status: 404 }
      );
    }

    // Check if the school has any classes with students
    const hasStudents = school.classes.some(cls => cls.students.length > 0);
    if (hasStudents) {
      return NextResponse.json(
        {
          success: false,
          error: "Cannot delete school with existing students. Please remove all students first.",
        },
        { status: 400 }
      );
    }

    // Delete all classes first (cascade delete will handle students)
    await prisma.class.deleteMany({
      where: { schoolId },
    });

    // Delete the school
    await prisma.school.delete({
      where: { id: schoolId },
    });

    return NextResponse.json({
      success: true,
      message: "School deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting school:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete school",
      },
      { status: 500 }
    );
  }
}

// PUT /api/schools/[schoolId] - Update a school
export async function PUT(request, { params }) {
  try {
    const { schoolId } = params;

    if (!schoolId) {
      return NextResponse.json(
        {
          success: false,
          error: "School ID is required",
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, code, email, phone } = body;

    // Validate required fields
    if (!name || !code) {
      return NextResponse.json(
        {
          success: false,
          error: "Name and code are required",
        },
        { status: 400 }
      );
    }

    // Check if the school exists
    const existingSchool = await prisma.school.findUnique({
      where: { id: schoolId },
    });

    if (!existingSchool) {
      return NextResponse.json(
        {
          success: false,
          error: "School not found",
        },
        { status: 404 }
      );
    }

    // Check if the code is already taken by another school
    if (code !== existingSchool.code) {
      const codeExists = await prisma.school.findFirst({
        where: {
          code,
          id: { not: schoolId },
        },
      });

      if (codeExists) {
        return NextResponse.json(
          {
            success: false,
            error: "School code already exists",
          },
          { status: 400 }
        );
      }
    }

    // Update the school
    const updatedSchool = await prisma.school.update({
      where: { id: schoolId },
      data: {
        name,
        code,
        email: email || null,
        phone: phone || null,
      },
    });

    return NextResponse.json({
      success: true,
      school: updatedSchool,
      message: "School updated successfully",
    });
  } catch (error) {
    console.error("Error updating school:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update school",
      },
      { status: 500 }
    );
  }
}
