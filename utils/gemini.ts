
import { GoogleGenAI } from "@google/genai";

export const getAIConciergeResponse = async (prompt: string, userName: string, rank: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: `You are a sophisticated, polite AI Butler for "The Residency", an elite old-money VIP casino. 
      The user is ${userName}, holding the rank of ${rank}. 
      Always address them formally (e.g., "My Lord", "Your Grace"). 
      Use Google Search to provide actual luxury news, stock market updates, or high-stakes gambling tips. 
      Keep responses elegant and concise. If you use search results, mention that you've looked up the latest information.`,
      tools: [{ googleSearch: {} }],
    },
  });

  return {
    text: response.text,
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

export const getNewsTickerData = async () => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Provide 5 very short, elegant headlines about the luxury market, high-end real estate, or stock market for a VIP ticker. Max 10 words per headline.",
      config: {
        tools: [{ googleSearch: {} }],
      }
    });
    return response.text;
  } catch (error) {
    return "Market report: S&P 500 reaches new highs. Luxury watch prices stabilizing. Global gold reserves increasing.";
  }
};
