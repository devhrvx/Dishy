const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());

app.post('/verify-recaptcha', async (req, res) => {
    const secretKey = process.env.RECAPTCHA_SK;
    const token = req.body.token;

    const response = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${secretKey}&response=${token}`
    });
    const result = await response.json();

    if (result.success) {
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
