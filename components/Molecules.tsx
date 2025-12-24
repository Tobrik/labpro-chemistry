import React, { useEffect, useRef, useState } from 'react';
import { Box, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../src/contexts/ThemeContext';

declare global {
  interface Window {
    $3Dmol: any;
  }
}

const MOLECULES = [
  { nameKey: "water", cid: "962" },
  { nameKey: "caffeine", cid: "2519" },
  { nameKey: "ethanol", cid: "702" },
  { nameKey: "glucose", cid: "5793" },
  { nameKey: "aspirin", cid: "2244" },
  { nameKey: "benzene", cid: "241" },
  { nameKey: "methane", cid: "297" },
];

const Molecules: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [selectedMol, setSelectedMol] = useState(MOLECULES[0]);
  const viewerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const glRef = useRef<any>(null);

  useEffect(() => {
    if (!viewerRef.current || !window.$3Dmol) return;

    // Initialize viewer once or recreate if theme changed
    if (!glRef.current) {
        const element = viewerRef.current;
        const config = { backgroundColor: theme === 'dark' ? '#18181b' : 'white' };
        glRef.current = window.$3Dmol.createViewer(element, config);
    } else {
        // Update background color when theme changes
        glRef.current.setBackgroundColor(theme === 'dark' ? '#18181b' : 'white');
        glRef.current.render();
    }

    const viewer = glRef.current;
    setLoading(true);

    window.$3Dmol.download(`cid:${selectedMol.cid}`, viewer, {
        multimodel: true,
        frames: true
    }, function() {
        viewer.setStyle({}, {stick: {radius: 0.15}, sphere: {scale: 0.25}});
        viewer.zoomTo();
        viewer.render();
        setLoading(false);
    });

  }, [selectedMol, theme]);

  return (
    <div className="space-y-6 relative isolate">
       <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-indigo-900 dark:bg-indigo-800 rounded-xl flex items-center justify-center text-white transition-colors">
          <Box size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-zinc-100">{t('molecules.title')}</h2>
          <p className="text-slate-500 dark:text-zinc-400">{t('molecules.subtitle')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-3 max-h-[500px] overflow-y-auto pr-2">
            {MOLECULES.map(mol => (
                <button
                  key={mol.cid}
                  onClick={() => setSelectedMol(mol)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all font-medium ${
                    selectedMol.cid === mol.cid
                      ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-md'
                      : 'bg-white dark:bg-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-700 text-slate-600 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700'
                  }`}
                >
                  {t(`molecules.${mol.nameKey}`)}
                </button>
            ))}
        </div>

        {/* Viewer Area */}
        <div className="lg:col-span-3 h-[500px] bg-slate-50 dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 relative overflow-hidden shadow-inner transition-colors isolate">
             {loading && (
                 <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-zinc-800/80 z-10 backdrop-blur-sm">
                     <Loader2 className="animate-spin text-indigo-600 dark:text-indigo-400" size={40} />
                 </div>
             )}

             <div id="mol-container" ref={viewerRef} className="w-full h-full relative z-0"></div>

             <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-zinc-800/90 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 z-10">
                 {t('molecules.hint')}
             </div>
        </div>
      </div>
    </div>
  );
};

export default Molecules;
