import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { getPatientByUidLocal } from '../db/patients.local';
import { db } from '../db/localDB';
import { MEDICINE_LIST } from '../utils/constants';
import {
  saveMedicineLogLocal, getMedicineStock, addMedicineStock
} from '../db/medicines.local';
import {
  ArrowLeft, Pill, User, AlertTriangle, Check, RefreshCw, Clipboard, Search, Plus, Minus
} from 'lucide-react';

export function MedicineLog() {
  const { t } = useLanguage();
  const { ashaWorkerId } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const paramUid = searchParams.get('uid');

  const [step, setStep] = useState(1); // 1: Patient, 2: Medicine, 3: Quantity
  const [patient, setPatient] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [matchingPatients, setMatchingPatients] = useState([]);

  // Selection States
  const [selectedMed, setSelectedMed] = useState(null);
  const [quantity, setQuantity] = useState('30');
  const [validationError, setValidationError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [dueDateText, setDueDateText] = useState(null);
  const [lowStockWarning, setLowStockWarning] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);

  // Load pre-filled patient if UID is supplied
  useEffect(() => {
    if (paramUid) {
      getPatientByUidLocal(paramUid).then((pat) => {
        if (pat) {
          setPatient(pat);
          setStep(2); // Skip step 1 if prefilled
        }
      });
    }
  }, [paramUid]);

  // Search patients locally
  useEffect(() => {
    if (!patient && searchQuery.trim().length >= 1) {
      db.patients
        .filter((p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.uid.includes(searchQuery)
        )
        .toArray()
        .then(setMatchingPatients);
    } else {
      setMatchingPatients([]);
    }
  }, [searchQuery, patient]);

  // Fetch recent distribution logs
  const loadRecentLogs = async () => {
    try {
      const logs = await db.medicines.orderBy('distributedAt').reverse().limit(4).toArray();
      const logsWithNames = await Promise.all(logs.map(async (l) => {
        const pat = await db.patients.where('uid').equals(l.uid).first();
        return {
          ...l,
          patientName: pat ? pat.name : 'Unknown Patient'
        };
      }));
      setRecentLogs(logsWithNames);
    } catch (err) {
      console.error('Failed to load recent logs:', err);
    }
  };

  useEffect(() => {
    loadRecentLogs();
  }, [isSuccess]);

  // Handle stock checks and due dates as options change
  const handleMedSelect = (med) => {
    setSelectedMed(med);
    setValidationError(null);
    setStep(3); // Advance to quantity selection
  };

  const handleQuantityChange = (val) => {
    setQuantity(val);
    setValidationError(null);
  };

  const incrementQty = () => {
    setQuantity(prev => {
      const num = parseInt(prev, 10);
      return isNaN(num) ? '1' : (num + 1).toString();
    });
  };

  const decrementQty = () => {
    setQuantity(prev => {
      const num = parseInt(prev, 10);
      return isNaN(num) ? '1' : Math.max(1, num - 1).toString();
    });
  };

  const handleSave = async () => {
    setValidationError(null);
    if (!patient) {
      setValidationError('Please select a patient first.');
      setStep(1);
      return;
    }
    if (!selectedMed) {
      setValidationError('Please select a medicine.');
      setStep(2);
      return;
    }
    const qtyNum = parseInt(quantity, 10);
    if (isNaN(qtyNum) || qtyNum <= 0) {
      setValidationError('Please enter a valid positive quantity.');
      return;
    }

    const currentStock = getMedicineStock(selectedMed.name);
    if (qtyNum > currentStock) {
      setValidationError(`Insufficient stock. Only ${currentStock} units left.`);
      return;
    }

    try {
      // Calculate next due date
      let nextDueDate = null;
      if (selectedMed.durationDays > 0) {
        const d = new Date();
        d.setDate(d.getDate() + selectedMed.durationDays);
        nextDueDate = d.toISOString();
        setDueDateText(d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }));
      } else {
        setDueDateText('As needed (No due date)');
      }

      const medicineLogPayload = {
        uid: patient.uid,
        medicineName: selectedMed.name,
        dose: selectedMed.defaultDose,
        quantity: qtyNum,
        distributedAt: new Date().toISOString(),
        nextDueDate,
        ashaWorkerId: ashaWorkerId || 'offline_dev',
        syncStatus: 'pending'
      };

      await saveMedicineLogLocal(medicineLogPayload);

      // Check stock alert threshold
      const remainingStock = currentStock - qtyNum;
      if (remainingStock < 10) {
        setLowStockWarning(`Low stock alert: ${selectedMed.name} — only ${remainingStock} left in clinic. Refill requested.`);
      }

      setIsSuccess(true);
    } catch (err) {
      console.error('Failed to log medicine distribution:', err);
      setValidationError('Failed to record log. Database error.');
    }
  };

  // Helper to refill stock
  const handleRefillStock = (medName) => {
    addMedicineStock(medName, 50);
    if (selectedMed && selectedMed.name === medName) {
      setSelectedMed({ ...selectedMed });
    }
  };

  if (isSuccess) {
    return (
      <div className="w-full flex flex-col justify-center items-center text-center bg-bg-primary py-6 px-4 animate-scale-in">
        <div className="flex flex-col justify-center items-center gap-6 max-w-md w-full">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-200 dark:border-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-md animate-scale-in">
            <Check size={40} className="stroke-[3]" />
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-primary-teal uppercase tracking-wider">{t('medicine.loggedSuccess') || 'Logged successfully'}</h2>
            <p className="text-text-secondary text-xs mt-1.5 leading-relaxed font-semibold">
              Medicine distributed to <strong>{patient.name}</strong> has been logged locally.
            </p>
          </div>

          <div className="glass-panel bg-bg-card border border-border-color p-5 w-full flex flex-col gap-3.5 text-left text-xs rounded-2xl shadow-sm text-text-primary">
            <div className="flex justify-between border-b border-border-color pb-2">
              <span className="text-text-secondary font-bold uppercase tracking-wider">Patient</span>
              <strong className="font-extrabold">{patient.name}</strong>
            </div>
            <div className="flex justify-between border-b border-border-color pb-2">
              <span className="text-text-secondary font-bold uppercase tracking-wider">Medicine</span>
              <strong className="font-extrabold">{selectedMed.name}</strong>
            </div>
            <div className="flex justify-between border-b border-border-color pb-2">
              <span className="text-text-secondary font-bold uppercase tracking-wider">Quantity</span>
              <strong className="font-extrabold">{quantity} Units</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary font-bold uppercase tracking-wider">Next Due Date</span>
              <strong className="text-secondary-coral font-extrabold">{dueDateText}</strong>
            </div>
          </div>

          {lowStockWarning && (
            <div className="flex items-start gap-2.5 p-4 bg-amber-500/10 border border-amber-200 dark:border-amber-950 text-amber-700 dark:text-amber-300 rounded-2xl text-xs text-left leading-normal w-full animate-scale-in font-semibold">
              <AlertTriangle size={18} className="shrink-0 text-amber-600" />
              <span>{lowStockWarning}</span>
            </div>
          )}
        </div>

        <button
          onClick={() => navigate(`/patient/${patient.uid}`)}
          className="w-full max-w-md py-3.5 bg-primary-teal hover:bg-[#225c53] rounded-xl text-white font-bold text-xs tracking-widest uppercase transition-colors mt-8 cursor-pointer shadow-md"
        >
          Back to Patient Profile
        </button>
      </div>
    );
  }

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
          <h2 className="text-sm font-black tracking-widest uppercase">{t('medicine.title') || 'Medicine Log'}</h2>
        </div>
      </div>

      {/* Main wizard cards and recent list */}
      <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full pb-16">

        {/* Wizard Step indicator (1 -> 2 -> 3) */}
        <div className="flex justify-between items-center bg-bg-card border border-border-color rounded-2xl p-4 shadow-sm w-full">
          {[
            { id: 1, label: 'Patient' },
            { id: 2, label: 'Medicine' },
            { id: 3, label: 'Quantity' }
          ].map((s, idx) => {
            const isCompleted = step > s.id;
            const isActive = step === s.id;
            return (
              <React.Fragment key={s.id}>
                <button
                  type="button"
                  disabled={s.id > step && !patient}
                  onClick={() => {
                    setStep(s.id);
                    setValidationError(null);
                  }}
                  className="flex items-center gap-2 text-left cursor-pointer focus:outline-none"
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${isCompleted ? 'bg-emerald-600 text-white' :
                      isActive ? 'bg-primary-teal text-white shadow-md ring-4 ring-primary-teal/15' :
                        'bg-bg-secondary text-text-secondary border border-border-color'
                    }`}>
                    {isCompleted ? <Check size={14} /> : s.id}
                  </div>
                  <span className={`text-[10px] uppercase tracking-wider font-extrabold hidden sm:inline ${isActive ? 'text-primary-teal' : 'text-text-secondary'
                    }`}>
                    {s.label}
                  </span>
                </button>
                {idx < 2 && (
                  <div className={`flex-1 h-0.5 mx-2 rounded ${step > s.id ? 'bg-emerald-500' : 'bg-border-color'
                    }`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Validation Errors */}
        {validationError && (
          <div className="flex items-center gap-2.5 p-3.5 bg-red-500/10 border border-red-200 dark:border-red-950 rounded-xl text-red-700 dark:text-red-300 text-xs leading-normal font-semibold animate-scale-in">
            <AlertTriangle size={18} className="shrink-0 text-red-500" />
            <span>{validationError}</span>
          </div>
        )}

        {/* STEP 1: Select Patient */}
        {step === 1 && (
          <div className="glass-panel bg-bg-card border border-border-color p-5 flex flex-col gap-4 rounded-2xl shadow-sm animate-scale-in">
            <h3 className="text-xs font-bold text-text-secondary tracking-widest uppercase border-b border-border-color pb-2 flex items-center gap-1.5">
              <User size={14} className="text-primary-teal" />
              1. Choose Patient
            </h3>

            {patient ? (
              <div className="flex items-center justify-between p-3.5 bg-bg-secondary/40 rounded-xl border border-border-color">
                <div>
                  <strong className="text-text-primary text-sm block font-extrabold">{patient.name}</strong>
                  <span className="text-[10px] text-text-secondary mt-0.5 block font-semibold">ID: {patient.uid} | {patient.village}</span>
                </div>
                <button
                  onClick={() => { setPatient(null); setSelectedMed(null); }}
                  className="text-xs font-black text-secondary-coral hover:underline cursor-pointer"
                >
                  Change
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
                    <Search size={16} />
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search patient by name or 6-digit ID..."
                    className="pl-11"
                  />
                </div>

                {matchingPatients.length > 0 && (
                  <div className="flex flex-col gap-2 bg-bg-secondary/40 p-2 rounded-xl border border-border-color max-h-36 overflow-y-auto">
                    {matchingPatients.map((pat) => (
                      <div
                        key={pat.id}
                        onClick={() => {
                          setPatient(pat);
                          setValidationError(null);
                          setStep(2); // Auto advance
                        }}
                        className="p-2.5 hover:bg-bg-card rounded-lg cursor-pointer flex items-center justify-between text-xs transition-all border border-transparent hover:border-border-color text-text-primary font-semibold"
                      >
                        <span>{pat.name}</span>
                        <span className="text-text-secondary font-black">{pat.uid}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {patient && (
              <button
                onClick={() => setStep(2)}
                className="py-3 px-4 bg-primary-teal hover:bg-[#225c53] text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer transition-colors shadow-sm"
              >
                Proceed to Medicine Selection
              </button>
            )}
          </div>
        )}

        {/* STEP 2: Choose Medicine */}
        {step === 2 && (
          <div className="glass-panel bg-bg-card border border-border-color p-5 flex flex-col gap-4 rounded-2xl shadow-sm animate-scale-in">
            <div className="flex items-center justify-between border-b border-border-color pb-2">
              <h3 className="text-xs font-bold text-text-secondary tracking-widest uppercase flex items-center gap-1.5">
                <Pill size={14} className="text-primary-teal" />
                2. Select Medicine
              </h3>
              {patient && (
                <span className="text-[10px] text-text-secondary font-semibold">
                  Patient: <strong>{patient.name}</strong>
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {MEDICINE_LIST.map((med) => {
                const currentStock = getMedicineStock(med.name);
                const isSelected = selectedMed?.id === med.id;

                // Color levels progress indicators
                const maxStock = 60;
                const percentage = Math.min(100, (currentStock / maxStock) * 100);
                let barColor = 'bg-emerald-600 dark:bg-emerald-500';
                if (currentStock < 10) barColor = 'bg-secondary-coral';
                else if (currentStock < 20) barColor = 'bg-accent-gold';

                return (
                  <div
                    key={med.id}
                    onClick={() => handleMedSelect(med)}
                    className={`p-4 rounded-xl cursor-pointer border flex flex-col justify-between min-h-[110px] transition-all duration-200 relative group ${isSelected
                        ? 'border-primary-teal bg-primary-teal/5 shadow-md scale-[1.01]'
                        : 'border-border-color bg-bg-card hover:border-border-color hover:shadow-sm'
                      }`}
                  >
                    <span className="text-xs font-extrabold uppercase tracking-wide text-text-primary">
                      {med.name}
                    </span>

                    <div>
                      {/* Stock level bar */}
                      <div className="flex justify-between items-center text-[9px] font-bold text-text-secondary mt-3">
                        <span>Stock count</span>
                        <span className={currentStock < 10 ? 'text-secondary-coral font-black animate-pulse' : 'text-text-primary'}>
                          {currentStock} / {maxStock} Units
                        </span>
                      </div>
                      <div className="w-full bg-bg-secondary h-1.5 rounded-full overflow-hidden mt-1">
                        <div className={`h-full ${barColor} transition-all duration-500`} style={{ width: `${percentage}%` }} />
                      </div>
                    </div>

                    {isSelected && currentStock < 15 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRefillStock(med.name);
                        }}
                        className="absolute top-2 right-2 text-[8px] font-black uppercase tracking-wider py-0.5 px-1.5 bg-bg-card text-primary-teal border border-border-color rounded hover:bg-bg-secondary cursor-pointer shadow-sm z-10"
                      >
                        Refill
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between mt-2">
              <button
                onClick={() => setStep(1)}
                className="py-3 px-4 bg-bg-secondary hover:bg-bg-secondary/70 border border-border-color rounded-xl text-text-primary text-xs font-bold transition-colors cursor-pointer"
              >
                Back to Patient
              </button>
              {selectedMed && (
                <button
                  onClick={() => setStep(3)}
                  className="py-3 px-4 bg-primary-teal hover:bg-[#225c53] text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer transition-colors shadow-sm"
                >
                  Proceed to Quantity
                </button>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: Quantity Stepper and Confirmation */}
        {step === 3 && (
          <div className="glass-panel bg-bg-card border border-border-color p-5 flex flex-col gap-4 rounded-2xl shadow-sm animate-scale-in">
            <h3 className="text-xs font-bold text-text-secondary tracking-widest uppercase border-b border-border-color pb-2 flex items-center gap-1.5">
              <Clipboard size={14} className="text-primary-teal" />
              3. Distribution Details
            </h3>

            <div className="flex flex-col gap-4 text-xs font-semibold text-text-secondary">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3.5 bg-bg-secondary/40 border border-border-color rounded-xl">
                  <span className="text-[9px] text-text-secondary font-bold uppercase tracking-wider block">Patient Profile</span>
                  <strong className="text-text-primary text-sm font-extrabold mt-1 block">{patient?.name}</strong>
                </div>
                <div className="p-3.5 bg-bg-secondary/40 border border-border-color rounded-xl">
                  <span className="text-[9px] text-text-secondary font-bold uppercase tracking-wider block">Selected Drug</span>
                  <strong className="text-text-primary text-sm font-extrabold mt-1 block">{selectedMed?.name}</strong>
                </div>
              </div>

              {/* Quantity Stepper Interface */}
              <div className="flex flex-col gap-2 mt-2">
                <label className="text-[10px] font-bold text-text-secondary uppercase">Quantity (Units)</label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={decrementQty}
                    className="w-11 h-11 rounded-xl bg-bg-secondary hover:bg-border-color text-text-primary flex items-center justify-center font-extrabold text-lg cursor-pointer transition-all active:scale-95 shadow-inner"
                  >
                    <Minus size={16} />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(e.target.value)}
                    className="text-center font-black text-lg max-w-[100px] py-2.5"
                  />
                  <button
                    type="button"
                    onClick={incrementQty}
                    className="w-11 h-11 rounded-xl bg-bg-secondary hover:bg-border-color text-text-primary flex items-center justify-center font-extrabold text-lg cursor-pointer transition-all active:scale-95 shadow-inner"
                  >
                    <Plus size={16} />
                  </button>

                  {selectedMed && (
                    <span className="text-[11px] text-text-secondary font-bold uppercase tracking-wider ml-2">
                      Dose: <strong className="text-text-primary">{selectedMed.defaultDose}</strong>
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-between gap-3 mt-4">
              <button
                onClick={() => setStep(2)}
                className="py-3.5 px-4 bg-bg-secondary hover:bg-bg-secondary/70 border border-border-color rounded-xl text-text-primary text-xs font-bold transition-colors cursor-pointer"
              >
                Back to Meds
              </button>

              <button
                onClick={handleSave}
                className="flex-grow py-3.5 bg-primary-teal hover:bg-[#225c53] text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-md active:scale-98"
              >
                Record Distribution
              </button>
            </div>
          </div>
        )}

        {/* Recent Distribution History (Displayed below steps) */}
        <div className="glass-panel bg-bg-card border border-border-color p-5 flex flex-col gap-4 rounded-2xl shadow-sm mt-2">
          <h3 className="text-xs font-bold text-text-secondary tracking-widest uppercase border-b border-border-color pb-2 flex items-center gap-1.5">
            <Clipboard size={14} className="text-primary-teal" />
            Recent Distribution History
          </h3>

          {recentLogs.length === 0 ? (
            <p className="text-xs text-text-muted py-6 text-center italic font-semibold">
              No recent logs found.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {recentLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 bg-bg-secondary/30 border border-border-color rounded-xl flex items-center justify-between text-xs font-semibold"
                >
                  <div className="min-w-0 pr-2">
                    <strong className="text-text-primary block truncate font-extrabold">{log.patientName}</strong>
                    <span className="text-[10px] text-text-secondary mt-0.5 block font-bold uppercase tracking-wider">{log.medicineName}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-extrabold text-slate-800 dark:text-white block">{log.quantity} Units</span>
                    <span className="text-[9px] text-text-muted block font-bold mt-0.5">
                      {new Date(log.distributedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default MedicineLog;
