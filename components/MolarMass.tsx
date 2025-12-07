import React, { useState } from 'react';
import { ATOMIC_MASSES } from '../constants';
import { Beaker, ArrowRight, AlertCircle } from 'lucide-react';

const MolarMass: React.FC = () => {
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
      const regex = /([A-Z][a-z]*)(\d*)/g;
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
        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
          <Beaker size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Калькулятор молярной массы</h2>
          <p className="text-slate-500">Мгновенный расчет молекулярной массы веществ</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <label className="block text-sm font-medium text-slate-500 mb-1 ml-1">
            Химическая формула
          </label>
          <input
            type="text"
            value={formula}
            onChange={(e) => setFormula(e.target.value)}
            placeholder="например, H2SO4, NaCl, C6H12O6"
            className="w-full h-14 px-4 text-lg bg-white text-slate-900 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            onKeyDown={(e) => e.key === 'Enter' && calculateMolarMass(formula)}
          />
        </div>

        <button
          onClick={() => calculateMolarMass(formula)}
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center space-x-2 active:scale-95"
        >
          <span>Рассчитать массу</span>
          <ArrowRight size={20} />
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 animate-fade-in border border-red-100">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {result !== null && (
        <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl animate-fade-in mt-6">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Общая молярная масса</p>
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-bold text-slate-800">{result.toFixed(3)}</span>
            <span className="text-xl text-slate-500">г/моль</span>
          </div>
          
          <div className="mt-4 pt-4 border-t border-slate-200">
            <p className="text-sm text-slate-400 mb-2">Состав</p>
            <div className="flex flex-wrap gap-2">
              {breakdown.map((item, idx) => (
                <span key={idx} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-600 shadow-sm">
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
