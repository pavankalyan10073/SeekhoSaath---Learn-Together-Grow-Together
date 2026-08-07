import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCqvYLSnF6CT9VCFYkAInJQebM-KasjCzw",
  authDomain: "seekho-saath.firebaseapp.com",
  projectId: "seekho-saath",
  storageBucket: "seekho-saath.firebasestorage.app",
  messagingSenderId: "558290608996",
  appId: "1:558290608996:web:a4055521b8c3b007ecd071",
  measurementId: "G-RQQBNWLLQQ",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider };
