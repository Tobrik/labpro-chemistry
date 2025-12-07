import React, { useState, useEffect } from 'react';
import { Timer, Activity } from 'lucide-react';
import { calculateConcentration } from '../chemistryUtils';

const Kinetics: React.FC = () => {
  const [order, setOrder] = useState(1);
  const [c0, setC0] = useState(1.0);
  const [k, setK] = useState(0.1);
  const [dataPoints, setDataPoints] = useState<{x:number, y:number}[]>([]);

  useEffect(() => {
    const points = [];
    // Generate 20 points over time
    const maxTime = k > 0 ? 5 / k : 10; 
    for(let i=0; i<=20; i++) {
        const t = (maxTime / 20) * i;
        const c = calculateConcentration(order, c0, k, t);
        points.push({x: t, y: c});
    }
    setDataPoints(points);
  }, [order, c0, k]);

  // SVG Graph helpers
  const width = 300;
  const height = 150;
  const padding = 20;
  
  const maxY = Math.max(...dataPoints.map(p => p.y), 0.001);
  const maxX = Math.max(...dataPoints.map(p => p.x), 0.001);
  
  const getX = (val: number) => padding + (val / maxX) * (width - 2 * padding);
  const getY = (val: number) => height - padding - (val / maxY) * (height - 2 * padding);

  const pathD = dataPoints.length > 0 
    ? `M ${getX(dataPoints[0].x)} ${getY(dataPoints[0].y)} ` + dataPoints.map(p => `L ${getX(p.x)} ${getY(p.y)}`).join(' ')
    : '';

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center text-teal-600">
          <Timer size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Химическая кинетика</h2>
          <p className="text-slate-500">Скорость реакции и порядки</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {/* Controls */}
         <div className="space-y-4">
            <div>
               <label className="text-sm font-medium text-slate-500">Порядок реакции</label>
               <div className="flex gap-2 mt-1">
                  {[0, 1, 2].map(o => (
                      <button key={o} onClick={() => setOrder(o)} className={`flex-1 py-2 border rounded-lg ${order === o ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-slate-600 border-slate-200'}`}>
                          {o}
                      </button>
                  ))}
               </div>
            </div>
            <div>
                <label className="text-sm font-medium text-slate-500">Начальная концентрация [A]₀ (моль/л)</label>
                <input type="number" step="0.1" value={c0} onChange={e => setC0(parseFloat(e.target.value) || 0)} className="w-full h-10 px-3 bg-white text-slate-900 border border-slate-200 rounded-lg mt-1" />
            </div>
            <div>
                <label className="text-sm font-medium text-slate-500">Константа скорости k</label>
                <input type="number" step="0.01" value={k} onChange={e => setK(parseFloat(e.target.value) || 0)} className="w-full h-10 px-3 bg-white text-slate-900 border border-slate-200 rounded-lg mt-1" />
            </div>
         </div>

         {/* Graph */}
         <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Activity size={16}/> График [A] от времени
            </h4>
            <div className="relative w-full aspect-[2/1]">
                 <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                     {/* Axes */}
                     <line x1={padding} y1={height-padding} x2={width-padding} y2={height-padding} stroke="#cbd5e1" strokeWidth="1" />
                     <line x1={padding} y1={padding} x2={padding} y2={height-padding} stroke="#cbd5e1" strokeWidth="1" />
                     
                     {/* Line */}
                     <path d={pathD} fill="none" stroke="#0d9488" strokeWidth="3" strokeLinecap="round" />
                 </svg>
                 <div className="absolute bottom-0 right-0 text-xs text-slate-400">Time (s)</div>
                 <div className="absolute top-0 left-0 text-xs text-slate-400">[A]</div>
            </div>
         </div>
      </div>
      
      <div className="bg-slate-50 p-4 rounded-xl text-sm text-slate-600">
         <h4 className="font-bold mb-2">Уравнение скорости:</h4>
         {order === 0 && <p className="font-mono">[A] = [A]₀ - kt</p>}
         {order === 1 && <p className="font-mono">[A] = [A]₀ · e^(-kt)</p>}
         {order === 2 && <p className="font-mono">1/[A] = 1/[A]₀ + kt</p>}
      </div>
    </div>
  );
};

export default Kinetics;
