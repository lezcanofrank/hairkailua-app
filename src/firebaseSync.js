// firebaseSync.js — Full working version with refresh fix

import { db } from './firebase';
import {
  collection,
  getDocs,
  getDoc,
  setDoc,
  doc
} from 'firebase/firestore';

// Save entire entries array for the current day
export async function saveEntriesToFirestore(entries) {
  const today = new Date().toLocaleDateString();
  await setDoc(doc(db, 'entries', today), {
    entries
  });
}

// Save closed day (with note) into history
export async function saveClosedDayToFirestore(date, note, entries) {
  await setDoc(doc(db, 'history', date), {
    date,
    note,
    entries
  });
}

// Load entries for today
export async function loadEntriesFromFirestore() {
  const today = new Date().toLocaleDateString();
  const docRef = doc(db, 'entries', today);
  const snapshot = await getDoc(docRef);
  return snapshot.exists() ? snapshot.data().entries || [] : [];
}

// Load entire history collection
export async function loadHistoryFromFirestore() {
  const snapshot = await getDocs(collection(db, 'history'));
  return snapshot.docs.map(doc => doc.data());
}  
