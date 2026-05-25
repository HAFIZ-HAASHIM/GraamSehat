import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useSync } from '../context/SyncContext';
import { useTheme } from '../context/ThemeContext';
import { db } from '../db/localDB';
import { setMedicineStock } from '../db/medicines.local';
import {
  ArrowLeft, LogOut, Database, User, Trash2,
  RefreshCcw, Sparkles, BookOpen, Check, Sun, Moon, Info, Settings as SettingsIcon
} from 'lucide-react';

export function Settings() {
  const { profile, logout } = useAuth();
  const { t, language, changeLanguage } = useLanguage();
  const { pendingCount, isSyncing, triggerSync } = useSync();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [prepopulating, setPrepopulating] = useState(false);
  const [prepopulateSuccess, setPrepopulateSuccess] = useState(false);
  const [dbCleared, setDbCleared] = useState(false);

  // Profile Edit fields
  const [workerName, setWorkerName] = useState(profile?.name || 'Rupa Devi');
  const [subcentreName, setSubcentreName] = useState(profile?.subcentre || 'Kengeri Sub-Centre');
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Wipes all local database records
  const handleWipeDatabase = async () => {
    if (window.confirm('Wipe local database? This deletes all offline unsynced patients, screenings and distributed meds!')) {
      try {
        await db.patients.clear();
        await db.screenings.clear();
        await db.medicines.clear();
        await db.syncQueue.clear();
        localStorage.removeItem('graamsehat_serial');
        localStorage.removeItem('graamsehat_mock_session');
        setDbCleared(true);
        setTimeout(() => setDbCleared(false), 3000);
      } catch (err) {
        console.error('Failed to wipe local db:', err);
      }
    }
  };

  // Pre-load mock data for offline simulation
  const handlePrepopulateMockData = async () => {
    setPrepopulating(true);
    setPrepopulateSuccess(false);
    try {
      await db.patients.clear();
      await db.screenings.clear();
      await db.medicines.clear();
      await db.syncQueue.clear();

      localStorage.setItem('graamsehat_serial', '68550');

      const mockPatients = [
        {
          uid: '685508',
          name: 'Basavaraj Gowda',
          age: 52,
          gender: 'Male',
          bloodGroup: 'O+',
          village: 'Hanchipura',
          district: 'Bangalore Urban',
          household: 'Door 10',
          phone: '9845012345',
          altPhone: '',
          familyPhone: '',
          aadhaarEncrypted: '123456789012',
          photo: '',
          ashaWorkerId: 'mock_asha_2901',
          createdAt: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString(),
          currentRiskLevel: 'RED',
          lastScreenedAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
          nextApptDate: new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString(),
          syncStatus: 'synced'
        },
        {
          uid: '685516',
          name: 'Lakshmi Devi',
          age: 38,
          gender: 'Female',
          bloodGroup: 'A+',
          village: 'Kengeri Village',
          district: 'Bangalore Urban',
          household: 'Door 45',
          phone: '9448011223',
          altPhone: '9448099887',
          familyPhone: '',
          aadhaarEncrypted: '556677889900',
          photo: '',
          ashaWorkerId: 'mock_asha_2901',
          createdAt: new Date(Date.now() - 8 * 24 * 3600 * 1000).toISOString(),
          currentRiskLevel: 'YELLOW',
          lastScreenedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
          nextApptDate: new Date(Date.now() + 28 * 24 * 3600 * 1000).toISOString(),
          syncStatus: 'synced'
        },
        {
          uid: '685524',
          name: 'Ramesh Gowda',
          age: 32,
          gender: 'Male',
          bloodGroup: 'B+',
          village: 'Kengeri Village',
          district: 'Bangalore Urban',
          household: 'Door 8/B',
          phone: '9900112233',
          altPhone: '',
          familyPhone: '',
          aadhaarEncrypted: '',
          noAadhaar: true,
          photo: '',
          ashaWorkerId: 'mock_asha_2901',
          createdAt: new Date(Date.now() - 12 * 24 * 3600 * 1000).toISOString(),
          currentRiskLevel: 'GREEN',
          lastScreenedAt: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString(),
          nextApptDate: new Date(Date.now() + 170 * 24 * 3600 * 1000).toISOString(),
          syncStatus: 'synced'
        }
      ];

      for (const pat of mockPatients) {
        await db.patients.add(pat);
      }

      const mockScreenings = [
        {
          uid: '685508',
          date: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
          idrsScore: 60,
          bpSystolic: 145,
          bpDiastolic: 92,
          glucoseLevel: 140,
          riskLevel: 'STAGE_2',
          overallRisk: 'RED',
          doctorsNote: {
            explanation: 'High screening indicators or Stage 2 BP. Urgent PHC reference is required.',
            actions: [
              'Visit Primary Health Centre (PHC) immediately.',
              'Begin regular medication as prescribed by clinical doctor.',
              'Avoid high physical strain and rest.',
              'Check BP daily.',
              'Coordinate subcentre follow-up.'
            ],
            nextCheckupDays: 7
          },
          nextApptDate: new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString(),
          symptoms: ['thirst', 'tiredness'],
          ashaWorkerId: 'mock_asha_2901',
          syncStatus: 'synced'
        },
        {
          uid: '685516',
          date: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
          idrsScore: 30,
          bpSystolic: 132,
          bpDiastolic: 84,
          glucoseLevel: 110,
          riskLevel: 'STAGE_1',
          overallRisk: 'YELLOW',
          doctorsNote: {
            explanation: 'Borderline indicators suggest moderate risk. Lifestyle changes recommended.',
            actions: [
              'Reduce salt intake.',
              'Confirm glucose reading within 30 days at PHC.',
              'Introduce 30 minutes walks.',
              'Monitor BP monthly.'
            ],
            nextCheckupDays: 30
          },
          nextApptDate: new Date(Date.now() + 28 * 24 * 3600 * 1000).toISOString(),
          symptoms: ['none'],
          ashaWorkerId: 'mock_asha_2901',
          syncStatus: 'synced'
        }
      ];

      for (const scr of mockScreenings) {
        await db.screenings.add(scr);
      }

      setMedicineStock('Metformin 500mg', 8);
      setMedicineStock('Amlodipine 5mg', 45);
      setMedicineStock('Atenolol 50mg', 20);
      setMedicineStock('ORS Sachet', 12);
      setMedicineStock('Iron Tablets', 50);
      setMedicineStock('Folic Acid', 50);

      setPrepopulateSuccess(true);
      setTimeout(() => setPrepopulateSuccess(false), 4000);
    } catch (err) {
      console.error('Prepopulation failed:', err);
    } finally {
      setPrepopulating(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="w-full flex flex-col bg-bg-primary animate-slide-in">

      {/* Header Row (Teal gradient back banner) */}
      <div className="bg-gradient-to-r from-primary-teal to-[#3ea393] text-white px-5 py-5 rounded-2xl shadow flex items-center justify-between shrink-0 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="p-2.5 rounded-xl bg-white/10 border border-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
          >
            <ArrowLeft size={18} />
          </button>
          <h2 className="text-sm font-black tracking-widest uppercase">System Settings</h2>
        </div>
      </div>

      {/* Settings Sections Grid */}
      <div className="flex flex-col gap-6 max-w-xl mx-auto w-full pb-16">

        {/* SECTION 1: ASHA Worker Profile with editable Avatar */}
        <div className="glass-panel bg-bg-card border border-border-color p-5 flex flex-col gap-4 rounded-2xl shadow-sm text-text-primary">
          <h3 className="text-xs font-bold text-text-secondary tracking-widest uppercase border-b border-border-color pb-2 flex items-center gap-1.5">
            <User size={14} className="text-primary-teal" />
            ASHA Worker Profile
          </h3>

          <div className="flex flex-col sm:flex-row items-center gap-4 py-2 border-b border-border-color/50 pb-4">
            <div className="w-16 h-16 rounded-2xl bg-primary-teal/15 text-primary-teal flex items-center justify-center font-extrabold text-2xl uppercase shadow-inner shrink-0">
              {workerName.charAt(0) || 'A'}
            </div>
            <div className="flex-1 w-full text-center sm:text-left">
              {isEditingProfile ? (
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={workerName}
                    onChange={(e) => setWorkerName(e.target.value)}
                    className="py-1.5 px-3 text-xs font-bold"
                    placeholder="Worker Name"
                  />
                  <input
                    type="text"
                    value={subcentreName}
                    onChange={(e) => setSubcentreName(e.target.value)}
                    className="py-1.5 px-3 text-xs font-bold"
                    placeholder="Subcentre Name"
                  />
                </div>
              ) : (
                <>
                  <h4 className="text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">{workerName}</h4>
                  <p className="text-[11px] text-text-secondary font-semibold mt-1">
                    📍 {subcentreName} | District: {profile?.district || 'Bangalore Urban'}
                  </p>
                </>
              )}
            </div>

            <button
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="py-1.5 px-3 bg-bg-secondary hover:bg-border-color rounded-xl text-[10px] font-black uppercase tracking-wider text-text-primary transition-colors cursor-pointer shrink-0"
            >
              {isEditingProfile ? 'Done' : 'Edit info'}
            </button>
          </div>

          <div className="flex justify-between items-center text-xs font-semibold text-text-secondary">
            <span>System User Role</span>
            <span className="text-[10px] bg-primary-teal/15 text-primary-teal py-0.5 px-2 rounded-full font-black uppercase tracking-wider">
              {profile?.role || 'asha'}
            </span>
          </div>
        </div>

        {/* SECTION 2: Interface Display (Dark Mode & Language Toggles) */}
        <div className="glass-panel bg-bg-card border border-border-color p-5 flex flex-col gap-4 rounded-2xl shadow-sm text-text-primary">
          <h3 className="text-xs font-bold text-text-secondary tracking-widest uppercase border-b border-border-color pb-2 flex items-center gap-1.5">
            <SettingsIcon size={14} className="text-primary-teal" />
            Display & Locale Settings
          </h3>

          {/* Theme Mode Segmented Controller */}
          <div className="flex flex-col gap-2.5">
            <span className="text-[9px] font-black text-text-secondary uppercase tracking-widest">
              Interface Color Theme
            </span>
            <div className="grid grid-cols-2 gap-2 bg-bg-secondary p-1 rounded-xl">
              <button
                onClick={() => theme === 'dark' && toggleTheme()}
                className={`py-2 px-3 rounded-lg text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-all ${theme === 'light'
                    ? 'bg-bg-card text-primary-teal shadow'
                    : 'text-text-secondary hover:text-text-primary'
                  }`}
              >
                <Sun size={14} />
                Light Mode
              </button>
              <button
                onClick={() => theme === 'light' && toggleTheme()}
                className={`py-2 px-3 rounded-lg text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-all ${theme === 'dark'
                    ? 'bg-bg-card text-primary-teal shadow'
                    : 'text-text-secondary hover:text-text-primary'
                  }`}
              >
                <Moon size={14} />
                Dark Mode
              </button>
            </div>
          </div>

          {/* Language flags switcher */}
          <div className="flex flex-col gap-2.5 border-t border-border-color pt-4 mt-2">
            <span className="text-[9px] font-black text-text-secondary uppercase tracking-widest">
              Application Language
            </span>
            <div className="grid grid-cols-2 gap-2 bg-bg-secondary p-1 rounded-xl">
              <button
                onClick={() => changeLanguage('en')}
                className={`py-2 px-3 rounded-lg text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-all ${language === 'en'
                    ? 'bg-bg-card text-primary-teal shadow'
                    : 'text-text-secondary hover:text-text-primary'
                  }`}
              >
                🇬🇧 English
              </button>
              <button
                onClick={() => changeLanguage('kn')}
                className={`py-2 px-3 rounded-lg text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-all ${language === 'kn'
                    ? 'bg-bg-card text-primary-teal shadow'
                    : 'text-text-secondary hover:text-text-primary'
                  }`}
              >
                🇮🇳 ಕನ್ನಡ
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 3: Database & Sync Status with Circular progress indicator mockup */}
        <div className="glass-panel bg-bg-card border border-border-color p-5 flex flex-col gap-4 rounded-2xl shadow-sm text-text-primary">
          <h3 className="text-xs font-bold text-text-secondary tracking-widest uppercase border-b border-border-color pb-2 flex items-center gap-1.5">
            <Database size={14} className="text-primary-teal" />
            Database Synchronization
          </h3>

          <div className="flex items-center gap-4 py-2 border-b border-border-color/50 pb-4">
            {/* Mock Circular Progress Indicator for Sync status */}
            <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  className="stroke-bg-secondary"
                  strokeWidth="6"
                  fill="transparent"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  className={pendingCount > 0 ? 'stroke-accent-gold' : 'stroke-emerald-500'}
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray="163"
                  strokeDashoffset={pendingCount > 0 ? 163 - (163 * 0.7) : 0} // visual status fill
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-black text-xs">
                {pendingCount > 0 ? '70%' : '100%'}
              </div>
            </div>

            <div className="flex-1">
              <h4 className="text-xs font-extrabold uppercase tracking-wide">Offline logs queue</h4>
              <p className="text-text-secondary text-[11px] font-semibold mt-0.5 leading-relaxed">
                {pendingCount > 0
                  ? `You have ${pendingCount} distribution logs pending synchronization to cloud.`
                  : 'All client activities are synchronized.'}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            {pendingCount > 0 && (
              <button
                onClick={triggerSync}
                disabled={isSyncing}
                className="w-full py-3 px-4 bg-primary-teal hover:bg-[#225c53] text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 rounded-xl cursor-pointer shadow-sm transition-transform active:scale-98"
              >
                {isSyncing ? (
                  <>
                    <RefreshCw className="animate-spin" size={14} />
                    Syncing Records...
                  </>
                ) : (
                  <>
                    <RefreshCw size={14} />
                    Synchronize Queue ({pendingCount})
                  </>
                )}
              </button>
            )}

            {/* Load Mock Demo Data */}
            <button
              onClick={handlePrepopulateMockData}
              disabled={prepopulating}
              className="w-full py-3 px-4 bg-bg-secondary hover:bg-border-color border border-border-color text-text-primary font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 rounded-xl cursor-pointer transition-all active:scale-98"
            >
              {prepopulating ? (
                <RefreshCw className="animate-spin" size={14} />
              ) : prepopulateSuccess ? (
                <>
                  <Check size={14} className="text-emerald-500" />
                  Loaded Demo Patients!
                </>
              ) : (
                <>
                  <Sparkles size={14} className="text-primary-teal" />
                  Reset & Prepopulate Demo Database
                </>
              )}
            </button>

            {/* Wipe database */}
            <button
              onClick={handleWipeDatabase}
              className="w-full py-3 px-4 bg-red-500/10 border border-red-500/20 text-red-500 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 rounded-xl cursor-pointer hover:bg-red-500/20 transition-colors"
            >
              {dbCleared ? (
                <>
                  <Check size={14} />
                  Database Cleared
                </>
              ) : (
                <>
                  <Trash2 size={14} />
                  Wipe local databases
                </>
              )}
            </button>
          </div>
        </div>

        {/* SECTION 4: Admin options checklist link */}
        <button
          onClick={() => navigate('/admin')}
          className="w-full py-3.5 px-4 rounded-xl bg-bg-card border border-border-color text-text-primary font-bold text-xs uppercase tracking-widest transition-all hover:border-primary-teal flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-98"
        >
          <BookOpen size={14} className="text-primary-teal" />
          View developer checklist & snippets
        </button>

        {/* SECTION 5: Logout */}
        <button
          onClick={handleLogout}
          className="w-full py-3.5 px-4 bg-red-500/10 border border-red-500/20 text-red-500 font-extrabold text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 cursor-pointer hover:bg-red-500/20 transition-colors mt-2"
        >
          <LogOut size={16} />
          Log out session
        </button>

      </div>
    </div>
  );
}

export default Settings;
