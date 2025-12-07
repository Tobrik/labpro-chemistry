"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const auth_1 = require("../_lib/auth");
const firebase_admin_1 = require("../_lib/firebase-admin");
async function handler(req, res) {
    const authReq = req;
    await (0, auth_1.authenticate)(authReq, res, async () => {
        if (!(0, auth_1.requireAdmin)(authReq, res))
            return;
        try {
            if (req.method === 'GET') {
                // Get users list
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 20;
                const role = req.query.role;
                let query = firebase_admin_1.db.collection('users');
                if (role && (role === 'admin' || role === 'user')) {
                    query = query.where('role', '==', role);
                }
                const snapshot = await query.orderBy('createdAt', 'desc').limit(limit).get();
                const users = snapshot.docs.map((doc) => ({
                    uid: doc.id,
                    ...doc.data(),
                }));
                res.status(200).json({ users, page, limit });
                return;
            }
            if (req.method === 'PUT') {
                // Update user role
                const { userId, role } = req.body;
                if (!userId || !role || (role !== 'admin' && role !== 'user')) {
                    res.status(400).json({ error: 'Invalid request' });
                    return;
                }
                await firebase_admin_1.db.collection('users').doc(userId).update({ role });
                res.status(200).json({ success: true });
                return;
            }
            if (req.method === 'DELETE') {
                // Deactivate user
                const { userId } = req.body;
                if (!userId) {
                    res.status(400).json({ error: 'Invalid request' });
                    return;
                }
                await firebase_admin_1.db.collection('users').doc(userId).update({ isActive: false });
                res.status(200).json({ success: true });
                return;
            }
            res.status(405).json({ error: 'Method not allowed' });
        }
        catch (error) {
            console.error('Users management error:', error);
            res.status(500).json({ error: 'Failed to manage users' });
        }
    });
}
