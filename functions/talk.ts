import { GoogleGenAI } from "@google/genai";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({});

const TalkAi = async (question: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: question,
  });
  return response;
}

export default TalkAi;