/**
 * pages/Login.jsx
 * Sign-in panel with Firebase Auth and mock mode login fallback.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Lock, Mail, RefreshCw, AlertCircle, Heart } from 'lucide-react';

export function Login() {
  const { login, isAuthenticated, error: authError, isLoading, isMock } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState(null);

  // Auto redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    if (!email || !password) {
      setLocalError('Please enter both email and password.');
      return;
    }

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      // Handled by AuthContext
    }
  };

  const getErrorMessage = () => {
    const activeError = authError || localError;
    if (!activeError) return null;
    
    if (activeError === 'pending_approval') {
      return t('login.errorUnapproved');
    }
    if (activeError === 'invalid_role') {
      return t('login.errorRole');
    }
    return activeError;
  };

  return (
    <div className="w-full flex-grow bg-bg-primary flex flex-col justify-center px-6 py-12 animate-scale-in text-text-primary">
      <div className="max-w-md mx-auto w-full flex flex-col gap-8">
        
        {/* App Logo/Header */}
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary-teal flex items-center justify-center text-white shadow-lg mb-4">
            <Heart size={32} fill="white" className="animate-[pulse_2s_infinite]" />
          </div>
          <h1 className="text-3xl font-black text-primary-teal tracking-tight">
            {t('common.appName')}
          </h1>
          <p className="text-text-secondary text-xs font-semibold mt-1.5 max-w-[280px]">
            {t('login.subtitle')}
          </p>
        </div>

        {/* Login Panel */}
        <div className="glass-panel p-6 flex flex-col gap-6 bg-bg-card border border-border-color rounded-2xl shadow-md">
          <h2 className="text-xs font-black text-primary-teal uppercase tracking-widest border-b border-border-color pb-3">
            ASHA Worker Portal
          </h2>

          {getErrorMessage() && (
            <div className="flex items-start gap-2.5 p-4 bg-red-500/10 border border-red-200 dark:border-red-950 rounded-xl text-red-700 dark:text-red-300 text-xs leading-relaxed font-semibold">
              <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-500" />
              <span>{getErrorMessage()}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Email Field */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">
                {t('login.email')}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
                  <Mail size={18} />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="asha@graamsehat.org"
                  className="pl-12"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">
                {t('login.password')}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
                  <Lock size={18} />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-12"
                  disabled={isLoading}
                  autoComplete="current-password"
                />
              </div>
            </div>

            {/* Persistence info text */}
            <span className="text-[10px] text-text-muted italic block font-semibold">
              💡 {t('login.persistenceNotice')}
            </span>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 px-4 rounded-xl bg-primary-teal hover:bg-[#225c53] text-white font-bold text-xs uppercase tracking-widest transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer shadow-md animate-scale-in"
            >
              {isLoading ? (
                <RefreshCw size={18} className="animate-spin" />
              ) : (
                t('login.loginBtn')
              )}
            </button>
          </form>
        </div>

        {/* Demo Fallback Instructions */}
        {isMock && (
          <div className="p-4 bg-primary-teal/5 border border-primary-teal/20 rounded-xl text-center shadow-sm">
            <span className="text-xs text-primary-teal font-semibold leading-normal block">
              💻 <strong>Offline Demo Mode Active</strong><br/>
              Use <code>asha@graamsehat.org</code> & <code>password123</code> to log in.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
