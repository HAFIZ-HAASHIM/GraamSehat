/**
 * components/SyncBanner.jsx
 * Modern network status banner with smooth animations
 * Google-style material design
 */

import React from 'react';
import { useOffline } from '../hooks/useOffline';
import { useSync } from '../context/SyncContext';
import { CloudOff, Wifi, CheckCircle2, RefreshCw, X } from 'lucide-react';

export function SyncBanner() {
  const { isOffline } = useOffline();
  const { pendingCount, isSyncing, toastMessage, clearToast, triggerSync } = useSync();

  const handleManualSync = (e) => {
    e.stopPropagation();
    if (!isOffline && pendingCount > 0) {
      triggerSync();
    }
  };

  return (
    <div className="w-full shrink-0 z-50">
      {/* Offline Pending Sync Banner */}
      {isOffline && pendingCount > 0 && (
        <div className="w-full bg-gradient-to-r from-amber-50 to-orange-50 border-b-2 border-amber-200 px-5 py-3 flex items-center justify-between text-amber-900 text-sm font-bold shadow-md animate-slide-down">
          <div className="flex items-center gap-3">
            <CloudOff size={18} className="text-amber-600 animate-pulse" strokeWidth={2} />
            <span>📡 Running Offline — {pendingCount} records pending sync</span>
          </div>
          <span className="bg-amber-200 py-1 px-3 rounded-full text-xs text-amber-900 font-bold uppercase tracking-tight">
            Saved Locally
          </span>
        </div>
      )}

      {/* Online but has pending items banner */}
      {!isOffline && pendingCount > 0 && (
        <div 
          onClick={handleManualSync}
          className="w-full bg-gradient-to-r from-teal-50 to-teal-100 border-b-2 border-teal-300 hover:from-teal-100 hover:to-teal-150 cursor-pointer px-5 py-3 flex items-center justify-between text-teal-900 text-sm font-bold shadow-md transition-all duration-300 animate-slide-down"
        >
          <div className="flex items-center gap-3">
            <Wifi size={18} className="text-teal-600" strokeWidth={2} />
            <span>✅ Online — {pendingCount} {pendingCount === 1 ? 'record' : 'records'} ready. Tap to sync.</span>
          </div>
          <button 
            disabled={isSyncing}
            className="flex items-center gap-2 bg-white hover:bg-teal-50 text-teal-700 font-bold py-1.5 px-4 rounded-2xl text-xs uppercase border-2 border-teal-300 transition-all duration-300 disabled:opacity-70"
          >
            {isSyncing ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                Syncing...
              </>
            ) : (
              'Sync Now'
            )}
          </button>
        </div>
      )}

      {/* Sync completed successfully Toast */}
      {toastMessage && (
        <div className="w-full bg-gradient-to-r from-green-50 to-emerald-50 border-b-2 border-green-300 px-5 py-3 flex items-center justify-between text-green-900 text-sm font-bold shadow-md animate-slide-down">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={18} className="text-green-600 fill-green-100" strokeWidth={2} />
            <span>✨ {toastMessage.text}</span>
          </div>
          <button 
            onClick={clearToast}
            className="text-green-600 hover:text-green-800 transition-all duration-300 p-1 rounded-lg hover:bg-green-100"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>
      )}
    </div>
  );
}

