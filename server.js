const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Статика из /public
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Re-Fix running on port ${PORT}`);
});
