import React, { useState } from 'react';
import { Flame, Calculator, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Thermochemistry: React.FC = () => {
  const { t } = useTranslation();
  const [mode, setMode] = useState<'heat' | 'enthalpy'>('heat');
  
  // Q = cmT
  const [mass, setMass] = useState('');
  const [tempChange, setTempChange] = useState('');
  const [specificHeat, setSpecificHeat] = useState('4.18'); // Water default
  const [resultQ, setResultQ] = useState<number | null>(null);

  const calculateHeat = () => {
    const m = parseFloat(mass);
    const c = parseFloat(specificHeat);
    const dt = parseFloat(tempChange);
    if (!isNaN(m) && !isNaN(c) && !isNaN(dt)) {
        setResultQ(m * c * dt);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center text-orange-600 dark:text-orange-400 transition-colors">
          <Flame size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-zinc-100">{t('thermochemistry.title')}</h2>
          <p className="text-slate-500 dark:text-zinc-400">{t('thermochemistry.subtitle')}</p>
        </div>
      </div>

      <div className="flex gap-2 bg-slate-100 dark:bg-zinc-800 p-1 rounded-xl mb-4 transition-colors">
          <button onClick={() => setMode('heat')} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'heat' ? 'bg-white dark:bg-zinc-700 shadow text-orange-600 dark:text-orange-400' : 'text-slate-500 dark:text-zinc-400'}`}>{t('thermochemistry.heat')}</button>
          <button onClick={() => setMode('enthalpy')} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'enthalpy' ? 'bg-white dark:bg-zinc-700 shadow text-orange-600 dark:text-orange-400' : 'text-slate-500 dark:text-zinc-400'}`}>{t('thermochemistry.enthalpyCalc')}</button>
      </div>

      {mode === 'heat' && (
        <div className="space-y-4 animate-fade-in">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                  <label className="text-sm font-medium text-slate-500 dark:text-zinc-400">{t('thermochemistry.mass')}</label>
                  <input type="number" value={mass} onChange={e => setMass(e.target.value)} className="w-full h-12 px-4 bg-white dark:bg-zinc-700 text-slate-900 dark:text-zinc-100 border border-slate-200 dark:border-zinc-600 rounded-xl mt-1 outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 transition-colors" placeholder="100" />
              </div>
              <div>
                  <label className="text-sm font-medium text-slate-500 dark:text-zinc-400">{t('thermochemistry.tempChange')}</label>
                  <input type="number" value={tempChange} onChange={e => setTempChange(e.target.value)} className="w-full h-12 px-4 bg-white dark:bg-zinc-700 text-slate-900 dark:text-zinc-100 border border-slate-200 dark:border-zinc-600 rounded-xl mt-1 outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 transition-colors" placeholder="25" />
              </div>
              <div>
                  <label className="text-sm font-medium text-slate-500 dark:text-zinc-400">{t('thermochemistry.specificHeat')}</label>
                  <input type="number" value={specificHeat} onChange={e => setSpecificHeat(e.target.value)} className="w-full h-12 px-4 bg-white dark:bg-zinc-700 text-slate-900 dark:text-zinc-100 border border-slate-200 dark:border-zinc-600 rounded-xl mt-1 outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 transition-colors" placeholder="4.18" />
              </div>
           </div>

           <button onClick={calculateHeat} className="w-full h-12 bg-orange-500 dark:bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-600 dark:hover:bg-orange-700 transition-colors">{t('thermochemistry.calculateHeat')}</button>

           {resultQ !== null && (
               <div className="bg-slate-50 dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-700 text-center transition-colors">
                   <div className="text-sm text-slate-500 dark:text-zinc-400 uppercase font-bold tracking-wider mb-2">{t('thermochemistry.heatAmount')}</div>
                   <div className="text-4xl font-bold text-slate-800 dark:text-zinc-100">{resultQ.toFixed(2)} <span className="text-lg text-slate-500 dark:text-zinc-400 font-normal">Дж</span></div>
                   <div className="text-sm text-slate-400 dark:text-zinc-500 mt-2">{(resultQ/1000).toFixed(3)} кДж</div>
               </div>
           )}
        </div>
      )}

      {mode === 'enthalpy' && (
          <div className="p-8 text-center text-slate-400 dark:text-zinc-500 border border-dashed border-slate-200 dark:border-zinc-700 rounded-2xl transition-colors">
              <Calculator size={48} className="mx-auto mb-4 opacity-20" />
              <p>{t('thermochemistry.enthalpyInDevelopment')}</p>
          </div>
      )}
    </div>
  );
};

export default Thermochemistry;
