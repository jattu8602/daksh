import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { message: "Username is required" },
        { status: 400 }
      );
    }

    // Check if username exists in User model
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    return NextResponse.json({
      available: !existingUser,
      message: existingUser ? "Username already taken" : "Username is available",
    });
  } catch (error) {
    console.error("Error checking username:", error);
    return NextResponse.json(
      { message: "Failed to check username" },
      { status: 500 }
    );
  }
}