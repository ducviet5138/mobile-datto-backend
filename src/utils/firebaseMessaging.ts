import * as admin from 'firebase-admin';

var serviceAccount = require('@/utils/datto-65a5b-firebase-adminsdk-jxz2u-3597bc2bb8.json');
admin.initializeApp({
    credential: admin.credential.cert({
        projectId: serviceAccount.project_id,
        clientEmail: serviceAccount.client_email,
        privateKey: serviceAccount.private_key,
    }),
});

const firebaseMessaging = admin.messaging(admin.app());

export default firebaseMessaging;
