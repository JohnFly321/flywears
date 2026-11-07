import { GoogleGenAI } from "@google/genai";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const model = "gemini-3.1-flash-lite";

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Please sign in to use AI descriptions." }, { status: 401 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("Gemini description generation is not configured.");
    return NextResponse.json(
      { error: "AI descriptions are temporarily unavailable. Please try again later." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request must contain valid JSON." }, { status: 400 });
  }

  if (!body || typeof body !== "object" || !("name" in body) || !("category" in body)) {
    return NextResponse.json(
      { error: "Product name and category are required." },
      { status: 400 },
    );
  }

  const { name, category } = body;
  if (typeof name !== "string" || typeof category !== "string") {
    return NextResponse.json(
      { error: "Product name and category must be text." },
      { status: 400 },
    );
  }

  const productName = name.trim();
  const productCategory = category.trim();
  if (!productName || !productCategory || productName.length > 120 || productCategory.length > 80) {
    return NextResponse.json(
      { error: "Enter a product name (up to 120 characters) and category (up to 80 characters)." },
      { status: 400 },
    );
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model,
      contents: `Write a professional e-commerce description for the following product.
Product name: ${JSON.stringify(productName)}
Category: ${JSON.stringify(productCategory)}

Keep it under three sentences. Highlight style and quality without inventing specific materials, features, or claims. Return only the description.`,
      config: {
        httpOptions: { timeout: 20_000 },
        maxOutputTokens: 180,
        temperature: 0.7,
      },
    });

    const description = response.text?.trim();
    if (!description) {
      console.error("Gemini returned an empty product description.");
      return NextResponse.json(
        { error: "Gemini couldn't generate a description. Please try again." },
        { status: 502 },
      );
    }

    return NextResponse.json({ description });
  } catch (error) {
    console.error("Gemini product description request failed.", error);
    return NextResponse.json(
      { error: "Couldn't generate a description right now. Please try again." },
      { status: 502 },
    );
  }
}
