
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useEffect, useState } from 'react';
import { Loader2, Sparkles, Camera, Layers, Palette } from 'lucide-react';

interface LoadingProps {
  status: string;
  step: number;
  facts?: string[];
}

const Loading: React.FC<LoadingProps> = ({ status, step, facts = [] }) => {
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  
  useEffect(() => {
    if (facts.length > 0) {
      const interval = setInterval(() => {
        setCurrentFactIndex((prev) => (prev + 1) % facts.length);
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [facts]);

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[400px] bg-white/50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-white/5 backdrop-blur-xl p-12 text-center animate-in fade-in zoom-in duration-500">
      
      <div className="relative mb-12">
        <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-20 animate-pulse"></div>
        <div className="relative w-24 h-24 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-600/40 transform rotate-12 animate-bounce">
          <Camera className="w-12 h-12 text-white -rotate-12" />
        </div>
        <div className="absolute -top-4 -right-4 bg-amber-400 p-2 rounded-xl shadow-lg animate-pulse">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
      </div>

      <div className="space-y-2 mb-8">
        <h3 className="text-xl font-bold dark:text-white flex items-center justify-center gap-2">
          {status}
        </h3>
        <p className="text-slate-500 text-sm font-medium">Please wait while the AI Studio polishes your shot.</p>
      </div>

      <div className="w-full max-w-xs space-y-4">
        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-600 transition-all duration-1000 ease-out"
            style={{ width: `${Math.min(step * 33 + 10, 100)}%` }}
          />
        </div>
        
        <div className="min-h-[60px] flex items-center justify-center px-4">
          <div key={currentFactIndex} className="animate-in slide-in-from-bottom-2 fade-in duration-500 text-indigo-600 dark:text-indigo-400 font-bold text-sm italic">
            {facts[currentFactIndex] || "Initializing photorealistic renderer..."}
          </div>
        </div>
      </div>

      <div className="mt-8 flex gap-4 opacity-40">
        <Layers className="w-4 h-4 animate-pulse" />
        <Palette className="w-4 h-4 animate-pulse delay-75" />
        <Loader2 className="w-4 h-4 animate-spin delay-150" />
      </div>
    </div>
  );
};

export default Loading;
