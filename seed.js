import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import fs from 'fs';

const envFile = fs.readFileSync('.env', 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    let val = match[2].trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    env[match[1]] = val;
  }
});

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const APP_ID = 'ich-wishlist';

const INITIAL_WISHES = [
  {
    id: '1',
    title: 'Relógio Feminino Retangular Square Astoria Couro Preto e Caixa Dourada',
    price: 'R$ 300,00',
    category: 'Acessórios',
    isPurchased: false,
    url: 'https://www.saintgermainbrand.com.br/produtos/relogio-feminino-retangular-square-astoria-couro-preto-e-caixa-dourada/',
    imageUrl: 'https://acdn-us.mitiendanube.com/stores/001/116/055/products/75d975741635daa13bfe364974a02025-f0fef6354c20b871b917551224447950-1024-1024.webp'
  },
  {
    id: '2',
    title: 'Relógio Feminino Pequeno Oval Mini Dourado',
    price: 'R$ 499,90',
    category: 'Acessórios',
    isPurchased: false,
    url: 'https://www.saintgermainbrand.com.br/produtos/relogio-feminino-pequeno-oval-mini-dourado/',
    imageUrl: 'https://acdn-us.mitiendanube.com/stores/001/116/055/products/2262d87233afbbec4b48a21e86310e45-265a175d40741ce32f17430311655973-1024-1024.webp'
  },
  {
    id: '3',
    title: 'Relógio Feminino Quadrado Vintage Boxy Dourado em Números Romanos',
    price: 'R$ 350,00',
    category: 'Acessórios',
    isPurchased: false,
    url: 'https://www.saintgermainbrand.com.br/produtos/relogio-feminino-quadrado-vintage-boxy-dourado-em-numeros-romanos/',
    imageUrl: 'https://acdn-us.mitiendanube.com/stores/001/116/055/products/c8cccb0150c6d978d99153fcc2b43c28-872c0cf009130794c617557013275342-1024-1024.webp'
  },
  {
    id: '4',
    title: 'Tênis Skate Slip-On Skull Pile Black White Gum',
    price: 'R$ 399,90',
    category: 'Tênis',
    isPurchased: false,
    url: 'https://www.vans.com.br/tenis-skate-slip-on-skull-pile-black-white-gum/p/1004300340015U',
    imageUrl: 'https://secure-static.vans.com.br/medias/sys_master/vans/vans/hec/h48/h00/h00/13085227286558/Midres-Vans-V1004300340015-02.jpg?w=1920&q=100'
  },
  {
    id: '5',
    title: 'Tênis Skate Slip-On Black Offwhite',
    price: 'R$ 399,90',
    category: 'Tênis',
    isPurchased: false,
    url: 'https://www.vans.com.br/t%C3%AAnis-skate-slip-on-black-offwhite/p/1002900260003U',
    imageUrl: 'https://secure-static.vans.com.br/medias/sys_master/vans/vans/hd1/h63/h00/h00/12969946316830/Midres-Vans-V1002900260003-02.jpg?w=1920&q=100'
  },
  {
    id: '6',
    title: 'Tênis Sk8-Low Black True White',
    price: 'R$ 379,90',
    category: 'Tênis',
    isPurchased: false,
    url: 'https://www.vans.com.br/tenis-sk8-low-black-true-white/p/1002001740011U',
    imageUrl: 'https://secure-static.vans.com.br/medias/sys_master/vans/vans/h0f/ha1/h00/h00/12861253058590/Midres-Vans-V1002001740011-02.jpg?w=1920&q=100'
  },
  {
    id: '7',
    title: 'Tênis Sk8-Hi Black White',
    price: 'R$ 399,90',
    category: 'Tênis',
    isPurchased: false,
    url: 'https://www.vans.com.br/tenis-sk8-hi-black-white/p/1002001230081U',
    imageUrl: 'https://secure-static.vans.com.br/medias/sys_master/vans/vans/hb5/hfe/h00/h00/13310726570014/Midres-Vans-V1002001230081-02.jpg?w=1920&q=100'
  },
  {
    id: '8',
    title: 'Tênis Speedcat OG Unissex',
    price: 'R$ 699,90',
    category: 'Tênis',
    isPurchased: false,
    url: 'https://br.puma.com/pd/tenis-speedcat-og-unissex/398846.html',
    imageUrl: 'https://images.puma.com/image/upload/f_auto,q_auto,w_600,b_rgb:FAFAFA/global/398846/02/sv01/fnd/BRA/fmt/png'
  }
];

async function seed() {
  try {
    await signInAnonymously(auth); // Requires login to write based on typical firestore rules
    let time = Date.now();
    for (const wish of INITIAL_WISHES) {
      const wishId = time.toString();
      time++;
      const wishData = { 
        title: wish.title,
        price: wish.price,
        category: wish.category,
        isPurchased: wish.isPurchased,
        url: wish.url,
        imageUrl: wish.imageUrl,
        createdAt: time
      };
      
      await setDoc(doc(db, 'artifacts', APP_ID, 'wishes', wishId), wishData);
      console.log(`Added global: ${wish.title}`);
    }
    console.log("Done seeding globally!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding:", error);
    process.exit(1);
  }
}

seed();
