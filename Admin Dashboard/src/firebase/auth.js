/**
 * GraamSehat Admin Dashboard - Authentication Service
 * Location: /src/firebase/auth.js
 */

import { auth, db, logAdminActivity } from './config';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

/**
 * Signs in user and verifies their admin role.
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<object>} The user profile data if admin
 */
export const loginAdmin = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Check role in Firestore users collection
    const userDocRef = doc(db, 'users', user.uid);
    const userDocSnap = await getDoc(userDocRef);
    
    if (!userDocSnap.exists()) {
      await signOut(auth);
      throw new Error('Access denied. Account not found.');
    }
    
    const userData = userDocSnap.data();
    
    if (userData.role !== 'admin') {
      await signOut(auth);
      throw new Error('Access denied. Admin accounts only.');
    }
    
    // Log successful admin login
    await logAdminActivity(user.uid, 'ADMIN_LOGIN', { email });
    
    return {
      uid: user.uid,
      email: user.email,
      ...userData
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Signs out the current user.
 */
export const logoutAdmin = async () => {
  const currentUser = auth.currentUser;
  if (currentUser) {
    await logAdminActivity(currentUser.uid, 'ADMIN_LOGOUT');
  }
  await signOut(auth);
};
