import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(request: Request) {
  try {
    const { 
      target_calories, 
      target_protein, 
      target_carbs, 
      target_fat, 
      goal, 
      health_conditions,
      weekly_trend
    } = await request.json();

    const trendSummary = weekly_trend?.length > 0 
      ? `Recent calorie trend (last ${weekly_trend.length} days): ${weekly_trend.map((s: any) => `${s.date}: ${s.calories}kcal`).join(', ')}`
      : 'No recent trend data available.';

    const prompt = `You are a professional dietitian.

Create a one-day meal plan for tomorrow.

User goal: ${goal}
Target calories: ${target_calories}
Target protein: ${target_protein}
Target carbs: ${target_carbs}
Target fat: ${target_fat}
Health conditions: ${health_conditions?.join(', ') || 'None'}
${trendSummary}

Requirements:
- Provide Breakfast, Lunch, Dinner, Snack.
- Include portion sizes.
- Include approximate macros per meal.
- Keep total calories close to target.
- Avoid foods conflicting with health conditions.
- Keep suggestions realistic and practical.

Return ONLY valid JSON in this exact format:
{
  "breakfast": {
    "name": "Meal name with portion size",
    "calories": number,
    "protein": number,
    "carbs": number,
    "fat": number
  },
  "lunch": {
    "name": "Meal name with portion size",
    "calories": number,
    "protein": number,
    "carbs": number,
    "fat": number
  },
  "dinner": {
    "name": "Meal name with portion size",
    "calories": number,
    "protein": number,
    "carbs": number,
    "fat": number
  },
  "snack": {
    "name": "Meal name with portion size",
    "calories": number,
    "protein": number,
    "carbs": number,
    "fat": number
  }
}

Do NOT include explanations.
Do NOT include markdown.`;

    // Using gemini-1.5-flash for speed and reliability, gemini-2.0-flash is also valid if supported
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash", 
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });

    const text = response.text.trim();
    
    try {
      // Clean the text in case Gemini adds markdown code blocks
      const cleanJson = text.replace(/^```json/, '').replace(/```$/, '').trim();
      const mealPlan = JSON.parse(cleanJson);
      
      // Basic validation of the structure
      const requiredKeys = ['breakfast', 'lunch', 'dinner', 'snack'];
      for (const key of requiredKeys) {
        if (!mealPlan[key] || typeof mealPlan[key].calories !== 'number') {
          throw new Error(`Invalid structure for ${key}`);
        }
      }

      return NextResponse.json(mealPlan);
    } catch (parseError) {
      console.error("Meal Plan Parse Error:", parseError, "Raw Text:", text);
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
    }
  } catch (error: any) {
    console.error("Meal Plan Generation Error:", error);
    return NextResponse.json({ error: 'Failed to generate meal plan' }, { status: 500 });
  }
}
