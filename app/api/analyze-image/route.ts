import { NextResponse } from "next/server";
import { callNvidiaNim } from "@/lib/nvidia";

export async function POST(request: Request) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    // Extract base64 content
    const base64Data = image.split(",")[1] || image;
    const mimeType = image.split(";")[0].split(":")[1] || "image/jpeg";

    const systemPrompt = `You are a professional nutritionist.
Analyze the provided food image.
Respond ONLY with a valid JSON object. No explanations, no markdown formatting, and no thinking blocks in the output.`;

    const userPrompt = `Analyze this food image.

Return JSON:
{
  "food_name": "...",
  "calories": number,
  "protein": number,
  "carbs": number,
  "fat": number
}`;

    const responseText = await callNvidiaNim([
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: [
          { type: "text", text: userPrompt },
          {
            type: "image_url",
            image_url: {
              url: `data:${mimeType};base64,${base64Data}`,
            },
          },
        ],
      },
    ]);
    
    if (!responseText) {
      throw new Error("No response text received from AI");
    }

    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in AI response");
      }
      const nutritionData = JSON.parse(jsonMatch[0]);
      
      // Ensure integer values
      const roundedData = {
        ...nutritionData,
        calories: Math.round(Number(nutritionData.calories) || 0),
        protein: Math.round(Number(nutritionData.protein) || 0),
        carbs: Math.round(Number(nutritionData.carbs) || 0),
        fat: Math.round(Number(nutritionData.fat) || 0),
      };

      return NextResponse.json(roundedData);
    } catch (parseError: any) {
      console.error("JSON Parse Error:", responseText);
      return NextResponse.json({ error: `Failed to parse AI response: ${parseError.message}` }, { status: 500 });
    }
  } catch (error: any) {
    console.error("Image Analysis Error:", error);
    return NextResponse.json(
      { error: `Analysis Error: ${error.message || "Unknown error"}.` },
      { status: 500 }
    );
  }
}
