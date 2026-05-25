/**
 * components/ScanOption.jsx
 * Option cards for scanner options.
 * Uses flat modern pastel selections instead of dark neon glows.
 */

import React from 'react';

export function ScanOption({ title, desc, icon: Icon, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border flex items-center gap-4 ${
        active 
          ? 'border-primary-teal bg-primary-teal/10 text-primary-teal dark:text-teal-300 shadow-sm scale-[1.01]' 
          : 'border-border-color bg-bg-card text-text-primary hover:bg-bg-secondary/50'
      }`}
    >
      <div className={`p-3 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
        active ? 'bg-primary-teal text-white' : 'bg-bg-secondary text-text-secondary'
      }`}>
        {Icon && <Icon size={20} />}
      </div>
      
      <div className="flex-1">
        <h4 className="text-xs font-black uppercase tracking-wider">
          {title}
        </h4>
        <p className="text-[10px] text-text-secondary leading-normal mt-0.5 font-semibold">
          {desc}
        </p>
      </div>
    </div>
  );
}

export default ScanOption;
