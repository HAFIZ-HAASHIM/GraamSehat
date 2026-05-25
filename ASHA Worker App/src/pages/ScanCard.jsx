/**
 * pages/ScanCard.jsx
 * Patient Identification Panel.
 * Implements NFC tap, QR scan, and 6-digit manual Luhn verification to load profiles.
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useOffline } from '../hooks/useOffline';
import { validateLuhn } from '../utils/uidGenerator';
import { getPatientByUidLocal, savePatientLocal } from '../db/patients.local';
import { fetchPatientFromFirestore } from '../firebase/patients';
import { ScanOption } from '../components/ScanOption';
import { QRScanner } from '../components/QRScanner';
import { NFCReader } from '../components/NFCReader';
import { Scan, Tablet, Keyboard, ArrowLeft, PlusCircle, AlertCircle } from 'lucide-react';

export function ScanCard() {
  const { t } = useLanguage();
  const { isOnline } = useOffline();
  const navigate = useNavigate();

  const [activeChannel, setActiveChannel] = useState(null); // 'nfc' | 'qr' | 'manual' | null
  const [digits, setDigits] = useState(['', '', '', '', '', '']); // 6-digit UID
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [patientNotFound, setPatientNotFound] = useState(null); // stores the missing UID if not found

  const inputRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  // Handles manual digit change
  const handleDigitChange = (value, idx) => {
    setErrorMsg(null);
    const numeric = value.replace(/\D/g, '');

    const newDigits = [...digits];
    newDigits[idx] = numeric.slice(-1); // only keep last digit
    setDigits(newDigits);

    // Auto focus next box
    if (numeric && idx < 5) {
      inputRefs[idx + 1].current.focus();
    }
  };

  // Handles backspace focus shifting
  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
      inputRefs[idx - 1].current.focus();
    }
  };

  // Triggers Luhn verification and database checks when 6 digits are complete
  useEffect(() => {
    const uid = digits.join('');
    if (uid.length === 6) {
      verifyAndLoadUID(uid);
    }
  }, [digits]);

  const verifyAndLoadUID = async (uid) => {
    setIsLoading(true);
    setErrorMsg(null);
    setPatientNotFound(null);

    // 1. Validate Luhn Checksum
    if (!validateLuhn(uid)) {
      setErrorMsg(t('scan.invalidUid'));
      setIsLoading(false);
      return;
    }

    try {
      // 2. Search Local Dexie DB first
      const localPatient = await getPatientByUidLocal(uid);
      if (localPatient) {
        navigate(`/patient/${uid}`);
        return;
      }

      // 3. If online, search Firestore
      if (isOnline) {
        const remotePatient = await fetchPatientFromFirestore(uid);
        if (remotePatient) {
          // Sync remote patient record back to local database
          await savePatientLocal({
            ...remotePatient,
            syncStatus: 'synced'
          });
          navigate(`/patient/${uid}`);
          return;
        }
      }

      // 4. Patient not found anywhere
      setPatientNotFound(uid);
    } catch (error) {
      console.error('Error finding patient UID:', error);
      setErrorMsg('An error occurred during database lookup.');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset inputs
  const resetScanner = () => {
    setActiveChannel(null);
    setDigits(['', '', '', '', '', '']);
    setErrorMsg(null);
    setPatientNotFound(null);
  };

  return (
    <div className="w-full flex-grow flex flex-col bg-bg-primary overflow-y-auto pb-12 animate-slide-in">

      {/* Header Row (Forest Green Native Band) */}
      <div className="bg-green-primary text-white px-5 py-5 rounded-b-[20px] shadow-md flex items-center shrink-0">
        <div className="max-w-xl mx-auto w-full flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="p-2.5 rounded-xl bg-white/10 border border-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
          >
            <ArrowLeft size={18} />
          </button>
          <h2 className="text-lg font-black tracking-wide">
            {t('scan.title')}
          </h2>
        </div>
      </div>

      {/* Main content elements with secure layout padding */}
      <div className="px-5 py-6 flex flex-col gap-6 max-w-xl mx-auto w-full">

        {/* Dynamic Display Area */}
        {activeChannel === 'nfc' && (
          <NFCReader
            onScanSuccess={verifyAndLoadUID}
            onCancel={resetScanner}
          />
        )}

        {activeChannel === 'qr' && (
          <QRScanner
            onScanSuccess={verifyAndLoadUID}
            onCancel={resetScanner}
          />
        )}

        {activeChannel === 'manual' && (
          <div className="glass-panel bg-white border border-cream-300 p-6 flex flex-col gap-5 rounded-2xl shadow-sm animate-scale-in">
            <h3 className="text-sm font-extrabold text-green-dark border-b border-cream-200 pb-2">
              Enter 6-Digit Health ID
            </h3>

            {/* 6 Digit Inputs row (Corrected invisible text color to text-slate-800) */}
            <div className="flex justify-between gap-2 py-4">
              {digits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={inputRefs[idx]}
                  type="text"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  value={digit}
                  onChange={(e) => handleDigitChange(e.target.value, idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  className="w-12 h-14 text-center text-xl font-black rounded-xl bg-bg-secondary border border-border-color text-slate-800 focus:border-green-primary focus:ring-4 focus:ring-green-primary/10 transition-all"
                  maxLength={1}
                  disabled={isLoading}
                />
              ))}
            </div>

            <button
              onClick={resetScanner}
              className="py-3 px-4 text-xs font-bold bg-white border border-cream-300 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Back to Options
            </button>
          </div>
        )}

        {/* Root Scanning Channel Options */}
        {!activeChannel && (
          <div className="flex flex-col gap-3">
            <ScanOption
              title={t('scan.nfcTitle')}
              desc={t('scan.nfcDesc')}
              icon={Tablet}
              onClick={() => setActiveChannel('nfc')}
            />

            <ScanOption
              title={t('scan.qrTitle')}
              desc={t('scan.qrDesc')}
              icon={Scan}
              onClick={() => setActiveChannel('qr')}
            />

            <ScanOption
              title={t('scan.manualTitle')}
              desc={t('scan.manualDesc')}
              icon={Keyboard}
              onClick={() => setActiveChannel('manual')}
            />
          </div>
        )}

        {/* Error Feedback Messages */}
        {errorMsg && (
          <div className="flex items-center gap-2.5 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-800 text-xs font-semibold animate-scale-in">
            <AlertCircle size={18} className="shrink-0 text-red-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Patient Not Found Prompt */}
        {patientNotFound && (
          <div className="glass-panel bg-white border border-cream-300 p-6 flex flex-col gap-4 rounded-2xl shadow-sm text-center animate-scale-in">
            <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
              <PlusCircle size={24} />
            </div>
            <div>
              <h4 className="text-green-dark font-extrabold">{t('scan.notFoundTitle')}</h4>
              <p className="text-slate-500 text-xs mt-1.5 leading-relaxed font-semibold">
                {t('scan.notFoundDesc', { uid: patientNotFound })}
              </p>
            </div>

            <button
              onClick={() => navigate(`/register?uid=${patientNotFound}`)}
              className="py-3 px-4 bg-green-primary hover:bg-green-dark rounded-xl text-white font-bold text-sm tracking-wide shadow-md transition-transform active:scale-[0.99] cursor-pointer"
            >
              {t('scan.registerBtn')}
            </button>
          </div>
        )}

        {/* Skipping Scan / Shortcut to blank Register */}
        {!activeChannel && (
          <button
            onClick={() => navigate('/register')}
            className="w-full py-3.5 px-4 bg-white border border-cream-300 rounded-xl text-slate-700 hover:bg-slate-50 font-bold text-xs tracking-wider transition-colors cursor-pointer"
          >
            {t('scan.noCardOption')}
          </button>
        )}

      </div>
    </div>
  );
}

export default ScanCard;
