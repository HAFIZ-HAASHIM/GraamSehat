import React, { createContext, useContext, useState, useCallback } from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, toasts }}>
      {children}
      
      {/* Global Slide-in Toast Container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          let Icon = Info;
          let containerClass = 'bg-white dark:bg-bg-secondary border-border-color text-text-primary';
          let iconClass = 'text-primary';

          if (toast.type === 'success') {
            Icon = CheckCircle;
            containerClass = 'bg-emerald-50 dark:bg-[#064e3b] border-emerald-200 dark:border-emerald-950 text-emerald-800 dark:text-emerald-100';
            iconClass = 'text-emerald-500';
          } else if (toast.type === 'error') {
            Icon = AlertCircle;
            containerClass = 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-900 text-red-800 dark:text-red-100';
            iconClass = 'text-red-500';
          } else if (toast.type === 'warning') {
            Icon = AlertCircle;
            containerClass = 'bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-100';
            iconClass = 'text-amber-500';
          }

          return (
            <div
              key={toast.id}
              className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg pointer-events-auto transition-all duration-300 animate-scale-in ${containerClass}`}
            >
              <Icon size={18} className={`shrink-0 mt-0.5 ${iconClass}`} />
              <div className="flex-1 text-xs font-semibold leading-relaxed">
                {toast.message}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-text-muted hover:text-text-primary p-0.5 rounded transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
export default ToastContext;
