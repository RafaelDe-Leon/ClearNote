"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const openai_1 = require("openai");
dotenv_1.default.config({ path: './server/.env' });
console.log('Loaded OPENAI_API_KEY:', process.env.OPENAI_API_KEY);
const app = (0, express_1.default)();
const port = 3000;
const openai = new openai_1.OpenAI({ apiKey: process.env.OPENAI_API_KEY });
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.post('/ask', async (req, res) => {
    try {
        const { message, systemMessage } = req.body;
        const completion = await openai.chat.completions.create({
            model: 'gpt-4.1-nano-2025-04-14',
            messages: [
                { role: 'system', content: systemMessage },
                { role: 'user', content: message },
            ],
        });
        res.json({ reply: completion.choices[0].message.content });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch response from OpenAI' });
    }
});
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
