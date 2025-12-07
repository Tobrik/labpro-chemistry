"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const auth_1 = require("../_lib/auth");
const firebase_admin_1 = require("../_lib/firebase-admin");
async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    const authReq = req;
    await (0, auth_1.authenticate)(authReq, res, async () => {
        try {
            const userId = authReq.user.uid;
            const doc = await firebase_admin_1.db.collection('userProgress').doc(userId).get();
            if (!doc.exists) {
                // Return default progress
                res.status(200).json({
                    xp: 0,
                    level: 1,
                    streak: 0,
                    lastTrainingDate: null,
                    achievements: [],
                });
                return;
            }
            res.status(200).json(doc.data());
        }
        catch (error) {
            console.error('Get progress error:', error);
            res.status(500).json({ error: 'Failed to get progress' });
        }
    });
}
