"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const auth_1 = require("../_lib/auth");
const firebase_admin_1 = require("../_lib/firebase-admin");
async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    const authReq = req;
    await (0, auth_1.authenticate)(authReq, res, async () => {
        try {
            const userId = authReq.user.uid;
            const { xp } = req.body;
            if (typeof xp !== 'number') {
                res.status(400).json({ error: 'Invalid XP value' });
                return;
            }
            const progressRef = firebase_admin_1.db.collection('userProgress').doc(userId);
            const existingDoc = await progressRef.get();
            if (existingDoc.exists) {
                const existingData = existingDoc.data();
                // Only migrate if backend XP is less than localStorage XP
                if (existingData.xp < xp) {
                    await progressRef.update({
                        xp,
                        level: Math.floor(xp / 100) + 1,
                        updatedAt: firebase_admin_1.Timestamp.now(),
                    });
                }
                res.status(200).json(existingDoc.data());
                return;
            }
            // Create new progress document
            const newProgress = {
                xp,
                level: Math.floor(xp / 100) + 1,
                streak: 0,
                lastTrainingDate: null,
                achievements: [],
                updatedAt: firebase_admin_1.Timestamp.now(),
            };
            await progressRef.set(newProgress);
            res.status(200).json(newProgress);
        }
        catch (error) {
            console.error('Migrate progress error:', error);
            res.status(500).json({ error: 'Failed to migrate progress' });
        }
    });
}
