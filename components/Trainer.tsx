import React, { useState, useEffect } from 'react';
import { Dumbbell, Check, X, RefreshCw, Trophy, Medal, Atom, Crown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ElementData } from '../types';
import { useElements } from '../src/contexts/ElementsContext';
import { useAuth } from '../src/context/AuthContext';

type LeaderboardEntry = {
  uid: string;
  displayName: string;
  xp: number;
  level: number;
  tasksCompleted: number;
};

const Trainer: React.FC = () => {
  const { t } = useTranslation();
  const { token } = useAuth();
  const { elements: PERIODIC_ELEMENTS } = useElements();
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [level, setLevel] = useState(1);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  // Element Mode State
  const [currentElement, setCurrentElement] = useState<ElementData | null>(null);
  const [options, setOptions] = useState<string[]>([]);

  // Load progress from backend
  useEffect(() => {
    const loadProgress = async () => {
      if (!token) return;

      try {
        const response = await fetch('/api/progress', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          setScore(data.xp || 0);
          setLevel(data.level || 1);
          setStreak(data.streak || 0);
          setCorrectAnswers(data.correctAnswers || 0);
        }
      } catch (error) {
        console.error('Failed to load progress:', error);
        // Fallback to localStorage for offline mode
        const savedXp = localStorage.getItem('chem_xp');
        if (savedXp) {
          const xp = parseInt(savedXp);
          setScore(xp);
          setLevel(Math.floor(xp / 100) + 1);
        }
      }
    };

    loadProgress();
    loadLeaderboard();
  }, [token]);

  // Load leaderboard
  const loadLeaderboard = async () => {
    try {
      const response = await fetch('/api/leaderboard');
      if (response.ok) {
        const data = await response.json();
        setLeaderboard(data);
      }
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    }
  };

  const addXP = async (amount: number, mode: 'elements' | 'balancing', correct: boolean) => {
    if (!token) {
      // Fallback to localStorage if not authenticated
      const newScore = score + amount;
      setScore(newScore);
      setLevel(Math.floor(newScore / 100) + 1);
      localStorage.setItem('chem_xp', newScore.toString());
      return;
    }

    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          xpToAdd: amount,
          correct: correct
        })
      });

      if (response.ok) {
        const data = await response.json();
        setScore(data.xp);
        setLevel(data.level);
        setStreak(data.streak || 0);
        setCorrectAnswers(data.correctAnswers || 0);
      }
    } catch (error) {
      console.error('Failed to update XP:', error);
    }
  };

  const generateElementQuestion = () => {
    const randomIdx = Math.floor(Math.random() * PERIODIC_ELEMENTS.length);
    const element = PERIODIC_ELEMENTS[randomIdx];
    setCurrentElement(element);

    const wrongOptions = new Set<string>();
    while (wrongOptions.size < 3) {
      const idx = Math.floor(Math.random() * PERIODIC_ELEMENTS.length);
      const name = PERIODIC_ELEMENTS[idx].name;
      if (name !== element.name) {
        wrongOptions.add(name);
      }
    }
    
    const allOptions = Array.from(wrongOptions);
    allOptions.splice(Math.floor(Math.random() * 4), 0, element.name);
    setOptions(allOptions);
    setFeedback(null);
  };

  useEffect(() => {
      generateElementQuestion();
  }, []);

  const handleElementAnswer = (answer: string) => {
    if (feedback) return;

    if (answer === currentElement?.name) {
      addXP(10, 'elements', true);
      setStreak(s => s + 1);
      setFeedback('correct');
      setTimeout(generateElementQuestion, 1000);
    } else {
      setStreak(0);
      setFeedback('wrong');
      setTimeout(generateElementQuestion, 1500);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 transition-colors">
          <Dumbbell size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-zinc-100 transition-colors">{t('trainer.title')}</h2>
          <p className="text-slate-500 dark:text-zinc-400 transition-colors">{t('trainer.subtitle')}</p>
        </div>
      </div>

      {/* Gamification Bar */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-700 rounded-2xl p-6 text-white shadow-lg mb-6 flex justify-between items-center transition-colors">
          <div>
              <div className="text-xs font-bold uppercase opacity-70 mb-1">{t('trainer.yourProgress')}</div>
              <div className="text-3xl font-bold flex items-center gap-2">
                  {t('trainer.level')} {level}
                  <Medal className="text-yellow-300" />
              </div>
              {streak > 0 && (
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <span className="bg-orange-500 px-2 py-1 rounded-lg font-bold animate-pulse">
                    🔥 {streak} {t('trainer.streakText')}
                  </span>
                </div>
              )}
          </div>
          <div className="text-right">
             <div className="text-2xl font-bold">{score} XP</div>
             <div className="text-xs opacity-80">{t('trainer.nextLevel')} {level + 1}: {3 - (correctAnswers % 3)} {t('trainer.correctAnswers')}</div>
          </div>
          <button
            onClick={() => setShowLeaderboard(!showLeaderboard)}
            className="ml-4 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors flex items-center gap-2"
          >
            <Trophy size={20} />
            {showLeaderboard ? t('trainer.hide') : t('trainer.leaderboard')}
          </button>
      </div>

      {/* Leaderboard */}
      {showLeaderboard && (
        <div className="bg-white dark:bg-zinc-800 rounded-2xl p-6 shadow-lg mb-6 border border-slate-200 dark:border-zinc-600 transition-colors">
          <div className="flex items-center gap-2 mb-4">
            <Crown className="text-yellow-500 dark:text-yellow-400" size={24} />
            <h3 className="text-xl font-bold text-slate-800 dark:text-zinc-100 transition-colors">{t('trainer.topPlayers')}</h3>
          </div>
          <div className="space-y-2">
            {leaderboard.map((entry, index) => (
              <div
                key={entry.uid}
                className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                  index === 0 ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-2 border-yellow-300 dark:border-yellow-600' :
                  index === 1 ? 'bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/20 dark:to-gray-700/20 border-2 border-gray-300 dark:border-gray-600' :
                  index === 2 ? 'bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-2 border-orange-300 dark:border-orange-600' :
                  'bg-slate-50 dark:bg-zinc-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    index === 0 ? 'bg-yellow-500 text-white' :
                    index === 1 ? 'bg-gray-400 text-white' :
                    index === 2 ? 'bg-orange-500 text-white' :
                    'bg-slate-300 dark:bg-zinc-600 text-slate-700 dark:text-zinc-200'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 dark:text-zinc-100 transition-colors">{entry.displayName}</div>
                    <div className="text-xs text-slate-500 dark:text-zinc-400 transition-colors">{t('trainer.level')} {entry.level}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-indigo-600 dark:text-indigo-400 transition-colors">{entry.xp} XP</div>
                  <div className="text-xs text-slate-500 dark:text-zinc-400 transition-colors">{entry.tasksCompleted} {t('trainer.tasksCompleted')}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-slate-50 dark:bg-zinc-900 rounded-2xl p-6 border border-slate-100 dark:border-zinc-700 text-center relative overflow-hidden min-h-[300px] flex flex-col justify-center transition-colors">
        {feedback === 'correct' && (
          <div className="absolute inset-0 bg-green-500/10 dark:bg-green-500/20 flex items-center justify-center z-20 animate-fade-in backdrop-blur-[2px]">
             <Check size={80} className="text-green-500 dark:text-green-400 drop-shadow-md" />
          </div>
        )}
        {feedback === 'wrong' && (
          <div className="absolute inset-0 bg-red-500/10 dark:bg-red-500/20 flex items-center justify-center z-20 animate-fade-in backdrop-blur-[2px]">
             <X size={80} className="text-red-500 dark:text-red-400 drop-shadow-md" />
          </div>
        )}

        <div className="mb-8">
          <p className="text-slate-500 dark:text-zinc-400 mb-4 font-medium uppercase tracking-wider transition-colors">{t('trainer.nameElement')}</p>
          <div className="w-32 h-32 mx-auto bg-white dark:bg-zinc-800 rounded-3xl shadow-lg border-2 border-slate-100 dark:border-zinc-600 flex flex-col items-center justify-center transition-colors">
              <span className="text-5xl font-bold text-slate-800 dark:text-zinc-100 transition-colors">{currentElement?.symbol}</span>
              <span className="text-sm text-slate-400 dark:text-zinc-500 mt-1 font-mono transition-colors">{currentElement?.number}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {options.map((opt, idx) => (
              <button
              key={idx}
              onClick={() => handleElementAnswer(opt)}
              disabled={!!feedback}
              className={`
                  h-14 rounded-xl font-medium transition-all text-lg
                  ${feedback && opt === currentElement?.name ? 'bg-green-500 text-white shadow-green-200' : ''}
                  ${feedback === 'wrong' && opt !== currentElement?.name ? 'opacity-50' : ''}
                  ${!feedback ? 'bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-600 text-slate-700 dark:text-zinc-200 hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-sm' : ''}
              `}
              >
              {opt}
              </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Trainer;
