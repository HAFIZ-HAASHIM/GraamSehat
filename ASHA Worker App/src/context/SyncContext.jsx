/**
 * context/SyncContext.jsx
 * Tracks the size of the offline database synchronization queue,
 * and automatically triggers Firestore uploads when the app is online.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useOffline } from '../hooks/useOffline';
import { getPendingCount } from '../db/pendingSync.local';
import { syncPendingRecords } from '../firebase/sync';

const SyncContext = createContext();

export const SyncProvider = ({ children }) => {
  const { isOnline } = useOffline();
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncResult, setLastSyncResult] = useState(null); // { synced, failed }
  const [toastMessage, setToastMessage] = useState(null);

  // Updates the local count of pending queue items
  const updatePendingCount = useCallback(async () => {
    const count = await getPendingCount();
    setPendingCount(count);
  }, []);

  // Performs sync execution
  const triggerSync = useCallback(async () => {
    if (isSyncing || !isOnline) return;
    
    const count = await getPendingCount();
    if (count === 0) return;

    setIsSyncing(true);
    setToastMessage(null);
    
    try {
      const result = await syncPendingRecords();
      setLastSyncResult(result);
      await updatePendingCount();

      if (result.syncedCount > 0) {
        setToastMessage({
          type: 'success',
          text: `${result.syncedCount} records uploaded successfully!`
        });
      }
    } catch (error) {
      console.error('Auto sync execution error:', error);
    } finally {
      setIsSyncing(false);
      // Auto clear success toast after 4s
      setTimeout(() => setToastMessage(null), 4000);
    }
  }, [isOnline, isSyncing, updatePendingCount]);

  // Poll local DB queue count and trigger sync when network changes
  useEffect(() => {
    updatePendingCount();
    
    // Setup short polling interval to check queue size (e.g. every 5s)
    const interval = setInterval(updatePendingCount, 5000);
    return () => clearInterval(interval);
  }, [updatePendingCount]);

  // Auto trigger sync on transition to online
  useEffect(() => {
    if (isOnline) {
      triggerSync();
    }
  }, [isOnline, triggerSync]);

  return (
    <SyncContext.Provider value={{
      pendingCount,
      isSyncing,
      lastSyncResult,
      toastMessage,
      clearToast: () => setToastMessage(null),
      triggerSync,
      updatePendingCount
    }}>
      {children}
    </SyncContext.Provider>
  );
};

export const useSync = () => useContext(SyncContext);
export default SyncContext;
