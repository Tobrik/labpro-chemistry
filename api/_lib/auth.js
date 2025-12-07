"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
exports.requireAdmin = requireAdmin;
const firebase_admin_1 = require("./firebase-admin");
async function authenticate(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ error: 'Unauthorized: No token provided' });
            return;
        }
        const token = authHeader.split('Bearer ')[1];
        try {
            // Verify Firebase ID token
            const decodedToken = await firebase_admin_1.auth.verifyIdToken(token);
            // Get user data from Firestore
            const userDoc = await firebase_admin_1.db.collection('users').doc(decodedToken.uid).get();
            if (!userDoc.exists) {
                res.status(404).json({ error: 'User not found' });
                return;
            }
            const userData = userDoc.data();
            if (!userData?.isActive) {
                res.status(403).json({ error: 'User account is deactivated' });
                return;
            }
            // Attach user info to request
            req.user = {
                uid: decodedToken.uid,
                email: decodedToken.email || '',
                role: userData.role || 'user',
            };
            await next();
        }
        catch (error) {
            console.error('Token verification error:', error);
            res.status(401).json({ error: 'Invalid or expired token' });
            return;
        }
    }
    catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
}
function requireAdmin(req, res) {
    if (!req.user) {
        res.status(401).json({ error: 'Unauthorized: Authentication required' });
        return false;
    }
    if (req.user.role !== 'admin') {
        res.status(403).json({ error: 'Forbidden: Admin access required' });
        return false;
    }
    return true;
}
