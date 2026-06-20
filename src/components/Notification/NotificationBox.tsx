import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from '../theme/ThemeContext';

// TypeScript Interfaces
interface NotificationData {
  id: number;
  type: 'welcome' | 'permission';
  title: string;
  message: string;
  time: string;
  requiresAction?: boolean;
}

interface NotificationBoxProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationBox: React.FC<NotificationBoxProps> = ({ isOpen, onClose }) => {
  const { theme } = useTheme(); // theme = true (Dark), false (Light)
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const notifications: NotificationData[] = [
    {
      id: 1,
      type: 'welcome',
      title: 'Welcome to Gurukul',
      message: 'Super Admin, you have successfully logged in. Explore the dashboard to manage your institution effectively.',
      time: 'Just now',
    },
    {
      id: 2,
      type: 'permission',
      title: 'New Permission Request',
      message: 'User "Rahul_Dev" requires your approval for new department access.',
      time: '10 mins ago',
      requiresAction: true,
    }
  ];

  const renderIcon = (type: NotificationData['type']) => {
    if (type === 'welcome') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      );
    }
    if (type === 'permission') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
      );
    }
    return null;
  };

  const isDark = theme;

  const portalContent = (
    <>
      <style>{`
        @keyframes customFadeIn {
          from { opacity: 0; backdrop-filter: blur(0px); }
          to { opacity: 1; backdrop-filter: blur(8px); }
        }
        @keyframes customScaleDown {
          from { transform: scale(1.05); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-lux-fade { animation: customFadeIn 0.3s ease-out forwards; }
        .animate-lux-scale { animation: customScaleDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>

      {/* Overlay */}
      <div 
        className={`fixed inset-0 z-[99999] flex justify-center items-start pt-[85px] animate-lux-fade ${
          isDark ? 'bg-slate-900/70' : 'bg-red-100/65'
        }`} 
        onClick={onClose}
      >
        {/* Main Box */}
        <div 
          className={`w-[800px] rounded-[20px] p-6 animate-lux-scale backdrop-blur-xl border ${
            isDark 
              ? 'bg-gradient-to-br from-slate-800/[0.98] to-slate-900/[0.99] border-slate-500/50 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.9),0_0_20px_rgba(0,0,0,0.3)]'
              : 'bg-gradient-to-br from-white/[0.98] to-slate-50/[0.95] border-red-300/60 shadow-[0_25px_50px_-12px_rgba(220,38,38,0.15),0_0_15px_rgba(255,255,255,0.8),inset_0_0_0_1px_rgba(255,255,255,1)]'
          }`} 
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={`flex justify-between items-center mb-5 border-b pb-4 ${isDark ? 'border-slate-600/40' : 'border-red-500/10'}`}>
            <h3 className={`m-0 text-[1.15rem] font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              Notifications
            </h3>
            <button 
              className={`h-8 w-8 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 border-none ${
                isDark 
                  ? 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-50 hover:rotate-90' 
                  : 'bg-red-500/5 text-slate-600 hover:bg-red-100 hover:text-red-500 hover:rotate-90'
              }`} 
              onClick={onClose} 
              title="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* List */}
          <div className="flex flex-col gap-5">
            {notifications.map((notif) => (
              <div 
                key={notif.id} 
                className={`flex items-start gap-4 p-[14px] rounded-[16px] border border-transparent transition-all duration-300 cursor-pointer ${
                  isDark 
                    ? 'bg-slate-700/30 hover:bg-slate-600/50 hover:border-slate-400/30 hover:-translate-y-0.5' 
                    : 'bg-white/60 hover:bg-white hover:border-red-500/15 hover:-translate-y-0.5'
                }`}
              >
                {/* Icon */}
                <div className={`flex items-center justify-center w-[44px] h-[44px] rounded-[12px] shrink-0 ${
                  notif.type === 'welcome' 
                    ? (isDark ? 'bg-emerald-500/15 text-emerald-400' : 'bg-emerald-50 text-emerald-500')
                    : (isDark ? 'bg-amber-500/15 text-amber-400' : 'bg-amber-50 text-amber-500')
                }`}>
                  {renderIcon(notif.type)}
                </div>

                {/* Content */}
                <div>
                  <h4 className={`m-0 mb-1 text-[0.95rem] font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                    {notif.title}
                  </h4>
                  <p className={`m-0 text-[0.85rem] leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {notif.message}
                  </p>
                  <div className={`mt-1.5 text-[0.75rem] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {notif.time}
                  </div>
                  
                  {/* Actions */}
                  {notif.requiresAction && (
                    <div className="flex gap-2.5 mt-3">
                      <button className={`border border-transparent px-4 py-1.5 rounded-md text-[0.8rem] font-semibold cursor-pointer transition-all duration-300 ${
                        isDark
                          ? 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 hover:border-emerald-400/40 hover:text-emerald-300 hover:shadow-[0_4px_12px_rgba(16,185,129,0.2)] hover:-translate-y-0.5'
                          : 'bg-emerald-50 text-emerald-500 hover:bg-emerald-100 hover:border-emerald-500/30 hover:text-emerald-600 hover:shadow-[0_4px_12px_rgba(16,185,129,0.15)] hover:-translate-y-0.5'
                      }`}>
                        Approve
                      </button>
                      <button className={`border border-transparent px-4 py-1.5 rounded-md text-[0.8rem] font-semibold cursor-pointer transition-all duration-300 ${
                        isDark
                          ? 'bg-rose-500/15 text-rose-400 hover:bg-rose-500/25 hover:border-rose-400/40 hover:text-rose-300 hover:shadow-[0_4px_12px_rgba(225,29,72,0.2)] hover:-translate-y-0.5'
                          : 'bg-red-50 text-red-500 hover:bg-red-100 hover:border-red-500/30 hover:text-red-600 hover:shadow-[0_4px_12px_rgba(239,68,68,0.15)] hover:-translate-y-0.5'
                      }`}>
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(portalContent, document.body);
};

export default NotificationBox;