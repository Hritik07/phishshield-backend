const levenshtein = require('fast-levenshtein');

const TRUSTED_DOMAINS = ["google.com", "amazon.in", "onlinesbi.sbi"]; // [cite: 20]

function checkSimilarity(currentDomain) {
    return TRUSTED_DOMAINS.some(trusted => {
        const distance = levenshtein.get(currentDomain, trusted);
        return distance > 0 && distance <= 2; // [cite: 15]
    });
}

module.exports = { checkSimilarity };