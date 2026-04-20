import React, { useState } from 'react';
import { X, Link as LinkIcon, Loader2, Tag, DollarSign, Image as ImageIcon } from 'lucide-react';
import { CATEGORIES } from '../utils/formatters';

export default function AddWishModal({ onClose, onSave }) {
  const [newWish, setNewWish] = useState({ title: '', price: '', url: '', imageUrl: '', category: 'Outros' });
  const [isScraping, setIsScraping] = useState(false);
  const [scrapeError, setScrapeError] = useState(false);

  const handleUrlScrape = async () => {
    if (!newWish.url) return;
    setIsScraping(true);
    setScrapeError(false);
    
    try {
      const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(newWish.url)}`);
      if (!response.ok) throw new Error('Falha na rede');
      
      const data = await response.json();
      const html = data.contents;
      
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      let title = doc.querySelector('meta[property="og:title"]')?.content || doc.querySelector('title')?.innerText || '';
      if (title.includes(' - ')) title = title.split(' - ')[0].trim();
      if (title.includes(' | ')) title = title.split(' | ')[0].trim();

      let imageUrl = doc.querySelector('meta[property="og:image"]')?.content || '';

      let price = '';
      const priceMeta = doc.querySelector('meta[property="product:price:amount"]')?.content;
      if (priceMeta) {
        price = `R$ ${parseFloat(priceMeta).toFixed(2).replace('.', ',')}`;
      } else {
        const priceMatch = html.match(/R\$\s*(\d{1,3}(?:\.\d{3})*,\d{2})/);
        if (priceMatch) price = `R$ ${priceMatch[1]}`;
      }

      let category = 'Outros';
      const lowerText = (title + ' ' + newWish.url).toLowerCase();
      
      if (lowerText.includes('tenis') || lowerText.includes('tênis')) category = 'Tênis';
      else if (lowerText.includes('relogio') || lowerText.includes('anel')) category = 'Acessórios';
      else if (lowerText.includes('vestido') || lowerText.includes('moda')) category = 'Moda';
      else if (lowerText.includes('perfume') || lowerText.includes('beleza')) category = 'Beleza';
      else if (lowerText.includes('casa') || lowerText.includes('luminária')) category = 'Casa';
      else if (lowerText.includes('fone') || lowerText.includes('eletrônico')) category = 'Eletrônicos';

      setNewWish(prev => ({
        ...prev,
        title: title || prev.title,
        imageUrl: imageUrl || prev.imageUrl,
        price: price || prev.price,
        category: category !== 'Outros' ? category : prev.category
      }));
    } catch (error) {
      setScrapeError(true);
    } finally {
      setIsScraping(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newWish.title.trim()) return;
    onSave(newWish);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6">
      <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-white rounded-t-[32px] sm:rounded-[32px] shadow-2xl p-6 sm:p-8 transform transition-all max-h-[90vh] overflow-y-auto">
        <div className="w-10 h-1.5 bg-zinc-200 rounded-full mx-auto mb-6 sm:hidden"></div>
        <button onClick={onClose} className="absolute top-6 right-6 w-8 h-8 bg-zinc-100 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 rounded-full hidden sm:flex items-center justify-center transition-colors">
          <X className="w-4 h-4 stroke-[3]" />
        </button>
        
        <div className="mb-8 text-center sm:text-left">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 mb-1">Novo Desejo</h2>
          <p className="text-zinc-500 text-sm">Adicione os detalhes do seu próximo mimo.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 ml-1">Link do Produto</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input 
                  type="url" placeholder="https://..." 
                  className="w-full bg-zinc-100 border-transparent text-zinc-900 rounded-2xl pl-10 pr-4 py-3.5 outline-none focus:bg-white focus:ring-2 focus:ring-zinc-900 transition-all text-sm"
                  value={newWish.url} onChange={(e) => { setNewWish({...newWish, url: e.target.value}); setScrapeError(false); }}
                />
              </div>
              <button type="button" onClick={handleUrlScrape} disabled={!newWish.url || isScraping} className="bg-zinc-200 text-zinc-700 hover:bg-zinc-300 disabled:opacity-50 px-5 rounded-2xl font-semibold text-sm flex items-center justify-center min-w-[100px]">
                {isScraping ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Buscar'}
              </button>
            </div>
            {scrapeError && <p className="text-xs text-rose-500 mt-2 ml-1 font-medium">Link protegido. Por favor, preencha manualmente.</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 ml-1">Nome do Item</label>
            <input type="text" required placeholder="Ex: Tênis branco..." className="w-full bg-zinc-100 border-transparent text-zinc-900 rounded-2xl px-4 py-3.5 outline-none focus:bg-white focus:ring-2 focus:ring-zinc-900 transition-all text-sm" value={newWish.title} onChange={(e) => setNewWish({...newWish, title: e.target.value})} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 ml-1">Categoria</label>
              <div className="relative">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <select className="w-full bg-zinc-100 border-transparent text-zinc-900 rounded-2xl pl-10 pr-4 py-3.5 outline-none focus:bg-white focus:ring-2 focus:ring-zinc-900 appearance-none text-sm font-medium" value={newWish.category} onChange={(e) => setNewWish({...newWish, category: e.target.value})}>
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 ml-1">Valor</label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input type="text" placeholder="R$ 0,00" className="w-full bg-zinc-100 border-transparent text-zinc-900 rounded-2xl pl-10 pr-4 py-3.5 outline-none focus:bg-white focus:ring-2 focus:ring-zinc-900 text-sm font-medium" value={newWish.price} onChange={(e) => setNewWish({...newWish, price: e.target.value})} />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 ml-1">Link da Imagem</label>
            <div className="relative">
              <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input type="url" placeholder="Cole o link da foto..." className="w-full bg-zinc-100 border-transparent text-zinc-900 rounded-2xl pl-10 pr-4 py-3.5 outline-none focus:bg-white focus:ring-2 focus:ring-zinc-900 text-sm" value={newWish.imageUrl} onChange={(e) => setNewWish({...newWish, imageUrl: e.target.value})} />
            </div>
          </div>

          <button type="submit" disabled={!newWish.title.trim()} className="w-full bg-zinc-900 hover:bg-black disabled:bg-zinc-300 text-white font-semibold text-base rounded-2xl py-4 mt-6 active:scale-[0.98]">
            Salvar na Nuvem
          </button>
        </form>
      </div>
    </div>
  );
}
