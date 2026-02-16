
import { GoogleGenAI } from "@google/genai";
import { UserProfile, WorkoutSession } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getAiCoachAdvice = async (profile: UserProfile, lastSession?: WorkoutSession) => {
  try {
    const prompt = lastSession 
      ? `User profile: ${profile.experience} level runner, ${profile.weight}kg. Last session: ${lastSession.distance}km in ${Math.floor(lastSession.time / 60)}min. Provide a short, 2-sentence encouraging coaching advice in Korean.`
      : `User just joined RunStart. ${profile.experience} level runner aiming for ${profile.goalWeight}kg. Provide a welcoming and encouraging tip in Korean for their first run.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are an expert running coach specialized in beginners and weight loss. Be supportive, friendly, and scientifically sound. Keep it under 100 characters.",
      }
    });

    return response.text || "오늘도 힘차게 달려볼까요?";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "생각하지 말고 일단 뛰어보세요! 작은 시작이 큰 변화를 만듭니다.";
  }
};
