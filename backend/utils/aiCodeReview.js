const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({});

async function getAiCodeAnalysis(code, language) {
  const prompt = `Analyze the following ${language} code and give me review about readability and modularity and time and space complexity ,only be short with your answer:\n\n${code}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error.message || error);
    throw new Error("Failed to get AI code analysis");
  }
}

module.exports = {
  getAiCodeAnalysis,
};
