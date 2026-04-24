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
    const {
      target_calories,
      target_protein,
      target_carbs,
      target_fat,
      goal,
      health_conditions,
      weekly_trend,
      low_gi_priority,
      sodium_warning,
      heart_healthy_mode,
    } = await request.json();

    const trendSummary =
      weekly_trend?.length > 0
        ? `Recent calorie trend (last ${
            weekly_trend.length
          } days): ${weekly_trend
            .map((s: { date: string; calories: number }) => `${s.date}: ${s.calories}kcal`)
            .join(", ")}`
        : "No recent trend data available.";

    const healthFocus = [
      low_gi_priority ? "Priority: Low Glycemic Index (Diabetes-friendly)" : "",
      sodium_warning ? "Constraint: Low Sodium (Hypertension-aware)" : "",
      heart_healthy_mode ? "Constraint: Low Saturated Fat (Heart Healthy)" : "",
    ]
      .filter(Boolean)
      .join(". ");

    const conditionsStr = Array.isArray(health_conditions)
      ? health_conditions.join(", ")
      : typeof health_conditions === "string"
      ? health_conditions
      : "None";

    const prompt = `You are a professional dietitian.

Create a one-day indian meal plan for tomorrow.

User goal: ${goal}
Target calories: ${target_calories}
Target protein: ${target_protein}
Target carbs: ${target_carbs}
Target fat: ${target_fat}
Health conditions: ${conditionsStr}
${healthFocus ? `Health Focus: ${healthFocus}` : ""}
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

    // Implementation of exponential backoff retry for 503 errors
    let response;
    let retries = 3;
    let delay = 2000;

    for (let i = 0; i < retries; i++) {
      try {
        response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: [{ role: "user", parts: [{ text: prompt }] }],
        });
        break; // Success, exit loop
      } catch (error: any) {
        const is503 = error.status === 503 || error.message?.includes("503") || error.message?.includes("high demand");
        if (is503 && i < retries - 1) {
          console.log(`Gemini 503 error, retrying in ${delay}ms... (Attempt ${i + 1}/${retries})`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 2; // Exponential backoff
          continue;
        }
        throw error; // Re-throw if not 503 or no retries left
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
      const mealPlan = JSON.parse(jsonMatch[0]);

      const requiredKeys = ["breakfast", "lunch", "dinner", "snack"];
      
      // Round all nutritional values to integers to prevent database insertion errors
      const roundedPlan: any = {};
      for (const key of requiredKeys) {
        if (!mealPlan[key]) continue;
        roundedPlan[key] = {
          ...mealPlan[key],
          calories: Math.round(Number(mealPlan[key].calories) || 0),
          protein: Math.round(Number(mealPlan[key].protein) || 0),
          carbs: Math.round(Number(mealPlan[key].carbs) || 0),
          fat: Math.round(Number(mealPlan[key].fat) || 0),
        };
      }

      return NextResponse.json(roundedPlan);
    } catch (parseError: any) {
      console.error("Meal Plan Parse Error:", parseError, "Raw Text:", text);
      return NextResponse.json(
        { error: `Failed to parse meal plan: ${parseError.message}` },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Meal Plan Generation Error:", error);
    return NextResponse.json(
      { error: `Generation Error: ${error.message || "Unknown error"}` },
      { status: 500 }
    );
  }
}
