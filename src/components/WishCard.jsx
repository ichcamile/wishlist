import React from 'react';
import { Gift, Heart, Trash2, ExternalLink } from 'lucide-react';

export default function WishCard({ wish, onTogglePurchased, onDelete }) {
  return (
    <div className={`group bg-white rounded-[24px] shadow-[0_2px_20px_rgba(0,0,0,0.03)] border border-zinc-100/80 overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] ${wish.isPurchased ? 'opacity-60 grayscale-[0.3]' : ''}`}>
      <div className="relative aspect-square w-full bg-zinc-50 overflow-hidden">
        {wish.imageUrl ? (
          <img 
            src={wish.imageUrl} 
            alt={wish.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            onError={(e) => {
              e.target.onerror = null; 
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div className={`w-full h-full flex flex-col items-center justify-center text-zinc-300 bg-zinc-100/50 ${wish.imageUrl ? 'hidden' : 'flex'}`}>
          <Gift className="w-12 h-12 mb-3 opacity-30" />
          <span className="text-[10px] uppercase tracking-widest font-semibold opacity-40">Sem foto</span>
        </div>
        
        {wish.isPurchased && (
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[11px] font-bold text-zinc-900 shadow-sm flex items-center gap-1.5">
            <Heart className="w-3 h-3 fill-rose-500 text-rose-500" /> Realizado
          </div>
        )}

        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => onDelete(wish.id)}
            className="w-8 h-8 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-zinc-400 hover:text-red-500 shadow-sm transition-colors"
            title="Excluir"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-5">
        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2 block">
          {wish.category}
        </span>
        <h3 className="font-semibold text-zinc-900 mb-1 truncate text-base tracking-tight">{wish.title}</h3>
        
        <div className="flex items-center justify-between mt-4">
          <span className="text-zinc-600 font-medium text-sm">{wish.price || 'Sem preço'}</span>
          
          <div className="flex gap-2">
            {wish.url && (
              <a 
                href={wish.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-zinc-50 text-zinc-500 flex items-center justify-center hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            <button 
              onClick={() => onTogglePurchased(wish.id, wish.isPurchased)}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                wish.isPurchased 
                  ? 'bg-rose-50 text-rose-500' 
                  : 'bg-zinc-50 text-zinc-400 hover:bg-rose-50 hover:text-rose-500'
              }`}
            >
              <Heart className={`w-4 h-4 transition-transform active:scale-75 ${wish.isPurchased ? 'fill-rose-500' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
