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
      },
    })
    const html = await res.text()
    const ogMatch = html.match(/property="og:image" content="([^"]+)"/)
    if (ogMatch) return ogMatch[1]
  } catch {}
  return null
}

async function searchPinterestImage(query, logs, index) {
  logs.push(`[Image ${index}] Searching for best Pinterest image...`)
  // First try Google normal search to get a Pinterest pin URL, then scrape its og:image
  const webSearch = `https://www.google.com/search?q=${encodeURIComponent(
    query + ' site:pinterest.com'
  )}&num=10`
  try {
    const res = await fetch(webSearch, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        Accept: 'text/html',
      },
    })
    const html = await res.text()
    const linkMatch = html.match(/\/url\?q=(https:\/\/[^&]+pinterest[^&]+)&/)
    if (linkMatch) {
      const pinUrl = decodeURIComponent(linkMatch[1])
      logs.push(`[Image ${index}] Found Pinterest pin: ${pinUrl}`)
      const img = await fetchImageFromPinterestPin(pinUrl)
      if (img) {
        logs.push(`[Image ${index}] ✅ Found og:image: ${img}`)
        return img
      }
      logs.push(`[Image ${index}] ❌ No og:image found on pin page.`)
    }
  } catch (e) {
    logs.push(`[Image ${index}] ❌ Error during web search: ${e.message}`)
  }
  // Fallback to image search JSON parsing
  logs.push(`[Image ${index}] Falling back to Google Images scraping...`)
  const imageSearch = `https://www.google.com/search?q=${encodeURIComponent(
    query + ' site:pinterest.com'
  )}&tbm=isch`
  try {
    const res = await fetch(imageSearch, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        Accept: 'text/html',
      },
    })
    const html = await res.text()
    let match = html.match(/\"ou\":\"([^\"]+)\"/)
    if (!match) match = html.match(/<img[^>]+src=\"([^\"]+)\"/)
    if (match) {
      logs.push(`[Image ${index}] ✅ Fallback image found: ${match[1]}`)
      return match[1]
    }
    logs.push(`[Image ${index}] ❌ No image found in fallback.`)
  } catch (e) {
    logs.push(`[Image ${index}] ❌ Error during image search: ${e.message}`)
  }
  return null
}

export async function POST(request) {
  try {
    const { description, count } = await request.json()
    if (!description || !count) {
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
    const ideas = await generateTitlesAndDescriptions(description, count)
    logs.push(`Generated ${ideas.length} ideas.`)
    logs.push('---')
    const items = []
    for (let i = 0; i < ideas.length; i++) {
      const idea = ideas[i]
      const index = i + 1
      logs.push(`[Image ${index}] Generating content...`)
      logs.push(`[Image ${index}] Title: ${idea.title}`)
      logs.push(`[Image ${index}] Description: ${idea.description}`)
      // 1. Scrape image
      const imageUrl = await searchPinterestImage(idea.title, logs, index)
      if (!imageUrl) {
        logs.push(`[Image ${index}] ❌ Could not find image. Skipping.`)
        logs.push('---')
        continue
      }
      // 2. Generate meta/hashtags
      logs.push(`[Image ${index}] Generating meta description & hashtags...`)
      const protocol = request.headers.get('x-forwarded-proto') || 'http'
      const host = request.headers.get('host')
      const baseUrl = `${protocol}://${host}`
      const metaRes = await fetch(`${baseUrl}/api/ai/generate-meta`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: idea.title,
          originalDesc: idea.description,
        }),
      })
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
    }
    logs.push('All images processed.')
    return NextResponse.json({ success: true, items, logs })
  } catch (error) {
    console.error('Pinterest scrapper error:', error)
    return NextResponse.json(
      { error: 'Failed to generate Pinterest content', message: error.message },
      { status: 500 }
    )
  }
}
