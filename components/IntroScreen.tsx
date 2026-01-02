
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import { Camera, Sparkles, Play } from 'lucide-react';

interface IntroScreenProps {
  onComplete: () => void;
}

const IntroScreen: React.FC<IntroScreenProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState(0); 

  useEffect(() => {
    const timer1 = setTimeout(() => setPhase(1), 1000); 
    const timer2 = setTimeout(() => setPhase(2), 3000); 

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center overflow-hidden font-display">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-black"></div>
      
      <div className="relative flex flex-col items-center gap-12 text-center p-6">
        <div className={`transition-all duration-1000 ${phase >= 1 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-600 blur-[60px] opacity-40 animate-pulse"></div>
            <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-[40px] flex items-center justify-center shadow-2xl relative z-10">
              <Camera className="w-16 h-16 md:w-20 md:h-20 text-white" />
              <div className="absolute -top-4 -right-4 bg-amber-400 p-3 rounded-2xl animate-bounce">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className={`space-y-4 transition-all duration-1000 ${phase >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h1 className="text-4xl md:text-7xl font-bold text-white tracking-tight">
            ProductGenius <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Studio</span>
          </h1>
          <p className="text-slate-400 uppercase tracking-[0.4em] text-sm md:text-lg">Professional Visuals. Instantly.</p>
          
          <div className="pt-12">
            <button 
              onClick={onComplete}
              className="group relative px-10 py-4 bg-indigo-600 rounded-2xl text-white font-bold tracking-widest text-lg overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-indigo-600/30"
            >
              <div className="relative flex items-center gap-3">
                <span>ENTER STUDIO</span>
                <Play className="w-5 h-5 fill-current" />
              </div>
            </button>
          </div>
        </div>
      </div>

      <button onClick={onComplete} className="absolute top-8 right-8 text-slate-500 hover:text-white text-xs uppercase tracking-widest transition-colors">Skip Intro</button>
    </div>
  );
};

export default IntroScreen;
