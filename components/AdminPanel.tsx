import React, { useState } from 'react';
import { ShieldAlert, Users, FileText, Activity, Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const AdminPanel: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'users' | 'formulas' | 'logs'>('users');

  // Mock Data
  const [users] = useState([
    { id: 1, name: "Иван Иванов", email: "ivan@example.com", activity: "Online", role: "User" },
    { id: 2, name: "Петр Петров", email: "petr@test.com", activity: "2h ago", role: "User" },
    { id: 3, name: "Admin User", email: "admin@labpro.com", activity: "Online", role: "Admin" },
  ]);

  const [formulas, setFormulas] = useState([
    { id: 1, name: "Закон Бойля-Мариотта", eq: "P1V1 = P2V2" },
    { id: 2, name: "Закон Гей-Люссака", eq: "V1/T1 = V2/T2" },
  ]);

  const [logs] = useState([
    { time: "10:23:45", level: "INFO", msg: "User login: id=1" },
    { time: "10:25:12", level: "ERROR", msg: "EquationBalancer: Failed to solve matrix" },
    { time: "10:40:00", level: "WARN", msg: "High latency on periodic table render" },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-slate-800 dark:bg-zinc-700 rounded-xl flex items-center justify-center text-white transition-colors">
          <ShieldAlert size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-zinc-100 transition-colors">{t('admin.title')}</h2>
          <p className="text-slate-500 dark:text-zinc-400 transition-colors">{t('admin.subtitle')}</p>
        </div>
      </div>

      <div className="flex gap-2 border-b border-slate-200 dark:border-zinc-600 pb-1 transition-colors">
        <button onClick={() => setActiveTab('users')} className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeTab === 'users' ? 'bg-white dark:bg-zinc-800 border-x border-t border-slate-200 dark:border-zinc-600 text-slate-800 dark:text-zinc-100' : 'text-slate-500 dark:text-zinc-400'}`}>
          <Users size={16} className="inline mr-2"/>{t('admin.users')}
        </button>
        <button onClick={() => setActiveTab('formulas')} className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeTab === 'formulas' ? 'bg-white dark:bg-zinc-800 border-x border-t border-slate-200 dark:border-zinc-600 text-slate-800 dark:text-zinc-100' : 'text-slate-500 dark:text-zinc-400'}`}>
          <FileText size={16} className="inline mr-2"/>{t('admin.formulaEditor')}
        </button>
        <button onClick={() => setActiveTab('logs')} className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeTab === 'logs' ? 'bg-white dark:bg-zinc-800 border-x border-t border-slate-200 dark:border-zinc-600 text-slate-800 dark:text-zinc-100' : 'text-slate-500 dark:text-zinc-400'}`}>
          <Activity size={16} className="inline mr-2"/>{t('admin.logs')}
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-800 rounded-b-xl min-h-[400px] transition-colors">
        {activeTab === 'users' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-zinc-900 text-slate-500 dark:text-zinc-400 uppercase transition-colors">
                <tr>
                  <th className="px-6 py-3">{t('admin.name')}</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">{t('admin.role')}</th>
                  <th className="px-6 py-3">{t('admin.activity')}</th>
                  <th className="px-6 py-3">{t('admin.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-700 transition-colors">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-zinc-100">{u.name}</td>
                    <td className="px-6 py-4 text-slate-500 dark:text-zinc-400">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${u.role === 'Admin' ? 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300' : 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'}`}>{u.role}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-zinc-400">{u.activity}</td>
                    <td className="px-6 py-4">
                      <button className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium transition-colors">{t('admin.ban')}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'formulas' && (
          <div className="space-y-4">
             {formulas.map((f, i) => (
               <div key={f.id} className="flex gap-4 items-center p-3 bg-slate-50 dark:bg-zinc-900 rounded-lg border border-slate-200 dark:border-zinc-600 transition-colors">
                 <input
                    className="flex-1 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-600 rounded px-3 py-2 text-slate-800 dark:text-zinc-100 transition-colors"
                    defaultValue={f.name}
                 />
                 <input
                    className="flex-1 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-600 rounded px-3 py-2 font-mono text-slate-800 dark:text-zinc-100 transition-colors"
                    defaultValue={f.eq}
                 />
                 <button className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900 rounded transition-colors"><Save size={18}/></button>
               </div>
             ))}
             <button className="w-full py-3 border-2 border-dashed border-slate-300 dark:border-zinc-600 rounded-lg text-slate-400 dark:text-zinc-500 hover:border-slate-400 dark:hover:border-zinc-500 hover:text-slate-500 dark:hover:text-zinc-400 transition-colors">
               {t('admin.addFormula')}
             </button>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="bg-slate-900 dark:bg-zinc-950 text-slate-300 dark:text-zinc-300 font-mono text-xs p-4 rounded-xl h-[400px] overflow-y-auto transition-colors">
            {logs.map((log, i) => (
              <div key={i} className="mb-1 border-b border-slate-800 dark:border-zinc-800 pb-1 transition-colors">
                <span className="text-slate-500 dark:text-zinc-500">[{log.time}]</span>{' '}
                <span className={log.level === 'ERROR' ? 'text-red-400 font-bold' : log.level === 'WARN' ? 'text-yellow-400' : 'text-blue-400'}>{log.level}</span>:{' '}
                {log.msg}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
