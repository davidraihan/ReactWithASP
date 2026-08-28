import React, { useState, useEffect } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

export interface AuthPageProps {
  initialTab?: 'login' | 'register';
  onLoginSuccess?: (data: {
    accessToken: string;
    accessExpiresAt: string;
    refreshToken: string;
    user?: any;
  }) => void;
  onRegisterSuccess?: (email: string) => void;
  onNavigateToPublic?: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialTab = 'login',
  onLoginSuccess,
  onRegisterSuccess,
  onNavigateToPublic,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const handleLoginSuccess = (data: {
    accessToken: string;
    accessExpiresAt: string;
    refreshToken: string;
    user?: any;
  }) => {
    console.log('Login success:', data);
    if (onLoginSuccess) {
      onLoginSuccess(data);
    }
  };

  const handleRegisterSuccess = (email: string) => {
    console.log('Register success:', email);
    if (onRegisterSuccess) {
      onRegisterSuccess(email);
    } else {
      setActiveTab('login');
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row font-sans antialiased">
      {/* ─── LEFT PANEL: Brand + Narasi ─── */}
      <div className="relative w-full lg:w-1/2 bg-[#0f172a] text-white flex flex-col justify-between p-8 sm:p-12 lg:p-16 overflow-hidden">
        {onNavigateToPublic && (
          <button
            onClick={onNavigateToPublic}
            className="hidden lg:flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors bg-slate-800/50 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700/60 w-fit mb-6 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Kembali ke Halaman Toko
          </button>
        )}
        {/* Decorative blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#3B82F6]/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -right-24 w-80 h-80 bg-[#6366f1]/15 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 w-72 h-72 bg-[#06b6d4]/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-[#3B82F6] rounded-lg flex items-center justify-center shadow-lg shadow-[#3B82F6]/30">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            </div>
            <span className="text-2xl font-bold tracking-tight">AeroCorp</span>
          </div>

          {/* Headline & Narasi */}
          <div className="max-w-md">
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold leading-tight mb-6">
              Accelerate your workflow with intelligent aviation management.
            </h2>
            <p className="text-slate-300 text-lg leading-relaxed mb-8">
              Join thousands of professionals who trust AeroCorp to streamline operations, manage fleets, and scale their aviation business effortlessly.
            </p>

            {/* Feature bullets */}
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-5 h-5 text-[#3B82F6]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Enterprise-grade Security</h4>
                  <p className="text-slate-400 text-sm">End-to-end encryption and compliance with aviation industry standards.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-5 h-5 text-[#3B82F6]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Real-time Analytics</h4>
                  <p className="text-slate-400 text-sm">Live dashboards and predictive insights for smarter decision making.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="relative z-10 mt-12">
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <span>Trusted by</span>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-300">Garuda</span>
              <span className="text-slate-600">|</span>
              <span className="font-semibold text-slate-300">Lion Air</span>
              <span className="text-slate-600">|</span>
              <span className="font-semibold text-slate-300">Citilink</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── RIGHT PANEL: Form ─── */}
      <div className="w-full lg:w-1/2 bg-[#f8fafc] flex items-center justify-center p-6 sm:p-10 lg:p-16">
        <div className="w-full max-w-[440px]">
          {onNavigateToPublic && (
            <button
              onClick={onNavigateToPublic}
              className="lg:hidden mb-6 flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              ← Kembali ke Halaman Toko
            </button>
          )}

          {/* Tab Toggle */}
          <div className="flex p-1 bg-white border border-[#E2E8F0] rounded-lg mb-8 shadow-sm">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-md transition-all ${
                activeTab === 'login'
                  ? 'bg-[#3B82F6] text-white shadow-sm'
                  : 'text-[#424754] hover:text-[#191c1d]'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-md transition-all ${
                activeTab === 'register'
                  ? 'bg-[#3B82F6] text-white shadow-sm'
                  : 'text-[#424754] hover:text-[#191c1d]'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Forms */}
          {activeTab === 'login' ? (
            <LoginForm
              onSuccess={handleLoginSuccess}
              onSwitchToRegister={() => setActiveTab('register')}
            />
          ) : (
            <RegisterForm
              onRegisterSuccess={handleRegisterSuccess}
              onSwitchToLogin={() => setActiveTab('login')}
            />
          )}
        </div>
      </div>
    </div>
  );
};
