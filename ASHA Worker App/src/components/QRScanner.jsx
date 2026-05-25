/**
 * components/QRScanner.jsx
 * Camera scanner view using the html5-qrcode library.
 * Displays a premium scanning reticle overlay.
 */

import React, { useEffect } from 'react';
import { useQR } from '../hooks/useQR';
import { Camera, XCircle, AlertTriangle } from 'lucide-react';

export function QRScanner({ onScanSuccess, onCancel }) {
  const { isQrScanning, qrError, startQrScan, stopQrScan } = useQR();

  useEffect(() => {
    // Start scanning on mount
    startQrScan('qr-reader-target', (uid) => {
      if (onScanSuccess) onScanSuccess(uid);
    });

    return () => {
      stopQrScan();
    };
  }, []);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-bg-card border border-border-color shadow-lg flex flex-col items-center justify-center p-4 animate-scale-in">
      <div className="flex items-center justify-between w-full mb-4">
        <div className="flex items-center gap-2 text-primary-teal">
          <Camera size={20} className="animate-pulse" />
          <span className="text-xs font-black tracking-widest uppercase">Camera Viewport</span>
        </div>
        <button 
          onClick={onCancel}
          className="text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
        >
          <XCircle size={22} />
        </button>
      </div>

      {/* Target Container */}
      <div className="relative w-full aspect-square max-w-[280px] bg-bg-secondary rounded-xl overflow-hidden border border-border-color shadow-inner">
        <div id="qr-reader-target" className="w-full h-full" />
        
        {/* Glowing HUD reticle overlay */}
        {isQrScanning && (
          <div className="absolute inset-0 border-[2px] border-primary-teal/20 pointer-events-none flex items-center justify-center">
            <div className="w-[180px] h-[180px] border-2 border-dashed border-primary-teal rounded-xl animate-[pulse_1.5s_infinite] relative">
              {/* Corner Indicators */}
              <div className="absolute -top-1.5 -left-1.5 w-4 h-4 border-t-4 border-l-4 border-primary-teal rounded-tl" />
              <div className="absolute -top-1.5 -right-1.5 w-4 h-4 border-t-4 border-r-4 border-primary-teal rounded-tr" />
              <div className="absolute -bottom-1.5 -left-1.5 w-4 h-4 border-b-4 border-l-4 border-primary-teal rounded-bl" />
              <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 border-b-4 border-r-4 border-primary-teal rounded-br" />
              
              {/* Animated scan bar */}
              <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-teal-400 to-transparent shadow-[0_0_8px_rgba(45,122,110,0.8)] animate-[scan_2s_linear_infinite]" />
            </div>
          </div>
        )}
      </div>

      {qrError && (
        <div className="mt-4 flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs w-full">
          <AlertTriangle size={16} className="shrink-0" />
          <span>{qrError}</span>
        </div>
      )}

      <p className="text-[10px] text-text-secondary font-bold uppercase tracking-wider mt-4 text-center">
        Align the patient's card QR code inside the framing.
      </p>

      {/* Embedded CSS animation for scanner beam */}
      <style>{`
        @keyframes scan {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
      `}</style>
    </div>
  );
}

export default QRScanner;
