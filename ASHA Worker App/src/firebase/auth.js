/**
 * firebase/auth.js
 * Handles login, logout, and ASHA worker profile retrieval.
 * Supports fallback mock logic when running offline or in mock mode.
 */

import { 
  signInWithEmailAndPassword, 
  signOut, 
  setPersistence, 
  browserLocalPersistence 
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, isFirebaseMock } from './config';

// ═══════════════════════════════════
// MOCK DATA FOR OFFLINE DEVELOPMENT
// ═══════════════════════════════════
const MOCK_USER = {
  uid: 'mock_asha_2901',
  email: 'asha@graamsehat.org'
};

const MOCK_PROFILE = {
  uid: 'mock_asha_2901',
  name: 'Rupa Devi',
  role: 'asha',
  status: 'approved',
  subcentre: 'Kengeri Sub-Centre',
  district: 'Bangalore Urban'
};

/**
 * Signs in an ASHA worker using email and password.
 * Enables 30-day session persistence.
 */
export async function loginUser(email, password) {
  if (isFirebaseMock) {
    // Mock login validation
    if (email === 'asha@graamsehat.org' && password === 'password123') {
      localStorage.setItem('graamsehat_mock_session', JSON.stringify(MOCK_USER));
      return MOCK_USER;
    }
    // Admin mock login for testing the checklist admin features
    if (email === 'admin@graamsehat.org' && password === 'admin123') {
      const mockAdmin = { uid: 'mock_admin_111', email: 'admin@graamsehat.org' };
      localStorage.setItem('graamsehat_mock_session', JSON.stringify(mockAdmin));
      return mockAdmin;
    }
    throw new Error('Invalid email or password. Use asha@graamsehat.org / password123 for offline mode.');
  }

  // Set 30 days local storage persistence
  await setPersistence(auth, browserLocalPersistence);
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

/**
 * Fetches the user profile from Firestore or mock database.
 */
export async function fetchWorkerProfile(uid) {
  if (isFirebaseMock) {
    if (uid === 'mock_admin_111') {
      return { uid, name: 'Admin Officer', role: 'admin', status: 'approved' };
    }
    return MOCK_PROFILE;
  }

  const userDocRef = doc(db, 'users', uid);
  const userDoc = await getDoc(userDocRef);
  
  if (!userDoc.exists()) {
    throw new Error('Worker profile not found in database.');
  }
  
  return userDoc.data();
}

/**
 * Signs out the current user.
 */
export async function logoutUser() {
  if (isFirebaseMock) {
    localStorage.removeItem('graamsehat_mock_session');
    return;
  }
  await signOut(auth);
}

/**
 * Checks for stored session on load (to auto-login).
 */
export function getSavedSession() {
  if (isFirebaseMock) {
    const session = localStorage.getItem('graamsehat_mock_session');
    return session ? JSON.parse(session) : null;
  }
  return auth?.currentUser || null;
}
