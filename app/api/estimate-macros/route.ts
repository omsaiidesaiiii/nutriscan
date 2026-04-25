import { NextResponse } from "next/server";
import { callNvidiaNim } from "@/lib/nvidia";

export async function POST(request: Request) {
  try {
    const { food_name, quantity } = await request.json();

    if (!food_name || !quantity) {
      return NextResponse.json(
        { error: "Food name and quantity are required" },
        { status: 400 }
      );
    }

    const systemPrompt = `You are a certified nutritionist.
Respond ONLY with a valid JSON object. No explanations, no markdown formatting, and no thinking blocks in the output.`;

    const userPrompt = `Estimate nutritional values for:
Food: ${food_name}
Quantity: ${quantity}

Return JSON format:
{
  "calories": number,
  "protein": number,
  "carbs": number,
  "fat": number
}`;

    const text = await callNvidiaNim([
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ]);

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
