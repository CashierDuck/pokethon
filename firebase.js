// ============================================================
//  firebase.js — Pokéthon cloud save + Google Sign-In
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth, signInAnonymously, signInWithRedirect, getRedirectResult,
  GoogleAuthProvider, linkWithRedirect, onAuthStateChanged, signOut
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

let db       = null;
let uid      = null;
let authRef  = null;
let isGoogle = false;

// ── UI helpers ───────────────────────────────────────────────
function setSyncStatus(icon, label, title) {
  const el = document.getElementById('sync-status');
  if (el) { el.textContent = icon + ' ' + label; el.title = title || label; }
}

function setGoogleBtn(visible) {
  const btn = document.getElementById('google-signin-btn');
  if (btn) btn.style.display = visible ? '' : 'none';
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
  } else {
    el.style.display = 'none';
  }
}

function openAccountModal(user) {
  const modal = document.getElementById('account-modal');
  if (!modal) return;
  document.getElementById('am-name').textContent  = user.displayName || 'Trainer';
  document.getElementById('am-email').textContent = user.email || '';
  const photo = document.getElementById('am-photo');
  if (user.photoURL) { photo.src = user.photoURL; photo.style.display = ''; }
  else { photo.style.display = 'none'; }
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
  setGoogleBtn(true);
  setSyncStatus('☁️', 'Synced', 'Signed out — saves continue locally');
  signInAnonymously(authRef).catch(() => {});
};

// ── Google sign-in (redirect — no popup blocker issues) ──────
window.signInWithGoogle = async function() {
  if (!authRef) { alert('Still connecting — please wait a moment and try again.'); return; }
  const provider = new GoogleAuthProvider();
  const btn = document.getElementById('google-signin-btn');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span style="opacity:.6">Redirecting…</span>';
  }
  try {
    const current = authRef.currentUser;
    if (current && current.isAnonymous) {
      await linkWithRedirect(current, provider);
    } else {
      await signInWithRedirect(authRef, provider);
    }
    // Page will redirect to Google, then back — getRedirectResult() handles the return
  } catch(e) {
    console.warn('Sign-in redirect failed:', e.code, e.message);
    setSyncStatus('⚠️', 'Sign-in failed', e.message);
    if (btn) { btn.disabled = false; btn.textContent = 'Sign in with Google'; }
  }
};

// ── Core init ────────────────────────────────────────────────
const app = initializeApp(firebaseConfig);
authRef   = getAuth(app);
db        = getFirestore(app);

setSyncStatus('🔄', 'Connecting…', 'Connecting to cloud');

// Handle return from Google redirect
getRedirectResult(authRef).then(result => {
  if (result && result.user) {
    // Successfully signed in via redirect — onAuthStateChanged will handle the rest
    console.log('Redirect sign-in complete:', result.user.displayName);
  }
}).catch(e => {
  if (e.code !== 'auth/no-current-user') {
    console.warn('Redirect result error:', e.code, e.message);
    setSyncStatus('⚠️', 'Sign-in failed', e.message);
  }
});

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
    setGoogleBtn(false);
    setSyncStatus('✅', 'Google', 'Signed in as ' + (user.displayName || user.email));
    // Wire chip click
    const chip = document.getElementById('user-chip');
    if (chip) chip.onclick = () => openAccountModal(user);
  } else {
    setUserChip(null);
    setGoogleBtn(true);
    setSyncStatus('☁️', 'Synced', 'Saves to cloud anonymously');
  }

  // Load cloud save
  try {
    const snap = await getDoc(doc(db, 'saves', uid));
    if (snap.exists()) {
      const cloud = snap.data();
      const local = JSON.parse(localStorage.getItem('pokethon_state') || '{}');
      const localLen = (local.completedLessons || []).length;
      if ((cloud.completedLessons?.length ?? 0) > localLen || (cloud.xp ?? 0) > (local.xp ?? 0)) {
        window.dispatchEvent(new CustomEvent('pokethon-cloud-loaded', { detail: cloud }));
      }
    }
  } catch(e) {
    console.warn('Could not load cloud save:', e.message);
  }
});

// Wire button — runs after module parses, which is after DOM is ready (modules are deferred)
const _btn = document.getElementById('google-signin-btn');
if (_btn) _btn.addEventListener('click', window.signInWithGoogle);
const _chip = document.getElementById('user-chip');
if (_chip) _chip.addEventListener('click', () => {
  if (authRef && authRef.currentUser && !authRef.currentUser.isAnonymous) {
    openAccountModal(authRef.currentUser);
  }
});

// Called by app.js on every state change
window.cloudSave = async function(stateObj) {
  if (!db || !uid) return;
  try {
    await setDoc(doc(db, 'saves', uid), stateObj, { merge: true });
    setSyncStatus('✅', 'Saved', 'Progress saved to cloud');
    setTimeout(() => setSyncStatus(
      isGoogle ? '✅' : '☁️',
      isGoogle ? 'Google' : 'Synced',
      isGoogle ? 'Signed in with Google' : 'Cloud save connected'
    ), 2000);
  } catch(e) {
    console.warn('Cloud save failed:', e.message);
    setSyncStatus('⚠️', 'Save failed', 'Check your connection');
  }
};
