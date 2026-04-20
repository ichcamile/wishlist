import React from 'react';
import { Wallet } from 'lucide-react';
import { formatPrice, CATEGORIES } from '../utils/formatters';

export default function Summary({ totalRemaining, categoryTotals }) {
  if (totalRemaining <= 0) return null;

  return (
    <div className="mb-10 bg-white rounded-[32px] p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-zinc-100">
      <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-6 flex items-center gap-2">
        <Wallet className="w-4 h-4" /> Resumo Financeiro
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        <div>
          <p className="text-sm font-medium text-zinc-500 mb-1">A Realizar</p>
          <p className="text-xl sm:text-3xl font-bold tracking-tight text-zinc-900 truncate">{formatPrice(totalRemaining)}</p>
        </div>
        {CATEGORIES.map(cat => {
          if (categoryTotals[cat] > 0) {
            return (
              <div key={cat} className="pl-4 border-l border-zinc-100">
                <p className="text-sm font-medium text-zinc-500 mb-1 truncate">{cat}</p>
                <p className="text-xl font-semibold tracking-tight text-zinc-800 truncate">{formatPrice(categoryTotals[cat])}</p>
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}
