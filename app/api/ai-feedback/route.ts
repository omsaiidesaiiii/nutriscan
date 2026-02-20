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
    const { totals, targets } = await request.json();
    const { calories, protein, carbs, fat } = totals;
    const { target_calories, target_protein, target_carbs, target_fat } = targets;

    const prompt = `You are a certified nutrition coach.
Analyze the following daily intake relative to the user's customized targets:

Current Intake:
- Calories: ${calories} kcal
- Protein: ${protein}g
- Carbs: ${carbs}g
- Fat: ${fat}g

User's Daily Targets:
- Target Calories: ${target_calories} kcal
- Target Protein: ${target_protein}g
- Target Carbs: ${target_carbs}g
- Target Fat: ${target_fat}g

Give:
1. Concise analysis of current progress vs targets.
2. What is lacking or in excess.
3. One specific, actionable suggestion for the next meal.

Keep response short (max 4-5 sentences), motivational, and practical.
Do NOT include markdown formatting or bolding.
Provide the response as clean, plain text.`;

    // gemini-2.0-flash-lite has higher free-tier limits
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", 
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
