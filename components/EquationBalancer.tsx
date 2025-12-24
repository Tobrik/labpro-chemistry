import React, { useState } from 'react';
import { Scale, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { getOxidationStates } from '../chemistryUtils';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../src/context/AuthContext';
import { useLanguage } from '../src/contexts/LanguageContext';

const EquationBalancer: React.FC = () => {
  const { t } = useTranslation();
  const { token } = useAuth();
  const { currentLanguage } = useLanguage();
  const [equation, setEquation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ balancedEquation: string; explanation: string } | null>(null);
  const [oxidationStates, setOxidationStates] = useState<Record<string, Record<string, number>>>({});

  const handleBalance = async () => {
    if (!equation.trim()) return;
    if (!token) {
      setError(t('errors.authRequired'));
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setOxidationStates({});

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: 'balance-equation',
          equation: equation,
          language: currentLanguage
        }),
      });

      if (!response.ok) throw new Error('Balancing failed');

      const data = await response.json();
      setResult({
        balancedEquation: data.balancedEquation,
        explanation: data.explanation
      });

      // Try to calculate oxidation states from the balanced equation (optional)
      try {
        const formulas = data.balancedEquation.match(/[A-Z][a-z]?\d*/g) || [];
        const states: Record<string, Record<string, number>> = {};
        formulas.forEach((formula: string) => {
          if (!states[formula]) {
            states[formula] = getOxidationStates(formula);
          }
        });
        setOxidationStates(states);
      } catch {
        // Oxidation states calculation failed, but that's okay
      }

    } catch (err: any) {
      setError(err.message || t('errors.generic'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 relative isolate">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 transition-colors">
          <Scale size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-zinc-100">{t('aiBalancer.title')}</h2>
          <p className="text-slate-500 dark:text-zinc-400">{t('aiBalancer.subtitle')}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <label className="block text-sm font-medium text-slate-500 dark:text-zinc-400 mb-1 ml-1">
            {t('aiBalancer.equation')}
          </label>
          <input
            type="text"
            value={equation}
            onChange={(e) => setEquation(e.target.value)}
            placeholder={t('aiBalancer.placeholder')}
            disabled={loading}
            className="w-full h-14 px-4 text-lg bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 border border-slate-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent transition-all font-mono disabled:opacity-50"
            onKeyDown={(e) => e.key === 'Enter' && !loading && handleBalance()}
          />
        </div>

        <button
          onClick={handleBalance}
          disabled={loading || !equation.trim()}
          className="w-full h-12 bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/30 transition-all flex items-center justify-center space-x-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>{t('common.loading')}</span>
            </>
          ) : (
            <>
              <span>{t('aiBalancer.balance')}</span>
              <ArrowRight size={20} />
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-medium animate-fade-in border border-red-100 dark:border-red-800">
          {error}
        </div>
      )}

      {result && (
        <div className="bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-6 rounded-2xl animate-fade-in mt-6 transition-colors">
           <div className="flex items-center gap-2 mb-3 text-green-600 dark:text-green-400">
             <CheckCircle2 size={18} />
             <span className="text-sm font-bold uppercase tracking-wider">{t('aiBalancer.result')}</span>
           </div>

           <div className="p-4 bg-white dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-700 shadow-sm mb-4 text-center">
             <p className="text-xl md:text-2xl font-mono text-slate-800 dark:text-zinc-100 font-bold break-all">
               {result.balancedEquation.replace(/->/g, '→')}
             </p>
           </div>

           {result.explanation && (
             <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800 mb-4">
               <h4 className="text-sm font-bold text-blue-700 dark:text-blue-300 mb-2">{t('aiBalancer.explanation')}</h4>
               <p className="text-sm text-blue-600 dark:text-blue-400">{result.explanation}</p>
             </div>
           )}

           {Object.keys(oxidationStates).length > 0 && (
             <div className="border-t border-slate-200 dark:border-zinc-700 pt-4">
               <h4 className="text-sm font-bold text-slate-500 dark:text-zinc-400 uppercase mb-3">Степени окисления</h4>
               <div className="flex flex-wrap gap-4">
                 {Object.entries(oxidationStates).map(([formula, states]) => (
                   <div key={formula} className="bg-white dark:bg-zinc-800 px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 shadow-sm">
                     <span className="font-bold text-slate-800 dark:text-zinc-100 block border-b border-slate-100 dark:border-zinc-700 pb-1 mb-1">{formula}</span>
                     <div className="flex gap-2 text-xs">
                       {Object.entries(states).map(([el, st]) => (
                         <span key={el} className="flex flex-col items-center">
                           <span className="text-slate-400 dark:text-zinc-500">{el}</span>
                           <span className={`font-mono font-bold ${st > 0 ? 'text-rose-500 dark:text-rose-400' : st < 0 ? 'text-blue-500 dark:text-blue-400' : 'text-slate-500 dark:text-zinc-500'}`}>
                             {st > 0 ? '+' + st : st}
                           </span>
                         </span>
                       ))}
                     </div>
                   </div>
                 ))}
               </div>
             </div>
           )}
        </div>
      )}
    </div>
  );
};

export default EquationBalancer;
