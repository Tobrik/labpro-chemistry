import React, { useState } from 'react';
import { Flame, Plus, Minus, ArrowRight, Trash2, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Standard enthalpies of formation (ΔH°f, kJ/mol)
const ENTHALPY_DATA: Record<string, { value: number; name: string }> = {
  'H2O(l)':    { value: -285.8, name: 'Вода (ж)' },
  'H2O(g)':    { value: -241.8, name: 'Вода (г)' },
  'CO2(g)':    { value: -393.5, name: 'CO₂' },
  'CO(g)':     { value: -110.5, name: 'CO' },
  'NH3(g)':    { value: -45.9, name: 'NH₃' },
  'NO(g)':     { value: +90.3, name: 'NO' },
  'NO2(g)':    { value: +33.2, name: 'NO₂' },
  'N2O(g)':    { value: +82.1, name: 'N₂O' },
  'SO2(g)':    { value: -296.8, name: 'SO₂' },
  'SO3(g)':    { value: -395.7, name: 'SO₃' },
  'HCl(g)':    { value: -92.3, name: 'HCl' },
  'HBr(g)':    { value: -36.4, name: 'HBr' },
  'HF(g)':     { value: -271.1, name: 'HF' },
  'HI(g)':     { value: +26.5, name: 'HI' },
  'H2S(g)':    { value: -20.6, name: 'H₂S' },
  'NaCl(s)':   { value: -411.2, name: 'NaCl' },
  'NaOH(s)':   { value: -425.6, name: 'NaOH' },
  'KOH(s)':    { value: -424.8, name: 'KOH' },
  'CaO(s)':    { value: -635.1, name: 'CaO' },
  'CaCO3(s)':  { value: -1206.9, name: 'CaCO₃' },
  'MgO(s)':    { value: -601.7, name: 'MgO' },
  'Fe2O3(s)':  { value: -824.2, name: 'Fe₂O₃' },
  'Fe3O4(s)':  { value: -1118.4, name: 'Fe₃O₄' },
  'FeO(s)':    { value: -272.0, name: 'FeO' },
  'Al2O3(s)':  { value: -1675.7, name: 'Al₂O₃' },
  'CuO(s)':    { value: -157.3, name: 'CuO' },
  'Cu2O(s)':   { value: -168.6, name: 'Cu₂O' },
  'ZnO(s)':    { value: -350.5, name: 'ZnO' },
  'SiO2(s)':   { value: -910.7, name: 'SiO₂' },
  'CH4(g)':    { value: -74.8, name: 'CH₄ (метан)' },
  'C2H6(g)':   { value: -84.7, name: 'C₂H₆ (этан)' },
  'C2H4(g)':   { value: +52.3, name: 'C₂H₄ (этилен)' },
  'C2H2(g)':   { value: +226.7, name: 'C₂H₂ (ацетилен)' },
  'C6H6(l)':   { value: +49.0, name: 'C₆H₆ (бензол)' },
  'C2H5OH(l)': { value: -277.7, name: 'C₂H₅OH (этанол)' },
  'CH3OH(l)':  { value: -238.7, name: 'CH₃OH (метанол)' },
  'HCOOH(l)':  { value: -424.7, name: 'HCOOH (муравьиная к.)' },
  'CH3COOH(l)':{ value: -484.5, name: 'CH₃COOH (уксусная к.)' },
  'C6H12O6(s)':{ value: -1273.3, name: 'C₆H₁₂O₆ (глюкоза)' },
  // Simple substances (ΔH°f = 0 by definition)
  'H2(g)':     { value: 0, name: 'H₂' },
  'O2(g)':     { value: 0, name: 'O₂' },
  'N2(g)':     { value: 0, name: 'N₂' },
  'C(s)':      { value: 0, name: 'C (графит)' },
  'S(s)':      { value: 0, name: 'S (ромб.)' },
  'Fe(s)':     { value: 0, name: 'Fe' },
  'Al(s)':     { value: 0, name: 'Al' },
  'Cu(s)':     { value: 0, name: 'Cu' },
  'Zn(s)':     { value: 0, name: 'Zn' },
  'Na(s)':     { value: 0, name: 'Na' },
  'Ca(s)':     { value: 0, name: 'Ca' },
  'Cl2(g)':    { value: 0, name: 'Cl₂' },
  'Br2(l)':    { value: 0, name: 'Br₂' },
  'I2(s)':     { value: 0, name: 'I₂' },
};

interface SubstanceEntry {
  formula: string;
  coeff: number;
}

const Thermochemistry: React.FC = () => {
  const { t } = useTranslation();
  const [mode, setMode] = useState<'heat' | 'enthalpy'>('heat');

  // Q = cmΔT
  const [mass, setMass] = useState('');
  const [tempChange, setTempChange] = useState('');
  const [specificHeat, setSpecificHeat] = useState('4.18');
  const [resultQ, setResultQ] = useState<number | null>(null);

  // Enthalpy calculator
  const [reactants, setReactants] = useState<SubstanceEntry[]>([{ formula: '', coeff: 1 }]);
  const [products, setProducts] = useState<SubstanceEntry[]>([{ formula: '', coeff: 1 }]);
  const [enthalpyResult, setEnthalpyResult] = useState<number | null>(null);
  const [enthalpyError, setEnthalpyError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const calculateHeat = () => {
    const m = parseFloat(mass);
    const c = parseFloat(specificHeat);
    const dt = parseFloat(tempChange);
    if (!isNaN(m) && !isNaN(c) && !isNaN(dt)) {
      setResultQ(m * c * dt);
    }
  };

  const calculateEnthalpy = () => {
    setEnthalpyError(null);
    setEnthalpyResult(null);

    let sumProducts = 0;
    let sumReactants = 0;

    for (const p of products) {
      if (!p.formula) continue;
      const data = ENTHALPY_DATA[p.formula];
      if (!data) {
        setEnthalpyError(`Вещество "${p.formula}" не найдено в базе`);
        return;
      }
      sumProducts += p.coeff * data.value;
    }

    for (const r of reactants) {
      if (!r.formula) continue;
      const data = ENTHALPY_DATA[r.formula];
      if (!data) {
        setEnthalpyError(`Вещество "${r.formula}" не найдено в базе`);
        return;
      }
      sumReactants += r.coeff * data.value;
    }

    setEnthalpyResult(sumProducts - sumReactants);
  };

  const addEntry = (side: 'reactants' | 'products') => {
    const setter = side === 'reactants' ? setReactants : setProducts;
    setter(prev => [...prev, { formula: '', coeff: 1 }]);
  };

  const removeEntry = (side: 'reactants' | 'products', index: number) => {
    const setter = side === 'reactants' ? setReactants : setProducts;
    setter(prev => prev.filter((_, i) => i !== index));
  };

  const updateEntry = (side: 'reactants' | 'products', index: number, field: 'formula' | 'coeff', value: string | number) => {
    const setter = side === 'reactants' ? setReactants : setProducts;
    setter(prev => prev.map((entry, i) => i === index ? { ...entry, [field]: value } : entry));
  };

  const filteredSubstances = Object.entries(ENTHALPY_DATA)
    .filter(([key, data]) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return key.toLowerCase().includes(q) || data.name.toLowerCase().includes(q);
    })
    .slice(0, 20);

  const inputClass = "w-full h-12 px-4 bg-white dark:bg-zinc-700 text-slate-900 dark:text-zinc-100 border border-slate-200 dark:border-zinc-600 rounded-xl mt-1 outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 transition-colors";

  const renderSubstanceRow = (entry: SubstanceEntry, index: number, side: 'reactants' | 'products') => (
    <div key={index} className="flex gap-2 items-end">
      <div className="w-20">
        <label className="text-xs text-slate-400 dark:text-zinc-500">Коэфф.</label>
        <input
          type="number"
          min="1"
          value={entry.coeff}
          onChange={e => updateEntry(side, index, 'coeff', parseInt(e.target.value) || 1)}
          className="w-full h-10 px-2 text-center bg-white dark:bg-zinc-700 text-slate-900 dark:text-zinc-100 border border-slate-200 dark:border-zinc-600 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
        />
      </div>
      <div className="flex-1">
        <label className="text-xs text-slate-400 dark:text-zinc-500">Вещество</label>
        <select
          value={entry.formula}
          onChange={e => updateEntry(side, index, 'formula', e.target.value)}
          className="w-full h-10 px-2 bg-white dark:bg-zinc-700 text-slate-900 dark:text-zinc-100 border border-slate-200 dark:border-zinc-600 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
        >
          <option value="">-- выбрать --</option>
          {Object.entries(ENTHALPY_DATA).map(([key, data]) => (
            <option key={key} value={key}>{data.name} ({key}) = {data.value} кДж/моль</option>
          ))}
        </select>
      </div>
      {((side === 'reactants' ? reactants : products).length > 1) && (
        <button
          onClick={() => removeEntry(side, index)}
          className="h-10 w-10 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
  );

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
              <input type="number" value={mass} onChange={e => setMass(e.target.value)} className={inputClass} placeholder="100" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-500 dark:text-zinc-400">{t('thermochemistry.tempChange')}</label>
              <input type="number" value={tempChange} onChange={e => setTempChange(e.target.value)} className={inputClass} placeholder="25" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-500 dark:text-zinc-400">{t('thermochemistry.specificHeat')}</label>
              <input type="number" value={specificHeat} onChange={e => setSpecificHeat(e.target.value)} className={inputClass} placeholder="4.18" />
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
        <div className="space-y-6 animate-fade-in">
          {/* Info */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800 text-sm text-blue-700 dark:text-blue-300">
            <p className="font-medium mb-1">Закон Гесса: ΔH°реакции = ΣΔH°f(продукты) - ΣΔH°f(реагенты)</p>
            <p className="text-blue-500 dark:text-blue-400">Выберите вещества и коэффициенты для реагентов и продуктов</p>
          </div>

          {/* Reactants */}
          <div>
            <h3 className="font-bold text-slate-700 dark:text-zinc-200 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-500 text-xs font-bold">R</span>
              Реагенты (исходные вещества)
            </h3>
            <div className="space-y-2">
              {reactants.map((entry, i) => renderSubstanceRow(entry, i, 'reactants'))}
            </div>
            <button
              onClick={() => addEntry('reactants')}
              className="mt-2 flex items-center gap-1 text-sm text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors"
            >
              <Plus size={16} /> Добавить реагент
            </button>
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <ArrowRight size={24} className="text-slate-300 dark:text-zinc-600" />
          </div>

          {/* Products */}
          <div>
            <h3 className="font-bold text-slate-700 dark:text-zinc-200 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-500 text-xs font-bold">P</span>
              Продукты (конечные вещества)
            </h3>
            <div className="space-y-2">
              {products.map((entry, i) => renderSubstanceRow(entry, i, 'products'))}
            </div>
            <button
              onClick={() => addEntry('products')}
              className="mt-2 flex items-center gap-1 text-sm text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors"
            >
              <Plus size={16} /> Добавить продукт
            </button>
          </div>

          {/* Calculate */}
          <button onClick={calculateEnthalpy} className="w-full h-12 bg-orange-500 dark:bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-600 dark:hover:bg-orange-700 transition-colors">
            Рассчитать ΔH° реакции
          </button>

          {enthalpyError && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm border border-red-100 dark:border-red-800">
              {enthalpyError}
            </div>
          )}

          {enthalpyResult !== null && (
            <div className="bg-slate-50 dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-700 text-center transition-colors">
              <div className="text-sm text-slate-500 dark:text-zinc-400 uppercase font-bold tracking-wider mb-2">Энтальпия реакции (ΔH°)</div>
              <div className={`text-4xl font-bold ${enthalpyResult < 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
                {enthalpyResult > 0 ? '+' : ''}{enthalpyResult.toFixed(1)} <span className="text-lg font-normal">кДж/моль</span>
              </div>
              <div className="mt-3 text-sm">
                {enthalpyResult < 0 ? (
                  <span className="text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">Экзотермическая реакция (выделение тепла)</span>
                ) : enthalpyResult > 0 ? (
                  <span className="text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 px-3 py-1 rounded-full">Эндотермическая реакция (поглощение тепла)</span>
                ) : (
                  <span className="text-slate-500">Тепловой эффект равен нулю</span>
                )}
              </div>
            </div>
          )}

          {/* Reference table */}
          <div className="border-t border-slate-200 dark:border-zinc-700 pt-4">
            <h4 className="font-bold text-sm text-slate-600 dark:text-zinc-300 mb-3 flex items-center gap-2">
              <Search size={14} />
              Справочник ΔH°f (стандартные энтальпии образования)
            </h4>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Поиск вещества..."
              className="w-full h-10 px-4 mb-3 bg-white dark:bg-zinc-700 text-slate-900 dark:text-zinc-100 border border-slate-200 dark:border-zinc-600 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 transition-colors text-sm"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-60 overflow-y-auto">
              {filteredSubstances.map(([key, data]) => (
                <div key={key} className="flex justify-between items-center bg-white dark:bg-zinc-800 px-3 py-2 rounded-lg border border-slate-100 dark:border-zinc-700 text-sm">
                  <span className="text-slate-600 dark:text-zinc-300">{data.name}</span>
                  <span className={`font-mono font-bold ${data.value < 0 ? 'text-blue-500' : data.value > 0 ? 'text-red-500' : 'text-slate-400'}`}>
                    {data.value > 0 ? '+' : ''}{data.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Thermochemistry;
