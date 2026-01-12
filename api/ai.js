"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const auth_1 = require("./_lib/auth");
const gemini_1 = require("./_lib/gemini");
async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    const authReq = req;
    await (0, auth_1.authenticate)(authReq, res, async () => {
        try {
            const { action, ...params } = req.body;
            let result;
            switch (action) {
                case 'element-details':
                    if (!params.elementName || typeof params.elementName !== 'string') {
                        res.status(400).json({ error: 'Invalid element name' });
                        return;
                    }
                    result = await (0, gemini_1.getElementDetails)(params.elementName);
                    break;
                case 'balance-equation':
                    if (!params.equation || typeof params.equation !== 'string') {
                        res.status(400).json({ error: 'Invalid equation' });
                        return;
                    }
                    result = await (0, gemini_1.balanceEquation)(params.equation);
                    break;
                case 'compare-substances':
                    if (!params.substanceA || !params.substanceB) {
                        res.status(400).json({ error: 'Invalid substances' });
                        return;
                    }
                    result = await (0, gemini_1.compareSubstances)(params.substanceA, params.substanceB);
                    break;
                case 'solve-problem':
                    if (!params.problem || typeof params.problem !== 'string') {
                        res.status(400).json({ error: 'Invalid problem' });
                        return;
                    }
                    result = await (0, gemini_1.solveProblem)(params.problem);
                    break;
                default:
                    res.status(400).json({ error: 'Invalid action' });
                    return;
            }
            res.status(200).json(result);
        }
        catch (error) {
            console.error('AI request error:', error);
            res.status(500).json({ error: 'AI request failed' });
        }
    });
}
