import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2, Gift } from 'lucide-react';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';

import { auth, db, APP_ID } from './services/firebase';
import { parsePrice, CATEGORIES } from './utils/formatters';

import Header from './components/Header';
import Summary from './components/Summary';
import WishCard from './components/WishCard';
import AddWishModal from './components/AddWishModal';

export default function App() {
  const [wishes, setWishes] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoadingDb, setIsLoadingDb] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('Todos');

  useEffect(() => {
    const initAuth = async () => {
      try { await signInAnonymously(auth); } 
      catch (error) { console.error(error); }
    };
    initAuth();
    
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const wishesRef = collection(db, 'artifacts', APP_ID, 'wishes');
    
    const unsubscribe = onSnapshot(wishesRef, (snapshot) => {
      const loadedWishes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setWishes(loadedWishes.sort((a, b) => b.createdAt - a.createdAt));
      setIsLoadingDb(false);
    }, (error) => {
      console.error("Erro no onSnapshot:", error);
      setIsLoadingDb(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleSaveWish = async (newWish) => {
    if (!user) return;
    const wishId = Date.now().toString();
    const wishData = { ...newWish, isPurchased: false, createdAt: Date.now() };
    try {
      await setDoc(doc(db, 'artifacts', APP_ID, 'wishes', wishId), wishData);
      setIsModalOpen(false);
    } catch (error) { console.error(error); }
  };

  const deleteWish = async (id) => {
    if (!user) return;
    try { await deleteDoc(doc(db, 'artifacts', APP_ID, 'wishes', id.toString())); } 
    catch (error) { console.error(error); }
  };

  const togglePurchased = async (id, currentStatus) => {
    if (!user) return;
    try {
      await setDoc(doc(db, 'artifacts', APP_ID, 'wishes', id.toString()), 
      { isPurchased: !currentStatus }, { merge: true });
    } catch (error) { console.error(error); }
  };

  const filteredWishes = activeFilter === 'Todos' ? wishes : wishes.filter(w => w.category === activeFilter);
  const unpurchasedWishes = wishes.filter(w => !w.isPurchased);
  const totalRemaining = unpurchasedWishes.reduce((sum, wish) => sum + parsePrice(wish.price), 0);
  
  const categoryTotals = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = unpurchasedWishes.filter(w => w.category === cat).reduce((sum, wish) => sum + parsePrice(wish.price), 0);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#F5F5F7] font-sans text-zinc-900 selection:bg-rose-200">
      <Header totalRemaining={totalRemaining} onOpenModal={() => setIsModalOpen(true)} />

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 mb-2 flex items-center gap-2">
            Meus Desejos <Sparkles className="w-7 h-7 text-zinc-400" />
          </h2>
          <p className="text-zinc-500 text-lg">Sua curadoria pessoal de sonhos e mimos guardada na nuvem.</p>
        </div>

        {wishes.length > 0 && <Summary totalRemaining={totalRemaining} categoryTotals={categoryTotals} />}

        {wishes.length > 0 && (
          <div className="flex overflow-x-auto pb-4 mb-6 scrollbar-hide">
            <div className="inline-flex bg-zinc-200/60 p-1 rounded-full">
              {['Todos', ...CATEGORIES].map(cat => (
                <button
                  key={cat} onClick={() => setActiveFilter(cat)}
                  className={`px-6 py-2 rounded-full whitespace-nowrap text-sm font-semibold transition-all ${activeFilter === cat ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-800'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {isLoadingDb ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Loader2 className="w-10 h-10 text-zinc-400 animate-spin mb-4 mx-auto" />
            <p className="text-zinc-500 font-medium">Sincronizando com a nuvem...</p>
          </div>
        ) : filteredWishes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mb-6">
              <Gift className="w-8 h-8 text-zinc-400" />
            </div>
            <h3 className="text-xl font-semibold text-zinc-900 mb-2 tracking-tight">Nenhum desejo encontrado</h3>
            <p className="text-zinc-500 max-w-sm mb-6 text-sm">Adicione novos mimos usando o botão acima.</p>
            <button 
              onClick={async () => {
                const items = [
                  { title: 'Relógio Feminino Retangular Square Astoria Couro Preto e Caixa Dourada', price: 'R$ 300,00', category: 'Acessórios', isPurchased: false, url: 'https://www.saintgermainbrand.com.br/produtos/relogio-feminino-retangular-square-astoria-couro-preto-e-caixa-dourada/', imageUrl: 'https://acdn-us.mitiendanube.com/stores/001/116/055/products/75d975741635daa13bfe364974a02025-f0fef6354c20b871b917551224447950-1024-1024.webp' },
                  { title: 'Relógio Feminino Pequeno Oval Mini Dourado', price: 'R$ 499,90', category: 'Acessórios', isPurchased: false, url: 'https://www.saintgermainbrand.com.br/produtos/relogio-feminino-pequeno-oval-mini-dourado/', imageUrl: 'https://acdn-us.mitiendanube.com/stores/001/116/055/products/2262d87233afbbec4b48a21e86310e45-265a175d40741ce32f17430311655973-1024-1024.webp' },
                  { title: 'Relógio Feminino Quadrado Vintage Boxy Dourado em Números Romanos', price: 'R$ 350,00', category: 'Acessórios', isPurchased: false, url: 'https://www.saintgermainbrand.com.br/produtos/relogio-feminino-quadrado-vintage-boxy-dourado-em-numeros-romanos/', imageUrl: 'https://acdn-us.mitiendanube.com/stores/001/116/055/products/c8cccb0150c6d978d99153fcc2b43c28-872c0cf009130794c617557013275342-1024-1024.webp' },
                  { title: 'Tênis Skate Slip-On Skull Pile Black White Gum', price: 'R$ 399,90', category: 'Tênis', isPurchased: false, url: 'https://www.vans.com.br/tenis-skate-slip-on-skull-pile-black-white-gum/p/1004300340015U', imageUrl: 'https://secure-static.vans.com.br/medias/sys_master/vans/vans/hec/h48/h00/h00/13085227286558/Midres-Vans-V1004300340015-02.jpg?w=1920&q=100' },
                  { title: 'Tênis Skate Slip-On Black Offwhite', price: 'R$ 399,90', category: 'Tênis', isPurchased: false, url: 'https://www.vans.com.br/t%C3%AAnis-skate-slip-on-black-offwhite/p/1002900260003U', imageUrl: 'https://secure-static.vans.com.br/medias/sys_master/vans/vans/hd1/h63/h00/h00/12969946316830/Midres-Vans-V1002900260003-02.jpg?w=1920&q=100' },
                  { title: 'Tênis Sk8-Low Black True White', price: 'R$ 379,90', category: 'Tênis', isPurchased: false, url: 'https://www.vans.com.br/tenis-sk8-low-black-true-white/p/1002001740011U', imageUrl: 'https://secure-static.vans.com.br/medias/sys_master/vans/vans/h0f/ha1/h00/h00/12861253058590/Midres-Vans-V1002001740011-02.jpg?w=1920&q=100' },
                  { title: 'Tênis Sk8-Hi Black White', price: 'R$ 399,90', category: 'Tênis', isPurchased: false, url: 'https://www.vans.com.br/tenis-sk8-hi-black-white/p/1002001230081U', imageUrl: 'https://secure-static.vans.com.br/medias/sys_master/vans/vans/hb5/hfe/h00/h00/13310726570014/Midres-Vans-V1002001230081-02.jpg?w=1920&q=100' },
                  { title: 'Tênis Speedcat OG Unissex', price: 'R$ 699,90', category: 'Tênis', isPurchased: false, url: 'https://br.puma.com/pd/tenis-speedcat-og-unissex/398846.html', imageUrl: 'https://images.puma.com/image/upload/f_auto,q_auto,w_600,b_rgb:FAFAFA/global/398846/02/sv01/fnd/BRA/fmt/png' }
                ];
                let time = Date.now();
                for (const wish of items) {
                  const wishId = time.toString(); time++;
                  try {
                    await setDoc(doc(db, 'artifacts', APP_ID, 'wishes', wishId), { ...wish, createdAt: time });
                  } catch (error) {
                    console.error(error);
                    alert('Erro de Permissão no Firebase! Por favor, atualize as Regras de Segurança no painel do Firestore conforme instruído anteriormente (allow read, write: if true;)');
                    break;
                  }
                }
              }}
              className="bg-rose-100 text-rose-600 px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-rose-200 transition-colors shadow-sm"
            >
              Popular Dados Iniciais
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredWishes.map(wish => (
              <WishCard 
                key={wish.id} 
                wish={wish} 
                onTogglePurchased={togglePurchased} 
                onDelete={deleteWish} 
              />
            ))}
          </div>
        )}
      </main>

      {isModalOpen && <AddWishModal onClose={() => setIsModalOpen(false)} onSave={handleSaveWish} />}
    </div>
  );
}
