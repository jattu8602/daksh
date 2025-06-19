import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'
import fs from 'fs-extra'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const r2 = new S3Client({
  region: 'auto',
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
})

function sanitizeHeaderValue(value) {
  return (value || '')
    .replace(/[^\x20-\x7E]+/g, '') // remove non-ASCII
    .replace(/[\r\n]+/g, ' ') // replace newlines with space
    .substring(0, 200) // limit length for safety
}

async function uploadToCloudflare({ localPath, title, description }) {
  const fileStream = fs.createReadStream(localPath)
  const fileName = `${Date.now()}-${title
    .replace(/[^a-z0-9]/gi, '_')
    .toLowerCase()}.mp4`
  const objectKey = `videos/${fileName}`

  await r2.send(
    new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: objectKey,
      Body: fileStream,
      ContentType: 'video/mp4',
      Metadata: {
        title: sanitizeHeaderValue(title),
        description: sanitizeHeaderValue(description),
      },
    })
  )

  // Use public URL format for R2
  const cloudflareUrl = `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${objectKey}`
  return { cloudflareUrl }
}

export async function POST(request) {
  try {
    const { title, description, metaDescription, hashtags, jobId } =
      await request.json()
    if (!title || !jobId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Fetch the job to get the localPath and url
    const job = await prisma.videoJob.findUnique({ where: { id: jobId } })
    if (
      !job ||
      !job.result ||
      !job.result.metadata ||
      !job.result.metadata.localPath
    ) {
      return NextResponse.json(
        { error: 'Invalid jobId or missing localPath' },
        { status: 400 }
      )
    }
    const { localPath, url } = { ...job.result.metadata, url: job.url }

    // Upload to Cloudflare
    const { cloudflareUrl } = await uploadToCloudflare({
      localPath,
      title,
      description,
    })

    // Update the video record in the database (create if not exists)
    let video = await prisma.video.findFirst({ where: { url: cloudflareUrl } })
    if (!video) {
      video = await prisma.video.create({
        data: {
          title,
          description: description || metaDescription || title,
          metaDescription,
          url: cloudflareUrl,
          source: 'youtube',
          sourcePlatform: 'youtube',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      })
    } else {
      video = await prisma.video.update({
        where: { id: video.id },
        data: {
          title,
          description: description || metaDescription || title,
          metaDescription,
          url: cloudflareUrl,
          source: 'youtube',
          sourcePlatform: 'youtube',
          updatedAt: new Date(),
        },
      })
    }

    // Handle hashtags
    if (hashtags && Array.isArray(hashtags)) {
      // Remove existing hashtag connections
      await prisma.videoHashtag.deleteMany({ where: { videoId: video.id } })
      for (const tag of hashtags) {
        const cleanTag = tag.startsWith('#') ? tag.slice(1) : tag
        const hashtag = await prisma.hashtag.upsert({
          where: { tag: cleanTag },
          update: {},
          create: { tag: cleanTag },
        })
        await prisma.videoHashtag.create({
          data: {
            videoId: video.id,
            hashtagId: hashtag.id,
          },
        })
      }
    }

    // Clean up the temp file
    try {
      await fs.unlink(localPath)
    } catch (e) {
      // Ignore cleanup errors
    }

    // Optionally update the job status
    await prisma.videoJob.update({
      where: { id: jobId },
      data: { status: 'uploaded' },
    })

    return NextResponse.json({ success: true, video })
  } catch (error) {
    console.error('Error uploading video:', error)
    return NextResponse.json(
      { error: 'Failed to upload video', message: error.message },
      { status: 500 }
    )
  }
}
