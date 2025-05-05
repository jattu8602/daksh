import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
  const schoolId = params.schoolId;
  const url = new URL(request.url);

  // Get pagination parameters from query string
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '100');
  const noCache = url.searchParams.get('no-cache') === 'true';

  console.log(`Fetching classes for school: ${schoolId}, page: ${page}, limit: ${limit}, noCache: ${noCache}`);

  // Set cache control headers
  const headers = new Headers();
  if (!noCache) {
    headers.append('Cache-Control', 'max-age=60, s-maxage=60, stale-while-revalidate=300');
  } else {
    headers.append('Cache-Control', 'no-cache, no-store, must-revalidate');
  }

  try {
    // Check if the school exists
    const school = await prisma.school.findUnique({
      where: { id: schoolId },
      select: {
        id: true,
        name: true,
        code: true,
        email: true,
        phone: true
      }
    });

    if (!school) {
      console.error(`School not found: ${schoolId}`);
      return NextResponse.json(
        { message: "School not found" },
        { status: 404 }
      );
    }

    // Get total count for pagination
    const totalCount = await prisma.class.count({
      where: { schoolId }
    });

    console.log(`Found ${totalCount} classes for school ${schoolId}`);

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get classes for this school with pagination
    const classes = await prisma.class.findMany({
      where: {
        schoolId: schoolId,
      },
      orderBy: {
        name: 'asc',
      },
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        totalStudents: true,
        boys: true,
        girls: true,
        startRollNumber: true,
        _count: {
          select: {
            students: true
          }
        }
      }
    });

    console.log(`Returning ${classes.length} classes for school ${schoolId}`);

    // Transform the data to include actual student counts
    const transformedClasses = classes.map(cls => ({
      id: cls.id,
      name: cls.name,
      totalStudents: cls.totalStudents,
      boys: cls.boys,
      girls: cls.girls,
      startRollNumber: cls.startRollNumber,
      actualStudentCount: cls._count.students
    }));

    return NextResponse.json({
      school,
      classes: transformedClasses,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      },
      success: true,
    }, { headers });
  } catch (error) {
    console.error("Error fetching classes:", error);
    return NextResponse.json(
      { error: "Something went wrong", message: error.message, stack: process.env.NODE_ENV === 'development' ? error.stack : undefined },
      { status: 500 }
    );
  }
}