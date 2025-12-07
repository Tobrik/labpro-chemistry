"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const auth_1 = require("../_lib/auth");
const gemini_1 = require("../_lib/gemini");
async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    const authReq = req;
    await (0, auth_1.authenticate)(authReq, res, async () => {
        try {
            const { problem } = req.body;
            if (!problem || typeof problem !== 'string') {
                res.status(400).json({ error: 'Invalid problem' });
                return;
            }
            const result = await (0, gemini_1.solveProblem)(problem);
            res.status(200).json(result);
        }
        catch (error) {
            console.error('Solve problem error:', error);
            res.status(500).json({ error: 'Failed to solve problem' });
        }
    });
}
