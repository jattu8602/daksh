import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 21;
    const search = searchParams.get("search") || "";
    const isOrganic = searchParams.get("isOrganic");
    const tag = searchParams.get("tag");

    // Build where clause
    const where = {
      AND: [
        ...(search ? [
          {
            OR: [
              { user: { name: { contains: search, mode: "insensitive" } } },
              { user: { username: { contains: search, mode: "insensitive" } } },
            ],
          }
        ] : []),
        ...(isOrganic !== null ? [{ isOrganic: isOrganic === "true" }] : []),
        ...(tag ? [{ tag }] : []),
      ],
    };

    // Get total count for pagination
    const total = await prisma.mentor.count({
      where,
    });

    // Fetch mentors with pagination
    const mentors = await prisma.mentor.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: {
          select: {
            name: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Format response
    const formattedMentors = mentors.map((mentor) => ({
      id: mentor.id,
      name: mentor.user.name,
      username: mentor.user.username,
      isOrganic: mentor.isOrganic,
      profilePhoto: mentor.profilePhoto,
      tag: mentor.tag,
      email: mentor.email,
      bio: mentor.bio,
      skills: mentor.skills,
      socialLinks: mentor.socialLinks,
      createdAt: mentor.createdAt,
    }));

    return NextResponse.json({
      mentors: formattedMentors,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching mentors:", error);
    return NextResponse.json(
      { message: "Failed to fetch mentors", error: error.message },
      { status: 500 }
    );
  }
}