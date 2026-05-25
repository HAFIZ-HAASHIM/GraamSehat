/**
 * components/RiskMeter.jsx
 * Modern speedometer dial with smooth animations
 * Google-style design with vibrant colors
 */

import React, { useEffect, useState } from 'react';

export function RiskMeter({ score }) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const duration = 900;
    const steps = 45;
    const increment = score / steps;
    let current = 0;
    let stepCount = 0;

    const timer = setInterval(() => {
      current += increment;
      stepCount++;
      if (stepCount >= steps) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.round(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [score]);

  const rotationDegrees = -90 + (animatedScore / 100) * 180;

  // Modern Google-style colors
  let color = '#34A853'; // Green
  let label = 'LOW RISK';
  let bgColor = '#E8F5E9';
  
  if (score >= 70) {
    color = '#EA4335'; // Red
    label = 'VERY HIGH';
    bgColor = '#FCE8E6';
  } else if (score >= 50) {
    color = '#EA4335'; // Red
    label = 'HIGH RISK';
    bgColor = '#FCE8E6';
  } else if (score >= 30) {
    color = '#FBBC04'; // Yellow
    label = 'MODERATE';
    bgColor = '#FEF7E0';
  }

  return (
    <div className={`flex flex-col items-center justify-center p-6 rounded-3xl transition-all duration-300 ${bgColor}`}>
      <div className="relative w-72 h-36 flex items-center justify-center">
        {/* Speedometer Track SVG */}
        <svg className="w-72 h-36 drop-shadow-md" viewBox="0 0 200 100">
          {/* Background Track */}
          <path
            d="M 20 90 A 80 80 0 0 1 180 90"
            fill="none"
            stroke="#E0E0E0"
            strokeWidth="14"
            strokeLinecap="round"
          />
          {/* Green Zone (0 - 30) */}
          <path
            d="M 20 90 A 80 80 0 0 1 68 39"
            fill="none"
            stroke="#34A853"
            strokeWidth="14"
            strokeLinecap="round"
          />
          {/* Yellow Zone (30 - 50) */}
          <path
            d="M 68 39 A 80 80 0 0 1 100 20"
            fill="none"
            stroke="#FBBC04"
            strokeWidth="14"
            strokeLinecap="round"
          />
          {/* Orange Zone (50 - 70) */}
          <path
            d="M 100 20 A 80 80 0 0 1 132 29"
            fill="none"
            stroke="#FA7B17"
            strokeWidth="14"
            strokeLinecap="round"
          />
          {/* Red Zone (70 - 100) */}
          <path
            d="M 132 29 A 80 80 0 0 1 180 90"
            fill="none"
            stroke="#EA4335"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Center circle */}
          <circle cx="100" cy="90" r="6" fill="#1F2937" />
        </svg>

        {/* Animated Needle */}
        <div 
          className="absolute bottom-6 left-1/2 w-2 h-20 bg-gradient-to-t from-gray-900 to-gray-700 origin-bottom rounded-full transition-transform duration-300 ease-out shadow-lg"
          style={{ 
            transform: `translateX(-50%) rotate(${rotationDegrees}deg)`,
            transformOrigin: '50% calc(100% - 8px)',
            filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))'
          }}
        />
      </div>

      {/* Score Display */}
      <div className="mt-6 text-center">
        <div className="text-5xl font-bold text-gray-900" style={{ color }}>
          {animatedScore}
        </div>
        <div className="text-sm font-bold tracking-widest mt-2" style={{ color }}>
          {label}
        </div>
        <div className="text-xs text-gray-600 mt-3 font-medium">
          Risk Score
        </div>
      </div>
    </div>
  );
}

export default RiskMeter;
