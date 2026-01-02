
import React, { useState } from 'react';
import { User, UserRole, PackageType } from '../types';
import { ArrowLeft, Lock, Mail, Building2 } from 'lucide-react';

interface Props {
  onSuccess: (user: User) => void;
  onBack: () => void;
}

const Auth: React.FC<Props> = ({ onSuccess, onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock Database logic using LocalStorage
    const usersDb = JSON.parse(localStorage.getItem('pg_users_db') || '[]');
    
    if (isLogin) {
      if (email === 'admin@productgenius.com' && password === 'admin123') {
        const admin: User = { 
          id: 'admin', 
          email: 'admin@productgenius.com', 
          businessName: 'Sistem Yöneticisi', 
          role: 'admin', 
          credits: 9999, 
          package: '12m', 
          expiryDate: '2099-01-01', 
          paymentPending: false,
          requestedPackage: null
        };
        onSuccess(admin);
        return;
      }

      const existing = usersDb.find((u: User) => u.email === email);
      if (existing) {
        onSuccess(existing);
      } else {
        alert("Hesap bulunamadı. Lütfen kayıt olun.");
      }
    } else {
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        businessName,
        role: 'business',
        credits: 1, 
        package: 'free',
        expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 day trial
        paymentPending: false,
        requestedPackage: null
      };
      usersDb.push(newUser);
      localStorage.setItem('pg_users_db', JSON.stringify(usersDb));
      onSuccess(newUser);
    }
  };

  return (
    <div className="max-w-md mx-auto pt-20 px-6">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-8 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Anasayfaya Dön
      </button>

      <div className="bg-white dark:bg-slate-900 p-10 rounded-[40px] shadow-2xl border border-slate-200 dark:border-white/5">
        <h2 className="text-3xl font-bold mb-2 tracking-tight">{isLogin ? 'Hoş Geldiniz' : 'Hesap Oluşturun'}</h2>
        <p className="text-slate-500 text-sm mb-10">{isLogin ? 'Ürün çekimlerinize devam edin.' : 'Ücretsiz görselinizle AI gücünü keşfedin.'}</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">İşletme Adı</label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input 
                  required
                  type="text" 
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium" 
                  placeholder="Butik / Marka Adı"
                />
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">E-Posta</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
              <input 
                required
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium" 
                placeholder="isletme@domain.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Şifre</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
              <input 
                required
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium" 
                placeholder="••••••••"
              />
            </div>
          </div>

          <button type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 transition-all mt-6 text-lg">
            {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
          </button>
        </form>

        <div className="mt-10 pt-10 border-t border-slate-100 dark:border-white/5 text-center">
            <p className="text-sm text-slate-500">
                {isLogin ? 'Henüz hesabınız yok mu?' : 'Zaten üye misiniz?'} 
                <button onClick={() => setIsLogin(!isLogin)} className="ml-2 text-indigo-600 font-bold hover:underline transition-all">
                    {isLogin ? 'Ücretsiz Kayıt Ol' : 'Giriş Yap'}
                </button>
            </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
