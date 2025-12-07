"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const firebase_admin_1 = require("../_lib/firebase-admin");
async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    try {
        const { uid, email, displayName } = req.body;
        if (!uid || !email) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        // Check if user already exists
        const userDoc = await firebase_admin_1.db.collection('users').doc(uid).get();
        if (userDoc.exists) {
            return res.status(200).json({ message: 'User already exists', user: userDoc.data() });
        }
        // Create new user document
        const userData = {
            uid,
            email,
            displayName: displayName || email.split('@')[0],
            role: 'user',
            isActive: true,
            createdAt: firebase_admin_1.Timestamp.now(),
            lastLoginAt: firebase_admin_1.Timestamp.now(),
        };
        await firebase_admin_1.db.collection('users').doc(uid).set(userData);
        return res.status(201).json({ message: 'User created successfully', user: userData });
    }
    catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ error: 'Failed to create user' });
    }
}
