import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useSync } from '../context/SyncContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Home, Users, Pill, Scan, RefreshCw, Settings,
  Sun, Moon, Bell, LogOut, Heart, Activity
} from 'lucide-react';

export function DashboardLayout({ children }) {
  const { profile, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { pendingCount } = useSync();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [showNotifications, setShowNotifications] = useState(false);

  const activePath = location.pathname;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex-grow flex flex-col min-h-0 bg-bg-primary text-text-primary transition-colors duration-300">

      {/* 1. TOP HEADER (Sticky, modern minimal design) */}
      <header className="sticky top-0 h-16 bg-gradient-to-r from-teal-50 to-white border-b-2 border-teal-200 flex items-center justify-between px-5 z-20 transition-colors shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          {/* Logo / Brand Icon */}
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-600 to-teal-700 flex items-center justify-center text-white shadow-md shrink-0">
            <Heart size={20} fill="white" strokeWidth={1.5} />
          </div>
          <span className="font-bold text-lg tracking-tight text-teal-800 truncate">
            GraamSehat
          </span>
        </div>

        {/* Quick Header Utilities */}
        <div className="flex items-center gap-2 shrink-0">

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-2xl text-gray-600 hover:bg-gray-100 transition-all duration-300 cursor-pointer hover:-translate-y-0.5"
            aria-label="Toggle Dark Mode"
          >
            {theme === 'dark' ? <Sun size={20} className="text-amber-500" /> : <Moon size={20} />}
          </button>

          {/* Notifications bell */}
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 rounded-2xl text-gray-600 hover:bg-gray-100 relative transition-all duration-300 cursor-pointer hover:-translate-y-0.5"
            aria-label="Notifications"
          >
            <Bell size={20} />
            {pendingCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            )}
          </button>

          {/* Notifications dropdown */}
          {showNotifications && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-3 top-16 w-72 bg-white border-2 border-gray-200 rounded-3xl shadow-xl p-4 z-40 animate-scale-in">
                <h4 className="text-xs font-bold text-gray-600 uppercase tracking-widest border-b-2 border-gray-200 pb-2.5">
                  📢 System Alerts
                </h4>
                <div className="flex flex-col gap-2.5 mt-3 max-h-48 overflow-y-auto">
                  {pendingCount > 0 ? (
                    <div className="flex gap-2.5 items-start text-xs font-semibold p-3 bg-amber-50 border-2 border-amber-200 text-amber-900 rounded-2xl">
                      <Activity size={14} className="shrink-0 mt-0.5" />
                      <span>{pendingCount} offline screening logs pending upload.</span>
                    </div>
                  ) : (
                    <div className="text-center py-5 text-gray-500 text-xs font-medium">
                      ✅ All clear! No alerts.
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* User Profile Initial */}
          <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm uppercase shrink-0 shadow-sm">
            {profile?.name?.charAt(0) || 'A'}
          </div>

          {/* Log Out */}
          <button
            onClick={handleLogout}
            className="p-2.5 rounded-2xl text-red-600 hover:bg-red-50 transition-all duration-300 cursor-pointer hover:-translate-y-0.5"
            aria-label="Log Out"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* 2. MAIN SCROLLABLE CONTENT VIEWPORT */}
      <main className="flex-1 min-h-0 overflow-y-auto p-6 select-none bg-teal-50/30">
        {children}
      </main>

      {/* 3. MOBILE BOTTOM NAVIGATION (Modern minimal design) */}
      <nav className="h-20 bg-white border-t-2 border-teal-200 flex justify-around items-center shrink-0 z-30 px-2 shadow-lg">
        <button
          onClick={() => navigate('/')}
          className={`flex flex-col items-center gap-1.5 cursor-pointer transition-all duration-300 p-2 rounded-2xl ${activePath === '/'
              ? 'text-teal-700 font-bold bg-teal-50'
              : 'text-gray-600 hover:text-teal-700'
            }`}
        >
          <Home size={24} strokeWidth={activePath === '/' ? 2.5 : 2} />
          <span className="text-xs font-bold tracking-tight">Home</span>
        </button>

        <button
          onClick={() => navigate('/patients')}
          className={`flex flex-col items-center gap-1.5 cursor-pointer transition-all duration-300 p-2 rounded-2xl ${activePath.startsWith('/patients') || activePath.startsWith('/patient/')
              ? 'text-teal-700 font-bold bg-teal-50'
              : 'text-gray-600 hover:text-teal-700'
            }`}
        >
          <Users size={24} strokeWidth={activePath.startsWith('/patients') || activePath.startsWith('/patient/') ? 2.5 : 2} />
          <span className="text-xs font-bold tracking-tight">Patients</span>
        </button>

        <button
          onClick={() => navigate('/scan')}
          className={`flex flex-col items-center gap-1.5 cursor-pointer transition-all duration-300 p-2 rounded-2xl ${activePath.startsWith('/scan') || activePath.startsWith('/screening')
              ? 'text-teal-700 font-bold bg-teal-50'
              : 'text-gray-600 hover:text-teal-700'
            }`}
        >
          <Scan size={24} strokeWidth={activePath.startsWith('/scan') || activePath.startsWith('/screening') ? 2.5 : 2} />
          <span className="text-xs font-bold tracking-tight">Scan</span>
        </button>

        <button
          onClick={() => navigate('/medicine')}
          className={`flex flex-col items-center gap-1.5 cursor-pointer transition-all duration-300 p-2 rounded-2xl ${activePath.startsWith('/medicine')
              ? 'text-teal-700 font-bold bg-teal-50'
              : 'text-gray-600 hover:text-teal-700'
            }`}
        >
          <Pill size={24} strokeWidth={activePath.startsWith('/medicine') ? 2.5 : 2} />
          <span className="text-xs font-bold tracking-tight">Meds</span>
        </button>

        <button
          onClick={() => navigate('/settings')}
          className={`flex flex-col items-center gap-1.5 cursor-pointer transition-all duration-300 p-2 rounded-2xl ${activePath.startsWith('/settings')
              ? 'text-teal-700 font-bold bg-teal-50'
              : 'text-gray-600 hover:text-teal-700'
            }`}
        >
          <Settings size={24} strokeWidth={activePath.startsWith('/settings') ? 2.5 : 2} />
          <span className="text-xs font-bold tracking-tight">Settings</span>
        </button>
      </nav>

    </div>
  );
}

export default DashboardLayout;
