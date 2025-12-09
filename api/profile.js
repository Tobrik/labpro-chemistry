"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const auth_1 = require("./_lib/auth");
async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    const authReq = req;
    await (0, auth_1.authenticate)(authReq, res, async () => {
        const user = authReq.user;
        res.status(200).json({
            uid: user.uid,
            email: user.email,
            role: user.role || 'user',
        });
    });
}
