import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { PlacementResult } from "../types";

// Initialize the Google GenAI client with the environment API key
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const evaluateFrenchLevel = async (userText: string): Promise<PlacementResult> => {
  try {
    // Generate content using the Gemini model
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Please evaluate this student text submission for FrenchCercle.
      
      Student Text: "${userText}"
      
      Your task is to:
      1. Analyze the grammar, vocabulary, and sentence structure.
      2. Determine the CEFR level (A1, A2, B1, or B2).
      3. Provide a helpful, professional, and encouraging feedback in English explaining the decision.
      `,
      config: {
        systemInstruction: "You are the Director of Studies at FrenchCercle, a premium French language institute. You are an expert in the CEFR (Common European Framework of Reference for Languages). Your tone is professional, warm, and encouraging. You are precise in your assessment.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            estimatedLevel: {
              type: Type.STRING,
              enum: ["A1", "A2", "B1", "B2"],
              description: "The estimated CEFR level based on the text complexity."
            },
            feedback: {
              type: Type.STRING,
              description: "A professional and encouraging explanation of the assessment in English."
            },
            confidence: {
              type: Type.NUMBER,
              description: "A confidence score between 0 and 1."
            }
          },
          required: ["estimatedLevel", "feedback", "confidence"]
        }
      }
    });

    const text = response.text;
    
    if (!text) {
      throw new Error("Empty response from AI");
    }
    
    return JSON.parse(text) as PlacementResult;

  } catch (error) {
    console.error("Gemini Evaluation Error:", error);
    // Fallback in case of API error to avoid crashing the UI
    return {
      estimatedLevel: 'A1',
      feedback: "We are currently experiencing high demand on our evaluation servers. Based on a preliminary check, we recommend starting with our foundational courses. Our instructors will refine this assessment during your first class.",
      confidence: 0
    };
  }
};