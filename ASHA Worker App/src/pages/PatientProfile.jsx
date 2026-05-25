/**
 * pages/PatientProfile.jsx
 * Patient Profile Panel.
 * Displays patient demographics, photos, recent screening timeline,
 * health indicator grids, and shortcuts to register screenings/medicine.
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPatientByUidLocal } from '../db/patients.local';
import { getScreeningsByUidLocal } from '../db/screenings.local';
import { getMedicineLogsByUidLocal } from '../db/medicines.local';
import {
  User, ArrowLeft, Activity, Heart, Pill, Calendar, MapPin,
  Phone, CheckCircle, RefreshCw
} from 'lucide-react';
import { getRiskLabel } from '../utils/riskCalculator';

export function PatientProfile() {
  const { uid } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [screenings, setScreenings] = useState([]);
  const [medsList, setMedsList] = useState([]);
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfileData = async () => {
    try {
      const patRecord = await getPatientByUidLocal(uid);
      if (!patRecord) {
        navigate('/scan');
        return;
      }

      const screeningRecords = await getScreeningsByUidLocal(uid);
      const sortedScreenings = [...screeningRecords].sort((a, b) => new Date(b.date) - new Date(a.date));

      const medicineLogs = await getMedicineLogsByUidLocal(uid);
      const sortedMeds = [...medicineLogs].sort((a, b) => new Date(b.distributedAt) - new Date(a.distributedAt));

      setPatient(patRecord);
      setScreenings(sortedScreenings);
      setMedsList(sortedMeds);
    } catch (err) {
      console.error('Error loading patient details:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [uid]);

  if (isLoading) {
    return (
      <div className="w-full flex-1 bg-cream-50 flex items-center justify-center text-slate-400">
        <RefreshCw className="animate-spin" size={28} />
      </div>
    );
  }

  // Get active risk formatting
  const risk = patient.currentRiskLevel || 'GREEN';
  let riskBg = 'bg-emerald-50 border-emerald-200 text-emerald-800';
  if (risk === 'RED') {
    riskBg = 'bg-red-50 border-red-200 text-red-800 animate-pulse';
  } else if (risk === 'YELLOW') {
    riskBg = 'bg-amber-50 border-amber-200 text-amber-800';
  }

  // Get last readings helper
  const latestScreening = screenings[0] || null;

  return (
    <div className="w-full flex-grow flex flex-col bg-cream-50 overflow-y-auto pb-12 animate-slide-in">

      {/* Header Row (Forest Green Native Band) */}
      <div className="bg-green-primary text-white px-5 py-5 rounded-b-[20px] shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/patients')}
            className="p-2.5 rounded-xl bg-white/10 border border-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
          >
            <ArrowLeft size={18} />
          </button>
          <h2 className="text-lg font-black tracking-wide">Patient Profile</h2>
        </div>

        <button
          onClick={() => navigate(`/register?uid=${uid}&edit=true`)}
          className="py-1.5 px-3 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl text-xs font-bold text-white transition-all cursor-pointer"
        >
          Edit Info
        </button>
      </div>

      {/* Demographics, Metrics, Timeline & Actions (Inner spacing wrapper) */}
      <div className="px-4 py-5 flex flex-col gap-5 w-full">

        {/* Patient Avatar Info Card */}
        <div className="glass-panel bg-white border border-cream-300 p-4 flex items-start gap-4">
          <div className={`w-14 h-14 rounded-2xl shrink-0 flex items-center justify-center text-white ${risk === 'RED' ? 'bg-red-100 text-red-700' :
              risk === 'YELLOW' ? 'bg-amber-100 text-amber-700' :
                'bg-green-light text-green-dark'
            }`}>
            {patient.photo ? (
              <img
                src={patient.photo}
                alt={patient.name}
                className="w-full h-full object-cover rounded-2xl"
              />
            ) : (
              <User size={26} />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-extrabold text-slate-800 truncate">{patient.name}</h3>
              {patient.syncStatus === 'pending' ? (
                <RefreshCw size={12} className="text-amber-500 animate-spin" />
              ) : (
                <CheckCircle size={12} className="text-emerald-500" />
              )}
            </div>

            <div className="flex flex-col gap-0.5 text-[10px] text-slate-500 mt-1 font-semibold">
              <span className="text-slate-750">UID: <strong>{patient.uid}</strong> | Age: <strong>{patient.age}</strong></span>
              <div className="flex items-center gap-1 mt-0.5">
                <MapPin size={10} className="text-slate-400" />
                <span className="truncate">{patient.village}, {patient.district}</span>
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <Phone size={10} className="text-slate-400" />
                <span>{patient.phone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Large Risk Badge Container */}
        <div className={`w-full py-2.5 px-4 rounded-xl border text-center font-black tracking-wider text-[10px] uppercase ${riskBg}`}>
          {getRiskLabel(risk)}
        </div>

        {/* Next Appointment Card with Rescheduling Controls */}
        <div className="glass-panel bg-white border border-cream-300 p-4 flex flex-col gap-3 rounded-2xl shadow-sm animate-scale-in">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-light text-green-primary flex items-center justify-center shrink-0">
                <Calendar size={18} />
              </div>
              <div>
                <h4 className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">
                  Next Checkup Schedule
                </h4>
                <p className="text-xs font-black text-green-dark mt-0.5">
                  {patient.nextApptDate ? (
                    new Date(patient.nextApptDate).toLocaleDateString(undefined, {
                      weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
                    })
                  ) : (
                    'No checkup scheduled'
                  )}
                </p>
              </div>
            </div>
            {patient.nextApptDate && (
              <span className="text-[8px] bg-green-light text-green-dark border border-green-200/50 py-0.5 px-2 rounded-full font-black uppercase shrink-0">
                Active
              </span>
            )}
          </div>

          {/* Date Picker Rescheduling Row */}
          <div className="flex items-center gap-2 border-t border-cream-100 pt-2.5 mt-0.5">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider shrink-0">
              Reschedule Appt:
            </span>
            <input
              type="date"
              min={new Date().toISOString().split('T')[0]}
              value={patient.nextApptDate ? patient.nextApptDate.split('T')[0] : ''}
              onChange={async (e) => {
                const newDate = e.target.value;
                if (!newDate) return;
                try {
                  const nextDateObj = new Date(newDate);
                  nextDateObj.setHours(10, 0, 0, 0); // standard morning appt time
                  const nextDateString = nextDateObj.toISOString();

                  // Update Local State & DB
                  await db.patients.update(patient.id, {
                    nextApptDate: nextDateString,
                    syncStatus: 'pending'
                  });
                  setPatient(prev => ({
                    ...prev,
                    nextApptDate: nextDateString,
                    syncStatus: 'pending'
                  }));
                } catch (err) {
                  console.error('Failed to reschedule checkup date:', err);
                }
              }}
              className="py-1 px-2.5 text-xs bg-bg-secondary rounded-lg border border-border-color focus:border-primary-teal focus:ring-1 focus:ring-primary-teal outline-none w-full"
            />
          </div>
        </div>

        {/* Health Readings Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="glass-panel bg-white border border-cream-300 p-3.5 flex flex-col justify-between min-h-[80px] shadow-sm rounded-xl">
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
              IDRS Score
            </span>
            <span className="text-xl font-black text-slate-800 mt-1">
              {latestScreening ? latestScreening.idrsScore : 'N/A'}
            </span>
            <span className="text-[8px] text-slate-400 font-bold mt-1">Diabetes Indicator</span>
          </div>

          <div className="glass-panel bg-white border border-cream-300 p-3.5 flex flex-col justify-between min-h-[80px] shadow-sm rounded-xl">
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
              Blood Pressure
            </span>
            <span className="text-xl font-black text-slate-800 mt-1">
              {latestScreening && latestScreening.bpSystolic
                ? `${latestScreening.bpSystolic}/${latestScreening.bpDiastolic}`
                : 'N/A'
              }
            </span>
            <span className="text-[8px] text-slate-400 font-bold mt-1 truncate">
              {latestScreening ? latestScreening.riskLevel : 'Not Tested'}
            </span>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={() => navigate(`/screening?uid=${uid}`)}
            className="w-full py-3.5 px-4 rounded-xl bg-green-primary hover:bg-green-dark text-white font-bold text-xs tracking-wide shadow-md flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-transform cursor-pointer"
          >
            <Activity size={16} />
            Conduct Health Screening
          </button>

          <button
            onClick={() => navigate(`/medicine?uid=${uid}`)}
            className="w-full py-3.5 px-4 rounded-xl bg-white border border-cream-300 text-slate-800 font-bold text-xs tracking-wide flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Pill size={16} className="text-amber-500" />
            Medicine Distribution
          </button>
        </div>

        {/* Timeline & Logs stack */}
        <div className="flex flex-col gap-4">
          {/* Screenings Timeline Section */}
          <div className="glass-panel bg-white border border-cream-300 p-4 flex flex-col gap-3 rounded-xl shadow-sm">
            <h3 className="text-[10px] font-bold text-slate-650 tracking-widest uppercase border-b border-cream-200 pb-1.5">
              Recent Screenings
            </h3>

            {screenings.length === 0 ? (
              <span className="text-slate-500 text-xs py-4 text-center italic font-medium">
                No screening records found.
              </span>
            ) : (
              <div className="flex flex-col gap-3">
                {(showAllHistory ? screenings : screenings.slice(0, 3)).map((scr, idx) => {
                  let scrColor = 'bg-emerald-500 border-emerald-100';
                  if (scr.overallRisk === 'RED') scrColor = 'bg-red-500 border-red-100';
                  else if (scr.overallRisk === 'YELLOW') scrColor = 'bg-amber-500 border-amber-100';

                  return (
                    <div key={scr.id} className="flex gap-3 relative">
                      {/* Timeline node line */}
                      {idx < screenings.length - 1 && (
                        <div className="absolute left-2 top-5 bottom-0 w-0.5 bg-cream-300" />
                      )}

                      <div className={`w-3.5 h-3.5 rounded-full shrink-0 border-2 border-white mt-1 ${scrColor} shadow-sm`} />

                      <div className="flex-1 bg-cream-50/50 border border-cream-300 rounded-xl p-2.5 flex items-center justify-between gap-3">
                        <div>
                          <span className="text-[9px] text-slate-500 font-bold block">
                            {new Date(scr.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800 mt-0.5">
                            <span>IDRS: {scr.idrsScore}</span>
                            {scr.bpSystolic > 0 && (
                              <span>BP: {scr.bpSystolic}/{scr.bpDiastolic}</span>
                            )}
                          </div>
                        </div>
                        <span className={`text-[8px] font-black py-0.5 px-2 rounded-full uppercase border shrink-0 ${scr.overallRisk === 'RED' ? 'text-red-700 border-red-200 bg-red-50' :
                            scr.overallRisk === 'YELLOW' ? 'text-amber-700 border-amber-200 bg-amber-50' :
                              'text-emerald-700 border-emerald-200 bg-emerald-50'
                          }`}>
                          {scr.overallRisk}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {screenings.length > 3 && (
                  <button
                    onClick={() => setShowAllHistory(!showAllHistory)}
                    className="w-full text-center text-[9px] font-black text-green-primary hover:text-green-dark tracking-wider uppercase pt-1 transition-colors cursor-pointer"
                  >
                    {showAllHistory ? 'Show Less' : `View All (${screenings.length})`}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Recent Distributed Medicines */}
          <div className="glass-panel bg-white border border-cream-300 p-4 flex flex-col gap-3 rounded-xl shadow-sm">
            <h3 className="text-[10px] font-bold text-slate-650 tracking-widest uppercase border-b border-cream-200 pb-1.5">
              Medicine Logs
            </h3>

            {medsList.length === 0 ? (
              <span className="text-slate-500 text-xs py-4 text-center italic font-medium">
                No medicine distributions logged.
              </span>
            ) : (
              <div className="flex flex-col gap-2.5">
                {medsList.slice(0, 3).map((med) => (
                  <div
                    key={med.id}
                    className="flex items-center justify-between p-3 bg-cream-50/50 border border-cream-300 rounded-xl text-xs text-slate-800"
                  >
                    <div className="min-w-0 pr-2">
                      <h4 className="font-extrabold text-slate-850 truncate">{med.medicineName}</h4>
                      <span className="text-[9px] text-slate-500 mt-0.5 block font-semibold">
                        Given: {new Date(med.distributedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-black text-slate-700 block">{med.quantity} Units</span>
                      {med.nextDueDate && (
                        <span className="text-[8.5px] text-amber-700 font-bold mt-0.5 block">
                          Due: {new Date(med.nextDueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default PatientProfile;
