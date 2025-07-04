import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

async function generateTitlesAndDescriptions(description, count) {
  const model = genAI.getGenerativeModel({ model: 'models/gemini-2.0-flash' })
  const prompt = `You are an AI assistant that creates engaging Pinterest post ideas.\nTopic: ${description}\nGenerate exactly ${count} unique ideas. Respond ONLY with valid JSON – an array of objects with keys \"title\" and \"description\" (no markdown, no extra text). Example: [{\"title\":\"...\",\"description\":\"...\"}]`
  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.7, maxOutputTokens: 300 },
  })
  const text = (await result.response).text().trim()
  let ideas = []
  try {
    ideas = JSON.parse(text)
  } catch {
    // attempt to salvage by extracting JSON substring
    const jsonStart = text.indexOf('[')
    const jsonEnd = text.lastIndexOf(']') + 1
    if (jsonStart !== -1 && jsonEnd !== -1) {
      try {
        ideas = JSON.parse(text.slice(jsonStart, jsonEnd))
      } catch {}
    }
  }
  return ideas.filter((i) => i.title && i.description).slice(0, count)
}

async function fetchImageFromPinterestPin(pinUrl) {
  try {
    const res = await fetch(pinUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        Accept: 'text/html',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
      },
    })
    if (!res.ok) {
      throw new Error(`Failed to fetch pin: ${res.status}`)
    }
    const html = await res.text()
    // Try multiple image patterns
    const patterns = [
      /property="og:image" content="([^"]+)"/,
      /"image_url":"([^"]+)"/,
      /<img[^>]+data-src="([^"]+)"/,
      /<img[^>]+src="([^"]+)"[^>]+class="[^"]*mainImage[^"]*"/,
    ]
    // Try each pattern until we find a match
    for (const pattern of patterns) {
      const match = html.match(pattern)
      if (match && match[1]) {
        const imageUrl = match[1].replace(/\\u002F/g, '/')
        // Validate URL
        try {
          new URL(imageUrl)
          return imageUrl
        } catch {}
      }
    }
  } catch (error) {
    console.error('Error fetching Pinterest image:', error)
  }
  return null
}

