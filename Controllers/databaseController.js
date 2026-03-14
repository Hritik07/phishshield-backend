const snowflake = require('snowflake-sdk');

const connection = snowflake.createConnection({
    account: process.env.SNOWFLAKE_ACCOUNT,
    username: process.env.SNOWFLAKE_USERNAME,
    password: process.env.SNOWFLAKE_PASSWORD
});

async function logPhishingAttempt(domain, score) {
    connection.connect((err) => {
        if (err) return;
        const sql = `INSERT INTO PHISH_LOGS (DOMAIN, RISK_SCORE, DETECTED_AT) VALUES (?, ?, CURRENT_TIMESTAMP)`;
        connection.execute({ sqlText: sql, binds: [domain, score] });
    });
}

module.exports = { logPhishingAttempt };