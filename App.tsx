
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import { User, AppView } from './types';
import LandingPage from './components/LandingPage';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import { Sun, Moon, LogOut, User as UserIcon, Shield } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    const savedUser = localStorage.getItem('pg_user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);
      setView('dashboard');
    }
  }, [isDarkMode]);

  const handleAuthSuccess = (u: User) => {
    setUser(u);
    localStorage.setItem('pg_user', JSON.stringify(u));
    setView(u.role === 'admin' ? 'admin' : 'dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('pg_user');
    setView('landing');
  };

  const refreshUser = () => {
    const allUsers = JSON.parse(localStorage.getItem('pg_users_db') || '[]');
    const updated = allUsers.find((u: User) => u.id === user?.id);
    if (updated) {
      setUser(updated);
      localStorage.setItem('pg_user', JSON.stringify(updated));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 transition-colors">
      {/* Universal Header for Logged-in Users */}
      {user && view !== 'landing' && (
        <header className="border-b border-slate-200 dark:border-white/10 sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-slate-950/60 h-16 flex items-center px-4 sm:px-6">
          <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView(user.role === 'admin' ? 'admin' : 'dashboard')}>
              <div className="bg-indigo-600 p-1.5 rounded-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h1 className="font-bold text-lg hidden sm:block">ProductGenius <span className="text-indigo-500">Pro</span></h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex flex-col items-end mr-2">
                <span className="text-xs font-bold text-slate-500">{user.businessName}</span>
                <span className="text-[10px] uppercase text-indigo-500 font-bold">
                  {user.isPro ? 'Pro Member' : `Credits: ${user.credits}`}
                </span>
              </div>
              <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              {user.role === 'admin' && view !== 'admin' && (
                <button onClick={() => setView('admin')} className="text-xs font-bold bg-slate-200 dark:bg-slate-800 px-3 py-1.5 rounded-lg">Admin</button>
              )}
              <button onClick={handleLogout} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>
      )}

      {view === 'landing' && <LandingPage onStart={() => setView('auth')} />}
      {view === 'auth' && <Auth onSuccess={handleAuthSuccess} onBack={() => setView('landing')} />}
      {view === 'dashboard' && user && <Dashboard user={user} onRefresh={refreshUser} />}
      {view === 'admin' && user?.role === 'admin' && <AdminPanel />}
    </div>
  );
};

export default App;
