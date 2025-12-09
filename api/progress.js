"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const auth_1 = require("./_lib/auth");
const firebase_admin_1 = require("./_lib/firebase-admin");
async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    const authReq = req;
    await (0, auth_1.authenticate)(authReq, res, async () => {
        try {
            const progressDoc = await firebase_admin_1.db
                .collection('users')
                .doc(authReq.user.uid)
                .collection('progress')
                .doc('stats')
                .get();
            if (!progressDoc.exists) {
                // Return default progress
                res.status(200).json({
                    xp: 0,
                    level: 1,
                    streak: 0,
                    tasksCompleted: 0,
                });
                return;
            }
            res.status(200).json(progressDoc.data());
        }
        catch (error) {
            console.error('Progress fetch error:', error);
            res.status(500).json({ error: 'Failed to fetch progress' });
        }
    });
}
