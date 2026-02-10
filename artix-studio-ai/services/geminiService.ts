
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY;

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    if (!API_KEY) {
      throw new Error("API_KEY is not defined");
    }
    this.ai = new GoogleGenAI({ apiKey: API_KEY });
  }

  async removeBackground(base64Image: string): Promise<string> {
    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image.split(',')[1],
              mimeType: 'image/png',
            },
          },
          {
            text: 'Remove the background with ABSOLUTE studio-grade precision. Identify the main subject and isolate it perfectly. Preserve fine details like hair strands, individual fibers, and semi-transparent textures. Ensure zero halos, jagged edges, or color bleeding. Retain original subject sharpness and skin tones. Return ONLY the subject on a completely transparent background.',
          },
        ],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("Failed to process background removal");
  }

  async enhanceImage(base64Image: string): Promise<string> {
    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image.split(',')[1],
              mimeType: 'image/png',
            },
          },
          {
            text: 'Perform professional studio-level image enhancement. Upscale perceived detail using high-frequency recovery. Intelligently reduce noise and compression artifacts while preserving natural skin textures and pore details. Correct white balance, enhance dynamic range (HDR-like depth), and sharpen focal points without creating halos. Return the high-fidelity studio-ready image.',
          },
        ],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("Failed to enhance image");
  }

  async applySmartCrop(base64Image: string, focus: string, aspectRatio: string): Promise<string> {
    const validRatios = ["1:1", "3:4", "4:3", "9:16", "16:9", "3:2", "4:5"];
    const targetRatio = validRatios.includes(aspectRatio) ? aspectRatio : "1:1";

    const prompt = `Act as a master cinematographer. Execute a studio-grade crop focusing on "${focus}". 
    Apply the Golden Ratio and Rule of Thirds to ensure the ${focus} is artistically balanced and centered within a ${targetRatio} aspect ratio. 
    Crucially: Maintain subject integrity—DO NOT cut off hair, limbs, or key features. Preserve original resolution and sharpness. 
    Return the result as a master-quality professional crop.`;
    
    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image.split(',')[1],
              mimeType: 'image/png',
            },
          },
          { text: prompt },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: targetRatio as any,
        }
      }
    });

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    
    throw new Error(`Model did not return an image part for crop. Focus: ${focus}, Ratio: ${targetRatio}`);
  }
}
