import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDx1axuRHjyzWrPbr0O_2qQNo3Khgi2z4o",
  authDomain: "seekho-saath-8764e.firebaseapp.com",
  projectId: "seekho-saath-8764e",
  storageBucket: "seekho-saath-8764e.firebasestorage.app",
  messagingSenderId: "84074990876",
  appId: "1:84074990876:web:f5421c7c11ba7e42c57ed9",
  measurementId: "G-02RTWJNGG4",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, googleProvider, db, storage };
