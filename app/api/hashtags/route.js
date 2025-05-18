import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    // Fetch all unique hashtags from the database
    const hashtags = await prisma.hashtag.findMany({
      select: {
        tag: true,
      },
      distinct: ["tag"],
      orderBy: {
        tag: "asc",
      },
    })

    // Format the response
    const formattedTags = hashtags.map(({ tag }) => tag)

    return NextResponse.json({ tags: formattedTags })
  } catch (error) {
    console.error("Error fetching hashtags:", error)
    return NextResponse.json(
      { error: "Failed to fetch hashtags" },
      { status: 500 }
    )
  }
}