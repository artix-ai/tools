
import { GoogleGenAI, Type } from "@google/genai";
import { CaptionSegment } from "../types";

export const generateCaptions = async (
  fileData: string,
  mimeType: string
): Promise<CaptionSegment[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

  const systemInstruction = `
    You are a professional world-class Hinglish transcriber and caption specialist.
    Your task is to transcribe the provided audio/video file word-for-word.
    
    CRITICAL INSTRUCTIONS:
    1. Language: Identify and transcribe Hinglish (a mix of Hindi and English).
    2. Transcription Style: Use Romanized script for Hindi words (e.g., "aap kaise hain") and standard English script for English words.
    3. Accuracy: Ensure word-for-word precision. Do not summarize.
    4. Timestamps: Provide highly accurate start and end times for each segment in seconds. Segments should typically be 3-7 seconds long or based on natural pauses.
    5. Output Format: Return ONLY a valid JSON object matching the requested schema.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        {
          inlineData: {
            data: fileData,
            mimeType: mimeType,
          },
        },
        {
          text: "Please transcribe this file into precise word-for-word Hinglish captions with timestamps."
        }
      ]
    },
    config: {
      systemInstruction: systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          segments: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                startTime: {
                  type: Type.NUMBER,
                  description: "Start time of the segment in seconds (e.g., 1.25)",
                },
                endTime: {
                  type: Type.NUMBER,
                  description: "End time of the segment in seconds (e.g., 4.50)",
                },
                text: {
                  type: Type.STRING,
                  description: "The word-for-word Hinglish transcription for this segment",
                },
              },
              required: ["startTime", "endTime", "text"],
            },
          },
        },
        required: ["segments"],
      },
    },
  });

  const resultStr = response.text;
  try {
    const parsed = JSON.parse(resultStr);
    return parsed.segments;
  } catch (error) {
    console.error("Failed to parse Gemini response as JSON:", resultStr);
    throw new Error("Failed to process the caption data.");
  }
};
