import React, { useState, useEffect } from 'react';
import { Search, Filter, Info, Atom, Thermometer, Layers, Clock, Loader2, X, History, Orbit } from 'lucide-react';
import { PERIODIC_ELEMENTS } from '../constants';
import { ElementData, ElementCategory, DetailedElementData } from '../types';
import { getElementDetailsAI } from '../services/gemini';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../src/contexts/LanguageContext';

const PeriodicTable: React.FC = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const [filter, setFilter] = useState<ElementCategory | 'all'>('all');
  const [periodFilter, setPeriodFilter] = useState<number | 'all'>('all');
  const [search, setSearch] = useState('');
  const [selectedElement, setSelectedElement] = useState<ElementData | null>(null);
  const [detailedInfo, setDetailedInfo] = useState<DetailedElementData | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);
  const [tab, setTab] = useState<'info' | 'timeline'>('info');

  useEffect(() => {
    if (selectedElement) {
      setDetailedInfo(null);
      setDetailsError(null);
      setLoadingDetails(true);
      getElementDetailsAI(selectedElement.name, currentLanguage)
        .then(data => {
          setDetailedInfo(data);
          setLoadingDetails(false);
        })
        .catch((error) => {
          setLoadingDetails(false);
          setDetailsError(error.message || t('errors.authRequired'));
        });
    }
  }, [selectedElement, currentLanguage, t]);

  const categories: { id: ElementCategory | 'all'; label: string; }[] = [
    { id: 'all', label: t('periodicTable.allCategories') },
    { id: 'non-metal', label: 'Non-metal' },
    { id: 'noble-gas', label: 'Noble gas' },
    { id: 'alkali-metal', label: 'Alkali metal' },
    { id: 'alkaline-earth-metal', label: 'Alkaline earth' },
    { id: 'metalloid', label: 'Metalloid' },
    { id: 'halogen', label: 'Halogen' },
    { id: 'transition-metal', label: 'Transition metal' },
    { id: 'post-transition-metal', label: 'Post-transition' },
    { id: 'lanthanide', label: 'Lanthanide' },
    { id: 'actinide', label: 'Actinide' },
  ];

  const filteredElements = PERIODIC_ELEMENTS.filter(el => {
    const matchesFilter = filter === 'all' || el.category === filter;
    const matchesPeriod = periodFilter === 'all' || el.period === periodFilter;
    const matchesSearch = 
      el.name.toLowerCase().includes(search.toLowerCase()) || 
      el.symbol.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch && matchesPeriod;
  });

  const getElementColor = (category: ElementCategory) => {
    switch (category) {
      case 'non-metal': return 'bg-blue-500 text-white border-blue-600';
      case 'noble-gas': return 'bg-cyan-400 text-white border-cyan-500';
      case 'alkali-metal': return 'bg-purple-500 text-white border-purple-600';
      case 'alkaline-earth-metal': return 'bg-orange-400 text-white border-orange-500';
      case 'metalloid': return 'bg-emerald-500 text-white border-emerald-600';
      case 'halogen': return 'bg-yellow-400 text-black border-yellow-500';
      case 'transition-metal': return 'bg-pink-500 text-white border-pink-600';
      case 'post-transition-metal': return 'bg-slate-500 text-white border-slate-600';
      case 'lanthanide': return 'bg-indigo-300 text-indigo-900 border-indigo-400';
      case 'actinide': return 'bg-rose-300 text-rose-900 border-rose-400';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-8 pb-20">

      {/* Search and Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-zinc-100 mb-6">{t('periodicTable.title')}</h2>
        <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500" size={20} />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={t('periodicTable.search')}
                    className="w-full h-12 pl-12 pr-4 bg-white dark:bg-zinc-700 text-slate-900 dark:text-zinc-100 border border-slate-200 dark:border-zinc-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all"
                />
            </div>
            <select
                value={periodFilter}
                onChange={e => setPeriodFilter(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                className="h-12 px-4 bg-white dark:bg-zinc-700 text-slate-900 dark:text-zinc-100 border border-slate-200 dark:border-zinc-600 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
            >
                <option value="all">{t('periodicTable.allCategories')}</option>
                {[1,2,3,4,5,6,7].map(p => <option key={p} value={p}>Period {p}</option>)}
            </select>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 items-center">
        <Filter className="text-slate-400 dark:text-zinc-500 mr-2" size={20} />
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              filter === cat.id
                ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-md'
                : 'bg-slate-100 dark:bg-zinc-700 text-slate-600 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-600'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Periodic Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
        {filteredElements.map((el) => (
          <button
            key={el.symbol}
            onClick={() => setSelectedElement(el)}
            className={`
              aspect-[4/5] p-2 rounded-lg border flex flex-col justify-between items-start transition-all hover:scale-105 shadow-sm
              ${getElementColor(el.category)}
              ${selectedElement?.symbol === el.symbol ? 'ring-4 ring-offset-2 ring-indigo-500 z-10' : ''}
            `}
          >
            <span className="text-[10px] font-bold opacity-80">{el.number}</span>
            <span className="text-xl font-bold self-center">{el.symbol}</span>
            <div className="w-full text-center">
               <span className="block text-[9px] truncate font-medium">{el.name}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Detail View Modal/Panel */}
      {selectedElement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 dark:bg-black/60 backdrop-blur-sm" onClick={() => setSelectedElement(null)}>
           <div className="bg-white dark:bg-zinc-800 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-100 dark:border-zinc-700 relative transition-colors" onClick={e => e.stopPropagation()}>

             <button
               onClick={() => setSelectedElement(null)}
               className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-700 flex items-center justify-center text-slate-500 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-600 z-10 transition-colors"
             >
               <X size={20} />
             </button>

             {/* Header Section */}
             <div className="p-8 border-b border-slate-100 dark:border-zinc-700 bg-slate-50/50 dark:bg-zinc-900/50 transition-colors">
               <div className="flex items-center gap-6">
                  <div className={`w-24 h-24 md:w-32 md:h-32 rounded-3xl flex items-center justify-center text-5xl md:text-6xl font-bold shadow-lg ${getElementColor(selectedElement.category)}`}>
                    {selectedElement.symbol}
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-zinc-400 font-medium text-lg">#{selectedElement.number}</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-zinc-100 mb-1">{selectedElement.name}</h2>
                    <p className="text-slate-500 dark:text-zinc-400 capitalize">{categories.find(c => c.id === selectedElement.category)?.label}</p>
                    <div className="flex gap-2 mt-2">
                         <button onClick={() => setTab('info')} className={`px-3 py-1 rounded-lg text-xs font-bold border transition-colors ${tab === 'info' ? 'bg-indigo-600 dark:bg-indigo-500 text-white border-indigo-600 dark:border-indigo-500' : 'bg-white dark:bg-zinc-700 text-slate-500 dark:text-zinc-300 border-slate-200 dark:border-zinc-600'}`}>Info</button>
                         <button onClick={() => setTab('timeline')} className={`px-3 py-1 rounded-lg text-xs font-bold border transition-colors ${tab === 'timeline' ? 'bg-indigo-600 dark:bg-indigo-500 text-white border-indigo-600 dark:border-indigo-500' : 'bg-white dark:bg-zinc-700 text-slate-500 dark:text-zinc-300 border-slate-200 dark:border-zinc-600'}`}>History</button>
                    </div>
                  </div>
               </div>
             </div>

             {/* Content Section */}
             <div className="p-8 space-y-8">
               
               {loadingDetails && (
                 <div className="flex flex-col items-center justify-center py-10 text-slate-400 dark:text-zinc-500">
                   <Loader2 size={32} className="animate-spin mb-3 text-indigo-500 dark:text-indigo-400" />
                   <p>{t('common.loading')}</p>
                 </div>
               )}

               {!loadingDetails && detailsError && (
                 <div className="flex flex-col items-center justify-center py-10">
                   <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 max-w-md text-center transition-colors">
                     <p className="text-red-600 dark:text-red-400 font-medium mb-2">⚠️ {t('common.error')}</p>
                     <p className="text-sm text-red-500 dark:text-red-400">{detailsError}</p>
                   </div>
                 </div>
               )}

               {!loadingDetails && detailedInfo && tab === 'info' && (
                 <>
                   <div className="bg-indigo-50/50 dark:bg-indigo-900/20 p-4 rounded-xl text-slate-700 dark:text-zinc-300 leading-relaxed text-sm md:text-base border border-indigo-100 dark:border-indigo-800 transition-colors">
                     {detailedInfo.description}
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="bg-white dark:bg-zinc-700 p-4 rounded-2xl border border-slate-100 dark:border-zinc-600 shadow-sm transition-colors">
                       <div className="flex items-center gap-2 mb-3 text-indigo-600 dark:text-indigo-400">
                         <Atom size={20} />
                         <h3 className="font-bold">{t('periodicTable.electronConfiguration')}</h3>
                       </div>
                       <div className="space-y-3">
                         <div>
                           <span className="text-xs text-slate-400 dark:text-zinc-500 uppercase font-bold tracking-wider block mb-1">{t('periodicTable.electronConfiguration')}</span>
                           <span className="font-mono text-slate-800 dark:text-zinc-100 bg-slate-50 dark:bg-zinc-600 px-2 py-1 rounded">{detailedInfo.electronConfiguration}</span>
                         </div>
                         <div>
                           <span className="text-xs text-slate-400 dark:text-zinc-500 uppercase font-bold tracking-wider block mb-1">{t('periodicTable.electronShells')}</span>
                           <div className="flex gap-2 mt-1 relative h-16 items-center justify-center border border-dashed border-slate-200 dark:border-zinc-600 rounded-lg">
                                {/* Simulated Orbitals */}
                                <div className="absolute w-2 h-2 bg-slate-800 dark:bg-zinc-100 rounded-full z-10"></div>
                                {detailedInfo.electronShells.split(',').map((shell, i) => (
                                    <div key={i} className="absolute border border-slate-300 dark:border-zinc-500 rounded-full" style={{
                                        width: `${(i+1)*25}px`,
                                        height: `${(i+1)*25}px`,
                                        opacity: 0.6
                                    }}></div>
                                ))}
                           </div>
                           <div className="text-center text-xs text-slate-400 dark:text-zinc-500 mt-1">{detailedInfo.electronShells}</div>
                         </div>
                       </div>
                     </div>

                     <div className="bg-white dark:bg-zinc-700 p-4 rounded-2xl border border-slate-100 dark:border-zinc-600 shadow-sm transition-colors">
                       <div className="flex items-center gap-2 mb-3 text-rose-500 dark:text-rose-400">
                         <Thermometer size={20} />
                         <h3 className="font-bold">Physical Properties</h3>
                       </div>
                       <div className="space-y-3">
                          <div className="flex justify-between items-center border-b border-slate-50 dark:border-zinc-600 pb-2">
                            <span className="text-sm text-slate-500 dark:text-zinc-400">{t('periodicTable.density')}</span>
                            <span className="font-medium text-slate-800 dark:text-zinc-100">{detailedInfo.density}</span>
                          </div>
                          <div className="flex justify-between items-center border-b border-slate-50 dark:border-zinc-600 pb-2">
                            <span className="text-sm text-slate-500 dark:text-zinc-400">{t('periodicTable.meltingPoint')}</span>
                            <span className="font-medium text-slate-800 dark:text-zinc-100">{detailedInfo.meltingPoint}</span>
                          </div>
                          <div className="flex justify-between items-center border-b border-slate-50 dark:border-zinc-600 pb-2">
                            <span className="text-sm text-slate-500 dark:text-zinc-400">{t('periodicTable.boilingPoint')}</span>
                            <span className="font-medium text-slate-800 dark:text-zinc-100">{detailedInfo.boilingPoint}</span>
                          </div>
                          <div className="flex justify-between items-center pt-1">
                             <div className="flex items-center gap-2 text-slate-500 dark:text-zinc-400 text-sm">
                               <Clock size={14} />
                               <span>{t('periodicTable.discoveryYear')}</span>
                             </div>
                             <span className="font-medium text-slate-800 dark:text-zinc-100">{detailedInfo.discoveryYear}</span>
                          </div>
                       </div>
                     </div>

                   </div>
                 </>
               )}

               {tab === 'timeline' && (
                   <div className="space-y-4 relative pl-4 border-l-2 border-slate-200 dark:border-zinc-600">
                        {/* Simulating history data based on description for now */}
                        <div className="relative mb-6">
                            <div className="absolute -left-[21px] top-1 w-3 h-3 bg-indigo-500 dark:bg-indigo-400 rounded-full border-2 border-white dark:border-zinc-800"></div>
                            <h4 className="font-bold text-slate-800 dark:text-zinc-100">{detailedInfo?.discoveryYear || '???'}</h4>
                            <p className="text-sm text-slate-600 dark:text-zinc-400">Discovery of element.</p>
                        </div>
                        <div className="relative">
                            <div className="absolute -left-[21px] top-1 w-3 h-3 bg-slate-300 dark:bg-zinc-500 rounded-full border-2 border-white dark:border-zinc-800"></div>
                            <h4 className="font-bold text-slate-800 dark:text-zinc-100">Modern era</h4>
                            <p className="text-sm text-slate-600 dark:text-zinc-400">Widely used in industry and science.</p>
                        </div>
                   </div>
               )}
             </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default PeriodicTable;
