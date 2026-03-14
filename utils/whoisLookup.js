const whois = require('whois-json');

async function getDomainAge(domain) {
    try {
        const data = await whois(domain);
        const created = new Date(data.creationDate || data.createdDate || Date.now());
        return (new Date() - created) / (1000 * 60 * 60 * 24);
    } catch (e) { return 365; } // Default to safe if lookup fails
}

module.exports = { getDomainAge };