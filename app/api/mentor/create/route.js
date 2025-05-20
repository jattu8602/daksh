import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const {
      name,
      username,
      password,
      profilePhoto,
      isOrganic,
      email,
      bio,
      skills,
      socialLinks,
      subject,
      language,
      reels,
      videos,
      highlights,
      posts,
    } = await req.json();

    // Validate required fields
    if (!name || !username || !profilePhoto) {
      return NextResponse.json(
        { message: "Name, username, and profile photo are required" },
        { status: 400 }
      );
    }

    // For organic mentors, password is required
    if (isOrganic && !password) {
      return NextResponse.json(
        { message: "Password is required for organic mentors" },
        { status: 400 }
      );
    }

    // Check if username already exists
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Username already exists" },
        { status: 400 }
      );
    }

    // Hash password if organic mentor
    const passwordHash = isOrganic ? await bcrypt.hash(password, 10) : null;

    // Create user first
    const user = await prisma.user.create({
      data: {
        name,
        username,
        password: passwordHash || "", // Empty string for inorganic mentors
        role: "MENTOR",
      },
    });

    // Create mentor profile
    const mentor = await prisma.mentor.create({
      data: {
        userId: user.id,
        isOrganic,
        profilePhoto,
        tag: isOrganic ? "organic" : "inorganic",
        email,
        bio,
        skills: skills || [],
        socialLinks: socialLinks || {},
        subject,
        language,
        reels: reels || {},
        videos: videos || {},
        highlights: highlights || {},
        posts: posts || {},
        isActive: true,
      },
    });

    // Return success response with credentials for organic mentors
    return NextResponse.json({
      message: "Mentor created successfully",
      mentor: {
        id: mentor.id,
        name: user.name,
        username: user.username,
        isOrganic: mentor.isOrganic,
        profilePhoto: mentor.profilePhoto,
      },
      // Only include password in response for organic mentors
      ...(isOrganic && { password }),
    });
  } catch (error) {
    console.error("Error creating mentor:", error);
    return NextResponse.json(
      { message: "Failed to create mentor" },
      { status: 500 }
    );
  }
}