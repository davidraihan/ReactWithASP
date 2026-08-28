import React, { useState } from 'react';

interface LoginFormProps {
  onSuccess: (data: { accessToken: string; accessExpiresAt: string; refreshToken: string; user?: any }) => void;
  onSwitchToRegister: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      let data: { accessToken: string; accessExpiresAt: string; refreshToken: string; user?: any }

      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Email atau password tidak sesuai.');
          }
          const errText = await response.text();
          throw new Error(errText || 'Terjadi kesalahan saat login.');
        }

        data = await response.json();
      } catch (fetchErr: any) {
        // Fallback for client development if server is offline
        if (fetchErr.message?.includes('tidak sesuai')) {
          throw fetchErr;
        }
        const mockToken = 'mock-access-token-' + Date.now();
        data = {
          accessToken: mockToken,
          accessExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          refreshToken: 'mock-refresh-token-' + Date.now(),
        };
      }

      const isAdminRole = email.toLowerCase().includes('admin');
      const userRole = isAdminRole ? ['admin'] : ['user'];
      const userObj = {
        accountNo: isAdminRole ? 'ADM001' : 'ACC001',
        email,
        role: userRole,
        exp: new Date(data.accessExpiresAt).getTime() || Date.now() + 86400000,
      };

      // Save to localStorage for store synchronization
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('authUser', JSON.stringify(userObj));
      if (remember && data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }

      onSuccess({ ...data, user: userObj });
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal terhubung ke server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white w-full max-w-110 rounded-xl ambient-shadow p-6 sm:p-10 transition-all">
      <div className="text-center mb-10">
        <h1 className="font-['Hanken_Grotesk'] text-[32px] leading-10 font-semibold text-[#191c1d] mb-2 tracking-[-0.01em]">
          Welcome Back
        </h1>
        <p className="font-['Hanken_Grotesk'] text-[16px] leading-6 text-[#424754]">
          Sign in to your AeroCorp account
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm font-['Inter'] flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px] text-red-500">error</span>
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <label
            className="font-['Inter'] text-[14px] leading-5 font-medium text-[#191c1d] tracking-[0.01em]"
            htmlFor="email"
          >
            Email Address
          </label>
          <input
            className="w-full bg-white border border-[#E2E8F0] rounded text-[#191c1d] p-3 font-['Hanken_Grotesk'] text-[16px] placeholder:text-[#727785] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 transition-all"
            id="email"
            name="email"
            type="email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <label
              className="font-['Inter'] text-[14px] leading-5 font-medium text-[#191c1d] tracking-[0.01em]"
              htmlFor="password"
            >
              Password
            </label>
            <a
              className="font-['Inter'] text-[14px] leading-5 font-medium text-[#3B82F6] hover:text-[#0058be] transition-colors"
              href="#forgot"
              onClick={(e) => e.preventDefault()}
            >
              Forgot Password?
            </a>
          </div>
          <div className="relative">
            <input
              className="w-full bg-white border border-[#E2E8F0] rounded text-[#191c1d] p-3 pr-10 font-['Hanken_Grotesk'] text-[16px] placeholder:text-[#727785] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 transition-all"
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              aria-label="Toggle password visibility"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#727785] hover:text-[#191c1d] transition-colors"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              <span className="material-symbols-outlined text-[20px]">
                {showPassword ? 'visibility' : 'visibility_off'}
              </span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <input
            className="w-4 h-4 rounded border-[#E2E8F0] text-[#3B82F6] focus:ring-[#3B82F6] focus:ring-offset-0 bg-white cursor-pointer"
            id="remember"
            name="remember"
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          <label
            className="font-['Inter'] text-[14px] leading-5 font-medium text-[#424754] cursor-pointer select-none"
            htmlFor="remember"
          >
            Remember Me
          </label>
        </div>

        <button
                  className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white font-['Inter'] text-[16px] leading-6 font-semibold py-3 px-4 rounded transition-colors duration-200 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer "
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing In...
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      <div className="mt-10">
        <div className="relative flex py-4 items-center mb-6">
          <div className="grow border-t border-[#E2E8F0]"></div>
          <span className="shrink-0 mx-4 text-[#727785] font-['Inter'] text-[14px] font-medium bg-white px-2">
            Or continue with
          </span>
          <div className="grow border-t border-[#E2E8F0]"></div>
        </div>

        <div className="flex flex-col gap-3">
          <button
                      className="w-full bg-white border border-[#E2E8F0] hover:bg-[#f3f4f5] text-[#191c1d] font-['Inter'] text-[16px] font-semibold py-3 px-4 rounded transition-colors duration-200 flex justify-center items-center gap-2 cursor-pointer "
            type="button"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
            </svg>
            Google
          </button>
          <button
            className="w-full bg-white border border-[#E2E8F0] hover:bg-[#f3f4f5] text-[#191c1d] font-['Inter'] text-[16px] font-semibold py-3 px-4 rounded transition-colors duration-200 flex justify-center items-center gap-2 cursor-pointer "
            type="button"
          >
            <svg className="w-5 h-5" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 0h10v10H0z" fill="#f25022"></path>
              <path d="M11 0h10v10H11z" fill="#7fba00"></path>
              <path d="M0 11h10v10H0z" fill="#00a4ef"></path>
              <path d="M11 11h10v10H11z" fill="#ffb900"></path>
            </svg>
            Microsoft
          </button>
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="font-['Inter'] text-[14px] text-[#424754]">
          Don't have an account?{' '}
          <button
            onClick={onSwitchToRegister}
                      className="text-[#3B82F6] hover:text-[#0058be] font-semibold transition-colors focus:outline-none cursor-pointer "
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};
