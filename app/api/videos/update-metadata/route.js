import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(request) {
  try {
    const { videoId, metaDescription, hashtags } = await request.json()

    if (!videoId) {
      return NextResponse.json(
        { error: "Video ID is required" },
        { status: 400 }
      )
    }

    // Start a transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      try {
        // Update video meta description
        const updatedVideo = await tx.video.update({
          where: { id: videoId },
          data: {
            metaDescription: metaDescription || undefined,
          },
        })

        // If hashtags are provided, update them
        if (hashtags && Array.isArray(hashtags)) {
          // Remove existing hashtag connections
          await tx.videoHashtag.deleteMany({
            where: { videoId },
          })

          // Create or find hashtags and connect them
          for (const tag of hashtags) {
            const cleanTag = tag.startsWith("#") ? tag.slice(1) : tag

            // Find or create the hashtag
            const hashtag = await tx.hashtag.upsert({
              where: { tag: cleanTag },
              update: {},
              create: { tag: cleanTag },
            })

            // Create the connection
            await tx.videoHashtag.create({
              data: {
                videoId,
                hashtagId: hashtag.id,
              },
            })
          }
        }

        // Fetch the updated video with its hashtags
        return await tx.video.findUnique({
          where: { id: videoId },
          include: {
            videoHashtags: {
              include: {
                hashtag: true,
              },
            },
          },
        })
      } catch (error) {
        console.error("Transaction error:", error)
        throw error
      }
    })

    return NextResponse.json({
      success: true,
      video: {
        ...result,
        hashtags: result.videoHashtags.map(vh => vh.hashtag.tag),
      },
    })
  } catch (error) {
    console.error("Error updating video metadata:", error)
    return NextResponse.json(
      {
        error: "Failed to update video metadata",
        details: error.message,
        code: error.code
      },
      { status: 500 }
    )
  }
}