/**
 * components/PatientCard.jsx
 * Modern patient card with bold design, curves, and smooth animations
 * Google-style material design
 */

import React from 'react';
import { User, Calendar, MapPin, CheckCircle, RefreshCw } from 'lucide-react';

export function PatientCard({ patient, onClick }) {
  const { uid, name, village, lastScreenedAt, currentRiskLevel, syncStatus } = patient;

  // Modern risk level styling
  let riskColor = 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 border-emerald-200 dark:border-emerald-900';
  let riskLabel = 'Low Risk';
  let riskDot = 'bg-emerald-500';

  if (currentRiskLevel === 'RED') {
    riskColor = 'text-red-700 dark:text-red-300 bg-red-50 border-red-200 dark:border-red-900';
    riskLabel = 'High Risk';
    riskDot = 'bg-red-500 animate-pulse';
  } else if (currentRiskLevel === 'YELLOW') {
    riskColor = 'text-amber-700 dark:text-amber-300 bg-amber-50 border-amber-200 dark:border-amber-900';
    riskLabel = 'Medium Risk';
    riskDot = 'bg-amber-500';
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Never Screened';
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <div
      onClick={() => onClick && onClick(patient)}
      className="w-full bg-white border-2 border-gray-200 p-5 rounded-3xl cursor-pointer flex items-center justify-between gap-4 transition-all duration-300 hover:border-teal-400 hover:shadow-md hover:-translate-y-1 active:scale-[0.96] animate-slide-in"
    >
      <div className="flex items-center gap-4 min-w-0">
        {/* Avatar */}
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 font-bold text-white text-lg ${
          currentRiskLevel === 'RED' ? 'bg-red-500' :
          currentRiskLevel === 'YELLOW' ? 'bg-amber-500' :
          'bg-teal-500'
        }`}>
          {patient.photo ? (
            <img 
              src={patient.photo} 
              alt={name} 
              className="w-full h-full object-cover rounded-2xl"
            />
          ) : (
            <User size={20} />
          )}
        </div>

        {/* Patient info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-bold text-gray-900 truncate">
              {name}
            </h4>
            
            {/* Sync status */}
            {syncStatus === 'pending' ? (
              <RefreshCw size={14} className="text-amber-500 animate-spin shrink-0" />
            ) : (
              <CheckCircle size={14} className="text-green-500 shrink-0" />
            )}
          </div>
          
          <div className="flex items-center gap-3 text-xs text-gray-600 mb-1">
            <div className="flex items-center gap-1 truncate">
              <MapPin size={12} />
              <span className="truncate">{village}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar size={12} />
            <span>{formatDate(lastScreenedAt)}</span>
          </div>
        </div>
      </div>

      {/* Risk Badge */}
      <div className={`flex flex-col items-center gap-1.5 shrink-0 px-3 py-2 rounded-2xl border-2 ${riskColor} font-bold text-xs`}>
        <div className={`w-2.5 h-2.5 rounded-full ${riskDot}`} />
        <span className="whitespace-nowrap">{riskLabel}</span>
      </div>
    </div>
  );
}

