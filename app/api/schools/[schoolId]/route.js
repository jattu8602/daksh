import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
  const schoolId = params.schoolId;

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
