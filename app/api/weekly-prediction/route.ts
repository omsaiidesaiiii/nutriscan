import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(request: Request) {
  try {
    const { 
      avg_calories, 
      avg_protein, 
      target_calories, 
      target_protein, 
      goal, 
      weight 
    } = await request.json();

    const prompt = `You are a professional sports nutritionist.

User Goal: ${goal}
User Weight: ${weight} kg
Target Calories: ${target_calories}
Average Daily Calories (last 7 days): ${avg_calories}
Target Protein: ${target_protein}
Average Daily Protein: ${avg_protein}

Predict:
1. Is the user likely gaining, losing, or maintaining weight?
2. Is calorie gap sufficient for their goal?
3. Recommend calorie adjustment if necessary.
4. Give one actionable suggestion.

Keep response short.
No markdown formatting.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });

    const text = response.text.trim();

    return NextResponse.json({ prediction: text });
  } catch (error: any) {
    console.error("Weekly Prediction API Error:", error);
    return NextResponse.json({ error: 'Failed to generate weekly prediction' }, { status: 500 });
  }
}
