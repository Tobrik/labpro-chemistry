import React, { useState } from 'react';
import { FlaskConical, ArrowRight, RefreshCw } from 'lucide-react';

const SolutionsCalculator: React.FC = () => {
  const [tab, setTab] = useState<'molarity' | 'dilution' | 'percent'>('molarity');

  // Molarity State
  const [molMass, setMolMass] = useState('');
  const [molVol, setMolVol] = useState('');
  const [molSubstanceMass, setMolSubstanceMass] = useState('');
  const [molarityResult, setMolarityResult] = useState<number | null>(null);

  // Dilution State
  const [dilC1, setDilC1] = useState('');
  const [dilV1, setDilV1] = useState('');
  const [dilC2, setDilC2] = useState('');
  const [dilResult, setDilResult] = useState<number | null>(null);

  // Percentage State
  const [pctSolute, setPctSolute] = useState('');
  const [pctSolution, setPctSolution] = useState('');
  const [pctResult, setPctResult] = useState<number | null>(null);

  const calculateMolarity = () => {
    const m = parseFloat(molSubstanceMass);
    const M = parseFloat(molMass);
    const V = parseFloat(molVol); // Liters
    if (m && M && V) {
      setMolarityResult(m / (M * V));
    }
  };

  const calculateDilution = () => {
    const c1 = parseFloat(dilC1);
    const v1 = parseFloat(dilV1);
    const c2 = parseFloat(dilC2);
    if (c1 && v1 && c2) {
      // C1V1 = C2V2 => V2 = (C1V1)/C2
      setDilResult((c1 * v1) / c2);
    }
  };

  const calculatePercent = () => {
    const m_solute = parseFloat(pctSolute);
    const m_solution = parseFloat(pctSolution);
    if (m_solute && m_solution) {
      setPctResult((m_solute / m_solution) * 100);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center text-cyan-600">
          <FlaskConical size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Калькулятор растворов</h2>
          <p className="text-slate-500">Приготовление и разбавление</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-slate-100 rounded-xl mb-6">
         <button onClick={() => setTab('molarity')} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${tab === 'molarity' ? 'bg-white shadow text-cyan-600' : 'text-slate-500'}`}>Молярность</button>
         <button onClick={() => setTab('dilution')} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${tab === 'dilution' ? 'bg-white shadow text-cyan-600' : 'text-slate-500'}`}>Разбавление</button>
         <button onClick={() => setTab('percent')} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${tab === 'percent' ? 'bg-white shadow text-cyan-600' : 'text-slate-500'}`}>Массовая доля</button>
      </div>

      {/* Molarity Content */}
      {tab === 'molarity' && (
        <div className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-500">Масса вещества (г)</label>
              <input type="number" value={molSubstanceMass} onChange={e => setMolSubstanceMass(e.target.value)} className="w-full h-12 px-4 bg-white text-slate-900 border border-slate-200 rounded-xl mt-1 focus:ring-2 focus:ring-cyan-500 outline-none" placeholder="10" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-500">Молярная масса (г/моль)</label>
              <input type="number" value={molMass} onChange={e => setMolMass(e.target.value)} className="w-full h-12 px-4 bg-white text-slate-900 border border-slate-200 rounded-xl mt-1 focus:ring-2 focus:ring-cyan-500 outline-none" placeholder="58.44" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-500">Объем раствора (л)</label>
            <input type="number" value={molVol} onChange={e => setMolVol(e.target.value)} className="w-full h-12 px-4 bg-white text-slate-900 border border-slate-200 rounded-xl mt-1 focus:ring-2 focus:ring-cyan-500 outline-none" placeholder="1" />
          </div>
          <button onClick={calculateMolarity} className="w-full h-12 bg-cyan-600 text-white rounded-xl font-medium mt-2 hover:bg-cyan-700 transition-colors">Рассчитать</button>
          
          {molarityResult !== null && (
             <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-4 text-center">
               <span className="text-sm text-slate-500 uppercase font-bold">Молярность (C)</span>
               <div className="text-3xl font-bold text-slate-800 mt-1">{molarityResult.toFixed(4)} <span className="text-lg font-normal text-slate-500">моль/л</span></div>
             </div>
          )}
        </div>
      )}

      {/* Dilution Content */}
      {tab === 'dilution' && (
        <div className="space-y-4 animate-fade-in">
          <p className="text-sm text-slate-400 italic">Формула: C1 × V1 = C2 × V2</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-500">C1 (Исходная)</label>
              <input type="number" value={dilC1} onChange={e => setDilC1(e.target.value)} className="w-full h-12 px-4 bg-white text-slate-900 border border-slate-200 rounded-xl mt-1 focus:ring-2 focus:ring-cyan-500 outline-none" placeholder="Молярность" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-500">V1 (Объем)</label>
              <input type="number" value={dilV1} onChange={e => setDilV1(e.target.value)} className="w-full h-12 px-4 bg-white text-slate-900 border border-slate-200 rounded-xl mt-1 focus:ring-2 focus:ring-cyan-500 outline-none" placeholder="Литры" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-500">C2 (Целевая)</label>
              <input type="number" value={dilC2} onChange={e => setDilC2(e.target.value)} className="w-full h-12 px-4 bg-white text-slate-900 border border-slate-200 rounded-xl mt-1 focus:ring-2 focus:ring-cyan-500 outline-none" placeholder="Молярность" />
            </div>
          </div>
          <button onClick={calculateDilution} className="w-full h-12 bg-cyan-600 text-white rounded-xl font-medium mt-2 hover:bg-cyan-700 transition-colors">Рассчитать V2</button>
          
          {dilResult !== null && (
             <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-4 text-center">
               <span className="text-sm text-slate-500 uppercase font-bold">Необходимый объем (V2)</span>
               <div className="text-3xl font-bold text-slate-800 mt-1">{dilResult.toFixed(4)} <span className="text-lg font-normal text-slate-500">л</span></div>
               <p className="text-xs text-slate-400 mt-2">Нужно добавить {(dilResult - parseFloat(dilV1)).toFixed(4)} л растворителя к исходному объему.</p>
             </div>
          )}
        </div>
      )}

      {/* Percent Content */}
      {tab === 'percent' && (
        <div className="space-y-4 animate-fade-in">
          <div>
            <label className="text-sm font-medium text-slate-500">Масса растворенного вещества (г)</label>
            <input type="number" value={pctSolute} onChange={e => setPctSolute(e.target.value)} className="w-full h-12 px-4 bg-white text-slate-900 border border-slate-200 rounded-xl mt-1 focus:ring-2 focus:ring-cyan-500 outline-none" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-500">Общая масса раствора (г)</label>
            <input type="number" value={pctSolution} onChange={e => setPctSolution(e.target.value)} className="w-full h-12 px-4 bg-white text-slate-900 border border-slate-200 rounded-xl mt-1 focus:ring-2 focus:ring-cyan-500 outline-none" />
          </div>
          <button onClick={calculatePercent} className="w-full h-12 bg-cyan-600 text-white rounded-xl font-medium mt-2 hover:bg-cyan-700 transition-colors">Рассчитать %</button>
          
          {pctResult !== null && (
             <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-4 text-center">
               <span className="text-sm text-slate-500 uppercase font-bold">Массовая доля</span>
               <div className="text-3xl font-bold text-slate-800 mt-1">{pctResult.toFixed(2)}%</div>
             </div>
          )}
        </div>
      )}

    </div>
  );
};

export default SolutionsCalculator;
