/**
 * pages/Screening.jsx
 * Duolingo-style Health Screening Questionnaire.
 * Renders 7 full-screen steps with big emoji assets, progress bars,
 * responsive cards, live input classifications, and IndexedDB saving.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { db } from '../db/localDB';
import { getPatientByUidLocal } from '../db/patients.local';
import { saveScreeningLocal } from '../db/screenings.local';
import { calculateIDRS, classifyBP, calculateCombinedRisk } from '../utils/riskCalculator';
import { ADVICE_TEXTS } from '../utils/constants';
import { ProgressBar } from '../components/ProgressBar';
import { GameCard } from '../components/GameCard';
import { ArrowLeft } from 'lucide-react';

export function Screening() {
  const { t, language } = useLanguage();
  const { ashaWorkerId } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const uid = searchParams.get('uid');

  const [patient, setPatient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [step, setStep] = useState(1);
  const totalSteps = 7;

  // Screening Answers State
  const [ageGroup, setAgeGroup] = useState(''); // 'under35' | '35to49' | '50plus'
  const [waistGender, setWaistGender] = useState(''); // sub-step for waist: 'male' | 'female'
  const [waistSize, setWaistSize] = useState(''); // 'low' | 'medium' | 'high'
  const [physicalActivity, setPhysicalActivity] = useState(''); // 'vigorous' | 'moderate' | 'sedentary'
  const [familyHistory, setFamilyHistory] = useState(''); // 'none' | 'one_parent' | 'both_parents'

  const [bpNotAvailable, setBpNotAvailable] = useState(false);
  const [bpSystolic, setBpSystolic] = useState('');
  const [bpDiastolic, setBpDiastolic] = useState('');

  const [glucoseNotAvailable, setGlucoseNotAvailable] = useState(false);
  const [glucoseLevel, setGlucoseLevel] = useState('');

  const [selectedSymptoms, setSelectedSymptoms] = useState([]);

  // Load pre-filled patient info
  useEffect(() => {
    if (!uid) {
      navigate('/scan');
      return;
    }

    getPatientByUidLocal(uid).then((pat) => {
      if (!pat) {
        navigate('/scan');
        return;
      }
      setPatient(pat);
      // Auto prefill gender and age parameters if available
      if (pat.gender) {
        setWaistGender(pat.gender.toLowerCase());
      }
      if (pat.age) {
        const ageVal = parseInt(pat.age, 10);
        if (ageVal < 35) setAgeGroup('under35');
        else if (ageVal < 50) setAgeGroup('35to49');
        else setAgeGroup('50plus');
      }
      setIsLoading(false);
    }).catch(err => {
      console.error('Error loading patient for screening:', err);
      navigate('/scan');
    });
  }, [uid, navigate]);

  if (isLoading) {
    return (
      <div className="w-full flex-1 bg-bg-primary flex items-center justify-center text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-primary" />
      </div>
    );
  }

  // Symptom toggle logic
  const handleSymptomSelect = (symptomKey) => {
    if (symptomKey === 'none') {
      setSelectedSymptoms(['none']);
      return;
    }

    let newList = selectedSymptoms.filter(s => s !== 'none');
    if (newList.includes(symptomKey)) {
      newList = newList.filter(s => s !== symptomKey);
    } else {
      newList.push(symptomKey);
    }
    setSelectedSymptoms(newList);
  };

  // Next Step validation check
  const isNextDisabled = () => {
    if (step === 1 && !ageGroup) return true;
    if (step === 2 && !waistSize) return true;
    if (step === 3 && !physicalActivity) return true;
    if (step === 4 && !familyHistory) return true;
    if (step === 5 && !bpNotAvailable && (!bpSystolic || !bpDiastolic)) return true;
    if (step === 6 && !glucoseNotAvailable && !glucoseLevel) return true;
    if (step === 7 && selectedSymptoms.length === 0) return true;
    return false;
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      submitScreening();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate(`/patient/${uid}`);
    }
  };

  // Live previews
  const getLiveBPClassification = () => {
    if (bpNotAvailable || !bpSystolic || !bpDiastolic) return null;
    return classifyBP(bpSystolic, bpDiastolic);
  };

  const getLiveGlucoseClassification = () => {
    if (glucoseNotAvailable || !glucoseLevel) return null;
    const gl = parseInt(glucoseLevel, 10);
    if (gl < 100) return 'NORMAL';
    if (gl < 126) return 'PREDIABETIC';
    return 'DIABETIC';
  };

  // Compile final results & save locally
  const submitScreening = async () => {
    setIsLoading(true);
    try {
      // 1. Calculate IDRS Diabetes Risk Score
      const idrsAnswers = {
        ageGroup,
        gender: waistGender,
        waistSize,
        physicalActivity,
        familyHistory
      };
      const idrsScore = calculateIDRS(idrsAnswers);

      // 2. Classify BP
      const bpClass = bpNotAvailable ? 'UNKNOWN' : classifyBP(bpSystolic, bpDiastolic);

      // 3. Combined Risk Level
      const overallRisk = calculateCombinedRisk(idrsScore, bpClass);

      // 4. Calculate next checkup/appointment date
      let checkupDays = 180; // Low Risk (GREEN): 6 months
      if (overallRisk === 'RED') {
        checkupDays = 7;   // High Risk: 7 days
      } else if (overallRisk === 'YELLOW') {
        checkupDays = 30;  // Moderate Risk: 30 days
      }

      const nextApptDate = new Date();
      nextApptDate.setDate(nextApptDate.getDate() + checkupDays);
      const nextApptDateString = nextApptDate.toISOString();

      // 5. Select localized Doctor's Note
      const rawNote = ADVICE_TEXTS[language]?.[overallRisk] || ADVICE_TEXTS['en'][overallRisk];
      const localizedNote = {
        ...rawNote,
        nextCheckupDays: checkupDays
      };

      const screeningPayload = {
        uid,
        date: new Date().toISOString(),
        idrsScore,
        bpSystolic: bpNotAvailable ? 0 : parseInt(bpSystolic, 10),
        bpDiastolic: bpNotAvailable ? 0 : parseInt(bpDiastolic, 10),
        glucoseLevel: glucoseNotAvailable ? 0 : parseInt(glucoseLevel, 10),
        riskLevel: bpClass,
        overallRisk,
        doctorsNote: localizedNote,
        nextApptDate: nextApptDateString,
        symptoms: selectedSymptoms.filter(s => s !== 'none'),
        ashaWorkerId: ashaWorkerId || 'offline_dev',
        syncStatus: 'pending'
      };

      const saved = await saveScreeningLocal(screeningPayload);

      // Update patient profile with latest screening info
      if (patient && patient.id) {
        await db.patients.update(patient.id, {
          lastScreenedAt: screeningPayload.date,
          currentRiskLevel: overallRisk,
          nextApptDate: nextApptDateString,
          syncStatus: 'pending'
        });
      }

      // Redirect to Result Screen
      navigate(`/screening-result/${saved.id}`);
    } catch (err) {
      console.error('Failed to submit screening:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex-grow flex flex-col bg-bg-primary overflow-y-auto pb-12 animate-slide-in">

      {/* Questionnaire Header (Forest Green native theme) */}
      <div className="bg-green-primary text-white px-5 py-5 rounded-b-[20px] shadow-md flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="p-2.5 rounded-xl bg-white/10 border border-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="text-base font-black tracking-wide">
              {t('screening.title')}
            </h2>
            <span className="text-[10px] text-green-light/80 font-bold block mt-0.5">
              Patient: {patient?.name} (UID: {uid})
            </span>
          </div>
        </div>

        <ProgressBar current={step} total={totalSteps} />
      </div>

      {/* STEP DISPLAY */}
      <div className="flex-1 px-5 py-8 flex flex-col justify-center max-w-lg mx-auto w-full">

        {/* STEP 1: Age Group */}
        {step === 1 && (
          <div className="flex flex-col gap-5 animate-scale-in">
            <div className="text-center mb-2">
              <span className="text-5xl filter drop-shadow-md block mb-2">🎂</span>
              <h3 className="text-xl font-extrabold text-green-dark leading-tight">
                {t('screening.step1Question')}
              </h3>
            </div>

            <div className="flex flex-col gap-3">
              <GameCard
                label={t('screening.optAge1')}
                emoji="👶"
                selected={ageGroup === 'under35'}
                onClick={() => setAgeGroup('under35')}
              />
              <GameCard
                label={t('screening.optAge2')}
                emoji="🧑"
                selected={ageGroup === '35to49'}
                onClick={() => setAgeGroup('35to49')}
              />
              <GameCard
                label={t('screening.optAge3')}
                emoji="🧓"
                selected={ageGroup === '50plus'}
                onClick={() => setAgeGroup('50plus')}
              />
            </div>
          </div>
        )}

        {/* STEP 2: Waist Measurement */}
        {step === 2 && (
          <div className="flex flex-col gap-5 animate-scale-in">
            <div className="text-center mb-2">
              <span className="text-5xl filter drop-shadow-md block mb-2">📏</span>
              <h3 className="text-xl font-extrabold text-green-dark leading-tight">
                {t('screening.step2Question')}
              </h3>

              <div className="flex justify-center mt-3">
                <svg className="w-24 h-12" viewBox="0 0 100 50">
                  <path d="M10 25 C25 15, 75 15, 90 25 C75 35, 25 35, 10 25 Z" fill="none" stroke="#2d6a4f" strokeWidth="2" strokeDasharray="3,3" />
                  <path d="M5 25 C25 20, 75 20, 95 25" fill="none" stroke="#576558" strokeWidth="4" strokeLinecap="round" />
                  <text x="50" y="29" textAnchor="middle" fill="#576558" fontSize="8" fontWeight="bold">WAIST</text>
                </svg>
              </div>
            </div>

            {!waistGender ? (
              <div className="glass-panel p-4 flex flex-col gap-3 text-center bg-white border border-cream-300">
                <span className="text-xs text-slate-600 font-bold uppercase">{t('screening.selectGenderFirst')}</span>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setWaistGender('male')} className="py-2.5 bg-green-primary text-xs font-bold text-white rounded-lg cursor-pointer">Male</button>
                  <button onClick={() => setWaistGender('female')} className="py-2.5 bg-green-primary text-xs font-bold text-white rounded-lg cursor-pointer">Female</button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {waistGender === 'male' ? (
                  <>
                    <GameCard
                      label={t('screening.optWaistMen1')}
                      emoji="🟢"
                      selected={waistSize === 'low'}
                      onClick={() => setWaistSize('low')}
                    />
                    <GameCard
                      label={t('screening.optWaistMen2')}
                      emoji="🟡"
                      selected={waistSize === 'medium'}
                      onClick={() => setWaistSize('medium')}
                    />
                    <GameCard
                      label={t('screening.optWaistMen3')}
                      emoji="🔴"
                      selected={waistSize === 'high'}
                      onClick={() => setWaistSize('high')}
                    />
                  </>
                ) : (
                  <>
                    <GameCard
                      label={t('screening.optWaistWomen1')}
                      emoji="🟢"
                      selected={waistSize === 'low'}
                      onClick={() => setWaistSize('low')}
                    />
                    <GameCard
                      label={t('screening.optWaistWomen2')}
                      emoji="🟡"
                      selected={waistSize === 'medium'}
                      onClick={() => setWaistSize('medium')}
                    />
                    <GameCard
                      label={t('screening.optWaistWomen3')}
                      emoji="🔴"
                      selected={waistSize === 'high'}
                      onClick={() => setWaistSize('high')}
                    />
                  </>
                )}

                <button
                  onClick={() => { setWaistGender(''); setWaistSize(''); }}
                  className="text-[10px] text-slate-500 font-bold hover:text-green-primary mt-2 uppercase tracking-wider text-center cursor-pointer"
                >
                  Change Gender Context ({waistGender})
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: Physical Activity */}
        {step === 3 && (
          <div className="flex flex-col gap-5 animate-scale-in">
            <div className="text-center mb-2">
              <span className="text-5xl filter drop-shadow-md block mb-2">🏃</span>
              <h3 className="text-xl font-extrabold text-green-dark leading-tight">
                {t('screening.step3Question')}
              </h3>
            </div>

            <div className="flex flex-col gap-3">
              <GameCard
                label={t('screening.optActivity1')}
                emoji="🌾"
                selected={physicalActivity === 'vigorous'}
                onClick={() => setPhysicalActivity('vigorous')}
              />
              <GameCard
                label={t('screening.optActivity2')}
                emoji="🚶"
                selected={physicalActivity === 'moderate'}
                onClick={() => setPhysicalActivity('moderate')}
              />
              <GameCard
                label={t('screening.optActivity3')}
                emoji="🪑"
                selected={physicalActivity === 'sedentary'}
                onClick={() => setPhysicalActivity('sedentary')}
              />
            </div>
          </div>
        )}

        {/* STEP 4: Family History */}
        {step === 4 && (
          <div className="flex flex-col gap-5 animate-scale-in">
            <div className="text-center mb-2">
              <span className="text-5xl filter drop-shadow-md block mb-2">👨👩👧</span>
              <h3 className="text-xl font-extrabold text-green-dark leading-tight">
                {t('screening.step4Question')}
              </h3>
            </div>

            <div className="flex flex-col gap-3">
              <GameCard
                label={t('screening.optFamily1')}
                emoji="🛡️"
                selected={familyHistory === 'none'}
                onClick={() => setFamilyHistory('none')}
              />
              <GameCard
                label={t('screening.optFamily2')}
                emoji="🧬"
                selected={familyHistory === 'one_parent'}
                onClick={() => setFamilyHistory('one_parent')}
              />
              <GameCard
                label={t('screening.optFamily3')}
                emoji="☣️"
                selected={familyHistory === 'both_parents'}
                onClick={() => setFamilyHistory('both_parents')}
              />
            </div>
          </div>
        )}

        {/* STEP 5: Blood Pressure */}
        {step === 5 && (
          <div className="flex flex-col gap-5 animate-scale-in">
            <div className="text-center mb-2">
              <span className="text-5xl filter drop-shadow-md block mb-2">💓</span>
              <h3 className="text-xl font-extrabold text-green-dark leading-tight">
                {t('screening.step5Question')}
              </h3>
            </div>

            <div className="glass-panel bg-white border border-cream-300 p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  BP Monitor Available?
                </span>
                <input
                  type="checkbox"
                  checked={!bpNotAvailable}
                  onChange={(e) => {
                    setBpNotAvailable(!e.target.checked);
                    if (!e.target.checked) {
                      setBpSystolic('');
                      setBpDiastolic('');
                    }
                  }}
                  className="w-5 h-5 accent-green-primary rounded cursor-pointer"
                />
              </div>

              {!bpNotAvailable && (
                <div className="flex flex-col gap-4 mt-2 animate-[slideIn_0.2s_ease]">
                  <div className="grid-2">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold text-slate-600 uppercase">Systolic (Upper)</label>
                      <input
                        type="number"
                        value={bpSystolic}
                        onChange={(e) => setBpSystolic(e.target.value)}
                        placeholder="120"
                        className="text-center text-lg font-bold"
                        maxLength={3}
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold text-slate-600 uppercase">Diastolic (Lower)</label>
                      <input
                        type="number"
                        value={bpDiastolic}
                        onChange={(e) => setBpDiastolic(e.target.value)}
                        placeholder="80"
                        className="text-center text-lg font-bold"
                        maxLength={3}
                      />
                    </div>
                  </div>

                  {/* Live BP Category Preview */}
                  {getLiveBPClassification() && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-xl flex items-center justify-between text-xs text-green-dark font-bold">
                      <span>{t('screening.previewLabel')}</span>
                      <span className="uppercase">{getLiveBPClassification()}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 6: Blood Glucose */}
        {step === 6 && (
          <div className="flex flex-col gap-5 animate-scale-in">
            <div className="text-center mb-2">
              <span className="text-5xl filter drop-shadow-md block mb-2">🩸</span>
              <h3 className="text-xl font-extrabold text-green-dark leading-tight">
                {t('screening.step6Question')}
              </h3>
            </div>

            <div className="glass-panel bg-white border border-cream-300 p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Glucometer Available?
                </span>
                <input
                  type="checkbox"
                  checked={!glucoseNotAvailable}
                  onChange={(e) => {
                    setGlucoseNotAvailable(!e.target.checked);
                    if (!e.target.checked) setGlucoseLevel('');
                  }}
                  className="w-5 h-5 accent-green-primary rounded cursor-pointer"
                />
              </div>

              {!glucoseNotAvailable && (
                <div className="flex flex-col gap-4 mt-2 animate-[slideIn_0.2s_ease]">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-slate-600 uppercase">Glucose Reading (mg/dL)</label>
                    <input
                      type="number"
                      value={glucoseLevel}
                      onChange={(e) => setGlucoseLevel(e.target.value)}
                      placeholder={t('screening.glucosePlaceholder')}
                      className="text-center text-lg font-bold"
                    />
                  </div>

                  {/* Live Glucose Category Preview */}
                  {getLiveGlucoseClassification() && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-xl flex items-center justify-between text-xs text-green-dark font-bold">
                      <span>{t('screening.previewLabel')}</span>
                      <span className="uppercase">{getLiveGlucoseClassification()}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 7: Symptoms Checklist */}
        {step === 7 && (
          <div className="flex flex-col gap-4 animate-scale-in max-h-[360px] overflow-y-auto pr-1">
            <div className="text-center mb-2">
              <span className="text-5xl filter drop-shadow-md block mb-2">🔍</span>
              <h3 className="text-xl font-extrabold text-green-dark leading-tight">
                {t('screening.step7Question')}
              </h3>
            </div>

            <div className="flex flex-col gap-2">
              <GameCard
                label={t('screening.symptomThirst')}
                emoji="🥤"
                selected={selectedSymptoms.includes('thirst')}
                onClick={() => handleSymptomSelect('thirst')}
              />
              <GameCard
                label={t('screening.symptomVision')}
                emoji="👓"
                selected={selectedSymptoms.includes('vision')}
                onClick={() => handleSymptomSelect('vision')}
              />
              <GameCard
                label={t('screening.symptomNumbness')}
                emoji="🦶"
                selected={selectedSymptoms.includes('numbness')}
                onClick={() => handleSymptomSelect('numbness')}
              />
              <GameCard
                label={t('screening.symptomUrination')}
                emoji="🚽"
                selected={selectedSymptoms.includes('urination')}
                onClick={() => handleSymptomSelect('urination')}
              />
              <GameCard
                label={t('screening.symptomTiredness')}
                emoji="🥱"
                selected={selectedSymptoms.includes('tiredness')}
                onClick={() => handleSymptomSelect('tiredness')}
              />
              <GameCard
                label={t('screening.symptomNone')}
                emoji="✅"
                selected={selectedSymptoms.includes('none')}
                onClick={() => handleSymptomSelect('none')}
              />
            </div>
          </div>
        )}

      </div>

      {/* Back and Next Actions Row */}
      <div className="flex items-center gap-3 px-5 pt-4 border-t border-border-color bg-bg-secondary">
        <button
          onClick={handleBack}
          className="flex-1 py-3.5 px-4 bg-white border border-border-color rounded-xl text-slate-700 hover:bg-slate-50 font-bold text-sm transition-colors cursor-pointer"
        >
          {t('screening.prevStep')}
        </button>

        <button
          onClick={handleNext}
          disabled={isNextDisabled()}
          className={`flex-2 py-3.5 px-6 rounded-xl text-white font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-1.5 cursor-pointer ${isNextDisabled()
              ? 'bg-cream-300 text-slate-500 cursor-not-allowed border border-cream-300'
              : 'bg-green-primary hover:bg-green-dark shadow-md active:scale-[0.98]'
            }`}
        >
          {step === totalSteps ? 'See Results' : t('common.next')}
        </button>
      </div>

    </div>
  );
}

export default Screening;
