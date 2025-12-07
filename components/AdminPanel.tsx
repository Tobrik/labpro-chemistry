import React, { useState } from 'react';
import { ShieldAlert, Users, FileText, Activity, Save } from 'lucide-react';

const AdminPanel: React.FC = () => {
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
        <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-white">
          <ShieldAlert size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Админ-панель</h2>
          <p className="text-slate-500">Управление системой и мониторинг</p>
        </div>
      </div>

      <div className="flex gap-2 border-b border-slate-200 pb-1">
        <button onClick={() => setActiveTab('users')} className={`px-4 py-2 text-sm font-medium rounded-t-lg ${activeTab === 'users' ? 'bg-white border-x border-t border-slate-200 text-slate-800' : 'text-slate-500'}`}>
          <Users size={16} className="inline mr-2"/>Пользователи
        </button>
        <button onClick={() => setActiveTab('formulas')} className={`px-4 py-2 text-sm font-medium rounded-t-lg ${activeTab === 'formulas' ? 'bg-white border-x border-t border-slate-200 text-slate-800' : 'text-slate-500'}`}>
          <FileText size={16} className="inline mr-2"/>Редактор формул
        </button>
        <button onClick={() => setActiveTab('logs')} className={`px-4 py-2 text-sm font-medium rounded-t-lg ${activeTab === 'logs' ? 'bg-white border-x border-t border-slate-200 text-slate-800' : 'text-slate-500'}`}>
          <Activity size={16} className="inline mr-2"/>Логи (Sentry Mock)
        </button>
      </div>

      <div className="bg-white rounded-b-xl min-h-[400px]">
        {activeTab === 'users' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 uppercase">
                <tr>
                  <th className="px-6 py-3">Имя</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Роль</th>
                  <th className="px-6 py-3">Активность</th>
                  <th className="px-6 py-3">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">{u.name}</td>
                    <td className="px-6 py-4 text-slate-500">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${u.role === 'Admin' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>{u.role}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{u.activity}</td>
                    <td className="px-6 py-4">
                      <button className="text-red-500 hover:text-red-700 font-medium">Бан</button>
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
               <div key={f.id} className="flex gap-4 items-center p-3 bg-slate-50 rounded-lg border border-slate-200">
                 <input 
                    className="flex-1 bg-white border border-slate-200 rounded px-3 py-2 text-slate-800" 
                    defaultValue={f.name} 
                 />
                 <input 
                    className="flex-1 bg-white border border-slate-200 rounded px-3 py-2 font-mono text-slate-800" 
                    defaultValue={f.eq} 
                 />
                 <button className="p-2 text-green-600 hover:bg-green-50 rounded"><Save size={18}/></button>
               </div>
             ))}
             <button className="w-full py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-400 hover:border-slate-400 hover:text-slate-500 transition-colors">
               + Добавить формулу
             </button>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="bg-slate-900 text-slate-300 font-mono text-xs p-4 rounded-xl h-[400px] overflow-y-auto">
            {logs.map((log, i) => (
              <div key={i} className="mb-1 border-b border-slate-800 pb-1">
                <span className="text-slate-500">[{log.time}]</span>{' '}
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
