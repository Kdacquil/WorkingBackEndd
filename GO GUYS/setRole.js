const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = require('./path/to/serviceAccountKey.json'); // Download from Firebase Console
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Assign role to a user
async function setUserRole(email, role) {
  const user = await admin.auth().getUserByEmail(email);
  await admin.auth().setCustomUserClaims(user.uid, { role });
  console.log(`Role "${role}" assigned to ${email}`);
}

// Example: Assign admin role
setUserRole('admin@example.com', 'admin').catch(console.error);
