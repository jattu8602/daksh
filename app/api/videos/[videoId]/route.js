import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function DELETE(_request, { params }) {
  const { videoId } = params

  if (!videoId) {
    return NextResponse.json({ error: 'Video ID is required' }, { status: 400 })
  }

  try {
    await prisma.$transaction(async (tx) => {
      // Remove videoHashtag mappings
      await tx.videoHashtag.deleteMany({ where: { videoId } })

      // Remove video assignments first as they reference video
      await tx.videoAssignment.deleteMany({ where: { videoId } })

      // Finally delete the video itself
      await tx.video.delete({ where: { id: videoId } })
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting video:', error)
    return NextResponse.json(
      { error: 'Failed to delete video', details: error.message },
      { status: 500 }
    )
  }
}
