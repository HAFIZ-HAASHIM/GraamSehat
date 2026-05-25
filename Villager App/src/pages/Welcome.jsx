/**
 * src/pages/Welcome.jsx
 * Splash screen shown to users on launch.
 * Displays logo, localized taglines, a start button, and language selectors.
 */

import React, { useState } from 'react';
import useLanguage from '../hooks/useLanguage';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { seedDemoDataToFirestore } from '../firebase/patients';
import { Database, CheckCircle2, Loader2 } from 'lucide-react';

export default function Welcome({ onGetStarted }) {
  const { t } = useLanguage();
  const [seedingStatus, setSeedingStatus] = useState('idle'); // 'idle' | 'seeding' | 'success' | 'error'

  const handleSeedData = async () => {
    setSeedingStatus('seeding');
    try {
      await seedDemoDataToFirestore();
      setSeedingStatus('success');
      setTimeout(() => setSeedingStatus('idle'), 5000);
    } catch (err) {
      console.error(err);
      setSeedingStatus('error');
      setTimeout(() => setSeedingStatus('idle'), 5000);
    }
  };

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

          <button
            type="button"
            className={`btn-secondary welcome-seed-btn ${seedingStatus}`}
            onClick={handleSeedData}
            disabled={seedingStatus === 'seeding'}
            style={{ marginTop: '12px', fontSize: '14px', minHeight: '44px' }}
          >
            {seedingStatus === 'idle' && (
              <>
                <Database size={16} className="text-teal" />
                <span>Initialize Demo Data in DB</span>
              </>
            )}
            {seedingStatus === 'seeding' && (
              <>
                <Loader2 size={16} className="animate-spin text-teal" style={{ animation: 'spin 1s linear infinite' }} />
                <span>Seeding Firestore...</span>
              </>
            )}
            {seedingStatus === 'success' && (
              <>
                <CheckCircle2 size={16} className="text-success" />
                <span className="text-success">Seeding Successful!</span>
              </>
            )}
            {seedingStatus === 'error' && (
              <span className="text-red">Error Seeding. Check console.</span>
            )}
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
