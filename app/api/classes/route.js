import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/classes - Get all common classes
export async function GET() {
  try {
    const classes = await prisma.class.findMany({
      orderBy: {
        createdAt: "desc",
      }
    });

    // Get the count of schools and sum of students for each common class
    const classStats = await Promise.all(
      classes.map(async (cls) => {
        const schoolClasses = await prisma.schoolClass.findMany({
          where: {
            commonClassId: cls.id,
          },
          select: {
            schoolId: true,
            _count: {
              select: {
                students: true
              }
            }
          }
        });

        const totalStudents = schoolClasses.reduce((sum, schoolClass) => sum + (schoolClass._count?.students || 0), 0);

        // Count unique schoolIds
        const uniqueSchoolIds = new Set(schoolClasses.map(sc => sc.schoolId));
        const schoolCount = uniqueSchoolIds.size;

        return {
          id: cls.id,
          schoolCount,
          totalStudents
        };
      })
    );

    // Transform the data to match the frontend format
    const transformedClasses = classes.map(cls => {
      const stats = classStats.find(s => s.id === cls.id);
      return {
        id: cls.id,
        name: cls.name,
        totalStudents: stats?.totalStudents || 0,
        totalSchools: stats?.schoolCount || 0,
        isCommon: true,
        hasImage: false,
      };
    });

    return NextResponse.json({
      success: true,
      classes: transformedClasses,
    });
  } catch (error) {
    console.error("Error fetching common classes:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch common classes",
      },
      {
        status: 500,
      }
    );
  }
}

// POST /api/classes - Create a new common class
export async function POST(request) {
  try {
    const body = await request.json();

    const { name } = body;

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          error: "Class name is required",
        },
        { status: 400 }
      );
    }

    // Check if a common class with the same name already exists
    const existingClass = await prisma.class.findFirst({
      where: {
        name: name.trim(),
      },
    });

    if (existingClass) {
      return NextResponse.json(
        {
          success: false,
          error: "A common class with this name already exists",
        },
        { status: 400 }
      );
    }

    // Create the class as common
    const newClass = await prisma.class.create({
      data: {
        name: name.trim(),
        startRollNumber: 1, // Default for common classes
      },
      include: {
        _count: {
          select: {
            students: true,
          }
        }
      }
    });

    // Get the count of schools using this common class
    let schoolCount = 0;
    try {
      schoolCount = await prisma.schoolClass.count({
        where: {
          commonClassId: newClass.id,
        }
      });
    } catch (error) {
      console.log('SchoolClass model not available yet, using fallback count');
      schoolCount = 0;
    }

    // Transform the response to match the frontend format (for the new class card)
    const transformedClass = {
      id: newClass.id,
      name: newClass.name,
      totalStudents: newClass._count.students,
      totalSchools: schoolCount,
      isCommon: true,
      hasImage: false,
    };

    return NextResponse.json({
      success: true,
      class: transformedClass,
      message: "Common class created successfully",
    });
  } catch (error) {
    console.error("Error creating common class:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create common class",
      },
      { status: 500 }
    );
  }
}