const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();
app.use(cors());
app.use(express.json());

// Add User Endpoint
app.post('/api/addUser', async (req, res) => {
  const { email, password, displayName, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    // Create User in Firebase Auth
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName
    });

    // Assign Role via Custom Claims
    if (role) {
      await admin.auth().setCustomUserClaims(userRecord.uid, { role });
    }

    return res.status(201).json({ message: 'User added successfully', uid: userRecord.uid });
  } catch (error) {
    console.error('Error adding user:', error);
    return res.status(500).json({ error: error.message });
  }
});

// Run Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

