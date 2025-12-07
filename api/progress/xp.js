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
            const { xpGained, mode, correctAnswers, totalQuestions } = req.body;
            if (!xpGained || !mode || correctAnswers === undefined || totalQuestions === undefined) {
                res.status(400).json({ error: 'Missing required fields' });
                return;
            }
            const progressRef = firebase_admin_1.db.collection('userProgress').doc(userId);
            const progressDoc = await progressRef.get();
            const currentProgress = progressDoc.exists
                ? progressDoc.data()
                : {
                    xp: 0,
                    level: 1,
                    streak: 0,
                    lastTrainingDate: null,
                    achievements: [],
                    updatedAt: firebase_admin_1.Timestamp.now(),
                };
            const newXp = currentProgress.xp + xpGained;
            const newLevel = Math.floor(newXp / 100) + 1;
            const leveledUp = newLevel > currentProgress.level;
            // Update streak logic
            const now = new Date();
            const lastDate = currentProgress.lastTrainingDate?.toDate();
            let newStreak = currentProgress.streak;
            if (lastDate) {
                const daysDiff = Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
                if (daysDiff === 1) {
                    newStreak += 1;
                }
                else if (daysDiff > 1) {
                    newStreak = 1;
                }
            }
            else {
                newStreak = 1;
            }
            // Check for new achievements
            const newAchievements = [];
            if (leveledUp && newLevel === 5 && !currentProgress.achievements.includes('level_5')) {
                newAchievements.push('level_5');
            }
            if (leveledUp && newLevel === 10 && !currentProgress.achievements.includes('level_10')) {
                newAchievements.push('level_10');
            }
            if (newStreak >= 7 && !currentProgress.achievements.includes('streak_7')) {
                newAchievements.push('streak_7');
            }
            const updatedProgress = {
                xp: newXp,
                level: newLevel,
                streak: newStreak,
                lastTrainingDate: firebase_admin_1.Timestamp.now(),
                achievements: [...currentProgress.achievements, ...newAchievements],
                updatedAt: firebase_admin_1.Timestamp.now(),
            };
            await progressRef.set(updatedProgress, { merge: true });
            // Create training session record
            await firebase_admin_1.db
                .collection('trainingStats')
                .doc(userId)
                .collection('sessions')
                .add({
                userId,
                mode,
                questionsAnswered: totalQuestions,
                correctAnswers,
                wrongAnswers: totalQuestions - correctAnswers,
                xpEarned: xpGained,
                startTime: firebase_admin_1.Timestamp.now(),
                endTime: firebase_admin_1.Timestamp.now(),
                duration: 0,
            });
            const response = {
                newXp,
                newLevel,
                leveledUp,
                newAchievements: newAchievements.length > 0 ? newAchievements : undefined,
            };
            res.status(200).json(response);
        }
        catch (error) {
            console.error('Update XP error:', error);
            res.status(500).json({ error: 'Failed to update XP' });
        }
    });
}
