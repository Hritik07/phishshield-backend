require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { calculateRisk } = require('./utils/riskEngine');
const PORT = process.env.PORT || 3000

const app = express();
app.use(cors());
app.use(express.json());

app.post('/analyze', async (req, res) => {
    const { url, contentSnippet } = req.body; // [cite: 31]
    try {
        const result = await calculateRisk(url, contentSnippet);
        res.json(result); // [cite: 35]
    } catch (error) {
        res.status(500).json({ error: "Oracle connection lost." });
    }
});

app.listen(process.env.PORT, () => console.log(`Eternum Server active on ${process.env.PORT}`));
app.listen(PORT, () => console.log(`Oracle active on port ${PORT}`));

