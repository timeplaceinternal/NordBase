import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function parseProductInfo(input: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Parse the following product information and return a JSON object. 
      Input: ${input}
      
      The response must be a JSON object with the following structure:
      {
        "name": { "en": "string", "pt": "string" },
        "category": "Ring Saw" | "Core Drill" | "Dehumidifier" | "Service" | "Other",
        "rentalPrice": number,
        "description": { "en": "string", "pt": "string" },
        "shortDescription": { "en": "string", "pt": "string" },
        "specifications": [{ "key": "string", "value": "string" }]
      }
      
      Translate the content to both English and Portuguese. If the price is not found, estimate a reasonable one for Algarve market or leave as 0.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: {
              type: Type.OBJECT,
              properties: {
                en: { type: Type.STRING },
                pt: { type: Type.STRING }
              },
              required: ["en", "pt"]
            },
            category: {
              type: Type.STRING,
              enum: ["Ring Saw", "Core Drill", "Dehumidifier", "Service", "Other"]
            },
            rentalPrice: { type: Type.NUMBER },
            description: {
              type: Type.OBJECT,
              properties: {
                en: { type: Type.STRING },
                pt: { type: Type.STRING }
              },
              required: ["en", "pt"]
            },
            shortDescription: {
              type: Type.OBJECT,
              properties: {
                en: { type: Type.STRING },
                pt: { type: Type.STRING }
              },
              required: ["en", "pt"]
            },
            specifications: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  key: { type: Type.STRING },
                  value: { type: Type.STRING }
                },
                required: ["key", "value"]
              }
            }
          },
          required: ["name", "category", "rentalPrice", "description", "shortDescription", "specifications"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error parsing product info:", error);
    throw error;
  }
}
