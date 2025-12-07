import React, { useState } from 'react';
import { Calculator, ArrowRight, Settings2, FlaskConical } from 'lucide-react';
import { balanceReaction, getMolarMass, parseFormula } from '../chemistryUtils';

type TaskType = 'mass-mass' | 'mass-volume' | 'moles-mass';

const ProblemSolver: React.FC = () => {
  const [taskType, setTaskType] = useState<TaskType>('mass-mass');
  const [equation, setEquation] = useState('');
  const [knownSubstance, setKnownSubstance] = useState('');
  const [knownValue, setKnownValue] = useState('');
  const [targetSubstance, setTargetSubstance] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [steps, setSteps] = useState<string[]>([]);

  const handleCalculate = () => {
    setResult(null);
    setSteps([]);
    
    if (!equation || !knownSubstance || !targetSubstance || !knownValue) return;

    // 1. Balance Equation
    const balancedRes = balanceReaction(equation);
    if (!balancedRes.reaction) {
      setResult("Ошибка: Не удалось уравнять реакцию.");
      return;
    }

    const { reactants, products } = balancedRes.reaction;
    const allComps = [...reactants, ...products];

    const knownComp = allComps.find(c => c.formula === knownSubstance);
    const targetComp = allComps.find(c => c.formula === targetSubstance);

    if (!knownComp || !targetComp) {
      setResult("Ошибка: Вещества не найдены в уравнении.");
      return;
    }

    const log: string[] = [];
    log.push(`1. Уравнение реакции: ${balancedRes.balanced}`);

    // 2. Calculate Moles of Known
    const knownMolarMass = getMolarMass(knownComp.elements);
    let knownMoles = 0;
    const val = parseFloat(knownValue);

    if (taskType === 'mass-mass' || taskType === 'mass-volume') {
      knownMoles = val / knownMolarMass;
      log.push(`2. Количество вещества (n) для ${knownSubstance}: ${val} г / ${knownMolarMass.toFixed(2)} г/моль = ${knownMoles.toFixed(4)} моль`);
    } else {
      // moles-mass implies input is moles
      knownMoles = val;
      log.push(`2. Дано количество вещества ${knownSubstance}: ${val} моль`);
    }

    // 3. Stoichiometric Ratio
    const ratio = targetComp.coefficient / knownComp.coefficient;
    const targetMoles = knownMoles * ratio;
    log.push(`3. По уравнению реакции соотношение коэф. ${targetComp.coefficient}/${knownComp.coefficient}.`);
    log.push(`   n(${targetSubstance}) = ${knownMoles.toFixed(4)} × ${ratio.toFixed(2)} = ${targetMoles.toFixed(4)} моль`);

    // 4. Calculate Result
    let finalRes = 0;
    let unit = '';
    const targetMolarMass = getMolarMass(targetComp.elements);

    if (taskType === 'mass-volume' && Object.keys(targetComp.elements).some(el => ['H','N','O','F','Cl','He','Ne','Ar','Kr','Xe','Rn'].includes(el))) {
       // Assume gas at STP if asking for volume of likely gas
       finalRes = targetMoles * 22.4;
       unit = 'л';
       log.push(`4. Объем газа (н.у.): ${targetMoles.toFixed(4)} моль × 22.4 л/моль = ${finalRes.toFixed(4)} л`);
    } else {
       finalRes = targetMoles * targetMolarMass;
       unit = 'г';
       log.push(`4. Масса ${targetSubstance}: ${targetMoles.toFixed(4)} моль × ${targetMolarMass.toFixed(2)} г/моль = ${finalRes.toFixed(4)} г`);
    }

    setResult(`${finalRes.toFixed(2)} ${unit}`);
    setSteps(log);
  };

  return (
    <div className="space-y-6">
       <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center text-rose-600">
          <Calculator size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Решатель задач</h2>
          <p className="text-slate-500">Стехиометрические расчеты по уравнению</p>
        </div>
      </div>

      {/* Configuration Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4 text-slate-600 font-medium">
          <Settings2 size={18} />
          <span>Тип задачи</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          <button onClick={() => setTaskType('mass-mass')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${taskType === 'mass-mass' ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-600'}`}>Масса → Масса</button>
          <button onClick={() => setTaskType('mass-volume')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${taskType === 'mass-volume' ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-600'}`}>Масса → Объем (Газ)</button>
          <button onClick={() => setTaskType('moles-mass')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${taskType === 'moles-mass' ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-600'}`}>Моль → Масса</button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-500 mb-1">Уравнение реакции</label>
            <input 
              type="text" 
              value={equation} 
              onChange={e => setEquation(e.target.value)} 
              placeholder="Например: 2H2 + O2 -> 2H2O"
              className="w-full h-12 px-4 bg-white text-slate-900 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
               <h4 className="font-medium text-slate-700 mb-3 flex items-center gap-2"><FlaskConical size={16}/> Известное вещество</h4>
               <div className="space-y-3">
                 <input 
                   type="text" 
                   value={knownSubstance} 
                   onChange={e => setKnownSubstance(e.target.value)} 
                   placeholder="Формула (H2)"
                   className="w-full h-10 px-3 bg-white text-slate-900 border border-slate-200 rounded-lg text-sm"
                 />
                 <input 
                   type="number" 
                   value={knownValue} 
                   onChange={e => setKnownValue(e.target.value)} 
                   placeholder={taskType === 'moles-mass' ? "Моль" : "Масса (г)"}
                   className="w-full h-10 px-3 bg-white text-slate-900 border border-slate-200 rounded-lg text-sm"
                 />
               </div>
            </div>
            
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
               <h4 className="font-medium text-slate-700 mb-3 flex items-center gap-2"><ArrowRight size={16}/> Найти вещество</h4>
               <div className="space-y-3">
                 <input 
                   type="text" 
                   value={targetSubstance} 
                   onChange={e => setTargetSubstance(e.target.value)} 
                   placeholder="Формула (H2O)"
                   className="w-full h-10 px-3 bg-white text-slate-900 border border-slate-200 rounded-lg text-sm"
                 />
                 <div className="h-10 flex items-center text-sm text-slate-400 italic">
                   Результат будет рассчитан...
                 </div>
               </div>
            </div>
          </div>

          <button
            onClick={handleCalculate}
            className="w-full h-12 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl shadow-lg shadow-rose-500/30 transition-all flex items-center justify-center space-x-2 mt-2"
          >
            <span>Решить</span>
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 animate-fade-in shadow-sm">
           <div className="text-center mb-6">
             <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Ответ</span>
             <div className="text-4xl font-bold text-slate-800 mt-2">{result}</div>
           </div>
           
           <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-700 font-mono space-y-2 border border-slate-100">
             {steps.map((step, i) => (
               <div key={i}>{step}</div>
             ))}
           </div>
        </div>
      )}
    </div>
  );
};

export default ProblemSolver;
