/**
 * hooks/useQR.js
 * Camera-based QR Code scanning hook using the html5-qrcode library.
 */

import { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

export function useQR() {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const scannerRef = useRef(null);

  const startScan = (elementId, onSuccess, onError) => {
    setIsScanning(true);
    setError(null);

    // Wait for the DOM element to be fully rendered
    setTimeout(async () => {
      try {
        if (scannerRef.current) {
          await stopScan();
        }

        const html5QrCode = new Html5Qrcode(elementId);
        scannerRef.current = html5QrCode;

        await html5QrCode.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: (width, height) => {
              const size = Math.min(width, height) * 0.7;
              return { width: size, height: size };
            }
          },
          (decodedText) => {
            // On successful scan
            setIsScanning(false);
            if (onSuccess) onSuccess(decodedText);
            stopScan();
          },
          () => {
            // QR code not found in frame - silent callback
          }
        );
      } catch (err) {
        console.error('QR Scanner failed to start:', err);
        let msg = 'Failed to open camera. Check permissions.';
        if (err.message && err.message.includes('NotFoundError')) {
          msg = 'No back camera found on this device.';
        }
        setError(msg);
        setIsScanning(false);
        if (onError) onError(msg);
      }
    }, 150);
  };

  const stopScan = async () => {
    if (scannerRef.current) {
      if (scannerRef.current.isScanning) {
        try {
          await scannerRef.current.stop();
        } catch (err) {
          console.error('Error stopping QR scanner:', err);
        }
      }
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        stopScan();
      }
    };
  }, []);

  return {
    isQrScanning: isScanning,
    qrError: error,
    startQrScan: startScan,
    stopQrScan: stopScan
  };
}

export default useQR;
