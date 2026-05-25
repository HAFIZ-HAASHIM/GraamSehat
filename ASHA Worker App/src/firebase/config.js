/**
 * firebase/config.js
 * Firebase initialization config.
 * Implements a mock fallback mode when credentials are not yet supplied,
 * ensuring the application can operate 100% offline out of the box.
 */

import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Replace these configuration details in the Firebase console when deploying
const firebaseConfig = {
  apiKey: "AIzaSyCb9XFg1zTu-tTmP-0PgWol768E1fPMaIM",
  authDomain: "graamsehat-d5ede.firebaseapp.com",
  projectId: "graamsehat-d5ede",
  storageBucket: "graamsehat-d5ede.firebasestorage.app",
  messagingSenderId: "800774314027",
  appId: "1:800774314027:web:6621fdf508d2f0f48eb26e",
  measurementId: "G-J39ZV4ZZYD"
};

let app;
let auth;
let db;
let storage;
let isFirebaseMock = false;

// Determine if actual configuration keys have been provided
const isConfigured =
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== "PLACEHOLDER_API_KEY" &&
  !firebaseConfig.apiKey.startsWith("YOUR_");

if (isConfigured) {
  try {
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
  } catch (error) {
    console.error("Firebase initialization failed. Falling back to Mock mode:", error);
    isFirebaseMock = true;
  }
} else {
  isFirebaseMock = true;
}

export { app, auth, db, storage, isFirebaseMock };
