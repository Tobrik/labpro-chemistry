import React, { useState } from 'react';
import { Scale, CheckCircle2, ArrowRight } from 'lucide-react';
import { balanceReaction, getOxidationStates } from '../chemistryUtils';

const EquationBalancer: React.FC = () => {
  const [equation, setEquation] = useState('');
  const [result, setResult] = useState<{ balanced: string; error?: string } | null>(null);
  const [oxidationStates, setOxidationStates] = useState<Record<string, Record<string, number>>>({});

  const handleBalance = () => {
    if (!equation.trim()) return;
    
    // Balance
    const res = balanceReaction(equation);
    setResult(res);

    if (res.reaction) {
      // Calculate Oxidation States for display
      const states: Record<string, Record<string, number>> = {};
      [...res.reaction.reactants, ...res.reaction.products].forEach(comp => {
         states[comp.formula] = getOxidationStates(comp.formula);
      });
      setOxidationStates(states);
    }
  };

  const formatWithOxidation = (formula: string) => {
    const states = oxidationStates[formula];
    if (!states) return formula;
    
    // Hacky display: insert oxidation number above element?
    // We will just return a formatted string for the UI like H(+1)2 O(-2)
    // This requires splitting formula again.
    // For simplicity, we display states below the formula in the card.
    return formula;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
          <Scale size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Уравнитель реакции</h2>
          <p className="text-slate-500">Точный алгоритмический баланс и степени окисления</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <label className="block text-sm font-medium text-slate-500 mb-1 ml-1">
            Химическое уравнение
          </label>
          <input
            type="text"
            value={equation}
            onChange={(e) => setEquation(e.target.value)}
            placeholder="например, H2 + O2 = H2O"
            className="w-full h-14 px-4 text-lg bg-white text-slate-900 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all font-mono"
            onKeyDown={(e) => e.key === 'Enter' && handleBalance()}
          />
          <p className="text-xs text-slate-400 mt-2 ml-1">Поддерживает знаки "=", "-&gt;", "+". Регистр важен (Fe, не fe).</p>
        </div>

        <button
          onClick={handleBalance}
          className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/30 transition-all flex items-center justify-center space-x-2 active:scale-95"
        >
          <span>Уравнять</span>
          <ArrowRight size={20} />
        </button>
      </div>

      {result?.error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium animate-fade-in border border-red-100">
          Ошибка: {result.error}. Проверьте правильность формул.
        </div>
      )}

      {result?.balanced && (
        <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl animate-fade-in mt-6">
           <div className="flex items-center gap-2 mb-3 text-green-600">
             <CheckCircle2 size={18} />
             <span className="text-sm font-bold uppercase tracking-wider">Сбалансированное уравнение</span>
           </div>
           
           <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm mb-6 text-center">
             <p className="text-xl md:text-2xl font-mono text-slate-800 font-bold break-all">
               {result.balanced.replace(/->/g, '→')}
             </p>
           </div>

           <div className="border-t border-slate-200 pt-4">
             <h4 className="text-sm font-bold text-slate-500 uppercase mb-3">Степени окисления (электронный баланс)</h4>
             <div className="flex flex-wrap gap-4">
               {Object.entries(oxidationStates).map(([formula, states]) => (
                 <div key={formula} className="bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm">
                   <span className="font-bold text-slate-800 block border-b border-slate-100 pb-1 mb-1">{formula}</span>
                   <div className="flex gap-2 text-xs">
                     {Object.entries(states).map(([el, st]) => (
                       <span key={el} className="flex flex-col items-center">
                         <span className="text-slate-400">{el}</span>
                         <span className={`font-mono font-bold ${st > 0 ? 'text-rose-500' : st < 0 ? 'text-blue-500' : 'text-slate-500'}`}>
                           {st > 0 ? '+' + st : st}
                         </span>
                       </span>
                     ))}
                   </div>
                 </div>
               ))}
             </div>
             <p className="text-xs text-slate-400 mt-2 italic">Примечание: Степени окисления рассчитаны по базовым правилам и могут не учитывать структурные исключения.</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default EquationBalancer;
