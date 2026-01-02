
import React, { useState, useRef, useEffect } from 'react';
import { User, BusinessType, SceneStyle, ImageQuality, GeneratedProduct, PackageType } from '../types';
import { generateProductVisual } from '../services/geminiService';
import ProductDisplay from './ProductDisplay';
import Loading from './Loading';
import { 
  Upload, Image as ImageIcon, Settings, Sparkles, AlertCircle, History, 
  Cpu, Footprints, Shirt, Heart, Gem, Home, Droplets, Star, CreditCard, X, Calendar
} from 'lucide-react';

interface Props {
  user: User;
  onRefresh: () => void;
}

const Dashboard: React.FC<Props> = ({ user, onRefresh }) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [businessType, setBusinessType] = useState<BusinessType>('Electronics');
  const [sceneStyle, setSceneStyle] = useState<SceneStyle>('Studio');
  const [imageQuality, setImageQuality] = useState<ImageQuality>('1K');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<GeneratedProduct[]>([]);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedFile(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleUpgradeRequest = (pkg: PackageType) => {
    const usersDb = JSON.parse(localStorage.getItem('pg_users_db') || '[]');
    const idx = usersDb.findIndex((u: User) => u.id === user.id);
    if (idx !== -1) {
      usersDb[idx].paymentPending = true;
      usersDb[idx].requestedPackage = pkg;
      localStorage.setItem('pg_users_db', JSON.stringify(usersDb));
      onRefresh();
      setShowUpgradeModal(false);
    }
  };

  const isExpired = user.expiryDate && new Date(user.expiryDate) < new Date();

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user.credits <= 0 || isExpired) {
      setError("Krediniz bitti veya üyeliğiniz sona erdi. Lütfen paket yenileyin.");
      return;
    }

    // API anahtarı kontrolü - window.aistudio sadece Google AI Studio ortamında mevcut
    // Yerel geliştirme ortamında .env dosyasından API_KEY kullanılır
    if (window.aistudio) {
      if (!(await window.aistudio.hasSelectedApiKey())) {
        await window.aistudio.openSelectKey();
      }
    }

    setIsLoading(true);
    setError(null);

    try {
      const resultData = await generateProductVisual(selectedFile!, businessType, sceneStyle, imageQuality, customPrompt);
      
      const usersDb = JSON.parse(localStorage.getItem('pg_users_db') || '[]');
      const idx = usersDb.findIndex((u: User) => u.id === user.id);
      if (idx !== -1) {
        usersDb[idx].credits -= 1;
        localStorage.setItem('pg_users_db', JSON.stringify(usersDb));
        onRefresh();
      }

      const newProduct: GeneratedProduct = {
        id: Date.now().toString(),
        data: resultData,
        originalImage: selectedFile!,
        prompt: customPrompt || `${businessType} in ${sceneStyle} style`,
        timestamp: Date.now(),
        businessType,
        style: sceneStyle,
        quality: imageQuality
      };

      setHistory([newProduct, ...history]);
    } catch (err: any) {
      if (err.message?.includes("Requested entity was not found")) {
        setError("API anahtarı bulunamadı veya yetkisiz.");
        // window.aistudio sadece Google AI Studio ortamında mevcut
        if (window.aistudio) {
          await window.aistudio.openSelectKey();
        }
      } else {
        setError(err.message || "Oluşturma hatası.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const businessIcons: Record<BusinessType, React.ReactNode> = {
    Electronics: <Cpu className="w-4 h-4" />,
    Footwear: <Footprints className="w-4 h-4" />,
    Fashion: <Shirt className="w-4 h-4" />,
    Lingerie: <Heart className="w-4 h-4" />,
    Handbags: <Star className="w-4 h-4" />,
    Jewelry: <Gem className="w-4 h-4" />,
    Accessories: <Star className="w-4 h-4" />,
    HomeDecor: <Home className="w-4 h-4" />,
    Cosmetics: <Droplets className="w-4 h-4" />
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {/* Stats Bar */}
      <div className="mb-8 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-3xl flex flex-wrap items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-slate-400">Paket</span>
            <span className="text-sm font-bold text-indigo-500 uppercase">{user.package === 'free' ? 'Ücretsiz Deneme' : `${user.package.replace('m', ' Aylık')} Plan`}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-slate-400">Kalan Kredi</span>
            <span className={`text-sm font-bold ${user.credits < 5 ? 'text-red-500 animate-pulse' : 'text-slate-900 dark:text-white'}`}>{user.credits} Görsel</span>
          </div>
          {user.expiryDate && (
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-slate-400">Bitiş Tarihi</span>
              <span className="text-sm font-bold flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {new Date(user.expiryDate).toLocaleDateString('tr-TR')}
              </span>
            </div>
          )}
        </div>

        <button 
          onClick={() => setShowUpgradeModal(true)}
          disabled={user.paymentPending}
          className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${user.paymentPending ? 'bg-slate-100 text-slate-400' : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20'}`}
        >
          {user.paymentPending ? 'Onay Bekleniyor...' : 'Kredi Satın Al / Yenile'}
        </button>
      </div>

      <div className={`grid gap-8 ${history.length > 0 ? 'lg:grid-cols-2' : 'max-w-3xl mx-auto'}`}>
        <section className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-200 dark:border-white/5">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Settings className="w-5 h-5 text-indigo-500" /> Stüdyo Ayarları
            </h2>
            <form onSubmit={handleGenerate} className="space-y-6">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-2xl p-8 cursor-pointer flex flex-col items-center justify-center gap-4 transition-all ${selectedFile ? 'border-indigo-500 bg-indigo-500/5' : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400'}`}
              >
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                {selectedFile ? (
                  <img src={selectedFile} className="h-48 w-48 object-contain rounded-lg" alt="Upload" />
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-slate-400" />
                    <p className="font-bold">Ürün Görseli Yükleyin</p>
                  </>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(businessIcons) as BusinessType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setBusinessType(type)}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${businessType === type ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'}`}
                  >
                    {businessIcons[type]}
                    <span className="text-[9px] font-bold uppercase truncate w-full text-center">{type}</span>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <select value={sceneStyle} onChange={(e) => setSceneStyle(e.target.value as SceneStyle)} className="w-full bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3 outline-none border border-slate-100 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500">
                  <option value="Studio">Profesyonel Stüdyo</option>
                  <option value="Lifestyle">Günlük Yaşam</option>
                  <option value="Luxury">Lüks & Altın</option>
                  <option value="Nature">Doğal Ortam</option>
                  <option value="Urban">Şehir/Sokak</option>
                </select>
                <select value={imageQuality} onChange={(e) => setImageQuality(e.target.value as ImageQuality)} className="w-full bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3 outline-none border border-slate-100 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500">
                  <option value="1K">Standart (1K)</option>
                  <option value="2K">Pro (2K)</option>
                  <option value="4K">Ultra (4K)</option>
                </select>
              </div>

              <textarea value={customPrompt} onChange={(e) => setCustomPrompt(e.target.value)} placeholder="Örn: Arka plana hafif sis ekle, gümüş detayları vurgula..." className="w-full bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3 min-h-[80px] border border-slate-100 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500" />

              <button 
                disabled={isLoading || !selectedFile || user.credits <= 0 || isExpired}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl hover:bg-indigo-500 transition-all disabled:opacity-50"
              >
                {isLoading ? 'OLUŞTURULUYOR...' : (user.credits <= 0 || isExpired) ? 'PAKET YETERSİZ' : 'ÇEKİM OLUŞTUR'}
              </button>
            </form>
          </div>
        </section>

        <section>
          {isLoading ? (
            <Loading status="AI Stüdyo Hazırlanıyor..." step={1} facts={["Işık ayarları yapılıyor...", "Ürün dokusu korunuyor...", "Yüksek çözünürlük uygulanıyor..."]} />
          ) : history.length > 0 ? (
            <ProductDisplay product={history[0]} />
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-12 bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
              <ImageIcon className="w-12 h-12 text-slate-300 mb-6" />
              <h3 className="text-xl font-bold">Stüdyo Önizleme</h3>
              <p className="text-slate-400 text-sm mt-2">Görselinizi yükleyip çekim butonuna bastığınızda sonuçlar burada belirecektir.</p>
            </div>
          )}
        </section>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden border border-slate-200 dark:border-white/5 animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-slate-100 dark:border-white/5 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold">Paket Seçimi Yapın</h3>
                <p className="text-slate-500 text-sm">Üyelik süresi ve kredi miktarı API maliyetlerine göre ayarlanmıştır.</p>
              </div>
              <button onClick={() => setShowUpgradeModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-8 grid sm:grid-cols-2 gap-4">
              {[
                { id: '1m' as PackageType, title: '1 Aylık', price: '149 TL', desc: '25 Profesyonel Görsel' },
                { id: '3m' as PackageType, title: '3 Aylık', price: '399 TL', desc: '80 Profesyonel Görsel' },
                { id: '6m' as PackageType, title: '6 Aylık', price: '699 TL', desc: '150 Profesyonel Görsel' },
                { id: '12m' as PackageType, title: 'Yıllık Pro', price: '1299 TL', desc: '350 Profesyonel Görsel', badge: 'En İyi Fiyat' }
              ].map(pkg => (
                <button 
                  key={pkg.id}
                  onClick={() => handleUpgradeRequest(pkg.id)}
                  className="group p-6 text-left border-2 border-slate-100 dark:border-slate-800 rounded-3xl hover:border-indigo-600 transition-all flex flex-col gap-2 relative overflow-hidden"
                >
                  {pkg.badge && <div className="absolute top-2 right-2 bg-emerald-500 text-white text-[8px] font-bold px-2 py-0.5 rounded-full">{pkg.badge}</div>}
                  <div className="font-bold text-lg">{pkg.title}</div>
                  <div className="text-2xl font-bold text-indigo-600">{pkg.price}</div>
                  <div className="text-xs text-slate-500">{pkg.desc}</div>
                </button>
              ))}
            </div>
            
            <div className="p-8 bg-slate-50 dark:bg-slate-800/50 flex items-center gap-4">
               <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl text-indigo-600 dark:text-indigo-400">
                  <CreditCard className="w-6 h-6" />
               </div>
               <p className="text-[10px] text-slate-500 leading-relaxed">Başvurunuz sonrası IBAN/Ödeme bilgileri admin tarafından paylaşılacaktır. Onaylandığında kredileriniz hesabınıza tanımlanır.</p>
            </div>
          </div>
        </div>
      )}

      {error && <div className="fixed bottom-6 right-6 bg-red-500 text-white p-4 rounded-2xl flex items-center gap-3 shadow-2xl animate-in slide-in-from-right-8"><AlertCircle className="w-5 h-5" /> {error}</div>}
    </main>
  );
};

export default Dashboard;
