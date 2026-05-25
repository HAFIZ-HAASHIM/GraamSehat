/**
 * components/ProgressBar.jsx
 * Modern progress indicator with smooth animations
 * Google-style material design
 */

import React from 'react';

export function ProgressBar({ current, total }) {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full flex flex-col gap-4 py-3">
      {/* Linear Progress Bar */}
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden border-2 border-gray-200">
        <div 
          className="h-full bg-gradient-to-r from-teal-500 to-teal-600 rounded-full transition-all duration-500 ease-out shadow-lg"
          style={{ 
            width: `${percentage}%`,
            boxShadow: '0 0 16px rgba(45, 122, 110, 0.5)'
          }}
        />
      </div>

      {/* Step Indicators */}
      <div className="flex items-center justify-between gap-2">
        {Array.from({ length: total }).map((_, idx) => {
          const stepNum = idx + 1;
          const isCompleted = stepNum < current;
          const isActive = stepNum === current;

          return (
            <div 
              key={stepNum}
              className={`flex-1 h-3 rounded-full transition-all duration-300 transform ${
                isCompleted 
                  ? 'bg-teal-600 shadow-md' 
                  : isActive
                  ? 'bg-teal-500 shadow-lg scale-110'
                  : 'bg-gray-300'
              }`}
            />
          );
        })}
      </div>

      {/* Progress text */}
      <div className="text-center text-sm font-bold text-gray-700">
        Step {current} of {total}
      </div>
    </div>
  );
}

export default ProgressBar;
