export interface NvidiaMessage {
  role: "user" | "assistant" | "system";
  content: string | (TextPart | ImagePart)[];
}

interface TextPart {
  type: "text";
  text: string;
}

interface ImagePart {
  type: "image_url";
  image_url: {
    url: string;
  };
}

export async function callNvidiaNim(messages: NvidiaMessage[], retries = 3) {
  const apiKey = process.env.NVIDIA_NIM_API_KEY;
  if (!apiKey) {
    throw new Error("NVIDIA_NIM_API_KEY is missing");
  }

  const endpoint = "https://integrate.api.nvidia.com/v1/chat/completions";
  let delay = 2000;

  for (let i = 0; i < retries; i++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

    try {
      console.log(`NVIDIA NIM: Sending request (Attempt ${i + 1}/${retries})...`);
      const startTime = Date.now();

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "z-ai/glm4.7",
          messages,
          temperature: 0.1,
          top_p: 0.7,
          max_tokens: 4096,
          chat_template_kwargs: {
            enable_thinking: false
          }
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      console.log(`NVIDIA NIM: Received response in ${duration}s (Status: ${response.status})`);

      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error");
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: { message: errorText } };
        }

        const status = response.status;
        console.error(`NVIDIA NIM: API Error Response:`, JSON.stringify(errorData, null, 2));
        
        // Retry on 429 (Rate Limit) or 5xx errors
        if ((status === 429 || status >= 500) && i < retries - 1) {
          console.warn(`NVIDIA NIM: API error ${status}, retrying in ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 2;
          continue;
        }
        
        throw new Error(errorData.error?.message || errorData.message || `API error: ${status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error: any) {
      clearTimeout(timeoutId);
      const isTimeout = error.name === "AbortError";
      const errorMessage = isTimeout ? "Request timed out after 60s" : error.message;

      if (i < retries - 1 && (isTimeout || error.message?.includes("fetch") || error.message?.includes("network"))) {
        console.warn(`NVIDIA NIM: ${errorMessage}, retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2;
        continue;
      }
      throw new Error(`NVIDIA NIM: ${errorMessage}`);
    }
  }
}
