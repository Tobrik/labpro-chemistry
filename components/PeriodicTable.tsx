import React, { useState, useEffect } from 'react';
import { Search, Filter, Info, Atom, Thermometer, Layers, Clock, Loader2, X, History, Orbit } from 'lucide-react';
import { PERIODIC_ELEMENTS } from '../constants';
import { ElementData, ElementCategory, DetailedElementData } from '../types';
import { getElementDetailsAI } from '../services/gemini';

const PeriodicTable: React.FC = () => {
  const [filter, setFilter] = useState<ElementCategory | 'all'>('all');
  const [periodFilter, setPeriodFilter] = useState<number | 'all'>('all');
  const [search, setSearch] = useState('');
  const [selectedElement, setSelectedElement] = useState<ElementData | null>(null);
  const [detailedInfo, setDetailedInfo] = useState<DetailedElementData | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [tab, setTab] = useState<'info' | 'timeline'>('info');

  useEffect(() => {
    if (selectedElement) {
      setDetailedInfo(null);
      setLoadingDetails(true);
      getElementDetailsAI(selectedElement.name)
        .then(data => {
          setDetailedInfo(data);
          setLoadingDetails(false);
        })
        .catch(() => setLoadingDetails(false));
    }
  }, [selectedElement]);

  const categories: { id: ElementCategory | 'all'; label: string; }[] = [
    { id: 'all', label: 'Все элементы' },
    { id: 'non-metal', label: 'Неметалл' },
    { id: 'noble-gas', label: 'Благородный газ' },
    { id: 'alkali-metal', label: 'Щелочной металл' },
    { id: 'alkaline-earth-metal', label: 'Щелочноземельный' },
    { id: 'metalloid', label: 'Металлоид' },
    { id: 'halogen', label: 'Галоген' },
    { id: 'transition-metal', label: 'Переходный металл' },
    { id: 'post-transition-metal', label: 'Постпереходный' },
    { id: 'lanthanide', label: 'Лантаноид' },
    { id: 'actinide', label: 'Актиноид' },
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
        <h2 className="text-2xl font-bold text-slate-800 mb-6 text-indigo-900">Интерактивная таблица Менделеева</h2>
        <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Поиск по названию или символу..."
                    className="w-full h-12 pl-12 pr-4 bg-white text-slate-900 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
            </div>
            <select 
                value={periodFilter} 
                onChange={e => setPeriodFilter(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                className="h-12 px-4 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
            >
                <option value="all">Все периоды</option>
                {[1,2,3,4,5,6,7].map(p => <option key={p} value={p}>Период {p}</option>)}
            </select>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 items-center">
        <Filter className="text-slate-400 mr-2" size={20} />
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              filter === cat.id
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm" onClick={() => setSelectedElement(null)}>
           <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-100 relative" onClick={e => e.stopPropagation()}>
             
             <button 
               onClick={() => setSelectedElement(null)}
               className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 z-10"
             >
               <X size={20} />
             </button>

             {/* Header Section */}
             <div className="p-8 border-b border-slate-100 bg-slate-50/50">
               <div className="flex items-center gap-6">
                  <div className={`w-24 h-24 md:w-32 md:h-32 rounded-3xl flex items-center justify-center text-5xl md:text-6xl font-bold shadow-lg ${getElementColor(selectedElement.category)}`}>
                    {selectedElement.symbol}
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium text-lg">#{selectedElement.number}</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-1">{selectedElement.name}</h2>
                    <p className="text-slate-500 capitalize">{categories.find(c => c.id === selectedElement.category)?.label}</p>
                    <div className="flex gap-2 mt-2">
                         <button onClick={() => setTab('info')} className={`px-3 py-1 rounded-lg text-xs font-bold border transition-colors ${tab === 'info' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-500 border-slate-200'}`}>Инфо</button>
                         <button onClick={() => setTab('timeline')} className={`px-3 py-1 rounded-lg text-xs font-bold border transition-colors ${tab === 'timeline' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-500 border-slate-200'}`}>История</button>
                    </div>
                  </div>
               </div>
             </div>

             {/* Content Section */}
             <div className="p-8 space-y-8">
               
               {loadingDetails && (
                 <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                   <Loader2 size={32} className="animate-spin mb-3 text-indigo-500" />
                   <p>Загрузка подробной информации...</p>
                 </div>
               )}

               {!loadingDetails && detailedInfo && tab === 'info' && (
                 <>
                   <div className="bg-indigo-50/50 p-4 rounded-xl text-slate-700 leading-relaxed text-sm md:text-base border border-indigo-100">
                     {detailedInfo.description}
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                       <div className="flex items-center gap-2 mb-3 text-indigo-600">
                         <Atom size={20} />
                         <h3 className="font-bold">Электронное строение</h3>
                       </div>
                       <div className="space-y-3">
                         <div>
                           <span className="text-xs text-slate-400 uppercase font-bold tracking-wider block mb-1">Конфигурация</span>
                           <span className="font-mono text-slate-800 bg-slate-50 px-2 py-1 rounded">{detailedInfo.electronConfiguration}</span>
                         </div>
                         <div>
                           <span className="text-xs text-slate-400 uppercase font-bold tracking-wider block mb-1">Электронные слои</span>
                           <div className="flex gap-2 mt-1 relative h-16 items-center justify-center border border-dashed border-slate-200 rounded-lg">
                                {/* Simulated Orbitals */}
                                <div className="absolute w-2 h-2 bg-slate-800 rounded-full z-10"></div>
                                {detailedInfo.electronShells.split(',').map((shell, i) => (
                                    <div key={i} className="absolute border border-slate-300 rounded-full" style={{
                                        width: `${(i+1)*25}px`,
                                        height: `${(i+1)*25}px`,
                                        opacity: 0.6
                                    }}></div>
                                ))}
                           </div>
                           <div className="text-center text-xs text-slate-400 mt-1">{detailedInfo.electronShells}</div>
                         </div>
                       </div>
                     </div>

                     <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                       <div className="flex items-center gap-2 mb-3 text-rose-500">
                         <Thermometer size={20} />
                         <h3 className="font-bold">Физические свойства</h3>
                       </div>
                       <div className="space-y-3">
                          <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                            <span className="text-sm text-slate-500">Плотность</span>
                            <span className="font-medium text-slate-800">{detailedInfo.density}</span>
                          </div>
                          <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                            <span className="text-sm text-slate-500">Плавление</span>
                            <span className="font-medium text-slate-800">{detailedInfo.meltingPoint}</span>
                          </div>
                          <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                            <span className="text-sm text-slate-500">Кипение</span>
                            <span className="font-medium text-slate-800">{detailedInfo.boilingPoint}</span>
                          </div>
                          <div className="flex justify-between items-center pt-1">
                             <div className="flex items-center gap-2 text-slate-500 text-sm">
                               <Clock size={14} />
                               <span>Год открытия</span>
                             </div>
                             <span className="font-medium text-slate-800">{detailedInfo.discoveryYear}</span>
                          </div>
                       </div>
                     </div>

                   </div>
                 </>
               )}

               {tab === 'timeline' && (
                   <div className="space-y-4 relative pl-4 border-l-2 border-slate-200">
                        {/* Simulating history data based on description for now */}
                        <div className="relative mb-6">
                            <div className="absolute -left-[21px] top-1 w-3 h-3 bg-indigo-500 rounded-full border-2 border-white"></div>
                            <h4 className="font-bold text-slate-800">{detailedInfo?.discoveryYear || '???'}</h4>
                            <p className="text-sm text-slate-600">Открытие элемента.</p>
                        </div>
                        <div className="relative">
                            <div className="absolute -left-[21px] top-1 w-3 h-3 bg-slate-300 rounded-full border-2 border-white"></div>
                            <h4 className="font-bold text-slate-800">Современность</h4>
                            <p className="text-sm text-slate-600">Широкое применение в промышленности и науке.</p>
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
