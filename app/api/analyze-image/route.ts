import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

export async function POST(request: Request) {
  try {
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

    // Using gemini-2.0-flash-lite which often has separate/higher free quota
    // than the standard gemini-2.0-flash model.
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        prompt,
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType
          }
        }
      ]
    });

    const responseText = response.text;
    
    if (!responseText) {
      throw new Error("No response text received from AI");
    }

    const cleanedJson = responseText.replace(/```json|```/gi, "").trim();
    
    try {
      const nutritionData = JSON.parse(cleanedJson);
      return NextResponse.json(nutritionData);
    } catch (parseError) {
      console.error("JSON Parse Error:", cleanedJson, "Original text:", responseText);
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
    }
  } catch (error: any) {
    console.error("Image Analysis Error:", error);
    return NextResponse.json(
      { error: `Analysis Error: ${error.message || "Unknown error"}. Make sure GEMINI_API_KEY is set in production.` },
      { status: 500 }
    );
  }
}
