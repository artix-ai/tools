
import { GoogleGenAI } from "@google/genai";
import { ThumbnailConfig, ThumbnailStyle } from "../types";

/**
 * Generates a YouTube thumbnail using the gemini-2.5-flash-image model.
 * The prompt is constructed based on the user's configuration.
 */
export const generateThumbnail = async (config: ThumbnailConfig): Promise<string> => {
  // Creating a new instance to ensure the latest API key is used as per guidelines.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const styleDescription = config.style === ThumbnailStyle.CINEMATIC 
    ? "film-grade 8K cinematic visual, moody dramatic lighting, high depth of field, professional color grading" 
    : "viral high-CTR YouTube thumbnail style, ultra-saturated colors, high contrast, popping visuals, sharp focus";

  const prompt = `Create a professional YouTube thumbnail image.
  Overall Style: ${styleDescription}.
  Main Topic/Headline: "${config.headline}". 
  Context: Set in a ${config.niche} environment.
  Subject Persona: A person in the foreground with a very clear ${config.expression} facial expression.
  Visual Elements to include:
  ${config.includeArrows ? "- Vibrant glowing red arrows pointing dramatically at the subject." : ""}
  ${config.includeMoney ? "- Stacks of $100 bills and money symbols in the background." : ""}
  ${config.includeParticles ? "- Atmospheric haze, dust particles, and cinematic volumetric lighting." : ""}
  ${config.includeStamp ? "- A 'SECRET' or 'EXPOSED' red rubber stamp overlay effect in the corner." : ""}
  
  Technical requirement: 16:9 aspect ratio. The image should be extremely eye-catching for a video preview. Avoid generating actual text if it looks messy, focus on the visual impact.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
        },
      },
    });

    // Iterate through response parts to find the generated image data.
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }

    throw new Error("The model did not return any image data.");
  } catch (error) {
    console.error("Gemini Image Generation Error:", error);
    throw error;
  }
};
