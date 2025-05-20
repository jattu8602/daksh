import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  const { id } = params;
  try {
    const mentor = await prisma.mentor.findUnique({
      where: { id },
      include: {
        user: {
          select: { name: true, username: true },
        },
      },
    });
    if (!mentor) {
      return NextResponse.json({ message: "Mentor not found" }, { status: 404 });
    }
    return NextResponse.json({ mentor });
  } catch (error) {
    console.error("Error fetching mentor:", error);
    return NextResponse.json({ message: "Failed to fetch mentor" }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  const { id } = params;
  try {
    const body = await req.json();
    // Update mentor fields
    const mentor = await prisma.mentor.update({
      where: { id },
      data: {
        profilePhoto: body.profilePhoto,
        tag: body.tag,
        email: body.email,
        bio: body.bio,
        skills: body.skills,
        socialLinks: body.socialLinks,
        subject: body.subject,
        language: body.language,
        reels: body.reels,
        videos: body.videos,
        highlights: body.highlights,
        posts: body.posts,
        isOrganic: body.isOrganic,
      },
      include: { user: true },
    });
    // Update user fields (name, username)
    await prisma.user.update({
      where: { id: mentor.userId },
      data: {
        name: body.name,
        username: body.username,
      },
    });
    // Return updated mentor
    const updatedMentor = await prisma.mentor.findUnique({
      where: { id },
      include: {
        user: {
          select: { name: true, username: true },
        },
      },
    });
    return NextResponse.json({ mentor: updatedMentor });
  } catch (error) {
    console.error("Error updating mentor:", error);
    return NextResponse.json({ message: "Failed to update mentor" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const { id } = params;
  try {
    // Find mentor and user
    const mentor = await prisma.mentor.findUnique({ where: { id } });
    if (!mentor) {
      return NextResponse.json({ message: "Mentor not found" }, { status: 404 });
    }
    // Delete mentor and user
    await prisma.mentor.delete({ where: { id } });
    await prisma.user.delete({ where: { id: mentor.userId } });
    return NextResponse.json({ message: "Mentor deleted successfully" });
  } catch (error) {
    console.error("Error deleting mentor:", error);
    return NextResponse.json({ message: "Failed to delete mentor" }, { status: 500 });
  }
}