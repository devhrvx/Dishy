function recaptchaVerified(token) {
    fetch('/api/verify-recaptcha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById('recaptcha-overlay').style.display = 'none';
        } else {
            alert('reCAPTCHA failed. Please try again.');
        }
    })
    .catch(error => console.error('Error:', error));
}