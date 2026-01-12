import React, { useState } from 'react';
import { ATOMIC_MASSES } from '../constants';
import { Beaker, ArrowRight, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const MolarMass: React.FC = () => {
  const { t } = useTranslation();
  const [formula, setFormula] = useState('');
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [breakdown, setBreakdown] = useState<string[]>([]);

  const calculateMolarMass = (input: string) => {
    setError(null);
    setResult(null);
    setBreakdown([]);

    if (!input.trim()) return;

    try {
      // Updated regex to properly match elements:
      // ([A-Z][a-z]?]) matches one uppercase letter optionally followed by ONE lowercase letter
      // This ensures Cl is matched as a whole, not as C and l separately
      const regex = /([A-Z][a-z]?)(\d*)/g;
      let match;
      let totalMass = 0;
      const elements: string[] = [];
      let validLength = 0;

      while ((match = regex.exec(input)) !== null) {
        const element = match[1];
        const count = match[2] ? parseInt(match[2]) : 1;

        validLength += match[0].length;

        if (ATOMIC_MASSES[element]) {
          const mass = ATOMIC_MASSES[element] * count;
          totalMass += mass;
          elements.push(`${count} × ${element} (${ATOMIC_MASSES[element].toFixed(2)})`);
        } else {
          throw new Error(`Неизвестный элемент: ${element}`);
        }
      }

      if (validLength !== input.length) {
         throw new Error("Неверные символы в формуле");
      }

      setResult(totalMass);
      setBreakdown(elements);
    } catch (err: any) {
      setError(err.message || "Неверная химическая формула");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 transition-colors">
          <Beaker size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-zinc-100">{t('molarMass.title')}</h2>
          <p className="text-slate-500 dark:text-zinc-400">{t('molarMass.subtitle')}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <label className="block text-sm font-medium text-slate-500 dark:text-zinc-400 mb-1 ml-1">
            {t('molarMass.formula')}
          </label>
          <input
            type="text"
            value={formula}
            onChange={(e) => setFormula(e.target.value)}
            placeholder={t('molarMass.placeholder')}
            className="w-full h-14 px-4 text-lg bg-white dark:bg-zinc-700 text-slate-900 dark:text-zinc-100 border border-slate-200 dark:border-zinc-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
            onKeyDown={(e) => e.key === 'Enter' && calculateMolarMass(formula)}
          />
        </div>

        <button
          onClick={() => calculateMolarMass(formula)}
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center space-x-2 active:scale-95"
        >
          <span>{t('common.calculate')}</span>
          <ArrowRight size={20} />
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-center gap-3 animate-fade-in border border-red-100 dark:border-red-800 transition-colors">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {result !== null && (
        <div className="bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-6 rounded-2xl animate-fade-in mt-6 transition-colors">
          <p className="text-slate-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">{t('molarMass.result')}</p>
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-bold text-slate-800 dark:text-zinc-100">{result.toFixed(3)}</span>
            <span className="text-xl text-slate-500 dark:text-zinc-400">g/mol</span>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-zinc-700">
            <p className="text-sm text-slate-400 dark:text-zinc-500 mb-2">Composition</p>
            <div className="flex flex-wrap gap-2">
              {breakdown.map((item, idx) => (
                <span key={idx} className="px-3 py-1 bg-white dark:bg-zinc-700 border border-slate-200 dark:border-zinc-600 rounded-full text-xs font-medium text-slate-600 dark:text-zinc-300 shadow-sm">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MolarMass;
