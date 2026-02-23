import React, { useState, useEffect } from 'react';
import { ShieldAlert, Users, FileText, Activity, Save, Trash2, Plus, Atom, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  subscribeToUsers,
  subscribeToFormulas,
  addFormula,
  updateFormula,
  deleteFormula,
  updateUserRole,
  banUser,
  FirestoreUser,
  FirestoreFormula,
} from '../services/firestore';
import { useElements } from '../src/contexts/ElementsContext';

const AdminPanel: React.FC = () => {
  const { t } = useTranslation();
  const { elements, source } = useElements();
  const [activeTab, setActiveTab] = useState<'users' | 'formulas' | 'elements' | 'logs'>('users');

  // Real data from Firestore
  const [users, setUsers] = useState<FirestoreUser[]>([]);
  const [formulas, setFormulas] = useState<FirestoreFormula[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingFormulas, setLoadingFormulas] = useState(true);

  // New formula form
  const [newFormulaName, setNewFormulaName] = useState('');
  const [newFormulaEq, setNewFormulaEq] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Editing formula
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editEq, setEditEq] = useState('');

  // Subscribe to real-time data
  useEffect(() => {
    const unsubUsers = subscribeToUsers(
      (data) => { setUsers(data); setLoadingUsers(false); },
      () => setLoadingUsers(false)
    );
    const unsubFormulas = subscribeToFormulas(
      (data) => { setFormulas(data); setLoadingFormulas(false); },
      () => setLoadingFormulas(false)
    );

    return () => { unsubUsers(); unsubFormulas(); };
  }, []);

  const handleAddFormula = async () => {
    if (!newFormulaName.trim() || !newFormulaEq.trim()) return;
    await addFormula({ name: newFormulaName, equation: newFormulaEq });
    setNewFormulaName('');
    setNewFormulaEq('');
    setShowAddForm(false);
  };

  const handleSaveFormula = async (id: string) => {
    await updateFormula(id, { name: editName, equation: editEq });
    setEditingId(null);
  };

  const handleDeleteFormula = async (id: string) => {
    await deleteFormula(id);
  };

  const handleToggleRole = async (uid: string, currentRole: 'admin' | 'user') => {
    await updateUserRole(uid, currentRole === 'admin' ? 'user' : 'admin');
  };

  const handleBanUser = async (uid: string, currentlyActive: boolean) => {
    await banUser(uid, currentlyActive);
  };

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

      <div className="flex gap-2 border-b border-slate-200 dark:border-zinc-600 pb-1 transition-colors overflow-x-auto">
        {(['users', 'formulas', 'elements', 'logs'] as const).map((tab) => {
          const icons = { users: <Users size={16} />, formulas: <FileText size={16} />, elements: <Atom size={16} />, logs: <Activity size={16} /> };
          const labels = { users: t('admin.users'), formulas: t('admin.formulaEditor'), elements: 'Элементы', logs: t('admin.logs') };
          return (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === tab ? 'bg-white dark:bg-zinc-800 border-x border-t border-slate-200 dark:border-zinc-600 text-slate-800 dark:text-zinc-100' : 'text-slate-500 dark:text-zinc-400'}`}>
              {icons[tab]}{labels[tab]}
            </button>
          );
        })}
      </div>

      <div className="bg-white dark:bg-zinc-800 rounded-b-xl min-h-[400px] transition-colors">
        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="overflow-x-auto">
            {loadingUsers ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="animate-spin text-slate-400" size={24} />
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-12 text-slate-500 dark:text-zinc-400">
                Нет пользователей в базе данных
              </div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-zinc-900 text-slate-500 dark:text-zinc-400 uppercase transition-colors">
                  <tr>
                    <th className="px-6 py-3">{t('admin.name')}</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">{t('admin.role')}</th>
                    <th className="px-6 py-3">Статус</th>
                    <th className="px-6 py-3">{t('admin.actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-700 transition-colors">
                  {users.map(u => (
                    <tr key={u.uid} className="hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-zinc-100">{u.displayName || '—'}</td>
                      <td className="px-6 py-4 text-slate-500 dark:text-zinc-400">{u.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${u.role === 'admin' ? 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300' : 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${u.isActive !== false ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300' : 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300'}`}>
                          {u.isActive !== false ? 'Активен' : 'Заблокирован'}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex gap-2">
                        <button
                          onClick={() => handleToggleRole(u.uid, u.role)}
                          className="text-indigo-500 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium transition-colors text-xs"
                        >
                          {u.role === 'admin' ? 'Снять админ' : 'Сделать админ'}
                        </button>
                        <button
                          onClick={() => handleBanUser(u.uid, u.isActive !== false)}
                          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium transition-colors text-xs"
                        >
                          {u.isActive !== false ? t('admin.ban') : 'Разбан'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Formulas Tab */}
        {activeTab === 'formulas' && (
          <div className="space-y-4">
            {loadingFormulas ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="animate-spin text-slate-400" size={24} />
              </div>
            ) : (
              <>
                {formulas.map((f) => (
                  <div key={f.id} className="flex gap-4 items-center p-3 bg-slate-50 dark:bg-zinc-900 rounded-lg border border-slate-200 dark:border-zinc-600 transition-colors">
                    {editingId === f.id ? (
                      <>
                        <input
                          className="flex-1 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-600 rounded px-3 py-2 text-slate-800 dark:text-zinc-100 transition-colors"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                        />
                        <input
                          className="flex-1 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-600 rounded px-3 py-2 font-mono text-slate-800 dark:text-zinc-100 transition-colors"
                          value={editEq}
                          onChange={(e) => setEditEq(e.target.value)}
                        />
                        <button onClick={() => handleSaveFormula(f.id)} className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900 rounded transition-colors">
                          <Save size={18} />
                        </button>
                        <button onClick={() => setEditingId(null)} className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded transition-colors text-lg">
                          &times;
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="flex-1 text-slate-800 dark:text-zinc-100">{f.name}</span>
                        <span className="flex-1 font-mono text-slate-600 dark:text-zinc-300">{f.equation}</span>
                        <button onClick={() => { setEditingId(f.id); setEditName(f.name); setEditEq(f.equation); }} className="p-2 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900 rounded transition-colors">
                          <FileText size={16} />
                        </button>
                        <button onClick={() => handleDeleteFormula(f.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900 rounded transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                ))}

                {showAddForm ? (
                  <div className="flex gap-4 items-center p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg border border-indigo-200 dark:border-indigo-700 transition-colors">
                    <input
                      className="flex-1 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-600 rounded px-3 py-2 text-slate-800 dark:text-zinc-100"
                      placeholder="Название формулы"
                      value={newFormulaName}
                      onChange={(e) => setNewFormulaName(e.target.value)}
                    />
                    <input
                      className="flex-1 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-600 rounded px-3 py-2 font-mono text-slate-800 dark:text-zinc-100"
                      placeholder="Формула (напр. PV = nRT)"
                      value={newFormulaEq}
                      onChange={(e) => setNewFormulaEq(e.target.value)}
                    />
                    <button onClick={handleAddFormula} className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900 rounded transition-colors">
                      <Save size={18} />
                    </button>
                    <button onClick={() => setShowAddForm(false)} className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded transition-colors text-lg">
                      &times;
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="w-full py-3 border-2 border-dashed border-slate-300 dark:border-zinc-600 rounded-lg text-slate-400 dark:text-zinc-500 hover:border-slate-400 dark:hover:border-zinc-500 hover:text-slate-500 dark:hover:text-zinc-400 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus size={18} />
                    {t('admin.addFormula')}
                  </button>
                )}
              </>
            )}
          </div>
        )}

        {/* Elements Tab */}
        {activeTab === 'elements' && (
          <div>
            <div className="mb-4 px-4 pt-4">
              <p className="text-sm text-slate-500 dark:text-zinc-400">
                Источник данных: <span className="font-medium text-slate-700 dark:text-zinc-200">{source === 'firestore' ? 'Firebase (реальное время)' : 'Локальные данные (fallback)'}</span>
              </p>
              <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
                Всего элементов: {elements.length}
              </p>
            </div>
            <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-zinc-900 text-slate-500 dark:text-zinc-400 uppercase transition-colors sticky top-0">
                  <tr>
                    <th className="px-4 py-3">N</th>
                    <th className="px-4 py-3">Символ</th>
                    <th className="px-4 py-3">Название</th>
                    <th className="px-4 py-3">Масса</th>
                    <th className="px-4 py-3">Категория</th>
                    <th className="px-4 py-3">Группа</th>
                    <th className="px-4 py-3">Период</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-700">
                  {elements.map((el) => (
                    <tr key={el.symbol} className="hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors">
                      <td className="px-4 py-2 text-slate-500 dark:text-zinc-400">{el.number}</td>
                      <td className="px-4 py-2 font-bold text-slate-800 dark:text-zinc-100">{el.symbol}</td>
                      <td className="px-4 py-2 text-slate-700 dark:text-zinc-200">{el.name}</td>
                      <td className="px-4 py-2 font-mono text-slate-600 dark:text-zinc-300">{el.mass}</td>
                      <td className="px-4 py-2 text-slate-500 dark:text-zinc-400 text-xs">{el.category}</td>
                      <td className="px-4 py-2 text-slate-500 dark:text-zinc-400">{el.group}</td>
                      <td className="px-4 py-2 text-slate-500 dark:text-zinc-400">{el.period}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Logs Tab */}
        {activeTab === 'logs' && (
          <div className="bg-slate-900 dark:bg-zinc-950 text-slate-300 dark:text-zinc-300 font-mono text-xs p-4 rounded-xl h-[400px] overflow-y-auto transition-colors">
            <p className="text-slate-500 mb-4">Логи загружаются из Firebase Analytics...</p>
            <p className="text-slate-600">Для просмотра логов перейдите в <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="text-indigo-400 underline">Firebase Console</a></p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
