import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const imageUrl = searchParams.get('url')

    if (!imageUrl) {
      return NextResponse.json({ error: 'No URL provided' }, { status: 400 })
    }

    console.log('Fetching image via proxy:', imageUrl)

    // Fetch the image with proper headers
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'image/webp,image/apng,image/*,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        'Sec-Fetch-Dest': 'image',
        'Sec-Fetch-Mode': 'no-cors',
        'Sec-Fetch-Site': 'cross-site',
        Referer: 'https://www.pinterest.com/',
      },
    })

    if (!response.ok) {
      console.error(
        'Failed to fetch image:',
        response.status,
        response.statusText
      )
      return NextResponse.json(
        {
          error: `Failed to fetch image: ${response.status} ${response.statusText}`,
        },
        { status: response.status }
      )
    }

    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.startsWith('image/')) {
      console.error('Response is not an image:', contentType)
      return NextResponse.json(
        {
          error: 'URL does not point to an image',
        },
        { status: 400 }
      )
    }

    const imageBuffer = await response.arrayBuffer()
    console.log('Successfully fetched image:', imageBuffer.byteLength, 'bytes')

    // Return the image with proper headers
    return new Response(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': imageBuffer.byteLength.toString(),
        'Cache-Control': 'public, max-age=31536000',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  } catch (error) {
    console.error('Error fetching image:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch image',
        details: error.message,
      },
      { status: 500 }
    )
  }
}
