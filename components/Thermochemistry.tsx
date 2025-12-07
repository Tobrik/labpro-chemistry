import React, { useState } from 'react';
import { Flame, Calculator, ArrowRight } from 'lucide-react';

const Thermochemistry: React.FC = () => {
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
        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
          <Flame size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Термохимия</h2>
          <p className="text-slate-500">Расчет тепловых эффектов и теплоемкости</p>
        </div>
      </div>

      <div className="flex gap-2 bg-slate-100 p-1 rounded-xl mb-4">
          <button onClick={() => setMode('heat')} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'heat' ? 'bg-white shadow text-orange-600' : 'text-slate-500'}`}>Теплота (Q=cmΔT)</button>
          <button onClick={() => setMode('enthalpy')} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'enthalpy' ? 'bg-white shadow text-orange-600' : 'text-slate-500'}`}>Энтальпия (ΔH)</button>
      </div>

      {mode === 'heat' && (
        <div className="space-y-4 animate-fade-in">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                  <label className="text-sm font-medium text-slate-500">Масса (г)</label>
                  <input type="number" value={mass} onChange={e => setMass(e.target.value)} className="w-full h-12 px-4 bg-white text-slate-900 border border-slate-200 rounded-xl mt-1 outline-none focus:ring-2 focus:ring-orange-500" placeholder="100" />
              </div>
              <div>
                  <label className="text-sm font-medium text-slate-500">ΔT (°C)</label>
                  <input type="number" value={tempChange} onChange={e => setTempChange(e.target.value)} className="w-full h-12 px-4 bg-white text-slate-900 border border-slate-200 rounded-xl mt-1 outline-none focus:ring-2 focus:ring-orange-500" placeholder="25" />
              </div>
              <div>
                  <label className="text-sm font-medium text-slate-500">c (Дж/г·°C)</label>
                  <input type="number" value={specificHeat} onChange={e => setSpecificHeat(e.target.value)} className="w-full h-12 px-4 bg-white text-slate-900 border border-slate-200 rounded-xl mt-1 outline-none focus:ring-2 focus:ring-orange-500" placeholder="4.18" />
              </div>
           </div>
           
           <button onClick={calculateHeat} className="w-full h-12 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors">Рассчитать Q</button>

           {resultQ !== null && (
               <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center">
                   <div className="text-sm text-slate-500 uppercase font-bold tracking-wider mb-2">Количество теплоты</div>
                   <div className="text-4xl font-bold text-slate-800">{resultQ.toFixed(2)} <span className="text-lg text-slate-500 font-normal">Дж</span></div>
                   <div className="text-sm text-slate-400 mt-2">{(resultQ/1000).toFixed(3)} кДж</div>
               </div>
           )}
        </div>
      )}

      {mode === 'enthalpy' && (
          <div className="p-8 text-center text-slate-400 border border-dashed border-slate-200 rounded-2xl">
              <Calculator size={48} className="mx-auto mb-4 opacity-20" />
              <p>Модуль расчета энтальпии реакции находится в разработке.</p>
          </div>
      )}
    </div>
  );
};

export default Thermochemistry;
