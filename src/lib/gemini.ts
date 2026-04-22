import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface PredictionResult {
  patternType: string;
  confidence: number;
  nextAnswers: string[];
  rationale: string;
  statisticalInsight: string;
}

export interface PDFData {
  data: string; // base64
  mimeType: string;
}

export async function analyzeMCQPattern(answers: string[], pdfs: PDFData[] = []): Promise<PredictionResult> {
  const model = "gemini-3-flash-preview"; 
  
  const contents: any[] = [];
  
  // Add PDFs as parts
  pdfs.forEach(pdf => {
    contents.push({
      inlineData: {
        data: pdf.data,
        mimeType: pdf.mimeType
      }
    });
  });

  const prompt = `
    Analyze the provided MCQ answer keys. 
    You have a manual sequence: [${answers.join(", ")}] 
    ${pdfs.length > 0 ? "And you have " + pdfs.length + " PDF(s) containing past paper answer keys." : ""}
    
    Tasks:
    1. Extract answer keys from any provided PDFs.
    2. Combined with the manual sequence (if any), identify hidden patterns or "examiner logic".
    3. Predict the most likely next 5 answers in the sequence. Each answer must be a single character A, B, C, or D.
    4. Provide a clear, strategic summary for a student on how to use this pattern.
    5. Provide a statistical insight (frequencies, streaks, etc.).
  `;

  contents.push({ text: prompt });

  try {
    const response = await ai.models.generateContent({
      model,
      contents: { parts: contents },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            patternType: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            nextAnswers: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            rationale: { type: Type.STRING },
            statisticalInsight: { type: Type.STRING }
          },
          required: ["patternType", "confidence", "nextAnswers", "rationale", "statisticalInsight"]
        }
      }
    });

    if (!response.text) {
      throw new Error("No response from Gemini");
    }

    // Attempt to parse. Sometimes there might be trailing junk even with application/json
    let cleanedText = response.text.trim();
    
    // If the response starts with markdown json tag, remove it
    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText.replace(/^```json\n?/, "").replace(/\n?```$/, "");
    }

    return JSON.parse(cleanedText) as PredictionResult;
  } catch (error) {
    console.error("Pattern analysis failed:", error);
    return {
      patternType: "Pattern Error",
      confidence: 0,
      nextAnswers: [],
      rationale: "Analysis failed. Please ensure your input contains clear answer keys (A, B, C, D).",
      statisticalInsight: "Heuristic engine sync lost."
    };
  }
}
