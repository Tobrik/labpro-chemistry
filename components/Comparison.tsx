import React, { useState } from 'react';
import { GitCompare, Loader2, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { compareSubstancesAI } from '../services/gemini';
import { ComparisonResult } from '../types';
import ReactMarkdown from 'react-markdown';

const Comparison: React.FC = () => {
  const [subA, setSubA] = useState('');
  const [subB, setSubB] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ComparisonResult | null>(null);

  const handleCompare = async () => {
    if (!subA.trim() || !subB.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const data = await compareSubstancesAI(subA, subB);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
          <GitCompare size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Сравнение веществ</h2>
          <p className="text-slate-500">Анализ свойств бок о бок</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
           <label className="block text-sm font-medium text-slate-500 mb-1 ml-1">Вещество А</label>
           <input
            type="text"
            value={subA}
            onChange={(e) => setSubA(e.target.value)}
            placeholder="например, Золото"
            className="w-full h-12 px-4 bg-white text-slate-900 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
           />
        </div>
        <div>
           <label className="block text-sm font-medium text-slate-500 mb-1 ml-1">Вещество Б</label>
           <input
            type="text"
            value={subB}
            onChange={(e) => setSubB(e.target.value)}
            placeholder="например, Серебро"
            className="w-full h-12 px-4 bg-white text-slate-900 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
           />
        </div>
      </div>

      <button
        onClick={handleCompare}
        disabled={loading || !subA || !subB}
        className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/30 transition-all flex items-center justify-center space-x-2 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
      >
         {loading ? <Loader2 className="animate-spin" /> : <span>Сравнить свойства</span>}
      </button>

      {result && (
        <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl animate-fade-in mt-6">
          <div className="prose prose-sm prose-slate max-w-none text-slate-700">
            <ReactMarkdown>{result.text}</ReactMarkdown>
          </div>

          {result.sources.length > 0 && (
            <div className="mt-6 pt-4 border-t border-slate-200">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <LinkIcon size={12} /> Источники
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.sources.map((source, idx) => (
                  <a 
                    key={idx} 
                    href={source.uri} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:text-blue-600 hover:border-blue-200 transition-colors"
                  >
                    <span className="truncate max-w-[150px]">{source.title}</span>
                    <ExternalLink size={10} />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Comparison;
