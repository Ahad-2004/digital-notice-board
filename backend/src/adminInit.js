const admin = require('firebase-admin');

function initAdminFromEnv() {
  if (admin.apps.length) return;

  const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env;
  if (FIREBASE_PROJECT_ID && FIREBASE_CLIENT_EMAIL && FIREBASE_PRIVATE_KEY) {
    // Sanitize the private key: remove surrounding quotes (dotenv sometimes preserves them)
    let privateKey = FIREBASE_PRIVATE_KEY;
    if ((privateKey.startsWith('"') && privateKey.endsWith('"')) || (privateKey.startsWith("'") && privateKey.endsWith("'"))) {
      privateKey = privateKey.slice(1, -1);
    }
    // Replace escaped newlines with real newlines
    privateKey = privateKey.replace(/\\n/g, '\n');

    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: FIREBASE_PROJECT_ID,
          clientEmail: FIREBASE_CLIENT_EMAIL,
          privateKey
        })
      });
      console.log('Firebase Admin initialized');
    } catch (err) {
      console.error('Failed to initialize Firebase Admin:', err && err.message ? err.message : err);
      console.error('The server will continue to run, but Firebase functionality may be limited. Check your FIREBASE_PRIVATE_KEY formatting.');
    }
  } else {
    console.log('Firebase Admin env vars not fully set; skipping initialization');
  }
}

module.exports = { initAdminFromEnv };
