/**
 * pages/AdminChecklist.jsx
 * Interactive developer checklist page.
 * Provides guide logs and code snippets for setting up Firestore rules,
 * indexes, Leaflet heatmaps, and admin verification.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckSquare, Square, Clipboard, CheckCircle2, BookOpen, Key, Map, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export function AdminChecklist() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [checklist, setChecklist] = useState(() => {
    const saved = localStorage.getItem('graamsehat_checklist');
    return saved ? JSON.parse(saved) : {
      packages: true,
      rules: false,
      firstAdmin: false,
      compoundIndexes: false,
      geoData: false,
      serviceWorker: false
    };
  });

  useEffect(() => {
    localStorage.setItem('graamsehat_checklist', JSON.stringify(checklist));
  }, [checklist]);

  const toggleCheck = (key) => {
    setChecklist({ ...checklist, [key]: !checklist[key] });
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const firestoreRules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function getUserData() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data;
    }
    function isAdmin() {
      return request.auth != null && getUserData().role == 'admin';
    }
    function isApprovedAsha() {
      return request.auth != null 
        && getUserData().role == 'asha' 
        && getUserData().status == 'approved';
    }

    // ASHA Worker details
    match /users/{userId} {
      allow read, write: if request.auth != null && (request.auth.uid == userId || isAdmin());
    }

    // Patient records
    match /patients/{patientUid} {
      allow read, write: if isApprovedAsha() || isAdmin();
      
      // Screenings subcollection
      match /screenings/{screeningId} {
        allow read, write: if isApprovedAsha() || isAdmin();
      }
      
      // Medicine distribution logs subcollection
      match /medicines/{logId} {
        allow read, write: if isApprovedAsha() || isAdmin();
      }
    }
  }
}`;

  return (
    <div className="w-full flex-grow flex flex-col bg-bg-primary overflow-y-auto pb-12 animate-slide-in">

      {/* Header Row (Forest Green native band) */}
      <div className="bg-green-primary text-white px-5 py-5 rounded-b-[20px] shadow-md flex items-center shrink-0">
        <div className="max-w-xl mx-auto w-full flex items-center gap-3">
          <button
            onClick={() => navigate('/settings')}
            className="p-2.5 rounded-xl bg-white/10 border border-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
          >
            <ArrowLeft size={18} />
          </button>
          <h2 className="text-lg font-black tracking-wide flex items-center gap-2">
            <BookOpen size={18} />
            Developer Checklist
          </h2>
        </div>
      </div>

      {/* Main content padding */}
      <div className="px-5 py-6 flex flex-col gap-6 text-slate-800 max-w-xl mx-auto w-full">
        <div>
          <p className="text-slate-600 text-xs font-semibold leading-relaxed">
            Follow these steps to link your local ASHA Worker application to Firebase and enable full map operations.
          </p>
        </div>

        {/* Interactive Checklist Cards */}
        <div className="glass-panel bg-white border border-cream-300 p-5 flex flex-col gap-4 rounded-2xl shadow-sm">
          <h3 className="text-xs font-bold text-slate-500 tracking-widest uppercase border-b border-cream-200 pb-2">
            Task Checklist
          </h3>

          <div className="flex flex-col gap-4">
            {/* Task 1 */}
            <div className="flex items-start gap-3 cursor-pointer" onClick={() => toggleCheck('packages')}>
              {checklist.packages ? (
                <CheckSquare className="text-green-primary shrink-0 mt-0.5" />
              ) : (
                <Square className="text-slate-400 shrink-0 mt-0.5" />
              )}
              <div>
                <h4 className={`text-sm font-extrabold ${checklist.packages ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                  Install Dependencies
                </h4>
                <p className="text-[11px] text-slate-500 font-semibold mt-0.5 leading-normal">
                  <code>npm install firebase react-leaflet leaflet recharts papaparse react-router-dom dexie html5-qrcode lucide-react</code>
                </p>
              </div>
            </div>

            {/* Task 2 */}
            <div className="flex items-start gap-3 cursor-pointer" onClick={() => toggleCheck('rules')}>
              {checklist.rules ? (
                <CheckSquare className="text-green-primary shrink-0 mt-0.5" />
              ) : (
                <Square className="text-slate-400 shrink-0 mt-0.5" />
              )}
              <div>
                <h4 className={`text-sm font-extrabold ${checklist.rules ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                  Set Up Firestore Security Rules
                </h4>
                <p className="text-[11px] text-slate-500 font-semibold mt-0.5 leading-normal">
                  Paste the approved ASHA and Admin access rules inside Firestore Rules. (Snippet below)
                </p>
              </div>
            </div>

            {/* Task 3 */}
            <div className="flex items-start gap-3 cursor-pointer" onClick={() => toggleCheck('firstAdmin')}>
              {checklist.firstAdmin ? (
                <CheckSquare className="text-green-primary shrink-0 mt-0.5" />
              ) : (
                <Square className="text-slate-400 shrink-0 mt-0.5" />
              )}
              <div>
                <h4 className={`text-sm font-extrabold ${checklist.firstAdmin ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                  Create First Admin Worker
                </h4>
                <p className="text-[11px] text-slate-500 font-semibold mt-0.5 leading-normal">
                  Sign up in Authentication, copy UID to Firestore <code>users/&lt;UID&gt;</code> with <code>role: 'admin', status: 'approved'</code>.
                </p>
              </div>
            </div>

            {/* Task 4 */}
            <div className="flex items-start gap-3 cursor-pointer" onClick={() => toggleCheck('compoundIndexes')}>
              {checklist.compoundIndexes ? (
                <CheckSquare className="text-green-primary shrink-0 mt-0.5" />
              ) : (
                <Square className="text-slate-400 shrink-0 mt-0.5" />
              )}
              <div>
                <h4 className={`text-sm font-extrabold ${checklist.compoundIndexes ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                  Firestore Indexes
                </h4>
                <p className="text-[11px] text-slate-500 font-semibold mt-0.5 leading-normal">
                  Create index on <code>patients</code>: (district + riskLevel), (ashaWorkerId + createdAt).
                </p>
              </div>
            </div>

            {/* Task 5 */}
            <div className="flex items-start gap-3 cursor-pointer" onClick={() => toggleCheck('geoData')}>
              {checklist.geoData ? (
                <CheckSquare className="text-green-primary shrink-0 mt-0.5" />
              ) : (
                <Square className="text-slate-400 shrink-0 mt-0.5" />
              )}
              <div>
                <h4 className={`text-sm font-extrabold ${checklist.geoData ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                  Load geoData.js Coordinates
                </h4>
                <p className="text-[11px] text-slate-500 font-semibold mt-0.5 leading-normal">
                  Loaded Karnataka district latitude/longitude coordinates in <code>/utils/geoData.js</code>.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Copyable Security Rules Snippet */}
        <div className="glass-panel bg-white border border-cream-300 p-5 flex flex-col gap-4 rounded-2xl shadow-sm text-slate-800">
          <div className="flex items-center justify-between border-b border-cream-200 pb-2">
            <h3 className="text-xs font-bold text-slate-500 tracking-widest uppercase flex items-center gap-1.5">
              <Key size={16} className="text-green-primary" />
              Firestore Rules
            </h3>
            <button
              onClick={() => copyToClipboard(firestoreRules, 1)}
              className="flex items-center gap-1 text-[11px] font-bold py-1 px-3 bg-cream-50 border border-cream-300 rounded-lg text-slate-700 hover:bg-cream-100 transition-colors cursor-pointer"
            >
              {copiedIndex === 1 ? (
                <>
                  <CheckCircle2 size={12} className="text-green-primary" />
                  Copied
                </>
              ) : (
                <>
                  <Clipboard size={12} />
                  Copy Rules
                </>
              )}
            </button>
          </div>
          <pre className="text-[10px] font-mono bg-cream-50 p-3 rounded-lg overflow-x-auto text-slate-700 max-h-48 border border-cream-300">
            {firestoreRules}
          </pre>
        </div>

        {/* Geo Data Snippet Hint */}
        <div className="glass-panel bg-white border border-cream-300 p-5 flex flex-col gap-4 rounded-2xl shadow-sm text-slate-800">
          <h3 className="text-xs font-bold text-slate-500 tracking-widest uppercase flex items-center gap-1.5 border-b border-cream-200 pb-2">
            <Map size={16} className="text-green-primary" />
            District Heatmaps
          </h3>
          <p className="text-xs text-slate-600 leading-normal font-semibold">
            For visual heatmaps, make sure to add district geolocations inside <code>src/utils/geoData.js</code>.
          </p>
          <pre className="text-[10px] font-mono bg-cream-50 p-3 rounded-lg overflow-x-auto text-slate-700 border border-cream-300">
            {`export const DISTRICT_COORDINATES = {
  "Bangalore Urban": [12.9716, 77.5946],
  "Mysore": [12.2958, 76.6394],
  "Belgaum": [15.8497, 74.4977],
  "Gulbarga": [17.3297, 76.8343],
  // ... coordinates loaded inside /utils/geoData.js
};`}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default AdminChecklist;
