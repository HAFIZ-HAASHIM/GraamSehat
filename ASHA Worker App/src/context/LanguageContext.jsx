/**
 * context/LanguageContext.jsx
 * Context provider for managing the selected application language
 * and providing localized translation functions.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import en from '../locales/en';
import kn from '../locales/kn';
import hi from '../locales/hi';
import ta from '../locales/ta';
import te from '../locales/te';

const LanguageContext = createContext();

const localeMap = { en, kn, hi, ta, te };

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('graamsehat_lang') || 'en';
  });

  const setLanguage = (lang) => {
    if (localeMap[lang]) {
      setLanguageState(lang);
      localStorage.setItem('graamsehat_lang', lang);
    }
  };

  /**
   * Translates a dot-notated key path (e.g. 'home.greeting') into the localized string.
   * Supports placeholder replacement (e.g. t('scan.notFoundDesc', { uid: '123' })).
   */
  const t = (keyPath, placeholders = {}) => {
    const keys = keyPath.split('.');
    
    // Attempt lookup in current language
    let translation = getNestedValue(localeMap[language], keys);
    
    // Fallback to English if not found
    if (translation === undefined && language !== 'en') {
      translation = getNestedValue(localeMap['en'], keys);
    }

    if (translation === undefined) {
      return keyPath;
    }

    // Replace placeholders
    let result = translation;
    Object.keys(placeholders).forEach((placeholder) => {
      result = result.replace(`{${placeholder}}`, placeholders[placeholder]);
    });

    return result;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Helper function to resolve nested keys
function getNestedValue(obj, keys) {
  let current = obj;
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return undefined;
    }
  }
  return current;
}

export const useLanguage = () => useContext(LanguageContext);
export default LanguageContext;
