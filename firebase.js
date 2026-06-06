// ============================================================
//  firebase.js — Pokéthon cloud save + Google Sign-In
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth, signInAnonymously, signInWithPopup,
  GoogleAuthProvider, linkWithPopup, onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey:            "AIzaSyBfClztcNrO22kwylCTq10joPo5LG7iU4M",
  authDomain:        "pokethon-acc32.firebaseapp.com",
  projectId:         "pokethon-acc32",
  storageBucket:     "pokethon-acc32.firebasestorage.app",
  messagingSenderId: "313852573856",
  appId:             "1:313852573856:web:3b6fbc6802caea57ffb1c5",
};

const CONFIGURED = !firebaseConfig.apiKey.startsWith("PASTE");

let db         = null;
let uid        = null;
let authRef    = null;
let isGoogle   = false;
let googleBtnHTML = '';

// Wire sign-in button click from the module (avoids inline onclick timing issues)
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('google-signin-btn');
  if (btn) {
    googleBtnHTML = btn.innerHTML;
    btn.addEventListener('click', () => {
      if (window.signInWithGoogle) window.signInWithGoogle();
    });
  }
  const chip = document.getElementById('user-chip');
  if (chip) chip.addEventListener('click', () => {
    if (authRef && authRef.currentUser && !authRef.currentUser.isAnonymous) {
      openAccountModal(authRef.currentUser);
    }
  });
});

// ── UI helpers ───────────────────────────────────────────────
function setSyncStatus(icon, label, title) {
  const el = document.getElementById('sync-status');
  if (el) { el.textContent = icon + ' ' + label; el.title = title || label; }
}

function setUserChip(user) {
  const el = document.getElementById('user-chip');
  if (!el) return;
  if (user && user.displayName) {
    const photo = user.photoURL
      ? '<img src="' + user.photoURL + '" alt="" />'
      : '<span class="uc-initial">' + user.displayName[0].toUpperCase() + '</span>';
    el.innerHTML = photo + '<span class="uc-name">' + user.displayName.split(' ')[0] + '</span>';
    el.style.display = 'flex';
    el.title = 'Signed in as ' + user.displayName + ' · click to sign out';
    el.onclick = () => openAccountModal(user);
  } else {
    el.style.display = 'none';
    el.onclick = null;
  }
}

// ── Account modal ────────────────────────────────────────────
function openAccountModal(user) {
  let modal = document.getElementById('account-modal');
  if (!modal) return;
  document.getElementById('am-name').textContent  = user.displayName || 'Trainer';
  document.getElementById('am-email').textContent = user.email || '';
  document.getElementById('am-photo').src = user.photoURL || '';
  document.getElementById('am-photo').style.display = user.photoURL ? '' : 'none';
  modal.classList.remove('hidden');
}

window.closeAccountModal = function() {
  const m = document.getElementById('account-modal');
  if (m) m.classList.add('hidden');
};

window.signOutGoogle = async function() {
  if (!authRef) return;
  window.closeAccountModal();
  await signOut(authRef);
  isGoogle = false;
  setUserChip(null);
  setSyncStatus('☁️', 'Synced', 'Signed out — anonymous save active');
  // Sign back in anonymously so saves still work
  signInAnonymously(authRef).catch(() => {});
};

// ── Google sign-in / link ────────────────────────────────────
async function doGoogleSignIn() {
  if (!authRef) return;
  const provider = new GoogleAuthProvider();
  const btn = document.getElementById('google-signin-btn');
  if (btn) { btn.disabled = true; btn.textContent = 'Signing in…'; }
  try {
    const current = authRef.currentUser;
    if (current && current.isAnonymous) {
      await linkWithPopup(current, provider);
    } else {
      await signInWithPopup(authRef, provider);
    }
  } catch(e) {
    if (e.code === 'auth/credential-already-in-use') {
      try { await signInWithPopup(authRef, provider); } catch(e2) {}
    } else {
      console.warn('Google sign-in failed:', e.message);
    }
    if (btn) { btn.disabled = false; btn.innerHTML = googleBtnHTML; }
  }
}

window.signInWithGoogle = doGoogleSignIn;

// ── Core auth + Firestore ────────────────────────────────────
if (CONFIGURED) {
  const app = initializeApp(firebaseConfig);
  authRef   = getAuth(app);
  db        = getFirestore(app);

  setSyncStatus('🔄', 'Connecting…', 'Connecting to cloud save');

  signInAnonymously(authRef).catch(err => {
    console.warn('Anonymous sign-in failed:', err.message);
    setSyncStatus('⚠️', 'Local only', 'Cloud save unavailable');
  });

  onAuthStateChanged(authRef, async user => {
    if (!user) return;
    uid      = user.uid;
    isGoogle = !user.isAnonymous;

    if (isGoogle) {
      setUserChip(user);
      setSyncStatus('✅', 'Google', 'Signed in as ' + (user.displayName || user.email));
    } else {
      setUserChip(null);
      setSyncStatus('☁️', 'Synced', 'Progress saved to cloud (anonymous)');
    }

    // Show / hide Google sign-in button in header
    const btn = document.getElementById('google-signin-btn');
    if (btn) btn.style.display = isGoogle ? 'none' : '';

    // Load cloud save
    try {
      const snap = await getDoc(doc(db, 'saves', uid));
      if (snap.exists()) {
        const cloud = snap.data();
        const localLessons = (JSON.parse(localStorage.getItem('pokethon_state') || '{}')).completedLessons || [];
        if ((cloud.completedLessons?.length ?? 0) > localLessons.length || (cloud.xp ?? 0) > 0) {
          window.dispatchEvent(new CustomEvent('pokethon-cloud-loaded', { detail: cloud }));
        }
      }
    } catch(e) {
      console.warn('Could not load cloud save:', e.message);
    }
  });
} else {
  setSyncStatus('', '', '');
}

// Called by app.js on every state change
window.cloudSave = async function(stateObj) {
  if (!db || !uid) return;
  try {
    await setDoc(doc(db, 'saves', uid), stateObj, { merge: true });
    setSyncStatus('✅', 'Saved', 'Progress saved to cloud');
    setTimeout(() => {
      setSyncStatus(isGoogle ? '✅' : '☁️', isGoogle ? 'Google' : 'Synced',
        isGoogle ? 'Signed in with Google' : 'Cloud save connected');
    }, 2000);
  } catch(e) {
    console.warn('Cloud save failed:', e.message);
    setSyncStatus('⚠️', 'Save failed', 'Check your connection');
  }
};
