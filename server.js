const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || 'AIzaSyD6g'; // Замените на ваш ключ

app.post('/api/chat', async (req, res) => {
    try {
        const { messages } = req.body;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'Invalid messages format' });
        }

        const systemPrompt = 'Ты опытный мастер по ремонту корпусной мебели в Алматы. Выясняй детали: тип мебели, материал, возраст, район, этаж, есть ли лифт. Отвечай простым языком, коротко, предлагай примерный порядок цен и предлагай клиенту оставить номер телефона или позвонить по номеру +7 705 916 43 37.';

        const userMessage = messages[messages.length - 1]?.content || '';

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `${systemPrompt}\n\nКлиент: ${userMessage}`
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 500
                    }
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error('Google API error:', data);
            return res.status(response.status).json({ error: 'AI service error', details: data });
        }

        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Извините, не удалось получить ответ. Попробуйте ещё раз.';

        res.json({ reply });
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Re-Fix chat running on port ${PORT}`);
});
