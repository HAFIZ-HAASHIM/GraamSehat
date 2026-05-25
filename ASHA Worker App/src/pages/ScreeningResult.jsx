/**
 * pages/ScreeningResult.jsx
 * Screening Outcomes page.
 * Styled in flat modern pastel containers, white card panels, and organic tags.
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { db } from '../db/localDB';
import { getPatientByUidLocal } from '../db/patients.local';
import { getRiskLabel } from '../utils/riskCalculator';
import { RiskMeter } from '../components/RiskMeter';
import {
  ArrowLeft, Share2, RotateCcw, AlertOctagon,
  Activity, Bookmark, Calendar
} from 'lucide-react';

export function ScreeningResult() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { profile } = useAuth();

  const [screening, setScreening] = useState(null);
  const [patient, setPatient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadResult = async () => {
      try {
        const scrRecord = await db.screenings.get(parseInt(id, 10));
        if (!scrRecord) {
          navigate('/');
          return;
        }

        const patRecord = await getPatientByUidLocal(scrRecord.uid);
        setScreening(scrRecord);
        setPatient(patRecord);
      } catch (err) {
        console.error('Failed to load screening result:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadResult();
  }, [id, navigate]);

  if (isLoading) {
    return (
      <div className="w-full flex-1 bg-bg-primary flex items-center justify-center text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-primary" />
      </div>
    );
  }

  const { overallRisk, idrsScore, bpSystolic, bpDiastolic, riskLevel, doctorsNote, symptoms } = screening;

  // Determine soft pastel colors
  let themeBg = 'bg-[#e8f5e9] text-[#2e7d32] border-[#a3cfbb]';
  let badgeColor = 'bg-[#e8f5e9] text-[#2e7d32] border-[#a3cfbb]';
  let titleColor = 'text-[#1b4332]';

  if (overallRisk === 'RED') {
    themeBg = 'bg-[#ffebee] text-[#c62828] border-[#f5c2c7]';
    badgeColor = 'bg-[#ffebee] text-[#c62828] border-[#f5c2c7]';
    titleColor = 'text-[#721c24]';
  } else if (overallRisk === 'YELLOW') {
    themeBg = 'bg-[#fff3e0] text-[#e65100] border-[#ffe0b2]';
    badgeColor = 'bg-[#fff3e0] text-[#e65100] border-[#ffe0b2]';
    titleColor = 'text-[#856404]';
  }

  // Pre-filled WhatsApp referral builder
  const handleWhatsAppShare = () => {
    const ashaName = profile?.name || 'ASHA Worker';
    const subcentre = profile?.subcentre || 'Rural Subcentre';
    const patName = patient?.name || 'Patient';
    const patAge = patient?.age || 'N/A';
    const patUid = screening.uid;
    const bpText = bpSystolic ? `${bpSystolic}/${bpDiastolic} mmHg` : 'Not Available';
    const bpClassText = bpSystolic ? `${riskLevel}` : 'N/A';
    const riskLabelText = getRiskLabel(overallRisk);

    const whatsappMessage = `Referral from ASHA ${ashaName}, Sub-Centre ${subcentre}.
Patient: ${patName}, ${patAge} yrs, UID: ${patUid}.
Diabetes Risk: ${riskLabelText} (IDRS: ${idrsScore}).
BP: ${bpText} (${bpClassText}).
Please review urgently.`;

    const encoded = encodeURIComponent(whatsappMessage);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  return (
    <div className={`w-full flex-grow flex flex-col justify-between p-6 ${themeBg} overflow-y-auto pb-12 animate-slide-in`}>
      <div className="max-w-md mx-auto w-full flex flex-col gap-6">

        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-black/10 pb-3">
          <h2 className={`text-base font-extrabold tracking-wide flex items-center gap-2 ${titleColor}`}>
            <Activity className="animate-pulse" size={18} />
            {t('result.title')}
          </h2>
          <span className={`text-[10px] font-black uppercase py-0.5 px-3 border rounded-full ${badgeColor}`}>
            Saved
          </span>
        </div>

        {/* Large Bold Outcome Title */}
        <div className="text-center flex flex-col items-center py-2">
          {overallRisk === 'RED' && <AlertOctagon size={42} className="text-red-600 animate-bounce mb-2" />}
          <h1 className={`text-2xl font-black tracking-tight leading-none ${titleColor}`}>
            {getRiskLabel(overallRisk)}
          </h1>
          <p className="text-slate-900 text-xs font-bold mt-2">
            Patient: {patient?.name} (Age: {patient?.age})
          </p>
        </div>

        {/* Speedometer Risk Gauge */}
        <div className="bg-white border border-cream-300 p-5 rounded-xl shadow-sm">
          <RiskMeter score={idrsScore} />
        </div>

        {/* Health Readings Quick Table */}
        <div className="grid-2">
          <div className="p-4 rounded-xl bg-white border border-cream-300 flex flex-col justify-between shadow-sm">
            <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest">Blood Pressure</span>
            <span className="text-lg font-black text-slate-800 mt-1">
              {bpSystolic ? `${bpSystolic}/${bpDiastolic}` : 'N/A'}
            </span>
            <span className="text-[9px] text-slate-500 font-bold mt-0.5">{riskLevel}</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-cream-300 flex flex-col justify-between shadow-sm">
            <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest">Blood Glucose</span>
            <span className="text-lg font-black text-slate-800 mt-1">
              {screening.glucoseLevel ? `${screening.glucoseLevel}` : 'N/A'}
            </span>
            <span className="text-[9px] text-slate-500 font-bold mt-0.5 truncate">
              {screening.glucoseLevel ? (screening.glucoseLevel >= 126 ? 'Diabetic' : screening.glucoseLevel >= 100 ? 'Prediabetic' : 'Normal') : 'Not Checked'}
            </span>
          </div>
        </div>

        {/* Symptoms checklist review */}
        {symptoms && symptoms.length > 0 && (
          <div className="p-4 rounded-xl bg-white border border-cream-300 text-xs shadow-sm">
            <span className="font-extrabold text-slate-500 uppercase tracking-wider block mb-2">Identified Symptoms</span>
            <div className="flex flex-wrap gap-1.5">
              {symptoms.map((symp) => (
                <span key={symp} className="py-1 px-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-semibold capitalize">
                  {symp}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Doctor's Advice Box & Automated Scheduled checkup */}
        {doctorsNote && (
          <div className="bg-white border border-cream-300 p-5 rounded-xl flex flex-col gap-4 shadow-sm text-slate-800 animate-scale-in">
            <h3 className="text-xs font-bold text-slate-700 tracking-widest uppercase border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <Bookmark size={14} className="text-green-primary" />
              {t('result.adviceTitle')}
            </h3>

            <p className="text-xs leading-relaxed text-slate-600 font-medium">
              {doctorsNote.explanation}
            </p>

            <div className="flex flex-col gap-2 mt-1">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Action Items:</span>
              <ul className="flex flex-col gap-2">
                {doctorsNote.actions.map((act, index) => (
                  <li key={index} className="flex gap-2.5 text-xs text-slate-600 leading-normal font-medium">
                    <span className="w-5 h-5 rounded bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-extrabold shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Scheduled Next Appointment display */}
            <div className="mt-3 flex flex-col gap-2 border-t border-cream-200 pt-3">
              <div className="py-2.5 px-3 bg-green-light rounded-xl border border-green-200/50 flex items-center justify-between text-xs">
                <span className="text-slate-700 font-semibold flex items-center gap-1.5">
                  <Calendar size={14} className="text-green-primary" />
                  Scheduled checkup:
                </span>
                {screening.nextApptDate ? (
                  <strong className="text-green-dark font-extrabold">
                    {new Date(screening.nextApptDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </strong>
                ) : (
                  <strong className="text-green-dark font-extrabold">{doctorsNote.nextCheckupDays} Days</strong>
                )}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* THREE Action Buttons */}
      <div className="max-w-md mx-auto w-full flex flex-col gap-3 mt-8 pt-4 border-t border-black/10">

        {/* 1. Share via WhatsApp */}
        {(overallRisk === 'RED' || overallRisk === 'YELLOW') && (
          <button
            onClick={handleWhatsAppShare}
            className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-sm tracking-wide shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-[0.99]"
          >
            <Share2 size={15} />
            {t('result.shareWhatsapp')}
          </button>
        )}

        {/* 2. Save and Continue */}
        <button
          onClick={() => navigate(`/patient/${screening.uid}`)}
          className="w-full py-3.5 px-4 rounded-xl bg-green-primary hover:bg-green-dark text-white font-bold text-sm tracking-wide shadow-sm flex items-center justify-center gap-1.5 cursor-pointer transition-transform active:scale-[0.99]"
        >
          {t('result.saveBtn')}
        </button>

        {/* 3. New Screening */}
        <button
          onClick={() => navigate('/scan')}
          className="w-full py-2.5 px-4 rounded-xl bg-white border border-[#e6dec9] text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
        >
          <RotateCcw size={12} />
          {t('result.newScreeningBtn')}
        </button>
      </div>

    </div>
  );
}

export default ScreeningResult;
