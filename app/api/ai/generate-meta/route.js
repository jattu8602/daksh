import { GoogleGenerativeAI } from "@google/generative-ai"
import { NextResponse } from "next/server"

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export async function POST(request) {
  try {
    const { title, originalDesc, temperature } = await request.json()

    if (!title || !originalDesc) {
      return NextResponse.json(
        { error: "Title and original description are required" },
        { status: 400 }
      )
    }

    // Use Gemini 2.0 Flash
    const model = genAI.getGenerativeModel({ model: "models/gemini-2.0-flash" })

    // Create the prompt
    const prompt = `Analyze the following video content and generate:\n\n1. An SEO-optimized meta description for social media, aiming for 140-160 characters. Make it rich, engaging, and informative. Include key details from the title and description, and a call to action if appropriate. Avoid being generic or too short.\n\n2. 5-10 relevant hashtags for social media (as a space-separated list).\n\nTitle: ${title}\nDescription: ${originalDesc}\n\nRespond in this format:\nMeta Description: <your description>\nHashtags: <#tag1 #tag2 #tag3 ...>`

    // Generate content
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: temperature || 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 300,
      },
    })

    const response = await result.response
    const text = response.text().trim()

    // Parse meta description and hashtags
    let description = ""
    let hashtags = []
    const descMatch = text.match(/Meta Description:\s*(.+)/i)
    if (descMatch) {
      description = descMatch[1].split("Hashtags:")[0].trim()
    }
    const hashtagsMatch = text.match(/Hashtags:\s*([#\w\s]+)/i)
    if (hashtagsMatch) {
      hashtags = hashtagsMatch[1].split(/\s+/).filter(Boolean)
    }

    return NextResponse.json({ description, hashtags })
  } catch (error) {
    console.error("Error generating meta description:", error)
    return NextResponse.json(
      { error: "Failed to generate meta description" },
      { status: 500 }
    )
  }
}