// Use `import` syntax instead of `require`
import fetch from 'node-fetch'; // Import fetch from node-fetch

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { token } = req.body; // Get the token from the request body

        if (!token) {
            return res.status(400).json({ success: false, error: 'No token provided' });
        }

        const SECRET_KEY = process.env.RECAPTCHA_SK; // Use environment variable

        if (!SECRET_KEY) {
            return res.status(500).json({ success: false, error: 'Missing secret key' });
        }

        try {
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
