import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import ejs from 'ejs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function sendEmail(templateName, email, subject, text, data = {}) {
    try {
        const templatePath = path.join(__dirname, `../../template/email/${templateName}`);
        const htmlContent = await ejs.renderFile(templatePath, {
            email,
            subject,
            text,
            data
            // name: data.name,
            // shopNow: data.url,
            // productImage1: data.image1,
            // productImage2: data.image2,
        });

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
                        name: data.name || '',

                    }
                ],
                subject,
                html: htmlContent,
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
