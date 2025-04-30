// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBje2QvsJkVC2qTmmzfDvaJxsRJ1FKnKro",
  authDomain: "hairkailuaapp.firebaseapp.com",
  projectId: "hairkailuaapp",
  storageBucket: "hairkailuaapp.firebasestorage.app",
  messagingSenderId: "182497845899",
  appId: "1:182497845899:web:a57422a1c6fd8d230baa8e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
