import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: Request) {
  try {
    const { name, category } = await request.json();

    if (!name || !category) {
      return NextResponse.json({ error: 'Name and category are required' }, { status: 400 });
    }

    // Initialize Gemini using your .env key
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // The prompt for the AI
    const prompt = `Write a compelling, professional e-commerce product description for a "${name}" in the "${category}" category. Keep it under 3 sentences, highlight quality and style, and make it appealing to buyers. Do not include any introductory text, just output the description directly.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ description: text });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: 'Failed to generate description' }, { status: 500 });
  }
}