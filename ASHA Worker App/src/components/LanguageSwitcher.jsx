/**
 * components/LanguageSwitcher.jsx
 * Modern language selector with Google-style design
 * Smooth animations and bold typography
 */

import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'kn', label: 'ಕನ್ನಡ' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'te', label: 'తెలుగు' }
];

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-2 max-w-full scrollbar-none shrink-0">
      <div className="text-gray-500 bg-teal-50 p-2.5 rounded-2xl border-2 border-teal-200 flex items-center justify-center shrink-0">
        <Globe size={20} className="text-teal-600" strokeWidth={2} />
      </div>

      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
        {LANGUAGES.map((lang) => {
          const isActive = language === lang.code;
          return (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`py-2 px-4 rounded-2xl text-sm font-bold tracking-wide border-2 transition-all duration-300 shrink-0 select-none transform ${
                isActive
                  ? 'bg-teal-600 border-teal-600 text-white shadow-lg -translate-y-1'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:shadow-sm active:scale-95'
              }`}
            >
              {lang.label}
            </button>
          );
        })}
      </div>

      <style>{`
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

export default LanguageSwitcher;
