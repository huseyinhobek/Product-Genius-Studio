
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { GeneratedProduct } from '../types';
import { Download, Maximize2, X, RefreshCw, Layers } from 'lucide-react';

interface Props {
  product: GeneratedProduct;
}

const ProductDisplay: React.FC<Props> = ({ product }) => {
  const [showOriginal, setShowOriginal] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-white/10 group relative">
        <div className="relative aspect-square bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          <img 
            src={showOriginal ? product.originalImage : product.data} 
            className="w-full h-full object-contain transition-all duration-500"
            alt="Product visual"
          />
          
          <div className="absolute top-4 right-4 flex gap-2">
            <button 
              onMouseDown={() => setShowOriginal(true)}
              onMouseUp={() => setShowOriginal(false)}
              onMouseLeave={() => setShowOriginal(false)}
              className="p-3 bg-white/10 backdrop-blur-md text-white rounded-xl hover:bg-white/20 transition-all"
              title="Hold to see original"
            >
              <Layers className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setIsFullscreen(true)}
              className="p-3 bg-white/10 backdrop-blur-md text-white rounded-xl hover:bg-white/20 transition-all"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
            <div className="bg-black/40 backdrop-blur-md p-3 rounded-2xl text-white">
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Project</p>
              <p className="text-sm font-bold truncate max-w-[200px]">{product.businessType} • {product.style}</p>
            </div>
            
            <a 
              href={product.data} 
              download={`product-genius-${product.id}.png`}
              className="bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-2xl shadow-lg transition-all"
            >
              <Download className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 p-4 bg-indigo-50 dark:bg-indigo-500/5 rounded-2xl border border-indigo-100 dark:border-indigo-500/20">
        <RefreshCw className="w-5 h-5 text-indigo-500 flex-shrink-0" />
        <p className="text-xs text-indigo-900 dark:text-indigo-300">
          <strong>Tip:</strong> You can hold the layer icon to compare the AI-refined visual with your original upload.
        </p>
      </div>

      {isFullscreen && (
        <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center p-8 animate-in fade-in duration-300">
          <button onClick={() => setIsFullscreen(false)} className="absolute top-8 right-8 text-white p-2 hover:bg-white/10 rounded-full transition-all">
            <X className="w-8 h-8" />
          </button>
          <img src={product.data} className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" alt="Fullscreen preview" />
        </div>
      )}
    </div>
  );
};

export default ProductDisplay;
