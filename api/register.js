"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const firebase_admin_1 = require("./_lib/firebase-admin");
const firebase_admin_2 = __importDefault(require("firebase-admin"));
async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const token = authHeader.split('Bearer ')[1];
        const decodedToken = await firebase_admin_2.default.auth().verifyIdToken(token);
        const uid = decodedToken.uid;
        // Check if user document already exists
        const userDoc = await firebase_admin_1.db.collection('users').doc(uid).get();
        if (userDoc.exists) {
            return res.status(200).json({ message: 'User already exists', user: userDoc.data() });
        }
        // Create new user document
        const { email, displayName } = req.body;
        const userData = {
            uid,
            email: email || decodedToken.email,
            displayName: displayName || decodedToken.name || email?.split('@')[0] || 'User',
            role: 'user',
            isActive: true,
            createdAt: firebase_admin_2.default.firestore.Timestamp.now(),
            lastLoginAt: firebase_admin_2.default.firestore.Timestamp.now(),
        };
        await firebase_admin_1.db.collection('users').doc(uid).set(userData);
        // Initialize progress
        await firebase_admin_1.db
            .collection('users')
            .doc(uid)
            .collection('progress')
            .doc('stats')
            .set({
            xp: 0,
            level: 1,
            tasksCompleted: 0,
            correctAnswers: 0,
            streak: 0,
            bestStreak: 0,
            createdAt: firebase_admin_2.default.firestore.Timestamp.now(),
        });
        return res.status(201).json({ message: 'User created successfully', user: userData });
    }
    catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ error: 'Failed to create user' });
    }
}
