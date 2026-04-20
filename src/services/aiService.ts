import { GoogleGenAI } from "@google/genai";

export async function generateLuckyMessage(apiKey: string) {
  if (!apiKey) return "Chúc bạn may mắn lần sau! Đừng quên cài đặt API Key để nhận lời chúc từ AI nhé.";

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Viết một lời chúc mừng ngắn gọn, hài hước và đầy năng lượng cho người vừa trúng thưởng vòng quay may mắn (độ dài dưới 15 từ).",
    });

    return response.text.trim();
  } catch (error) {
    console.error("AI Error:", error);
    return "Chúc mừng bạn đã trúng thưởng! Cố gắng quay thêm nhé!";
  }
}
