import React from 'react';
import { Heart, Plus } from 'lucide-react';
import { formatPrice } from '../utils/formatters';

export default function Header({ totalRemaining, onOpenModal }) {
  return (
    <header className="sticky top-0 z-10 bg-white/70 backdrop-blur-xl border-b border-zinc-200/50 px-6 py-4 flex items-center justify-between transition-all">
      <div className="flex items-center gap-3">
        <div className="bg-rose-100 p-2 rounded-xl">
          <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-semibold tracking-tight text-zinc-900 leading-tight">Desejos</h1>
          <span className="text-[11px] font-medium text-zinc-500 tracking-wide">FALTA: {formatPrice(totalRemaining)}</span>
        </div>
      </div>
      <button 
        onClick={onOpenModal}
        className="bg-zinc-900 hover:bg-black text-white px-5 py-2.5 rounded-full flex items-center gap-2 text-sm font-semibold transition-transform active:scale-95 shadow-sm"
      >
        <Plus className="w-4 h-4 stroke-[3]" />
        <span className="hidden sm:inline">Adicionar</span>
      </button>
    </header>
  );
}
