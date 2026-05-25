/**
 * context/AuthContext.jsx
 * Context provider managing the authenticated worker session,
 * role validation, and login persistence.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, isFirebaseMock } from '../firebase/config';
import { loginUser, logoutUser, fetchWorkerProfile, getSavedSession } from '../firebase/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper to load profile once user is identified
  const loadProfile = async (firebaseUser) => {
    try {
      if (firebaseUser) {
        const workerProfile = await fetchWorkerProfile(firebaseUser.uid);
        
        // Verify approved status and role
        if (workerProfile.status !== 'approved') {
          setError('pending_approval');
          setUser(firebaseUser);
          setProfile(workerProfile);
        } else if (workerProfile.role !== 'asha' && workerProfile.role !== 'admin') {
          setError('invalid_role');
          setUser(null);
          setProfile(null);
        } else {
          setUser(firebaseUser);
          setProfile(workerProfile);
          setError(null);
        }
      } else {
        setUser(null);
        setProfile(null);
        setError(null);
      }
    } catch (err) {
      console.error('Error loading worker profile:', err);
      setError('profile_load_failed');
      setUser(firebaseUser);
    } finally {
      setIsLoading(false);
    }
  };

  // Sync session on mount
  useEffect(() => {
    if (isFirebaseMock) {
      const savedUser = getSavedSession();
      if (savedUser) {
        loadProfile(savedUser);
      } else {
        setIsLoading(false);
      }
    } else {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          loadProfile(firebaseUser);
        } else {
          setUser(null);
          setProfile(null);
          setIsLoading(false);
        }
      });
      return unsubscribe;
    }
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const loggedUser = await loginUser(email, password);
      await loadProfile(loggedUser);
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await logoutUser();
      setUser(null);
      setProfile(null);
      setError(null);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const ashaWorkerId = profile?.uid || null;
  const isApproved = profile?.status === 'approved';
  const isAuthenticated = !!user && isApproved && (profile?.role === 'asha' || profile?.role === 'admin');

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      ashaWorkerId,
      isAuthenticated,
      isApproved,
      isLoading,
      error,
      login,
      logout,
      isMock: isFirebaseMock
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
