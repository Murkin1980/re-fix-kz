const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const PORTKEY_API_URL = 'https://api.portkey.ai/v1/chat/completions';
const PORTKEY_API_KEY = process.env.PORTKEY_API_KEY || 'VLURN8YWIaaujEILy7Mz/RapEopq';

app.post('/api/chat', async (req, res) => {
    try {
        const { messages } = req.body;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'Invalid messages format' });
        }

        const systemMessage = {
            role: 'system',
            content: 'Ты опытный мастер по ремонту корпусной мебели в Алматы. Выясняй детали: тип мебели, материал, возраст, район, этаж, есть ли лифт. Отвечай простым языком, коротко, предлагай примерный порядок цен и предлагай клиенту оставить номер телефона или позвонить по номеру +7 705 916 43 37.'
        };

        const response = await fetch(PORTKEY_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${PORTKEY_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gemini-1.5-flash',
                messages: [systemMessage, ...messages]
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Portkey API error:', data);
            return res.status(response.status).json({ error: 'AI service error', details: data });
        }

        res.json(data);
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Re-Fix chat proxy running on port ${PORT}`);
});
