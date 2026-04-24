import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is missing in environment variables" },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
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

    let response;
    let retries = 3;
    let delay = 2000;

    for (let i = 0; i < retries; i++) {
      try {
        response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: [{ role: "user", parts: [{ text: prompt }] }],
        });
        break;
      } catch (error: any) {
        const is503 = error.status === 503 || error.message?.includes("503") || error.message?.includes("high demand");
        if (is503 && i < retries - 1) {
          console.log(`Gemini 503 error, retrying in ${delay}ms... (Attempt ${i + 1}/${retries})`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 2;
          continue;
        }
        throw error;
      }
    }

    const text = response?.text?.trim();

    if (!text) {
      return NextResponse.json(
        { error: "Empty response from AI" },
        { status: 500 }
      );
    }

    try {
      // Robust JSON extraction
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in AI response");
      }
      const nutrition = JSON.parse(jsonMatch[0]);

      // Ensure integer values for database compatibility
      const roundedNutrition = {
        ...nutrition,
        calories: Math.round(Number(nutrition.calories) || 0),
        protein: Math.round(Number(nutrition.protein) || 0),
        carbs: Math.round(Number(nutrition.carbs) || 0),
        fat: Math.round(Number(nutrition.fat) || 0),
      };

      return NextResponse.json(roundedNutrition);
    } catch (parseError: any) {
      console.error("AI Parse Error:", parseError, "Raw Text:", text);
      return NextResponse.json(
        { error: `Failed to parse AI response: ${parseError.message}` },
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
