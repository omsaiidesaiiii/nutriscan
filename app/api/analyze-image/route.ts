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
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    // Extract base64 content
    const base64Data = image.split(",")[1] || image;
    const mimeType = image.split(";")[0].split(":")[1] || "image/jpeg";

    const prompt = `You are a professional nutritionist.
Analyze this food image.

Return ONLY valid JSON:
{
  "food_name": "",
  "calories": number,
  "protein": number,
  "carbs": number,
  "fat": number
}

Estimate values realistically for one serving.
Do not include any explanation or markdown formatting. Just the JSON object.`;

    let response;
    let retries = 3;
    let delay = 2000;

    for (let i = 0; i < retries; i++) {
      try {
        response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: [
            { role: "user", parts: [{ text: prompt }] },
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType
              }
            }
          ]
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

    const responseText = response?.text?.trim();
    
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
      { error: `Analysis Error: ${error.message || "Unknown error"}. Make sure GEMINI_API_KEY is set in production.` },
      { status: 500 }
    );
  }
}
