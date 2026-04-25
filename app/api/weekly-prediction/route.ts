import { NextResponse } from "next/server";
import { callNvidiaNim } from "@/lib/nvidia";

export async function POST(request: Request) {
  try {
    const {
      avg_calories,
      avg_protein,
      target_calories,
      target_protein,
      goal,
      weight,
    } = await request.json();

    const systemPrompt = `You are a professional sports nutritionist.
Provide a short weight/calorie prediction.
Respond ONLY with text. No markdown, no explanations, no thinking blocks.`;

    const userPrompt = `User Goal: ${goal}
User Weight: ${weight} kg
Target Calories: ${target_calories}
Average Daily Calories (last 7 days): ${avg_calories}
Target Protein: ${target_protein}
Average Daily Protein: ${avg_protein}

Predict:
1. Is the user likely gaining, losing, or maintaining weight?
2. Is calorie gap sufficient for their goal?
3. Recommend calorie adjustment if necessary.
4. Give one actionable suggestion.`;

    const text = await callNvidiaNim([
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ]);

    return NextResponse.json({
      prediction: text || "No prediction available.",
    });
  } catch (error: any) {
    console.error("Weekly Prediction API Error:", error);
    return NextResponse.json(
      { error: `Failed to generate weekly prediction: ${error.message || "Unknown error"}` },
      { status: 500 }
    );
  }
}
