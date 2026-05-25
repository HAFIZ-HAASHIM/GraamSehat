/**
 * src/pages/Welcome.jsx
 * Splash screen shown to users on launch.
 * Displays logo, localized taglines, a start button, and language selectors.
 */

import React from 'react';
import useLanguage from '../hooks/useLanguage';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function Welcome({ onGetStarted }) {
  const { t } = useLanguage();

  return (
    <div className="page-container welcome-page animate-fade-in">
      <div className="welcome-main-content">
        {/* Brand Logo & Presentation */}
        <div className="logo-container animate-float">
          <svg
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="brand-svg-logo"
            width="120"
            height="120"
          >
            <circle cx="100" cy="100" r="90" fill="#0D9488" fillOpacity="0.1" />
            <circle cx="100" cy="100" r="75" fill="#0D9488" fillOpacity="0.2" />
            {/* Heart symbol */}
            <path
              d="M100 135C100 135 140 105 140 80C140 63.4315 126.569 50 110 50C100.8 50 92.5 54.2 87 60.8C81.5 54.2 73.2 50 64 50C47.4315 50 34 63.4315 34 80C34 105 74 135 74 135L100 160L126 135"
              fill="#0D9488"
            />
            {/* Health cross */}
            <rect x="92" y="70" width="16" height="40" rx="8" fill="#FFFFFF" />
            <rect x="80" y="82" width="40" height="16" rx="8" fill="#FFFFFF" />
          </svg>
          <h1 className="welcome-app-name">{t('common.appName')}</h1>
          <p className="welcome-tagline">{t('common.tagline')}</p>
        </div>

        {/* Action button */}
        <div className="welcome-action-box">
          <button 
            className="btn-primary welcome-start-btn" 
            onClick={onGetStarted}
          >
            {t('common.getStarted')}
          </button>
        </div>
      </div>

      {/* Language Selector at bottom */}
      <div className="welcome-footer">
        <span className="lang-footer-lbl">{t('welcome.selectLanguage')}</span>
        <LanguageSwitcher />
      </div>
    </div>
  );
}
