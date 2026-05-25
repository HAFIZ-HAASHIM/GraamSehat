/**
 * components/BigButton.jsx
 * Modern minimal action buttons with Google-style design
 * Bold typography, curved elements, smooth animations
 */

import React from 'react';

export function BigButton({ title, desc, icon: Icon, onClick, colorClass, gradientClass }) {
  // Modern color mapping with vibrant Google palette
  const colorMap = {
    primary: {
      bg: 'bg-teal-50',
      text: 'text-teal-900',
      border: 'border-teal-200',
      hover: 'hover:bg-teal-100',
      icon: 'text-teal-600',
    },
    success: {
      bg: 'bg-green-50',
      text: 'text-green-900',
      border: 'border-green-200',
      hover: 'hover:bg-green-100',
      icon: 'text-green-600',
    },
    warning: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-900',
      border: 'border-yellow-200',
      hover: 'hover:bg-yellow-100',
      icon: 'text-yellow-600',
    },
    danger: {
      bg: 'bg-red-50',
      text: 'text-red-900',
      border: 'border-red-200',
      hover: 'hover:bg-red-100',
      icon: 'text-red-600',
    },
  };

  // Determine color based on input
  let colors = colorMap.primary;
  if (colorClass?.includes('teal') || colorClass?.includes('green') || colorClass?.includes('emerald') || gradientClass?.includes('green')) {
    colors = colorMap.success;
  } else if (colorClass?.includes('amber') || colorClass?.includes('yellow') || colorClass?.includes('orange') || gradientClass?.includes('amber')) {
    colors = colorMap.warning;
  } else if (colorClass?.includes('red') || gradientClass?.includes('red')) {
    colors = colorMap.danger;
  }

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-6 rounded-3xl border-2 transition-all duration-300 active:scale-[0.96] flex items-center justify-between group ${colors.bg} ${colors.border} ${colors.hover} shadow-sm hover:shadow-md hover:-translate-y-1 animate-scale-in`}
      style={{ minHeight: '100px' }}
    >
      <div className="flex-1 pr-4">
        <h3 className={`text-lg font-bold tracking-tight mb-1 ${colors.text}`}>
          {title}
        </h3>
        <p className={`opacity-75 text-sm font-medium tracking-wide ${colors.text}`}>
          {desc}
        </p>
      </div>

      <div className={`bg-white p-3.5 rounded-2xl shadow-md flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg ${colors.icon}`}>
        {Icon && <Icon size={28} className="stroke-[2]" />}
      </div>
    </button>
  );
}

