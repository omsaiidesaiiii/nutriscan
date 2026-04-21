import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(request: Request) {
  try {
    const { food_name, quantity } = await request.json();

    if (!food_name || !quantity) {
      return NextResponse.json(
        { error: "Food name and quantity are required" },
        { status: 400 }
      );
    }

    const prompt = `You are a certified nutritionist.

Estimate nutritional values for:
Food: ${food_name}
Quantity: ${quantity}

Return ONLY valid JSON in this exact format:
{
  "calories": number,
  "protein": number,
  "carbs": number,
  "fat": number
}

Estimate realistic values for the specified serving size. 
Do not include explanation.
Do not include markdown.
Ensure the response is a single JSON object.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
    const text = response.text?.trim();

    if (!text) {
      return NextResponse.json(
        { error: "Empty response from AI" },
        { status: 500 }
      );
    }

    try {
      // Clean the text in case Gemini adds markdown code blocks
      const cleanJson = text
        .replace(/^```json/, "")
        .replace(/```$/, "")
        .trim();
      const nutrition = JSON.parse(cleanJson);

      // Validate structure
      if (
        typeof nutrition.calories !== "number" ||
        typeof nutrition.protein !== "number"
      ) {
        throw new Error("Invalid nutrition data format from AI");
      }

      return NextResponse.json(nutrition);
    } catch (parseError) {
      console.error("AI Parse Error:", parseError, "Raw Text:", text);
      return NextResponse.json(
        { error: "Failed to parse AI response" },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Estimation API Error:", error);
    return NextResponse.json(
      { error: `Failed to estimate macros: ${error.message || "Unknown error"}` },
      { status: 500 }
    );
  }
}
