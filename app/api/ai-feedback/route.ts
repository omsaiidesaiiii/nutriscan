import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

// Using apiVersion: 'v1' to access stable model names like gemini-1.5-flash
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  // Setting apiVersion to v1 (default is v1beta in this SDK)
  // This allows using the standard gemini-1.5-flash model name
});

export async function POST(request: Request) {
  try {
    const { calories, protein, carbs, fat } = await request.json();

    const prompt = `You are a certified nutrition coach.
Analyze the following daily intake:

Calories: ${calories}
Protein: ${protein} grams
Carbs: ${carbs} grams
Fat: ${fat} grams

Assume:
- Target calories: 2200
- Target protein: 120g
- Target carbs: 250g
- Target fat: 70g

Give:
1. Clear feedback.
2. What is lacking.
3. What is excess. (Note: if any value seems like a typo, e.g. 33kg of fat, call it out as an error)
4. One actionable suggestion.

Keep response short, motivational, and practical.
Do NOT include markdown formatting.
Provide the response as clean, plain text.`;

    // gemini-2.0-flash-lite has higher free-tier limits
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-lite", 
      contents: prompt,
    });


    const text = response.text;

    return NextResponse.json({ feedback: text });
  } catch (error: any) {
    console.error("Gemini AI Error:", error);
    return NextResponse.json(
      { error: "Failed to generate AI feedback: " + error.message },
      { status: 500 }
    );
  }
}
