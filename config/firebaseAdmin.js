// config/firebaseAdmin.js
import admin from 'firebase-admin';
import { readFileSync } from 'fs';

const serviceAccount = JSON.parse(
    readFileSync('./config/molimor-e-com-firebase-adminsdk-fbsvc-555c947c5c.json', 'utf-8')
);

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

export const messaging = admin.messaging();
