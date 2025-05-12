import axios from 'axios';

const TO_EMAIL = 'mihirkasodariya21@gmail.com';

export async function sendEmail(name, email, subject, html, text) {
    try {
        const res = await axios.post(
            'https://api.mailersend.com/v1/email',
            {
                from: {
                    email: process.env.FROM_EMAIL,
                    name: 'Mihir Kasodariya',
                },
                to: [
                    {
                        email: email,
                        name: name,
                    },
                ],
                subject: subject,
                html: html,
                text: text,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log('Email sent successfully:', res.data);
    } catch (err) {
        console.error('Error sending email:', err.response?.data || err.message);
    }
}

// const mail = await sendEmail({ name, email, subject, html, text });
