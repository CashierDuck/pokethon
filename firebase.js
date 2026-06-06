// ============================================================
//  firebase.js — Pokéthon cloud save
//  PASTE YOUR FIREBASE CONFIG OBJECT BELOW (step 3 of setup)
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ── PASTE YOUR CONFIG HERE ──────────────────────────────────
//  Firebase Console → Project Settings → Your Apps → SDK snippet
const firebaseConfig = {
  apiKey:            "AIzaSyBfClztcNrO22kwylCTq10joPo5LG7iU4M",
  authDomain:        "pokethon-acc32.firebaseapp.com",
  projectId:         "pokethon-acc32",
  storageBucket:     "pokethon-acc32.firebasestorage.app",
  messagingSenderId: "313852573856",
  appId:             "1:313852573856:web:3b6fbc6802caea57ffb1c5",
};
// ────────────────────────────────────────────────────────────

const CONFIGURED = !firebaseConfig.apiKey.startsWith("PASTE");

let db   = null;
let uid  = null;

function setSyncStatus(icon, label, title) {
  const el = document.getElementById('sync-status');
  if (el) { el.textContent = icon + ' ' + label; el.title = title; }
}

if (CONFIGURED) {
  const app  = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  db = getFirestore(app);

  setSyncStatus('🔄', 'Connecting…', 'Connecting to cloud save');

  signInAnonymously(auth).catch(err => {
    console.warn('Firebase sign-in failed:', err.message);
    setSyncStatus('⚠️', 'Local only', 'Cloud save unavailable — progress saved locally');
  });

  onAuthStateChanged(auth, async user => {
    if (!user) return;
    uid = user.uid;
    setSyncStatus('☁️', 'Saved', 'Progress saved to cloud');

    // load cloud save on sign-in
    try {
      const snap = await getDoc(doc(db, 'saves', uid));
      if (snap.exists()) {
        const cloud = snap.data();
        // only load if cloud is newer (more XP or more lessons)
        const localLessons = (JSON.parse(localStorage.getItem('pokethon_state') || '{}')).completedLessons || [];
        if ((cloud.completedLessons?.length ?? 0) > localLessons.length || (cloud.xp ?? 0) > 0) {
          window.__cloudSave = cloud;
          // notify app.js to merge
          window.dispatchEvent(new CustomEvent('pokethon-cloud-loaded', { detail: cloud }));
        }
      }
    } catch(e) {
      console.warn('Could not load cloud save:', e.message);
    }
  });
} else {
  setSyncStatus('', '');
  console.info('Firebase not configured — using localStorage only. See firebase.js to set up cloud saves.');
}

// Called by app.js whenever state changes
window.cloudSave = async function(stateObj) {
  if (!db || !uid) return;
  try {
    await setDoc(doc(db, 'saves', uid), stateObj, { merge: true });
    setSyncStatus('✅', 'Saved', 'Progress saved to cloud');
    setTimeout(() => setSyncStatus('☁️', 'Synced', 'Cloud save connected'), 2000);
  } catch(e) {
    console.warn('Cloud save failed:', e.message);
    setSyncStatus('⚠️', 'Save failed', 'Check your connection');
  }
};
