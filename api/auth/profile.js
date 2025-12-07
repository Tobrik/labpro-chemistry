"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const auth_1 = require("../_lib/auth");
const firebase_admin_1 = require("../_lib/firebase-admin");
async function handler(req, res) {
    const authReq = req;
    await (0, auth_1.authenticate)(authReq, res, async () => {
        try {
            const userId = authReq.user.uid;
            if (req.method === 'GET') {
                // Get user profile
                const userDoc = await firebase_admin_1.db.collection('users').doc(userId).get();
                if (!userDoc.exists) {
                    res.status(404).json({ error: 'User not found' });
                    return;
                }
                res.status(200).json(userDoc.data());
                return;
            }
            if (req.method === 'PUT') {
                // Update user profile
                const { displayName, profilePhotoUrl } = req.body;
                const updates = {
                    lastLoginAt: firebase_admin_1.Timestamp.now(),
                };
                if (displayName)
                    updates.displayName = displayName;
                if (profilePhotoUrl)
                    updates.profilePhotoUrl = profilePhotoUrl;
                await firebase_admin_1.db.collection('users').doc(userId).update(updates);
                const updatedDoc = await firebase_admin_1.db.collection('users').doc(userId).get();
                res.status(200).json(updatedDoc.data());
                return;
            }
            res.status(405).json({ error: 'Method not allowed' });
        }
        catch (error) {
            console.error('Profile error:', error);
            res.status(500).json({ error: 'Failed to manage profile' });
        }
    });
}
