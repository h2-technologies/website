import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { FIREBASE_API_KEY, FIREBASE_APP_ID } from "$env/static/private";

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: "website-e5c75.firebaseapp.com",
  projectId: "website-e5c75",
  storageBucket: "website-e5c75.firebasestorage.app",
  messagingSenderId: "739618192733",
  appId: FIREBASE_APP_ID,
  measurementId: FIREBASE_APP_ID
}

const firebase = initializeApp(firebaseConfig);
export const storage = getStorage(firebase);