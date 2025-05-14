// import axios from 'axios';

// export async function sendEmail(name, email, subject, html, text) {
//     try {
//         const res = await axios.post(
//             'https://api.mailersend.com/v1/email',
//             {
//                 from: {
//                     email: process.env.FROM_EMAIL,
//                     name: 'Mihir Kasodariya',
//                 },
//                 to: [
//                     {
//                         email: email,
//                         name: name,
//                     },
//                 ],
//                 subject: subject,
//                 html: html,
//                 text: text,
//             },
//             {
//                 headers: {
//                     Authorization: `Bearer ${process.env.API_KEY}`,
//                     'Content-Type': 'application/json',
//                 },
//             }
//         );

//         console.log('Email sent successfully:', res.data);
//     } catch (err) {
//         console.error('Error sending email:', err.response?.data || err.message);
//     }
// }

// // const mail = await sendEmail({ name, email, subject, html, text });
import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function sendEmail(template, name, email, subject, text) {
    try {
        // Path to your HTML template
        const htmlTemplatePath = path.join(__dirname, `../../template/email/${template}`);

        // Read the file content as string
        const htmlContent = await fs.readFile(htmlTemplatePath, 'utf-8');
console.log('htmlTemplatePath', htmlTemplatePath)
        // Replace dynamic placeholders in the HTML (if any)
        const personalizedHtml = htmlContent
            .replace(/{{name}}/g, name)
            .replace(/{{email}}/g, email)
            .replace(/{{subject}}/g, subject)
            .replace(/{{text}}/g, text);

        // Send email using MailerSend API
        const response = await axios.post(
            'https://api.mailersend.com/v1/email',
            {
                from: {
                    email: 'MS_CjEiQA@test-86org8ee100gew13.mlsender.net',
                    name: 'Mihir Kasodariya'
                },
                to: [
                    {
                        email,
                        name
                    }
                ],
                subject,
                html: personalizedHtml,
                text
            },
            {
                headers: {
                    Authorization: `Bearer mlsn.b0e7bc479f3ecbe673ee3ffbdfa7128426801573249bff66c198a6b299d1e538`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('✅ Email sent successfully:', response.data);
    } catch (err) {
        console.error('❌ Error sending email:', err.response?.data || err.message);
    }
}
