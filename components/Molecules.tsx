import React, { useEffect, useRef, useState } from 'react';
import { Box, Loader2 } from 'lucide-react';

declare global {
  interface Window {
    $3Dmol: any;
  }
}

const MOLECULES = [
  { name: "Вода", cid: "962" },
  { name: "Кофеин", cid: "2519" },
  { name: "Этанол", cid: "702" },
  { name: "Глюкоза", cid: "5793" },
  { name: "Аспирин", cid: "2244" },
  { name: "Бензол", cid: "241" },
  { name: "Метан", cid: "297" },
];

const Molecules: React.FC = () => {
  const [selectedMol, setSelectedMol] = useState(MOLECULES[0]);
  const viewerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const glRef = useRef<any>(null);

  useEffect(() => {
    if (!viewerRef.current || !window.$3Dmol) return;

    // Initialize viewer once
    if (!glRef.current) {
        const element = viewerRef.current;
        const config = { backgroundColor: 'white' };
        glRef.current = window.$3Dmol.createViewer(element, config);
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

  }, [selectedMol]);

  return (
    <div className="space-y-6">
       <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-indigo-900 rounded-xl flex items-center justify-center text-white">
          <Box size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">3D Молекулы</h2>
          <p className="text-slate-500">Визуализация структур веществ</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-2 max-h-[500px] overflow-y-auto pr-2">
            {MOLECULES.map(mol => (
                <button 
                  key={mol.cid}
                  onClick={() => setSelectedMol(mol)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all font-medium ${selectedMol.cid === mol.cid ? 'bg-indigo-600 text-white shadow-md' : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200'}`}
                >
                  {mol.name}
                </button>
            ))}
        </div>

        {/* Viewer Area */}
        <div className="lg:col-span-3 h-[500px] bg-slate-50 rounded-2xl border border-slate-200 relative overflow-hidden shadow-inner">
             {loading && (
                 <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10 backdrop-blur-sm">
                     <Loader2 className="animate-spin text-indigo-600" size={40} />
                 </div>
             )}
             
             <div id="mol-container" ref={viewerRef} className="w-full h-full relative z-0"></div>
             
             <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 border border-slate-200 z-10">
                 Используйте мышь для вращения
             </div>
        </div>
      </div>
    </div>
  );
};

export default Molecules;
