
import { GoogleGenAI, Modality } from "@google/genai";
import { VoiceName } from "../types";

const API_KEY = process.env.API_KEY || '';

export const optimizeHinglishScript = async (script: string, tone: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const prompt = `
    You are a professional voiceover scriptwriter. 
    I will provide a script in Hinglish (Hindi mixed with English).
    Your task is to:
    1. Maintain the natural "Hinglish" flow (don't translate to pure Hindi or pure English).
    2. Add punctuation for natural pauses and emphasis.
    3. Ensure the tone is "${tone}".
    4. If there are technical words in English, keep them. 
    5. Return ONLY the optimized script text, ready for text-to-speech.
    
    Script: "${script}"
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });

  return response.text || script;
};

export const generateSpeech = async (text: string, voice: VoiceName, tone: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  // Prepend tone instruction to the text for Gemini 2.5 Flash TTS to catch inflection
  const synthesisPrompt = `Say ${tone.toLowerCase()}ly: ${text}`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: synthesisPrompt }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: voice },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) {
    throw new Error("Failed to generate audio content from Gemini.");
  }
  return base64Audio;
};
