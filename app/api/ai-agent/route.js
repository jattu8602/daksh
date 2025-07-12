import { NextResponse } from 'next/server';

// You may need to install and import tesseract.js or use a cloud OCR API for real OCR
// import Tesseract from 'tesseract.js';

export const runtime = 'nodejs';

async function extractTextFromFile(fileBuffer, fileType) {
  // TODO: Implement OCR for images and PDFs
  // For now, return a stub
  return 'Extracted text from uploaded file (OCR stub)';
}

async function askGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + apiKey;
  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
  };
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  // Gemini returns step-by-step if prompted
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No answer from Gemini.';
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    let query = formData.get('query');
    let file = formData.get('file');
    let extractedText = '';

    if (file && file.size > 0) {
      const fileBuffer = Buffer.from(await file.arrayBuffer());
      const fileType = file.type;
      extractedText = await extractTextFromFile(fileBuffer, fileType);
      query = extractedText;
    }

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ error: 'No query provided.' }, { status: 400 });
    }

    // Prompt Gemini for step-by-step answer
    const prompt = `You are a helpful study assistant. Answer the following question with a step-by-step solution.\n\nQuestion: ${query}`;
    const answer = await askGemini(prompt);
    return NextResponse.json({ answer });
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Internal server error.' }, { status: 500 });
  }
}