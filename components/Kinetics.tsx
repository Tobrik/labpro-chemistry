import React, { useState, useEffect } from 'react';
import { Timer, Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Kinetics: React.FC = () => {
  const { t } = useTranslation();
  const [order, setOrder] = useState(1);
  const [c0, setC0] = useState(1.0);
  const [v, setV] = useState(0.1); // Скорость реакции как входной параметр
  const [dataPoints, setDataPoints] = useState<{x:number, y:number}[]>([]);

  useEffect(() => {
    const points = [];

    // Рассчитываем концентрацию на основе скорости реакции v
    const maxTime = v > 0 ? 5 / v : 10;

    for(let i=0; i<=20; i++) {
      const t = (maxTime / 20) * i;
      let c;

      // Концентрация зависит от скорости реакции и порядка
      if (order === 0) {
        // Нулевой порядок: [A] = [A]₀ - vt
        c = Math.max(0, c0 - v * t);
      } else if (order === 1) {
        // Первый порядок: [A] = [A]₀ · e^(-vt/[A]₀)
        c = c0 * Math.exp(-v * t / c0);
      } else if (order === 2) {
        // Второй порядок: 1/[A] = 1/[A]₀ + vt/[A]₀²
        c = c0 / (1 + v * t / c0);
      } else {
        c = c0;
      }

      points.push({x: t, y: c});
    }

    setDataPoints(points);
  }, [order, c0, v]);

  // SVG Graph helpers
  const width = 400;
  const height = 200;
  const padding = 30;

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
        <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center text-teal-600 dark:text-teal-400 transition-colors">
          <Timer size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-zinc-100">{t('kinetics.title')}</h2>
          <p className="text-slate-500 dark:text-zinc-400">{t('kinetics.subtitle')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {/* Controls */}
         <div className="space-y-4">
            <div>
               <label className="text-sm font-medium text-slate-500 dark:text-zinc-400">{t('kinetics.order')}</label>
               <div className="flex gap-2 mt-1">
                  {[0, 1, 2].map(o => (
                      <button key={o} onClick={() => setOrder(o)}
                        className={`flex-1 py-2 border rounded-lg transition-colors ${order === o
                          ? 'bg-teal-600 dark:bg-teal-500 text-white border-teal-600 dark:border-teal-500'
                          : 'bg-white dark:bg-zinc-700 text-slate-600 dark:text-zinc-300 border-slate-200 dark:border-zinc-600'}`}>
                          {o}
                      </button>
                  ))}
               </div>
            </div>

            <div>
                <label className="text-sm font-medium text-slate-500 dark:text-zinc-400">{t('kinetics.initialConcentration')}</label>
                <input type="number" step="0.1" value={c0} onChange={e => setC0(parseFloat(e.target.value) || 0)}
                  className="w-full h-10 px-3 bg-white dark:bg-zinc-700 text-slate-900 dark:text-zinc-100 border border-slate-200 dark:border-zinc-600 rounded-lg mt-1 transition-colors" />
            </div>

            <div>
                <label className="text-sm font-medium text-slate-500 dark:text-zinc-400">{t('kinetics.reactionRate')}</label>
                <input type="number" step="0.01" value={v} onChange={e => setV(parseFloat(e.target.value) || 0)}
                  className="w-full h-10 px-3 bg-white dark:bg-zinc-700 text-slate-900 dark:text-zinc-100 border border-slate-200 dark:border-zinc-600 rounded-lg mt-1 transition-colors" />
            </div>
         </div>

         {/* Graph */}
         <div className="bg-white dark:bg-zinc-800 p-4 rounded-2xl border border-slate-200 dark:border-zinc-700 shadow-sm transition-colors flex flex-col items-center justify-center">
            <h4 className="text-sm font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Activity size={16}/> {t('kinetics.concentrationGraph')}
            </h4>
            <div className="relative w-full aspect-[2/1]">
                 <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                     {/* Axes */}
                     <line x1={padding} y1={height-padding} x2={width-padding} y2={height-padding}
                       stroke="currentColor" strokeWidth="1" className="text-slate-300 dark:text-zinc-600" />
                     <line x1={padding} y1={padding} x2={padding} y2={height-padding}
                       stroke="currentColor" strokeWidth="1" className="text-slate-300 dark:text-zinc-600" />

                     {/* Line */}
                     <path d={pathD} fill="none" stroke="#0d9488" strokeWidth="3" strokeLinecap="round" />
                 </svg>
                 <div className="absolute bottom-0 right-0 text-xs text-slate-400 dark:text-zinc-500">t (s)</div>
                 <div className="absolute top-0 left-0 text-xs text-slate-400 dark:text-zinc-500">[A]</div>
            </div>
         </div>
      </div>

      <div className="bg-slate-50 dark:bg-zinc-900 p-4 rounded-xl text-sm text-slate-600 dark:text-zinc-400 transition-colors">
         <h4 className="font-bold mb-2">{t('kinetics.equations')}</h4>
         <div className="space-y-2">
           <div>
             <p className="text-xs text-slate-500 dark:text-zinc-500">{t('kinetics.concentrationEquation')}</p>
             {order === 0 && <p className="font-mono">[A] = [A]₀ - vt</p>}
             {order === 1 && <p className="font-mono">[A] = [A]₀ · e^(-vt/[A]₀)</p>}
             {order === 2 && <p className="font-mono">1/[A] = 1/[A]₀ + vt/[A]₀²</p>}
           </div>
         </div>
      </div>
    </div>
  );
};

export default Kinetics;
