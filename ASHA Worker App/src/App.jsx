/**
 * App.jsx
 * Main Application Module.
 * Integrates global localization, authentication, and offline database context providers.
 * Establishes protected client routes for ASHA worker screens.
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Context Providers
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SyncProvider } from './context/SyncContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';

// Common Components
import { SyncBanner } from './components/SyncBanner';
import { DashboardLayout } from './components/DashboardLayout';

// Pages
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { ScanCard } from './pages/ScanCard';
import { PatientProfile } from './pages/PatientProfile';
import { NewRegistration } from './pages/NewRegistration';
import { Screening } from './pages/Screening';
import { ScreeningResult } from './pages/ScreeningResult';
import { MedicineLog } from './pages/MedicineLog';
import { MyPatients } from './pages/MyPatients';
import { PendingSync } from './pages/PendingSync';
import { Settings } from './pages/Settings';
import { AdminChecklist } from './pages/AdminChecklist';

// Protected Route Guard
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="w-full flex-grow bg-bg-primary flex items-center justify-center text-text-secondary">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-teal" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}

export function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <SyncProvider>
            <ToastProvider>
              <BrowserRouter>
                <div className="app-container select-none">
                  
                  {/* Persistent Network Connectivity Alert Banner */}
                  <SyncBanner />

                  <div className="flex-1 flex flex-col min-h-0">
                    <Routes>
                      {/* Public Login Route */}
                      <Route path="/login" element={<Login />} />

                      {/* Protected ASHA Worker Routes */}
                      <Route path="/" element={
                        <ProtectedRoute>
                          <Home />
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/scan" element={
                        <ProtectedRoute>
                          <ScanCard />
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/patient/:uid" element={
                        <ProtectedRoute>
                          <PatientProfile />
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/register" element={
                        <ProtectedRoute>
                          <NewRegistration />
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/screening" element={
                        <ProtectedRoute>
                          <Screening />
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/screening-result/:id" element={
                        <ProtectedRoute>
                          <ScreeningResult />
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/medicine" element={
                        <ProtectedRoute>
                          <MedicineLog />
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/patients" element={
                        <ProtectedRoute>
                          <MyPatients />
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/sync-queue" element={
                        <ProtectedRoute>
                          <PendingSync />
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/settings" element={
                        <ProtectedRoute>
                          <Settings />
                        </ProtectedRoute>
                      } />

                      {/* Developer/Admin Helper Route */}
                      <Route path="/admin" element={
                        <ProtectedRoute>
                          <AdminChecklist />
                        </ProtectedRoute>
                      } />

                      {/* Fallback redirect to Home */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </div>

                </div>
              </BrowserRouter>
            </ToastProvider>
          </SyncProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
