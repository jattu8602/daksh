import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
  const schoolId = params.schoolId;
  const classId = params.classId;

  // Use URL to check for any cache-control settings
  const url = new URL(request.url);
  const noCache = url.searchParams.get('no-cache') === 'true';

  // Set cache control headers
  const headers = new Headers();
  if (!noCache) {
    headers.append('Cache-Control', 'max-age=60, s-maxage=60, stale-while-revalidate=300');
  } else {
    headers.append('Cache-Control', 'no-cache, no-store, must-revalidate');
  }

  try {
    // Get class details with school and students in a single query
    // Use select instead of include where possible to reduce data transfer
    const classData = await prisma.class.findUnique({
      where: { id: classId },
      include: {
        school: {
          select: {
            id: true,
            name: true,
            code: true
          }
        },
        students: {
          orderBy: {
            rollNo: 'asc',
          },
          select: {
            id: true,
            rollNo: true,
            userId: true,
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

    // Format the response
    const response = {
      success: true,
      class: {
        ...classData,
        students: classData.students.map(student => ({
          id: student.id,
          name: student.user.name,
          rollNo: student.rollNo,
          username: student.user.username,
          password: student.user.password,
          qrCode: student.user.qrCode ? true : false,
          userId: student.userId
        }))
      }
    };

    return NextResponse.json(response, { headers });
  } catch (error) {
    console.error("Error fetching class details:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
