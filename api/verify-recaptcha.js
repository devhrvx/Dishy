export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ success: false, error: 'No token provided' });
        }

        const SECRET_KEY = process.env.RECAPTCHA_SK;

        if (!SECRET_KEY) {
            return res.status(500).json({ success: false, error: 'Missing secret key' });
        }

        try {
            // Dynamically import fetch
            const { default: fetch } = await import('node-fetch');

            const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `secret=${SECRET_KEY}&response=${token}`,
            });

            const data = await response.json();

            if (data.success) {
                return res.status(200).json({ success: true });
            } else {
                return res.status(400).json({ success: false, error: 'Invalid reCAPTCHA' });
            }
        } catch (error) {
            console.error('Error verifying reCAPTCHA:', error);
            return res.status(500).json({ success: false, error: 'Error verifying reCAPTCHA' });
        }
    } else {
        return res.status(405).json({ success: false, error: 'Method Not Allowed' });
    }
}
