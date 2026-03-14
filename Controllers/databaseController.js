const snowflake = require('snowflake-sdk');

const connection = snowflake.createConnection({
    account: process.env.SNOWFLAKE_ACCOUNT,
    username: process.env.SNOWFLAKE_USERNAME,
    password: process.env.SNOWFLAKE_PASSWORD,
    warehouse: process.env.SNOWFLAKE_WAREHOUSE, // Required
    database: process.env.SNOWFLAKE_DATABASE,   // Required
    schema: process.env.SNOWFLAKE_SCHEMA        // Required
});

// Connect once when the server starts
connection.connect((err) => {
    if (err) {
        console.error('Snowflake Connection Error:', err.message);
    } else {
        console.log('Connected to Snowflake Archive.');
    }
});

async function logPhishingAttempt(domain, score) {
    // Execute the insertion directly using the existing connection
    const sql = `INSERT INTO PHISH_LOGS (DOMAIN, RISK_SCORE, DETECTED_AT) VALUES (?, ?, CURRENT_TIMESTAMP)`;
    
    connection.execute({
        sqlText: sql,
        binds: [domain, score],
        complete: (err, stmt, rows) => {
            if (err) {
                console.error('Failed to log to Snowflake:', err.message);
            } else {
                console.log(`Log archived for: ${domain}`);
            }
        }
    });
}

module.exports = { logPhishingAttempt };