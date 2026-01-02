
import React, { useState, useEffect } from 'react';
import { User, PackageType } from '../types';
import { 
  ShieldCheck, CheckCircle, Trash2, Calendar, CreditCard, Clock, 
  UserCheck, UserPlus, Edit3, X, Save, Plus, Minus, Search
} from 'lucide-react';

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Form states
  const [newUser, setNewUser] = useState({ businessName: '', email: '', password: '' });

  useEffect(() => {
    const usersDb = JSON.parse(localStorage.getItem('pg_users_db') || '[]');
    setUsers(usersDb);
  }, []);

  const saveToDb = (updatedUsers: User[]) => {
    setUsers(updatedUsers);
    localStorage.setItem('pg_users_db', JSON.stringify(updatedUsers));
  };

  const getPackageCredits = (pkg: PackageType): number => {
    switch(pkg) {
      case '1m': return 25;
      case '3m': return 80;
      case '6m': return 150;
      case '12m': return 350;
      default: return 1;
    }
  };

  const getExpiryDate = (pkg: PackageType): string => {
    const date = new Date();
    switch(pkg) {
      case '1m': date.setMonth(date.getMonth() + 1); break;
      case '3m': date.setMonth(date.getMonth() + 3); break;
      case '6m': date.setMonth(date.getMonth() + 6); break;
      case '12m': date.setMonth(date.getMonth() + 12); break;
      default: date.setDate(date.getDate() + 7); break;
    }
    return date.toISOString();
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (users.some(u => u.email === newUser.email)) {
      alert("Bu e-posta zaten kayıtlı!");
      return;
    }

    const created: User = {
      id: Math.random().toString(36).substr(2, 9),
      email: newUser.email,
      businessName: newUser.businessName,
      role: 'business',
      credits: 1,
      package: 'free',
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      paymentPending: false,
      requestedPackage: null
    };

    saveToDb([...users, created]);
    setIsCreateModalOpen(false);
    setNewUser({ businessName: '', email: '', password: '' });
  };

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    const updated = users.map(u => u.id === selectedUser.id ? selectedUser : u);
    saveToDb(updated);
    setIsEditModalOpen(false);
    setSelectedUser(null);
  };

  const approvePackage = (userId: string, pkg: PackageType) => {
    const updated = users.map(u => {
      if (u.id === userId) {
        return { 
          ...u, 
          package: pkg, 
          credits: getPackageCredits(pkg), 
          expiryDate: getExpiryDate(pkg),
          paymentPending: false,
          requestedPackage: null
        };
      }
      return u;
    });
    saveToDb(updated);
  };

  const deleteUser = (userId: string) => {
    if (!confirm("Kullanıcıyı silmek istediğinize emin misiniz?")) return;
    const updated = users.filter(u => u.id !== userId);
    saveToDb(updated);
  };

  const filteredUsers = users.filter(u => 
    u.businessName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const packageLabels: Record<PackageType, string> = {
    'free': 'Deneme',
    '1m': 'Aylık',
    '3m': '3 Aylık',
    '6m': '6 Aylık',
    '12m': 'Yıllık'
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">İşletme Yönetimi</h1>
          <p className="text-slate-500 mt-2">Kredi tanımlama ve manuel kullanıcı işlemlerini yapın.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="İşletme veya e-posta ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 w-64"
            />
          </div>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20"
          >
            <UserPlus className="w-4 h-4" /> Yeni İşletme Ekle
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-slate-400 font-bold uppercase text-[10px] tracking-widest">
            <UserCheck className="w-4 h-4" /> Kayıtlı Müşteri
          </div>
          <div className="text-4xl font-bold">{users.length}</div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-amber-500 font-bold uppercase text-[10px] tracking-widest">
            <Clock className="w-4 h-4" /> Bekleyen Ödeme
          </div>
          <div className="text-4xl font-bold">{users.filter(u => u.paymentPending).length}</div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-indigo-500 font-bold uppercase text-[10px] tracking-widest">
            <ShieldCheck className="w-4 h-4" /> Sistem Yetkisi
          </div>
          <div className="text-xl font-bold">Admin Panel v2.0</div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl border border-slate-200 dark:border-white/5 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
            <tr>
              <th className="px-8 py-6">İşletme / E-Posta</th>
              <th className="px-8 py-6">Kredi Durumu</th>
              <th className="px-8 py-6">Plan / Talep</th>
              <th className="px-8 py-6">Üyelik Bitiş</th>
              <th className="px-8 py-6 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {filteredUsers.length === 0 ? (
              <tr><td colSpan={5} className="px-8 py-32 text-center text-slate-400">Aranan kriterde işletme bulunamadı.</td></tr>
            ) : (
              filteredUsers.map(u => (
                <tr key={u.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-8 py-6">
                    <div className="font-bold text-slate-900 dark:text-white">{u.businessName}</div>
                    <div className="text-[10px] text-slate-500">{u.email}</div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${u.credits < 5 ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                        {u.credits} Kredi
                        </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    {u.paymentPending ? (
                      <div className="flex flex-col gap-1">
                        <span className="flex items-center gap-1.5 text-amber-500 font-bold text-[11px] animate-pulse">
                          <Clock className="w-3.5 h-3.5" /> {packageLabels[u.requestedPackage || 'free']} Onayı Bekliyor
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-500 font-bold text-[11px] flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-indigo-500" /> {packageLabels[u.package]} Plan
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-6 text-sm">
                    {u.expiryDate ? (
                        <div className={`font-medium ${new Date(u.expiryDate) < new Date() ? 'text-red-500' : 'text-slate-600'}`}>
                            {new Date(u.expiryDate).toLocaleDateString('tr-TR')}
                        </div>
                    ) : '—'}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      {u.paymentPending && (
                        <button 
                          onClick={() => approvePackage(u.id, u.requestedPackage!)}
                          className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-emerald-500"
                        >
                          Ödemeyi Onayla
                        </button>
                      )}
                      <button 
                        onClick={() => {
                            setSelectedUser({...u});
                            setIsEditModalOpen(true);
                        }}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        title="Düzenle / Kredi Ekle"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => deleteUser(u.id)}
                        className="p-2 text-slate-300 hover:text-red-500 transition-all"
                        title="Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create User Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden border border-slate-200 dark:border-white/5 animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 dark:border-white/5 flex justify-between items-center">
              <h3 className="text-xl font-bold">Yeni İşletme Hesabı</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">İşletme Adı</label>
                <input required type="text" value={newUser.businessName} onChange={(e) => setNewUser({...newUser, businessName: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">E-Posta</label>
                <input required type="email" value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Şifre</label>
                <input required type="password" placeholder="••••••••" value={newUser.password} onChange={(e) => setNewUser({...newUser, password: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl outline-none" />
              </div>
              <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-500">
                Müşteriyi Kaydet
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden border border-slate-200 dark:border-white/5 animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 dark:border-white/5 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">Kullanıcı Düzenle</h3>
                <p className="text-xs text-slate-500">{selectedUser.email}</p>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUpdateUser} className="p-6 space-y-6">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">İşletme Adı</label>
                <input required type="text" value={selectedUser.businessName} onChange={(e) => setSelectedUser({...selectedUser, businessName: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl outline-none" />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 block mb-2">Kredi Tanımlama</label>
                <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                    <button type="button" onClick={() => setSelectedUser({...selectedUser, credits: Math.max(0, selectedUser.credits - 1)})} className="p-2 bg-white dark:bg-slate-700 rounded-lg shadow hover:bg-red-50 text-red-500"><Minus className="w-4 h-4" /></button>
                    <input 
                        type="number" 
                        value={selectedUser.credits} 
                        onChange={(e) => setSelectedUser({...selectedUser, credits: parseInt(e.target.value) || 0})}
                        className="flex-1 bg-transparent text-center font-bold text-2xl outline-none"
                    />
                    <button type="button" onClick={() => setSelectedUser({...selectedUser, credits: selectedUser.credits + 1})} className="p-2 bg-white dark:bg-slate-700 rounded-lg shadow hover:bg-emerald-50 text-emerald-500"><Plus className="w-4 h-4" /></button>
                </div>
                <p className="text-[10px] text-slate-500 mt-2 text-center">Müşteri kredilerini manuel olarak artırabilir veya azaltabilirsiniz.</p>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Üyelik Bitiş Tarihi</label>
                <input 
                    type="date" 
                    value={selectedUser.expiryDate ? selectedUser.expiryDate.split('T')[0] : ''} 
                    onChange={(e) => setSelectedUser({...selectedUser, expiryDate: new Date(e.target.value).toISOString()})}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl outline-none" 
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl font-bold">Vazgeç</button>
                <button type="submit" className="flex-[2] py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2">
                    <Save className="w-4 h-4" /> Değişiklikleri Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
