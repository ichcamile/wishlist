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

async function test() {
  try {
    const cred = await signInAnonymously(auth);
    console.log("Logged in:", cred.user.uid);
    await setDoc(doc(db, 'artifacts', 'ich-wishlist', 'users', cred.user.uid, 'wishes', 'test1'), { test: 1 });
    console.log("Wrote to users/uid/wishes/test1");
    await setDoc(doc(db, 'artifacts', 'ich-wishlist', 'wishes', 'test2'), { test: 2 });
    console.log("Wrote to wishes/test2");
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
test();
