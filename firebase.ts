
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  increment, 
  onSnapshot,
  collection
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBWOCvrB6Nxqp7j_z7zTVPeZnmgaURBJe0",
  authDomain: "baloon-6112c.firebaseapp.com",
  projectId: "baloon-6112c",
  storageBucket: "baloon-6112c.firebasestorage.app",
  messagingSenderId: "693605500238",
  appId: "1:693605500238:web:54d55bee25fa6ade15ca1f"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export { 
  signInWithPopup, 
  onAuthStateChanged, 
  signOut,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  onSnapshot,
  collection
};
