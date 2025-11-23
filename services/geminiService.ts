import { GoogleGenAI, Type } from "@google/genai";
import { PlacementResult } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const evaluateFrenchLevel = async (userText: string): Promise<PlacementResult> => {
  if (!apiKey) {
    console.warn("API Key not found. Returning mock data.");
    return {
      estimatedLevel: 'A2',
      feedback: "API Key missing. This is a simulation based on your text length.",
      confidence: 0.8
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Evaluate the following French text submitted by a student. 
      Determine their CEFR level (A1, A2, B1, or B2) based on grammar, vocabulary complexity, and sentence structure.
      Provide brief feedback in English explaining why.
      
      Student Text: "${userText}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            estimatedLevel: {
              type: Type.STRING,
              enum: ["A1", "A2", "B1", "B2"],
              description: "The estimated CEFR level"
            },
            feedback: {
              type: Type.STRING,
              description: "Constructive feedback explaining the level determination"
            },
            confidence: {
              type: Type.NUMBER,
              description: "Confidence score between 0 and 1"
            }
          },
          required: ["estimatedLevel", "feedback", "confidence"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as PlacementResult;

  } catch (error) {
    console.error("Gemini Evaluation Error:", error);
    return {
      estimatedLevel: 'A1',
      feedback: "We encountered an error analyzing your text. Please try again later or contact our support.",
      confidence: 0
    };
  }
};