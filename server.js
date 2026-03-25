const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Статика теперь в /public — server.js и package.json не будут доступны публично
app.use(express.static(path.join(__dirname, 'public')));

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || '';

// --- Rate limiting: не более 20 запросов в минуту с одного IP ---
const rateLimitMap = new Map();
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60 * 1000;

function checkRateLimit(ip) {
    const now = Date.now();
    const entry = rateLimitMap.get(ip);
    if (!entry || now - entry.start > RATE_WINDOW_MS) {
        rateLimitMap.set(ip, { count: 1, start: now });
        return true;
    }
    if (entry.count >= RATE_LIMIT) return false;
    entry.count++;
    return true;
}

// Очищаем старые записи раз в минуту
setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of rateLimitMap.entries()) {
        if (now - entry.start > RATE_WINDOW_MS) rateLimitMap.delete(ip);
    }
}, RATE_WINDOW_MS);

app.post('/api/chat', async (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    if (!checkRateLimit(ip)) {
        return res.status(429).json({ error: 'Слишком много запросов. Попробуйте через минуту.' });
    }

    try {
        // messages — массив { role: 'user'|'assistant', content: string }
        const { messages } = req.body;

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({ error: 'Invalid messages format' });
        }

        const systemPrompt = 'Ты опытный мастер по ремонту корпусной мебели в Алматы. Выясняй детали: тип мебели, материал, возраст, район, этаж, есть ли лифт. Отвечай простым языком, коротко, предлагай примерный порядок цен и предлагай клиенту оставить номер телефона или позвонить по номеру +7 705 916 43 37.';

        // Строим историю диалога для Gemini
        const contents = messages.map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }]
        }));

        // Добавляем системный промпт как первое сообщение от user если его нет
        const fullContents = [
            { role: 'user', parts: [{ text: systemPrompt }] },
            { role: 'model', parts: [{ text: 'Понял, буду помогать клиентам Re-Fix.' }] },
            ...contents
        ];

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: fullContents,
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

        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text
            || 'Извините, не удалось получить ответ. Попробуйте ещё раз.';

        res.json({ reply });
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Re-Fix chat running on port ${PORT}`);
});