async function searchPinterestImage(query, logs, index, retryCount = 0) {
  const MAX_RETRIES = 3
  if (retryCount >= MAX_RETRIES) {
    logs.push(
      `[Image ${index}] ❌ Max retries reached. Trying alternative sources...`
    )
    return await searchAlternativeImages(query, logs, index)
  }

  logs.push(
    `[Image ${index}] 🔍 Searching for Pinterest image (attempt ${
      retryCount + 1
    })...`
  )

  // Enhanced Pinterest search with better error handling
  const searchQuery = encodeURIComponent(`${query} site:pinterest.com`)
  const webSearch = `https://www.google.com/search?q=${searchQuery}&num=20&tbm=isch`

  try {
    const res = await fetch(webSearch, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        DNT: '1',
        Connection: 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
    })

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`)
    }

    const html = await res.text()
    logs.push(
      `[Image ${index}] 📄 Retrieved search page (${html.length} chars)`
    )

    // Enhanced image extraction patterns
    const imagePatterns = [
      // Direct Pinterest image URLs
      /"(https:\/\/i\.pinimg\.com\/[^"]+\.(?:jpg|jpeg|png|gif))"/gi,
      // Pinterest media URLs
      /"(https:\/\/media\.pinterest\.com\/[^"]+\.(?:jpg|jpeg|png|gif))"/gi,
      // Google cached Pinterest images
      /"ou":"(https:\/\/[^"]*pinterest[^"]*\.(?:jpg|jpeg|png|gif)[^"]*)"/gi,
      // Alternative Pinterest domains
      /"(https:\/\/.*\.pinimg\.com\/[^"]+\.(?:jpg|jpeg|png|gif))"/gi,
      // General high-quality image URLs
      /"ou":"(https:\/\/[^"]+\.(?:jpg|jpeg|png|gif))"/gi,
    ]

    const foundImages = []

    for (const pattern of imagePatterns) {
      let match
      while ((match = pattern.exec(html)) !== null && foundImages.length < 10) {
        const imageUrl = match[1]
          .replace(/\\u002F/g, '/')
          .replace(/\\u0026/g, '&')
        try {
          new URL(imageUrl)
          if (!foundImages.includes(imageUrl)) {
            foundImages.push(imageUrl)
          }
        } catch {}
      }
    }

    logs.push(
      `[Image ${index}] 🖼️ Found ${foundImages.length} potential images`
    )

    // Test images for accessibility
    for (const imageUrl of foundImages) {
      try {
        const testRes = await fetch(imageUrl, {
          method: 'HEAD',
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
          timeout: 5000,
        })

        if (
          testRes.ok &&
          testRes.headers.get('content-type')?.startsWith('image/')
        ) {
          logs.push(`[Image ${index}] ✅ Found working image: ${imageUrl}`)
          return imageUrl
        }
      } catch {
        // Continue to next image
      }
    }

    logs.push(`[Image ${index}] ⚠️ No working images found, retrying...`)
  } catch (error) {
    logs.push(`[Image ${index}] ❌ Search error: ${error.message}`)
  }

  // Retry with exponential backoff
  const delay = Math.pow(2, retryCount) * 1000 + Math.random() * 1000
  logs.push(`[Image ${index}] 🔄 Retrying in ${Math.round(delay / 1000)}s...`)
  await new Promise((resolve) => setTimeout(resolve, delay))
  return searchPinterestImage(query, logs, index, retryCount + 1)
}

// New alternative image search function
async function searchAlternativeImages(query, logs, index) {
  logs.push(`[Image ${index}] 🔄 Trying alternative image sources...`)

  // Try Unsplash for educational content
  try {
    const unsplashQuery = encodeURIComponent(`${query} education study notes`)
    const unsplashSearch = `https://www.google.com/search?q=${unsplashQuery} site:unsplash.com&tbm=isch&num=10`

    const res = await fetch(unsplashSearch, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    })

    if (res.ok) {
      const html = await res.text()
      const unsplashPattern = /"(https:\/\/images\.unsplash\.com\/[^"]+)"/g
      let match = unsplashPattern.exec(html)

      if (match) {
        const imageUrl = match[1]
        logs.push(`[Image ${index}] ✅ Found Unsplash alternative: ${imageUrl}`)
        return imageUrl
      }
    }
  } catch (error) {
    logs.push(`[Image ${index}] ❌ Unsplash search failed: ${error.message}`)
  }

  // Try Pixabay as another alternative
  try {
    const pixabayQuery = encodeURIComponent(`${query} education`)
    const pixabaySearch = `https://www.google.com/search?q=${pixabayQuery} site:pixabay.com&tbm=isch&num=10`

    const res = await fetch(pixabaySearch, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    })

    if (res.ok) {
      const html = await res.text()
      const pixabayPattern =
        /"(https:\/\/cdn\.pixabay\.com\/[^"]+\.(?:jpg|jpeg|png))"/g
      let match = pixabayPattern.exec(html)

      if (match) {
        const imageUrl = match[1]
        logs.push(`[Image ${index}] ✅ Found Pixabay alternative: ${imageUrl}`)
        return imageUrl
      }
    }
  } catch (error) {
    logs.push(`[Image ${index}] ❌ Pixabay search failed: ${error.message}`)
  }

  // Final fallback to a placeholder service
  logs.push(`[Image ${index}] 🎨 Using placeholder service as final fallback`)
  const fallbackUrl = `https://picsum.photos/600/400?random=${Date.now()}`
  return fallbackUrl
}

