import React, { useState, useEffect } from 'react';
import { Timer, Activity } from 'lucide-react';
import { calculateConcentration, calculateReactionRate } from '../chemistryUtils';
import { useTranslation } from 'react-i18next';

interface GraphProps {
  data: {x: number, y: number}[];
  title: string;
  yLabel: string;
  color: string;
}

const Graph: React.FC<GraphProps> = ({ data, title, yLabel, color }) => {
  const width = 300;
  const height = 150;
  const padding = 20;

  const maxY = Math.max(...data.map(p => p.y), 0.001);
  const maxX = Math.max(...data.map(p => p.x), 0.001);

  const getX = (val: number) => padding + (val / maxX) * (width - 2 * padding);
  const getY = (val: number) => height - padding - (val / maxY) * (height - 2 * padding);

  const pathD = data.length > 0
    ? `M ${getX(data[0].x)} ${getY(data[0].y)} ` + data.map(p => `L ${getX(p.x)} ${getY(p.y)}`).join(' ')
    : '';

  return (
    <div className="bg-white dark:bg-zinc-800 p-4 rounded-2xl border border-slate-200 dark:border-zinc-700 shadow-sm transition-colors">
      <h4 className="text-sm font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-4 flex items-center gap-2">
        <Activity size={16}/> {title}
      </h4>
      <div className="relative w-full aspect-[2/1]">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          <line x1={padding} y1={height-padding} x2={width-padding} y2={height-padding}
                stroke="currentColor" strokeWidth="1" className="text-slate-300 dark:text-zinc-600" />
          <line x1={padding} y1={padding} x2={padding} y2={height-padding}
                stroke="currentColor" strokeWidth="1" className="text-slate-300 dark:text-zinc-600" />
          <path d={pathD} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
        </svg>
        <div className="absolute bottom-0 right-0 text-xs text-slate-400 dark:text-zinc-500">t (s)</div>
        <div className="absolute top-0 left-0 text-xs text-slate-400 dark:text-zinc-500">{yLabel}</div>
      </div>
    </div>
  );
};

const Kinetics: React.FC = () => {
  const { t } = useTranslation();
  const [order, setOrder] = useState(1);
  const [c0, setC0] = useState(1.0);
  const [k, setK] = useState(0.1);
  const [dataPoints, setDataPoints] = useState<{x:number, y:number}[]>([]);
  const [rateDataPoints, setRateDataPoints] = useState<{x:number, y:number}[]>([]);

  useEffect(() => {
    const concentrationPoints = [];
    const ratePoints = [];

    const maxTime = k > 0 ? 5 / k : 10;
    for(let i=0; i<=20; i++) {
      const t = (maxTime / 20) * i;
      const c = calculateConcentration(order, c0, k, t);
      const v = calculateReactionRate(order, c0, k, t);

      concentrationPoints.push({x: t, y: c});
      ratePoints.push({x: t, y: v});
    }

    setDataPoints(concentrationPoints);
    setRateDataPoints(ratePoints);
  }, [order, c0, k]);

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

      {/* Controls */}
      <div className="bg-white dark:bg-zinc-800 p-4 rounded-2xl border border-slate-200 dark:border-zinc-700 transition-colors space-y-4">
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
          <label className="text-sm font-medium text-slate-500 dark:text-zinc-400">{t('kinetics.rateConstant')}</label>
          <input type="number" step="0.01" value={k} onChange={e => setK(parseFloat(e.target.value) || 0)}
            className="w-full h-10 px-3 bg-white dark:bg-zinc-700 text-slate-900 dark:text-zinc-100 border border-slate-200 dark:border-zinc-600 rounded-lg mt-1 transition-colors" />
        </div>
      </div>

      {/* TWO GRAPHS STACKED */}
      <div className="space-y-4">
        <Graph
          data={dataPoints}
          title={t('kinetics.concentrationGraph')}
          yLabel="[A]"
          color="#0d9488"
        />

        <Graph
          data={rateDataPoints}
          title={t('kinetics.rateGraph')}
          yLabel="v"
          color="#f59e0b"
        />
      </div>

      {/* Equations */}
      <div className="bg-slate-50 dark:bg-zinc-900 p-4 rounded-xl text-sm text-slate-600 dark:text-zinc-400 transition-colors">
        <h4 className="font-bold mb-2">{t('kinetics.equations')}</h4>
        <div className="space-y-2">
          <div>
            <p className="text-xs text-slate-500 dark:text-zinc-500">{t('kinetics.concentrationEquation')}</p>
            {order === 0 && <p className="font-mono">[A] = [A]₀ - kt</p>}
            {order === 1 && <p className="font-mono">[A] = [A]₀ · e^(-kt)</p>}
            {order === 2 && <p className="font-mono">1/[A] = 1/[A]₀ + kt</p>}
          </div>

          <div>
            <p className="text-xs text-slate-500 dark:text-zinc-500">{t('kinetics.rateEquation')}</p>
            {order === 0 && <p className="font-mono">v = k</p>}
            {order === 1 && <p className="font-mono">v = k·[A]</p>}
            {order === 2 && <p className="font-mono">v = k·[A]²</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Kinetics;
