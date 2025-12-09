import React, { useState, Component, ErrorInfo, ReactNode } from 'react';
import { Beaker, Scale, Grid, FlaskConical, Droplet, Dumbbell, BookOpen, BrainCircuit, Flame, Timer, Box, ShieldAlert } from 'lucide-react';
import MolarMass from './components/MolarMass';
import EquationBalancer from './components/EquationBalancer';
import PeriodicTable from './components/PeriodicTable';
import Comparison from './components/Comparison';
import Trainer from './components/Trainer';
import SolutionsCalculator from './components/SolutionsCalculator';
import FormulaReference from './components/FormulaReference';
import ProblemSolver from './components/ProblemSolver';
import AdminPanel from './components/AdminPanel';
import Thermochemistry from './components/Thermochemistry';
import Kinetics from './components/Kinetics';
import Molecules from './components/Molecules';
import { NavItem } from './types';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import AuthModal from './src/components/AuthModal';

// Simple Error Boundary
interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return <div className="p-8 text-center text-red-500">Что-то пошло не так. Перезагрузите страницу.</div>;
    }
    return this.props.children;
  }
}

function AppContent() {
  const { user, loading, userRole, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<NavItem>('periodic-table');
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  const navItems: { id: NavItem; label: string; icon: React.ReactNode }[] = [
    { id: 'periodic-table', label: 'Таблица', icon: <Grid size={18} /> },
    { id: 'formulas', label: 'Формулы', icon: <BookOpen size={18} /> },
    { id: 'solver', label: 'AI Задачи', icon: <BrainCircuit size={18} /> },
    { id: 'reaction-balancer', label: 'AI Уравнитель', icon: <Scale size={18} /> },
    { id: 'trainer', label: 'Тренажёр', icon: <Dumbbell size={18} /> },
    { id: 'solutions', label: 'Растворы', icon: <FlaskConical size={18} /> },
    { id: 'thermo', label: 'Термохимия', icon: <Flame size={18} /> },
    { id: 'kinetics', label: 'Кинетика', icon: <Timer size={18} /> },
    { id: 'molecules', label: '3D Молекулы', icon: <Box size={18} /> },
    { id: 'molar-mass', label: 'Мол. масса', icon: <Beaker size={18} /> },
    { id: 'ph', label: 'AI Сравнение', icon: <Droplet size={18} /> },
  ];

  const renderContent = () => {
    // Restrict admin panel to admins only
    if (activeTab === 'admin' && userRole !== 'admin') {
      return (
        <div className="text-center py-12">
          <ShieldAlert size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-xl font-bold text-slate-800 mb-2">Доступ запрещён</h3>
          <p className="text-slate-600">У вас нет прав доступа к админ панели</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'periodic-table': return <PeriodicTable />;
      case 'formulas': return <FormulaReference />;
      case 'solver': return <ProblemSolver />;
      case 'reaction-balancer': return <EquationBalancer />;
      case 'molar-mass': return <MolarMass />;
      case 'trainer': return <Trainer />;
      case 'solutions': return <SolutionsCalculator />;
      case 'thermo': return <Thermochemistry />;
      case 'kinetics': return <Kinetics />;
      case 'molecules': return <Molecules />;
      case 'admin': return <AdminPanel />;
      case 'ph': return <Comparison />;
      default: return null;
    }
  };

  return (
    <>
      {/* Auth Modal - show when not authenticated */}
      {!user && <AuthModal isOpen={!user} onClose={() => setShowAuthModal(false)} />}

      <div className="min-h-screen bg-slate-50 font-sans text-slate-900">

        {/* Header */}
        <header className="bg-[#1e1b4b] text-white pt-6 pb-20 relative z-0">
          <div className="container mx-auto px-4 lg:px-8">
             <div className="flex items-center justify-between mb-2">
               <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white backdrop-blur-sm border border-white/20">
                   <Beaker size={20} strokeWidth={2.5} />
                 </div>
                 <div>
                   <h1 className="text-2xl font-bold tracking-tight">LabPro</h1>
                   <p className="text-indigo-200 text-xs opacity-80">Инструменты для химических расчётов</p>
                 </div>
               </div>

               <div className="flex items-center gap-3">
                 {/* User info */}
                 {user && (
                   <div className="text-right text-xs">
                     <p className="text-white/90">{user.displayName || user.email}</p>
                     {userRole === 'admin' && (
                       <p className="text-indigo-300">Администратор</p>
                     )}
                   </div>
                 )}

                 {/* Logout button */}
                 {user && (
                   <button
                      onClick={() => logout()}
                      className="px-3 py-1.5 text-sm bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                      title="Выйти"
                   >
                      Выйти
                   </button>
                 )}

                 {/* Admin Trigger (Only for admins) */}
                 {userRole === 'admin' && (
                   <button
                      onClick={() => setActiveTab('admin')}
                      className="opacity-50 hover:opacity-100 transition-opacity"
                      title="Admin Panel"
                   >
                      <ShieldAlert size={20} />
                   </button>
                 )}
               </div>
             </div>
          </div>
        </header>

      {/* Navigation Pills */}
      <div className="container mx-auto px-4 lg:px-8 -mt-8 relative z-10 mb-8">
         <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-thin scrollbar-thumb-indigo-300 scrollbar-track-transparent">
           {navItems.filter(i => i.id !== 'admin').map((item) => (
             <button
               key={item.id}
               onClick={() => setActiveTab(item.id)}
               className={`
                 flex items-center gap-2 px-5 py-3 rounded-xl font-medium whitespace-nowrap transition-all text-sm
                 ${activeTab === item.id 
                   ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
                   : 'bg-white text-slate-600 hover:bg-slate-50 hover:text-indigo-600 border border-slate-100 shadow-sm'}
               `}
             >
               {item.icon}
               <span>{item.label}</span>
             </button>
           ))}
         </div>
      </div>

      {/* Main Content Area */}
      <main className="container mx-auto px-4 lg:px-8 pb-12">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 min-h-[600px]">
          <ErrorBoundary>
            {renderContent()}
          </ErrorBoundary>
        </div>
      </main>

      </div>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;