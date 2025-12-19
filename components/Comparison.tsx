import React, { useState } from 'react';
import { GitCompare, Loader2, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { compareSubstancesAI } from '../services/gemini';
import { ComparisonResult } from '../types';
import ReactMarkdown from 'react-markdown';
import { useTranslation } from 'react-i18next';

const Comparison: React.FC = () => {
  const { t } = useTranslation();
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
    <div className="space-y-6 relative isolate">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center text-orange-600 dark:text-orange-400 transition-colors">
          <GitCompare size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-zinc-100">{t('aiCompare.title')}</h2>
          <p className="text-slate-500 dark:text-zinc-400">{t('aiCompare.subtitle')}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
           <label className="block text-sm font-medium text-slate-500 dark:text-zinc-400 mb-1 ml-1">{t('aiCompare.substanceA')}</label>
           <input
            type="text"
            value={subA}
            onChange={(e) => setSubA(e.target.value)}
            placeholder="например, Золото"
            className="w-full h-12 px-4 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 border border-slate-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 transition-all"
           />
        </div>
        <div>
           <label className="block text-sm font-medium text-slate-500 dark:text-zinc-400 mb-1 ml-1">{t('aiCompare.substanceB')}</label>
           <input
            type="text"
            value={subB}
            onChange={(e) => setSubB(e.target.value)}
            placeholder="например, Серебро"
            className="w-full h-12 px-4 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 border border-slate-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 transition-all"
           />
        </div>
      </div>

      <button
        onClick={handleCompare}
        disabled={loading || !subA || !subB}
        className="w-full h-12 bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-500 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/30 transition-all flex items-center justify-center space-x-2 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
      >
         {loading ? <Loader2 className="animate-spin" /> : <span>{t('aiCompare.compare')}</span>}
      </button>

      {result && (
        <div className="bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-6 rounded-2xl animate-fade-in mt-6 transition-colors">
          <div className="prose prose-sm prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-zinc-300">
            <ReactMarkdown>{result.text}</ReactMarkdown>
          </div>

          {result.sources && result.sources.length > 0 && (
            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-zinc-700">
              <h4 className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <LinkIcon size={12} /> Источники
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.sources.map((source, idx) => (
                  <a
                    key={idx}
                    href={source.uri}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg text-xs font-medium text-slate-600 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-600 transition-colors"
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
