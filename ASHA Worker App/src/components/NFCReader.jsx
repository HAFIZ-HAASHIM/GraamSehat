/**
 * components/NFCReader.jsx
 * Tap card animation and status logger for Web NFC scanning.
 */

import React, { useEffect } from 'react';
import { useNFC } from '../hooks/useNFC';
import { Smartphone, Radio, AlertTriangle } from 'lucide-react';

export function NFCReader({ onScanSuccess, onCancel }) {
  const { isNfcSupported, isNfcScanning, nfcError, startNfcScan, stopNfcScan } = useNFC();

  useEffect(() => {
    startNfcScan((uid) => {
      if (onScanSuccess) onScanSuccess(uid);
    });

    return () => {
      stopNfcScan();
    };
  }, []);

  return (
    <div className="relative w-full rounded-2xl bg-bg-card border border-border-color shadow-lg p-6 flex flex-col items-center justify-center animate-scale-in text-center">
      <div className="flex items-center justify-between w-full mb-6">
        <div className="flex items-center gap-2 text-primary-teal">
          <Radio size={20} className="animate-pulse" />
          <span className="text-xs font-black tracking-widest uppercase">NFC Reader Active</span>
        </div>
      </div>

      {!isNfcSupported ? (
        <div className="flex flex-col items-center py-6 px-4">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center mb-4">
            <AlertTriangle size={32} />
          </div>
          <h4 className="text-text-primary font-extrabold mb-2 uppercase tracking-wide">NFC Unavailable</h4>
          <p className="text-text-secondary text-xs font-semibold max-w-[240px]">
            NFC is not supported by this browser or device. Please select QR Code scan.
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          {/* Animated NFC Radar Rings */}
          <div className="relative w-32 h-32 flex items-center justify-center mb-8">
            <div className="absolute w-24 h-24 rounded-full bg-primary-teal/5 border border-primary-teal/10 animate-[ping_2s_infinite]" />
            <div className="absolute w-28 h-28 rounded-full bg-primary-teal/5 border border-primary-teal/15 animate-[ping_2.5s_infinite]" />
            
            <div className="w-20 h-20 rounded-full bg-primary-teal/10 border border-primary-teal/20 shadow-[0_0_15px_rgba(45,122,110,0.2)] flex items-center justify-center text-primary-teal z-10">
              <Smartphone size={36} className="animate-[bounce_2s_infinite]" />
            </div>
          </div>

          <h4 className="text-text-primary font-extrabold mb-2 uppercase tracking-wide">Ready to Scan</h4>
          <p className="text-text-secondary text-xs font-semibold max-w-[260px] leading-relaxed">
            Hold the patient's card against the back of your phone near the camera area.
          </p>
        </div>
      )}

      {nfcError && (
        <div className="mt-6 flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs w-full text-left">
          <AlertTriangle size={16} className="shrink-0" />
          <span>{nfcError}</span>
        </div>
      )}

      <button 
        onClick={onCancel}
        className="w-full mt-6 py-3 px-4 bg-bg-secondary hover:bg-bg-secondary/70 border border-border-color rounded-xl text-text-primary font-bold text-sm transition-colors cursor-pointer"
      >
        Cancel NFC Scan
      </button>
    </div>
  );
}

export default NFCReader;
