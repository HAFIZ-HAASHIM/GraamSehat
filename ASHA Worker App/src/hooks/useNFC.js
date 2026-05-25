/**
 * hooks/useNFC.js
 * Handles reading from physical patient health cards using the browser Web NFC API.
 * Gracefully provides warning fallbacks if NFC is not supported.
 */

import { useState, useEffect, useRef } from 'react';

export function useNFC() {
  const [isSupported, setIsSupported] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const [nfcData, setNfcData] = useState(null);
  const ndefReaderRef = useRef(null);
  const controllerRef = useRef(null);

  // Check Web NFC compatibility on mount
  useEffect(() => {
    if ('NDEFReader' in window) {
      setIsSupported(true);
    } else {
      setIsSupported(false);
    }
  }, []);

  const startScan = async (onSuccess, onError) => {
    if (!isSupported) {
      const errMsg = 'NFC not supported on this device. Use QR scan instead.';
      setError(errMsg);
      if (onError) onError(errMsg);
      return;
    }

    setIsScanning(true);
    setError(null);
    setNfcData(null);

    try {
      // Create fresh AbortController to cancel reader on stop Scan
      controllerRef.current = new AbortController();
      const ndef = new NDEFReader();
      ndefReaderRef.current = ndef;

      await ndef.scan({ signal: controllerRef.current.signal });

      ndef.onreadingerror = () => {
        const errMsg = 'Failed to read NFC card. Position it correctly and try again.';
        setError(errMsg);
        if (onError) onError(errMsg);
      };

      ndef.onreading = ({ message }) => {
        for (const record of message.records) {
          if (record.recordType === 'text') {
            const textDecoder = new TextDecoder(record.encoding || 'utf-8');
            const payloadText = textDecoder.decode(record.data);
            
            setNfcData(payloadText);
            setIsScanning(false);
            if (onSuccess) onSuccess(payloadText);
            
            // Auto stop scanning on success
            stopScan();
            return;
          }
        }
        
        const errNoText = 'NFC card detected, but no valid UID record found.';
        setError(errNoText);
        if (onError) onError(errNoText);
      };

    } catch (err) {
      console.error('NFC Scan error:', err);
      let userFriendlyMsg = 'NFC scan failed. Make sure NFC is enabled in system settings.';
      if (err.name === 'NotAllowedError') {
        userFriendlyMsg = 'NFC permissions denied.';
      }
      setError(userFriendlyMsg);
      setIsScanning(false);
      if (onError) onError(userFriendlyMsg);
    }
  };

  const stopScan = () => {
    if (controllerRef.current) {
      controllerRef.current.abort();
      controllerRef.current = null;
    }
    setIsScanning(false);
    ndefReaderRef.current = null;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isScanning) {
        stopScan();
      }
    };
  }, [isScanning]);

  return {
    isNfcSupported: isSupported,
    isNfcScanning: isScanning,
    nfcError: error,
    nfcData,
    startNfcScan: startScan,
    stopNfcScan: stopScan
  };
}

export default useNFC;
