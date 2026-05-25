/**
 * pages/PendingSync.jsx
 * Pending Sync Queue.
 * Lists local records queued for upload, displays retry attempts,
 * and hosts manual synchronization handlers.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useSync } from '../context/SyncContext';
import { useOffline } from '../hooks/useOffline';
import { getPendingSyncQueue } from '../db/pendingSync.local';
import {
  ArrowLeft, RefreshCw, AlertTriangle, CloudOff, Wifi,
  Database, User, Heart, Pill, CheckCircle
} from 'lucide-react';

export function PendingSync() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { isOffline } = useOffline();
  const { pendingCount, isSyncing, triggerSync } = useSync();

  const [queueItems, setQueueItems] = useState([]);
  const [stats, setStats] = useState({ patients: 0, screenings: 0, medicines: 0 });

  const loadQueue = async () => {
    try {
      const items = await getPendingSyncQueue();
      setQueueItems(items);

      // Compute subcategory stats
      const counts = items.reduce(
        (acc, item) => {
          if (item.table in acc) acc[item.table]++;
          return acc;
        },
        { patients: 0, screenings: 0, medicines: 0 }
      );
      setStats(counts);
    } catch (err) {
      console.error('Failed to load pending queue details:', err);
    }
  };

  useEffect(() => {
    loadQueue();
    const timer = setInterval(loadQueue, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleManualSync = async () => {
    if (isOffline) return;
    await triggerSync();
    await loadQueue();
  };

  return (
    <div className="w-full flex-grow flex flex-col bg-bg-primary overflow-y-auto pb-12 animate-slide-in">

      {/* Header Row (Forest Green native band) */}
      <div className="bg-green-primary text-white px-5 py-5 rounded-b-[20px] shadow-md flex items-center shrink-0">
        <div className="max-w-xl mx-auto w-full flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="p-2.5 rounded-xl bg-white/10 border border-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
          >
            <ArrowLeft size={18} />
          </button>
          <h2 className="text-lg font-black tracking-wide">Sync Queue</h2>
        </div>
      </div>

      {/* Main Container spacing */}
      <div className="px-5 py-6 flex flex-col gap-5 max-w-xl mx-auto w-full">

        {/* Connection Status Card */}
        <div className={`p-4 rounded-2xl border flex items-center justify-between gap-4 font-semibold ${isOffline
            ? 'bg-amber-50 border-amber-200 text-amber-800'
            : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}>
          <div className="flex items-center gap-3">
            {isOffline ? (
              <CloudOff size={20} className="text-amber-600 animate-pulse" />
            ) : (
              <Wifi size={20} className="text-emerald-600" />
            )}
            <div>
              <span className="text-xs font-black uppercase tracking-wider block">
                {isOffline ? 'Offline Mode' : 'Online Mode'}
              </span>
              <p className="text-[10px] text-slate-500 font-semibold mt-0.5 leading-relaxed">
                {isOffline
                  ? 'Connect to internet to enable automatic synchronization.'
                  : 'Internet connection detected. Synchronization is available.'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Sync Summary Widget */}
        <div className="glass-panel bg-white border border-border-color p-5 flex flex-col gap-4 rounded-2xl shadow-sm text-slate-800">
          <h3 className="text-xs font-bold text-slate-500 tracking-widest uppercase border-b border-border-color pb-2">
            Pending Queue Summary
          </h3>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-bg-secondary rounded-xl text-center border border-border-color">
              <User size={16} className="text-green-primary mx-auto mb-1.5" />
              <span className="text-lg font-black text-slate-800 block">{stats.patients}</span>
              <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Patients</span>
            </div>

            <div className="p-3 bg-bg-secondary rounded-xl text-center border border-border-color">
              <Heart size={16} className="text-red-500 mx-auto mb-1.5" />
              <span className="text-lg font-black text-slate-800 block">{stats.screenings}</span>
              <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Screenings</span>
            </div>

            <div className="p-3 bg-bg-secondary rounded-xl text-center border border-border-color">
              <Pill size={16} className="text-amber-500 mx-auto mb-1.5" />
              <span className="text-lg font-black text-slate-800 block">{stats.medicines}</span>
              <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Meds</span>
            </div>
          </div>
        </div>

        {/* Detailed Item List */}
        <div className="glass-panel bg-white border border-border-color p-5 flex flex-col gap-4 rounded-2xl shadow-sm text-slate-800">
          <h3 className="text-xs font-bold text-slate-500 tracking-widest uppercase border-b border-border-color pb-2">
            Queued Record Transactions ({queueItems.length})
          </h3>

          {queueItems.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs flex flex-col items-center gap-2 font-medium">
              <CheckCircle size={28} className="text-emerald-500" />
              <span>All offline logs have been successfully synchronized!</span>
            </div>
          ) : (
            <div className="flex flex-col gap-3 max-h-[220px] overflow-y-auto pr-1">
              {queueItems.map((item) => {
                let icon = <Database size={14} className="text-slate-400" />;
                if (item.table === 'patients') icon = <User size={14} className="text-green-primary" />;
                else if (item.table === 'screenings') icon = <Heart size={14} className="text-red-500" />;
                else if (item.table === 'medicines') icon = <Pill size={14} className="text-amber-500" />;

                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-bg-secondary border border-border-color rounded-xl text-xs text-slate-700 font-semibold"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="shrink-0">{icon}</div>
                      <div className="min-w-0">
                        <span className="font-extrabold text-slate-800 capitalize block truncate">
                          {item.table.slice(0, -1)}: {item.data.name || item.data.uid}
                        </span>
                        <span className="text-[9px] text-slate-500 mt-0.5 block font-semibold">
                          Local ID: {item.localId} | Op: {item.operation}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[9px] text-slate-400 block font-bold">
                        Attempts: {item.attempts || 0}
                      </span>
                      {item.attempts > 3 && (
                        <span className="text-[8px] font-extrabold text-red-600 flex items-center gap-0.5 justify-end mt-0.5 uppercase tracking-wide">
                          <AlertTriangle size={8} /> Failure Warning
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Manual Sync Button */}
        <button
          onClick={handleManualSync}
          disabled={isSyncing || isOffline || pendingCount === 0}
          className={`w-full py-4 font-bold text-sm uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-[0.98] cursor-pointer shadow-md ${isOffline || pendingCount === 0
              ? 'bg-cream-300 text-slate-500 border border-cream-300 cursor-not-allowed'
              : 'bg-green-primary hover:bg-green-dark text-white'
            }`}
        >
          {isSyncing ? (
            <>
              <RefreshCw className="animate-spin" size={16} />
              Uploading Logs...
            </>
          ) : (
            <>
              <RefreshCw size={16} />
              Upload Queued Records
            </>
          )}
        </button>

      </div>
    </div>
  );
}

export default PendingSync;
