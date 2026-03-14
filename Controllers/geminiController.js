const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function analyzeWithGemini(snippet) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Analyze this text from a website for phishing intent: "${snippet.substring(0, 500)}". 
    Return only a number between 0 and 1 representing phishing probability.`; // [cite: 39]

    try {
        const result = await model.generateContent(prompt);
        return parseFloat(result.response.text());
    } catch (e) { return 0; }
}

module.exports = { analyzeWithGemini };