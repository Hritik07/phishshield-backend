const { getDomainAge } = require('./whoisLookup');
const { checkSimilarity } = require('./similarity');
const { analyzeWithGemini } = require('../Controllers/geminiController');
const { logPhishingAttempt } = require('../Controllers/databaseController');

async function calculateRisk(url, snippet) {
    let score = 100; // [cite: 41]
    const deductions = [];
    const domain = new URL(url).hostname;

    // Layer 1: Domain Age [cite: 38, 43, 44]
    const ageInDays = await getDomainAge(domain);
    if (ageInDays < 7) { score -= 60; deductions.push("New domain (<7 days)"); }
    else if (ageInDays < 30) { score -= 40; deductions.push("Young domain (<30 days)"); }

    // Layer 2: URL Similarity [cite: 15, 32, 46]
    if (checkSimilarity(domain)) { score -= 25; deductions.push("Domain similarity detected"); }

    // Layer 3: Gemini AI (Only if risk is already present) [cite: 38]
    if (score < 80) {
        const aiScore = await analyzeWithGemini(snippet); // [cite: 34]
        if (aiScore > 0.75) { score -= 40; deductions.push("AI Sentinel flagged content"); } // [cite: 47]
    }

    // Log to Snowflake if malicious 
    if (score < 50) await logPhishingAttempt(domain, score);

    return { score: Math.max(score, 0), deductions };
}

module.exports = { calculateRisk };