// ============================================================
//  firebase.js — Pokéthon cloud save + Google Sign-In
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth, signInAnonymously, signInWithPopup,
  GoogleAuthProvider, linkWithPopup, onAuthStateChanged, signOut,
  browserLocalPersistence, setPersistence
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

const app    = initializeApp(firebaseConfig);
const auth   = getAuth(app);
const db     = getFirestore(app);

let uid      = null;
let isGoogle = false;

// ── UI ───────────────────────────────────────────────────────
function setSyncStatus(icon, label, title) {
  const el = document.getElementById('sync-status');
  if (el) { el.textContent = icon + ' ' + label; el.title = title || label; }
}

function showSignedIn(user) {
  // Hide sign-in button
  const btn = document.getElementById('google-signin-btn');
  if (btn) btn.style.display = 'none';

  // Show chip with photo + name
  const chip = document.getElementById('user-chip');
  if (!chip) return;
  const photo = user.photoURL
    ? '<img src="' + user.photoURL + '" alt="" />'
    : '<span class="uc-initial">' + (user.displayName || 'G')[0].toUpperCase() + '</span>';
  chip.innerHTML = photo + '<span class="uc-name">' + (user.displayName || 'You').split(' ')[0] + '</span>';
  chip.style.display = 'flex';
  chip.onclick = () => openAccountModal(user);

  setSyncStatus('✅', 'Google', 'Signed in as ' + (user.displayName || user.email));
}

function showSignedOut() {
  const btn = document.getElementById('google-signin-btn');
  if (btn) btn.style.display = '';
  const chip = document.getElementById('user-chip');
  if (chip) { chip.style.display = 'none'; chip.onclick = null; }
  setSyncStatus('☁️', 'Synced', 'Saving anonymously');
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
  window.closeAccountModal();
  await signOut(auth);
  signInAnonymously(auth).catch(() => {});
};

// ── Google sign-in ───────────────────────────────────────────
async function doGoogleSignIn() {
  const btn = document.getElementById('google-signin-btn');
  if (btn) { btn.disabled = true; btn.innerHTML = '<span style="opacity:.6;font-size:.8rem">Opening…</span>'; }

  console.log('[Pokéthon] Starting Google sign-in, auth ready:', !!auth, 'current user:', auth.currentUser?.uid);

  const provider = new GoogleAuthProvider();
  try {
    const current = auth.currentUser;
    let result;
    if (current && current.isAnonymous) {
      console.log('[Pokéthon] Linking anonymous → Google');
      result = await linkWithPopup(current, provider);
    } else {
      console.log('[Pokéthon] signInWithPopup');
      result = await signInWithPopup(auth, provider);
    }
    console.log('[Pokéthon] Sign-in popup completed', result.user.displayName);
    // linkWithPopup doesn't always re-fire onAuthStateChanged — update UI directly
    uid      = result.user.uid;
    isGoogle = true;
    showSignedIn(result.user);
  } catch(e) {
    console.error('[Pokéthon] Sign-in error:', e.code, e.message);

    if (e.code === 'auth/credential-already-in-use') {
      try { await signInWithPopup(auth, provider); } catch(_) {}
    } else if (e.code === 'auth/popup-closed-by-user' || e.code === 'auth/cancelled-popup-request') {
      // user closed popup — silent
    } else if (e.code === 'auth/popup-blocked') {
      setSyncStatus('⚠️', 'Popup blocked', 'Allow popups for this site in your browser');
      alert('Popup was blocked. Please allow popups for cashierduck.github.io in your browser settings, then try again.');
    } else {
      setSyncStatus('⚠️', 'Error: ' + e.code, e.message);
    }

    if (btn) { btn.disabled = false; btn.innerHTML = googleBtnContent; }
  }
}

// ── Boot ─────────────────────────────────────────────────────
setSyncStatus('🔄', 'Connecting…', 'Connecting to cloud');

// LOCAL persistence — session survives page refresh
// onAuthStateChanged fires once on load; if no user, sign in anonymously
setPersistence(auth, browserLocalPersistence).catch(err => {
  console.warn('setPersistence failed:', err.message);
});

const unsub = onAuthStateChanged(auth, user => {
  unsub(); // unsubscribe after first call — the persistent listener below handles the rest
  if (!user) {
    signInAnonymously(auth).catch(err => {
      console.warn('Anonymous auth failed:', err.message);
      setSyncStatus('⚠️', 'Local only', 'Cloud unavailable');
    });
  }
});

onAuthStateChanged(auth, async user => {
  if (!user) { showSignedOut(); return; }
  uid      = user.uid;
  isGoogle = !user.isAnonymous;

  if (isGoogle) showSignedIn(user);
  else showSignedOut();

  // Load cloud save
  try {
    const snap = await getDoc(doc(db, 'saves', uid));
    if (snap.exists()) {
      const cloud = snap.data();
      const local = JSON.parse(localStorage.getItem('pokethon_state') || '{}');
      const cloudLen = cloud.completedLessons?.length ?? 0;
      const localLen = (local.completedLessons || []).length;
      if (cloudLen > localLen || (cloud.xp ?? 0) > (local.xp ?? 0)) {
        window.dispatchEvent(new CustomEvent('pokethon-cloud-loaded', { detail: cloud }));
      }
    }
  } catch(e) {
    console.warn('Cloud load failed:', e.message);
  }
});

// Attach button — ES modules are deferred so DOM is ready here
const googleBtnContent = document.getElementById('google-signin-btn')?.innerHTML || '';
document.getElementById('google-signin-btn')?.addEventListener('click', doGoogleSignIn);

// ── Save ─────────────────────────────────────────────────────
window.cloudSave = async function(stateObj) {
  if (!uid) return;
  try {
    await setDoc(doc(db, 'saves', uid), stateObj, { merge: true });
    setSyncStatus('✅', 'Saved', 'Progress saved to cloud');
    setTimeout(() => setSyncStatus(
      isGoogle ? '✅' : '☁️',
      isGoogle ? 'Google' : 'Synced',
      isGoogle ? 'Signed in with Google' : 'Cloud save active'
    ), 2000);
  } catch(e) {
    console.warn('Save failed:', e.message);
    setSyncStatus('⚠️', 'Save failed', 'Check connection');
  }
};
