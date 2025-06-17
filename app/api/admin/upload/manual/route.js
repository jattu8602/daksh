import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'

const prisma = new PrismaClient()

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
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

function cleanHashtag(tag) {
  return tag.replace(/^#/, '').trim()
}

async function uploadToCloudflare(file, title, description, mediaType) {
  try {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Determine file extension based on media type
    const fileExtension = mediaType === 'video' ? '.mp4' : '.jpg'
    const contentType = mediaType === 'video' ? 'video/mp4' : 'image/jpeg'
    const folder = mediaType === 'video' ? 'videos' : 'images'

    const fileName = `${Date.now()}-${title
      .replace(/[^a-z0-9]/gi, '_')
      .toLowerCase()}${fileExtension}`
    const objectKey = `${folder}/${fileName}`

    console.log('Uploading to Cloudflare R2:', {
      bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      key: objectKey,
      size: buffer.length,
      type: contentType,
    })

    await r2.send(
      new PutObjectCommand({
        Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
        Key: objectKey,
        Body: buffer,
        ContentType: contentType,
        Metadata: {
          title: sanitizeHeaderValue(title),
          description: sanitizeHeaderValue(description),
        },
      })
    )

    // Use public URL format for R2
    const cloudflareUrl = `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${objectKey}`
    console.log('Upload successful, URL:', cloudflareUrl)
    return { cloudflareUrl }
  } catch (error) {
    console.error('Error in uploadToCloudflare:', error)
    throw error
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    const title = formData.get('title')
    const description = formData.get('description')
    const metaDescription = formData.get('metaDescription')
    const hashtags = JSON.parse(formData.get('hashtags')).map(cleanHashtag)
    const mediaType = file.type.startsWith('video/') ? 'video' : 'image'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    console.log('Starting upload process for:', title)

    // Upload to Cloudflare
    const { cloudflareUrl } = await uploadToCloudflare(
      file,
      title,
      description,
      mediaType
    )

    console.log('Creating database record for:', title)

    // Create media record in database
    const video = await prisma.video.create({
      data: {
        title,
        description: description || null,
        metaDescription: metaDescription || null,
        url: cloudflareUrl,
        source: 'manual',
        sourcePlatform: 'manual',
        mediaType,
        videoHashtags: {
          create: hashtags.map((tag) => ({
            hashtag: {
              connectOrCreate: {
                where: { tag },
                create: { tag },
              },
            },
          })),
        },
      },
      include: {
        videoHashtags: {
          include: {
            hashtag: true,
          },
        },
      },
    })

    console.log('Upload process completed successfully')

    return NextResponse.json({
      success: true,
      video: {
        ...video,
        hashtags: video.videoHashtags.map((vh) => vh.hashtag.tag),
      },
    })
  } catch (error) {
    console.error('Error uploading media:', error)
    return NextResponse.json(
      { error: 'Failed to upload media', details: error.message },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
