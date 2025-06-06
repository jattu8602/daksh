import { GoogleGenerativeAI } from "@google/generative-ai"
import { NextResponse } from "next/server"

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)






export async function POST(request) {
  try {
    const { content } = await request.json()

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      )
    }

    // Initialize the model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    // Create the prompt
    const prompt = `Generate relevant hashtags for the following content:
${content}

Requirements:
- Generate 5-10 relevant hashtags
- Include a mix of popular and niche hashtags
- Make them specific to the content
- Format them without the # symbol
- Separate them with commas
- Focus on engagement and discoverability

Generate only the hashtags, no additional text.`

    // Generate content
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 200,
      },
    })

    const response = await result.response
    const hashtagsText = response.text().trim()

    // Split the response into individual hashtags and format them
    const hashtags = hashtagsText
      .split(",")
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
      .map(tag => tag.startsWith("#") ? tag : `#${tag}`)

    return NextResponse.json({ hashtags })
  } catch (error) {
    console.error("Error generating hashtags:", error)
    return NextResponse.json(
      { error: "Failed to generate hashtags" },
      { status: 500 }
    )
  }
}