export async function POST(request) {
  try {
    const { description, count } = await request.json()
    console.log('Received request:', { description, count })

    if (!description || !count) {
      console.error('Missing required fields:', { description, count })
      return NextResponse.json(
        { error: 'Missing description or count' },
        { status: 400 }
      )
    }

    const logs = []
    logs.push(`Prompt: ${description}`)
    logs.push(`Number of images to generate: ${count}`)
    logs.push('---')
    logs.push('Generating post ideas with Gemini...')

    try {
      const ideas = await generateTitlesAndDescriptions(description, count)
      console.log('Generated ideas:', ideas)
      logs.push(`Generated ${ideas.length} ideas.`)
      logs.push('---')

      const items = []
      for (let i = 0; i < ideas.length; i++) {
        const idea = ideas[i]
        const index = i + 1
        logs.push(`[Image ${index}] Generating content...`)
        logs.push(`[Image ${index}] Title: ${idea.title}`)
        logs.push(`[Image ${index}] Description: ${idea.description}`)

        try {
          const imageUrl = await searchPinterestImage(idea.title, logs, index)
          if (!imageUrl) {
            logs.push(
              `[Image ${index}] ❌ Could not find image. Using placeholder.`
            )
            // Use a fallback image instead of skipping
            const fallbackUrl = `https://picsum.photos/600/400?random=${Date.now()}&text=${encodeURIComponent(
              idea.title
            )}`
            logs.push(
              `[Image ${index}] 🎨 Using fallback image: ${fallbackUrl}`
            )

            items.push({
              title: idea.title,
              description: idea.description,
              metaDescription: idea.description,
              hashtags: ['#StudyNotes', '#Education', '#Learning'],
              url: fallbackUrl,
              mediaType: 'image',
              sourcePlatform: 'fallback',
            })
            logs.push('---')
            continue
          }

          logs.push(
            `[Image ${index}] Generating meta description & hashtags...`
          )
          const protocol = request.headers.get('x-forwarded-proto') || 'http'
          const host = request.headers.get('host')
          const baseUrl = `${protocol}://${host}`

          try {
            const metaRes = await fetch(`${baseUrl}/api/ai/generate-meta`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                title: idea.title,
                originalDesc: idea.description,
              }),
            })

            if (!metaRes.ok) {
              throw new Error(`Meta generation failed: ${metaRes.status}`)
            }

            const metaData = await metaRes.json()
            const metaDescription = metaData.description || ''
            const hashtags = metaData.hashtags || []

            logs.push(`[Image ${index}] ✅ Meta & hashtags generated.`)
            logs.push(`[Image ${index}] Image URL: ${imageUrl}`)
            logs.push('---')

            items.push({
              title: idea.title,
              description: idea.description,
              metaDescription,
              hashtags,
              url: imageUrl,
              mediaType: 'image',
              sourcePlatform: 'pinterest',
            })
          } catch (metaError) {
            console.error('Meta generation error:', metaError)
            logs.push(
              `[Image ${index}] ❌ Meta generation failed: ${metaError.message}`
            )
            logs.push('---')
          }
        } catch (imageError) {
          console.error('Image search error:', imageError)
          logs.push(
            `[Image ${index}] ❌ Image search failed: ${imageError.message}`
          )
          logs.push('---')
        }
      }

      logs.push('All images processed.')

      // Ensure we always have at least one item, even with fallback content
      if (items.length === 0 && ideas.length > 0) {
        logs.push('⚠️ No images found, generating fallback content...')
        const fallbackItem = {
          title: ideas[0].title,
          description: ideas[0].description,
          metaDescription: ideas[0].description,
          hashtags: ['#StudyNotes', '#Education', '#Learning'],
          url: `https://picsum.photos/600/400?random=${Date.now()}&text=${encodeURIComponent(
            ideas[0].title
          )}`,
          mediaType: 'image',
          sourcePlatform: 'fallback',
        }
        items.push(fallbackItem)
        logs.push('✅ Fallback content generated successfully.')
      }

      if (items.length === 0) {
        logs.push('❌ No content could be generated.')
        return NextResponse.json({
          success: false,
          error: 'Failed to generate any content for the given topic.',
          items,
          logs,
        })
      }

      return NextResponse.json({ success: true, items, logs })
    } catch (genError) {
      console.error('Content generation error:', genError)
      return NextResponse.json(
        {
          error: 'Failed to generate content',
          message: genError.message,
          logs,
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Pinterest scrapper error:', error)
    return NextResponse.json(
      { error: 'Failed to generate Pinterest content', message: error.message },
      { status: 500 }
    )
  }
}
