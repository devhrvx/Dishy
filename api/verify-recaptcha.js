// api/verify-recaptcha.js
const fetch = require('node-fetch');

const SECRET_KEY = process.env.RECAPTCHA_SK;

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        const { token } = req.body;

        try {
            const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `secret=${SECRET_KEY}&response=${token}`,
            });

            const data = await response.json();

            if (data.success) {
                res.status(200).json({ success: true });
            } else {
                res.status(400).json({ success: false, error: 'Invalid reCAPTCHA' });
            }
        } catch (error) {
            console.error('Error verifying reCAPTCHA:', error);
            res.status(500).json({ success: false, error: 'Server error' });
        }
    } else {
        res.status(405).json({ success: false, error: 'Method Not Allowed' });
    }
};
