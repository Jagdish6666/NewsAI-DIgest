// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  projectId: "newsai-digest-7tbog",
  appId: "1:722840960696:web:1961f54027dc5313007e4d",
  storageBucket: "newsai-digest-7tbog.firebasestorage.app",
  apiKey: "AIzaSyCUflOf8Ew8ti6WV1L5zofwOOOdYSsp1KE",
  authDomain: "newsai-digest-7tbog.firebaseapp.com",
  messagingSenderId: "722840960696",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider };
