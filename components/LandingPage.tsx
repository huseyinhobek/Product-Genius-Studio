
import React from 'react';
import { ArrowRight, CheckCircle2, Star, Sparkles, Camera, BarChart3, Zap, ShieldCheck } from 'lucide-react';

interface Props {
  onStart: () => void;
}

const LandingPage: React.FC<Props> = ({ onStart }) => {
  return (
    <div className="relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-indigo-500/10 to-transparent blur-3xl -z-10"></div>
      
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg"><Camera className="w-6 h-6 text-white" /></div>
          <span className="font-bold text-xl tracking-tighter">ProductGenius <span className="text-indigo-600">Studio</span></span>
        </div>
        <button onClick={onStart} className="bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-6 py-2 rounded-full font-bold hover:scale-105 transition-transform">İşletme Girişi</button>
      </nav>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-32 text-center relative z-10">
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-full text-sm font-bold mb-8">
          <Sparkles className="w-4 h-4" /> Profesyonel E-Ticaret Görsel Çözümü
        </div>
        <h1 className="text-5xl md:text-8xl font-bold tracking-tight mb-8 leading-[1.05]">
          Katalog Çekimlerinizi <span className="text-indigo-600">AI</span> İle Dönüştürün
        </h1>
        <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 mb-12 max-w-2xl mx-auto">
          Stüdyo kiralamaya ve saatlerce süren çekimlere son. Ürünlerinizi yükleyin, saniyeler içinde satışa hazır profesyonel görsellerinizi alın.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button onClick={onStart} className="w-full sm:w-auto px-10 py-5 bg-indigo-600 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl shadow-indigo-600/30 hover:bg-indigo-500 transition-all">
            Hemen Ücretsiz Deneyin <ArrowRight className="w-5 h-5" />
          </button>
        </div>
        <p className="mt-4 text-sm font-medium text-slate-400 italic">Yeni üyeler için 1 adet deneme görseli ücretsizdir.</p>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Size Uygun Paketi Seçin</h2>
          <p className="text-slate-500 mb-16 italic">Profesyonel stüdyo maliyetlerinin %90 altında, daha hızlı ve kaliteli.</p>
          
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { title: "Başlangıç", price: "149", duration: "1 Ay", credits: "25 Görsel Kredisi", desc: "Küçük butikler için ideal" },
              { title: "Büyüyen", price: "399", duration: "3 Ay", credits: "80 Görsel Kredisi", desc: "Popüler Paket", discount: "%15 Tasarruf" },
              { title: "Profesyonel", price: "699", duration: "6 Ay", credits: "150 Görsel Kredisi", desc: "Geniş Envanter", discount: "%25 Tasarruf" },
              { title: "Kurumsal", price: "1299", duration: "12 Ay", credits: "350 Görsel Kredisi", desc: "Tam Çözüm", featured: true, discount: "Kampanya: 12 Ay Al 10 Öde!" }
            ].map((pkg, i) => (
              <div key={i} className={`bg-white dark:bg-slate-800 p-8 rounded-[32px] border-2 transition-all flex flex-col text-left ${pkg.featured ? 'border-indigo-600 shadow-2xl scale-105' : 'border-transparent hover:border-slate-200 shadow-sm'}`}>
                {pkg.featured && <div className="bg-indigo-600 text-white text-[10px] font-bold uppercase py-1 px-3 rounded-full self-start mb-4">En Popüler</div>}
                <h3 className="text-xl font-bold mb-1">{pkg.title}</h3>
                <div className="text-slate-400 text-xs mb-6">{pkg.duration}</div>
                <div className="text-4xl font-bold mb-2">{pkg.price} TL</div>
                {pkg.discount && <div className="text-emerald-500 text-[10px] font-bold mb-6">{pkg.discount}</div>}
                
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-indigo-500" /> <b>{pkg.credits}</b></li>
                  <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-indigo-500" /> 4K Ultra Çözünürlük</li>
                  <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-indigo-500" /> Ticari Kullanım Hakları</li>
                  <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-indigo-500" /> Öncelikli AI Render</li>
                </ul>
                
                <button onClick={onStart} className={`w-full py-3 rounded-xl font-bold transition-all ${pkg.featured ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600'}`}>
                  Başvur
                </button>
              </div>
            ))}
          </div>
          
          <div className="mt-12 p-6 bg-white dark:bg-slate-800 rounded-2xl max-w-2xl mx-auto border border-slate-200 dark:border-white/5 flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-full"><ShieldCheck className="w-6 h-6 text-emerald-500" /></div>
            <p className="text-sm text-slate-500 text-left">Fiyatlarımız API maliyetlerine göre optimize edilmiştir. Satın aldığınız krediler üyelik süresince geçerlidir ve devredilemez.</p>
          </div>
        </div>
      </section>

      <footer className="py-20 border-t border-slate-200 dark:border-white/10 text-center text-slate-400 text-sm">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Zap className="w-4 h-4 text-amber-500" />
          <span className="font-bold text-slate-900 dark:text-white">ProductGenius AI Studio</span>
        </div>
        &copy; 2024 AWS Ubuntu & Docker Safe.
      </footer>
    </div>
  );
};

export default LandingPage;
