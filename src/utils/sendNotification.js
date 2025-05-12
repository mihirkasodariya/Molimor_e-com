import { messaging } from './../../config/firebaseAdmin.js';

export async function sendNotification(deviceTokens, notificationPayload, customData = {}) {
    const tokensArray = Array.isArray(deviceTokens) ? deviceTokens : [deviceTokens];

    const multicastMessage = {
        tokens: tokensArray,
        notification: notificationPayload, // e.g. { title: 'Hello', body: 'World' }
        data: customData,                  // optional key-value pairs
    };
    console.log('multicastMessage', multicastMessage)
    try {
        const result = await messaging.sendEachForMulticast(multicastMessage);
        console.log('Notification sent successfully:', result);
        return result;
    } catch (error) {
        console.error('Notification Error:', error);
        throw error;
    }
}



// import { sendNotification } from '../utils/sendNotification.js';

// const send = await sendNotification(user.fcm,
//     { title: 'Test', body: 'This is a test notification' },
//     { key1: 'value1' });
// console.log('send', send)