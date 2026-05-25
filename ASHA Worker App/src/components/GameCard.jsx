/**
 * components/GameCard.jsx
 * Modern minimal choice cards with bold design and smooth animations
 * Google-style material design with curves and transitions
 */

import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export function GameCard({ label, icon: Icon, emoji, selected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`w-full min-h-[88px] p-5 rounded-3xl cursor-pointer border-2 flex items-center justify-between transition-all duration-300 select-none transform ${
        selected
          ? 'border-teal-600 bg-teal-50 shadow-md -translate-y-1 animate-scale-in'
          : 'border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 active:scale-[0.96] hover:shadow-sm'
      }`}
    >
      <div className="flex items-center gap-4">
        {/* Left Side Icon/Emoji container */}
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 text-3xl transition-all duration-300 font-bold ${
          selected ? 'bg-teal-200 scale-110 shadow-md' : 'bg-gray-100 text-gray-400'
        }`}>
          {emoji ? (
            <span>{emoji}</span>
          ) : Icon ? (
            <Icon size={24} className={`transition-all duration-300 ${selected ? 'text-teal-700' : 'text-gray-500'}`} strokeWidth={2} />
          ) : null}
        </div>

        {/* Option Text Label */}
        <span className={`text-base font-bold tracking-tight transition-all duration-300 ${
          selected ? 'text-teal-900' : 'text-gray-800'
        }`}>
          {label}
        </span>
      </div>

      {/* Selected checkmark bubble */}
      <div className={`transition-all duration-300 shrink-0 transform ${
        selected ? 'opacity-100 scale-100 animate-bounce-spring' : 'opacity-0 scale-50'
      }`}>
        <div className="relative">
          <CheckCircle2 size={24} className="text-teal-600 fill-teal-50 drop-shadow-sm" strokeWidth={2.5} />
        </div>
      </div>
    </div>
  );
}

export default GameCard;
