import React, { useState } from 'react';
import { FlaskConical, ArrowRight, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const SolutionsCalculator: React.FC = () => {
  const { t } = useTranslation();
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
        <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 rounded-xl flex items-center justify-center text-cyan-600 dark:text-cyan-400 transition-colors">
          <FlaskConical size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-zinc-100">{t('solutions.calculator')}</h2>
          <p className="text-slate-500 dark:text-zinc-400">{t('solutions.preparation')}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-slate-100 dark:bg-zinc-800 rounded-xl mb-6 transition-colors">
         <button onClick={() => setTab('molarity')} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${tab === 'molarity' ? 'bg-white dark:bg-zinc-700 shadow text-cyan-600 dark:text-cyan-400' : 'text-slate-500 dark:text-zinc-400'}`}>{t('solutions.molarity')}</button>
         <button onClick={() => setTab('dilution')} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${tab === 'dilution' ? 'bg-white dark:bg-zinc-700 shadow text-cyan-600 dark:text-cyan-400' : 'text-slate-500 dark:text-zinc-400'}`}>{t('solutions.dilution')}</button>
         <button onClick={() => setTab('percent')} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${tab === 'percent' ? 'bg-white dark:bg-zinc-700 shadow text-cyan-600 dark:text-cyan-400' : 'text-slate-500 dark:text-zinc-400'}`}>{t('solutions.massFractionTab')}</button>
      </div>

      {/* Molarity Content */}
      {tab === 'molarity' && (
        <div className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-500 dark:text-zinc-400">{t('solutions.substanceMass')}</label>
              <input type="number" value={molSubstanceMass} onChange={e => setMolSubstanceMass(e.target.value)} className="w-full h-12 px-4 bg-white dark:bg-zinc-700 text-slate-900 dark:text-zinc-100 border border-slate-200 dark:border-zinc-600 rounded-xl mt-1 focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400 outline-none transition-colors" placeholder="10" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-500 dark:text-zinc-400">{t('solutions.molarMassLabel')}</label>
              <input type="number" value={molMass} onChange={e => setMolMass(e.target.value)} className="w-full h-12 px-4 bg-white dark:bg-zinc-700 text-slate-900 dark:text-zinc-100 border border-slate-200 dark:border-zinc-600 rounded-xl mt-1 focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400 outline-none transition-colors" placeholder="58.44" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-500 dark:text-zinc-400">{t('solutions.solutionVolume')}</label>
            <input type="number" value={molVol} onChange={e => setMolVol(e.target.value)} className="w-full h-12 px-4 bg-white dark:bg-zinc-700 text-slate-900 dark:text-zinc-100 border border-slate-200 dark:border-zinc-600 rounded-xl mt-1 focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400 outline-none transition-colors" placeholder="1" />
          </div>
          <button onClick={calculateMolarity} className="w-full h-12 bg-cyan-600 dark:bg-cyan-500 text-white rounded-xl font-medium mt-2 hover:bg-cyan-700 dark:hover:bg-cyan-600 transition-colors">{t('common.calculate')}</button>

          {molarityResult !== null && (
             <div className="bg-slate-50 dark:bg-zinc-900 p-4 rounded-xl border border-slate-200 dark:border-zinc-700 mt-4 text-center transition-colors">
               <span className="text-sm text-slate-500 dark:text-zinc-400 uppercase font-bold">{t('solutions.molarityResult')}</span>
               <div className="text-3xl font-bold text-slate-800 dark:text-zinc-100 mt-1">{molarityResult.toFixed(4)} <span className="text-lg font-normal text-slate-500 dark:text-zinc-400">{t('solutions.molPerLiter')}</span></div>
             </div>
          )}
        </div>
      )}

      {/* Dilution Content */}
      {tab === 'dilution' && (
        <div className="space-y-4 animate-fade-in">
          <p className="text-sm text-slate-400 dark:text-zinc-500 italic">{t('solutions.dilutionFormula')}</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-500 dark:text-zinc-400">{t('solutions.initialConc')}</label>
              <input type="number" value={dilC1} onChange={e => setDilC1(e.target.value)} className="w-full h-12 px-4 bg-white dark:bg-zinc-700 text-slate-900 dark:text-zinc-100 border border-slate-200 dark:border-zinc-600 rounded-xl mt-1 focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400 outline-none transition-colors" placeholder={t('solutions.molarity')} />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-500 dark:text-zinc-400">{t('solutions.initialVol')}</label>
              <input type="number" value={dilV1} onChange={e => setDilV1(e.target.value)} className="w-full h-12 px-4 bg-white dark:bg-zinc-700 text-slate-900 dark:text-zinc-100 border border-slate-200 dark:border-zinc-600 rounded-xl mt-1 focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400 outline-none transition-colors" placeholder={t('solutions.volume')} />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-500 dark:text-zinc-400">{t('solutions.targetConc')}</label>
              <input type="number" value={dilC2} onChange={e => setDilC2(e.target.value)} className="w-full h-12 px-4 bg-white dark:bg-zinc-700 text-slate-900 dark:text-zinc-100 border border-slate-200 dark:border-zinc-600 rounded-xl mt-1 focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400 outline-none transition-colors" placeholder={t('solutions.molarity')} />
            </div>
          </div>
          <button onClick={calculateDilution} className="w-full h-12 bg-cyan-600 dark:bg-cyan-500 text-white rounded-xl font-medium mt-2 hover:bg-cyan-700 dark:hover:bg-cyan-600 transition-colors">{t('solutions.calculateV2')}</button>

          {dilResult !== null && (
             <div className="bg-slate-50 dark:bg-zinc-900 p-4 rounded-xl border border-slate-200 dark:border-zinc-700 mt-4 text-center transition-colors">
               <span className="text-sm text-slate-500 dark:text-zinc-400 uppercase font-bold">{t('solutions.requiredVolume')}</span>
               <div className="text-3xl font-bold text-slate-800 dark:text-zinc-100 mt-1">{dilResult.toFixed(4)} <span className="text-lg font-normal text-slate-500 dark:text-zinc-400">л</span></div>
               <p className="text-xs text-slate-400 dark:text-zinc-500 mt-2">{t('solutions.addSolvent').replace('{volume}', (dilResult - parseFloat(dilV1)).toFixed(4))}</p>
             </div>
          )}
        </div>
      )}

      {/* Percent Content */}
      {tab === 'percent' && (
        <div className="space-y-4 animate-fade-in">
          <div>
            <label className="text-sm font-medium text-slate-500 dark:text-zinc-400">{t('solutions.soluteMass')}</label>
            <input type="number" value={pctSolute} onChange={e => setPctSolute(e.target.value)} className="w-full h-12 px-4 bg-white dark:bg-zinc-700 text-slate-900 dark:text-zinc-100 border border-slate-200 dark:border-zinc-600 rounded-xl mt-1 focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400 outline-none transition-colors" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-500 dark:text-zinc-400">{t('solutions.totalMass')}</label>
            <input type="number" value={pctSolution} onChange={e => setPctSolution(e.target.value)} className="w-full h-12 px-4 bg-white dark:bg-zinc-700 text-slate-900 dark:text-zinc-100 border border-slate-200 dark:border-zinc-600 rounded-xl mt-1 focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400 outline-none transition-colors" />
          </div>
          <button onClick={calculatePercent} className="w-full h-12 bg-cyan-600 dark:bg-cyan-500 text-white rounded-xl font-medium mt-2 hover:bg-cyan-700 dark:hover:bg-cyan-600 transition-colors">{t('solutions.calculatePercent')}</button>

          {pctResult !== null && (
             <div className="bg-slate-50 dark:bg-zinc-900 p-4 rounded-xl border border-slate-200 dark:border-zinc-700 mt-4 text-center transition-colors">
               <span className="text-sm text-slate-500 dark:text-zinc-400 uppercase font-bold">{t('solutions.massFractionResult')}</span>
               <div className="text-3xl font-bold text-slate-800 dark:text-zinc-100 mt-1">{pctResult.toFixed(2)}%</div>
             </div>
          )}
        </div>
      )}

    </div>
  );
};

export default SolutionsCalculator;
