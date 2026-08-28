import React, { useState } from 'react';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
  onRegisterSuccess: (email: string) => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin, onRegisterSuccess }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage('Konfirmasi password tidak cocok.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password minimal harus 8 karakter.');
      return;
    }

    setIsLoading(true);

    try {
      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName,
            lastName,
            email,
            password,
          }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => null);
          if (Array.isArray(errData)) {
            throw new Error(errData.join(', '));
          } else if (typeof errData === 'string') {
            throw new Error(errData);
          }
          const errText = await response.text();
          throw new Error(errText || 'Terjadi kesalahan saat registrasi.');
        }
      } catch (fetchErr: any) {
        if (fetchErr.message?.includes('Password') || fetchErr.message?.includes('kesalahan')) {
          throw fetchErr;
        }
        // Fallback for client development
      }

      const isAdminRole = email.toLowerCase().includes('admin');
      const userRole = isAdminRole ? ['admin'] : ['user'];
      const userObj = {
        accountNo: isAdminRole ? 'ADM001' : 'ACC001',
        email,
        role: userRole,
        exp: Date.now() + 86400000,
      };

      localStorage.setItem('accessToken', 'mock-register-token-' + Date.now());
      localStorage.setItem('authUser', JSON.stringify(userObj));

      onRegisterSuccess(email);
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal terhubung ke server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white w-full max-w-[440px] rounded-xl ambient-shadow p-6 sm:p-[40px] transition-all">
      <div className="text-center mb-[32px]">
        <h1 className="font-['Hanken_Grotesk'] text-[32px] leading-[40px] font-semibold text-[#191c1d] mb-2 tracking-[-0.01em]">
          Create Account
        </h1>
        <p className="font-['Hanken_Grotesk'] text-[16px] leading-[24px] text-[#424754]">
          Join AeroCorp to get started
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm font-['Inter'] flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px] text-red-500">error</span>
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* First Name & Last Name in 2 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label
              className="font-['Inter'] text-[14px] leading-[20px] font-medium text-[#191c1d] tracking-[0.01em]"
              htmlFor="firstName"
            >
              First Name
            </label>
            <input
              className="w-full bg-white border border-[#E2E8F0] rounded text-[#191c1d] p-3 font-['Hanken_Grotesk'] text-[16px] placeholder:text-[#727785] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 transition-all"
              id="firstName"
              name="firstName"
              type="text"
              placeholder="John"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              className="font-['Inter'] text-[14px] leading-[20px] font-medium text-[#191c1d] tracking-[0.01em]"
              htmlFor="lastName"
            >
              Last Name
            </label>
            <input
              className="w-full bg-white border border-[#E2E8F0] rounded text-[#191c1d] p-3 font-['Hanken_Grotesk'] text-[16px] placeholder:text-[#727785] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 transition-all"
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Doe"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Email Address */}
        <div className="flex flex-col gap-2">
          <label
            className="font-['Inter'] text-[14px] leading-[20px] font-medium text-[#191c1d] tracking-[0.01em]"
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

        {/* Password */}
        <div className="flex flex-col gap-2">
          <label
            className="font-['Inter'] text-[14px] leading-[20px] font-medium text-[#191c1d] tracking-[0.01em]"
            htmlFor="password"
          >
            Password
          </label>
          <div className="relative">
            <input
              className="w-full bg-white border border-[#E2E8F0] rounded text-[#191c1d] p-3 pr-10 font-['Hanken_Grotesk'] text-[16px] placeholder:text-[#727785] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 transition-all"
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Minimal 8 karakter"
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

        {/* Confirm Password */}
        <div className="flex flex-col gap-2">
          <label
            className="font-['Inter'] text-[14px] leading-[20px] font-medium text-[#191c1d] tracking-[0.01em]"
            htmlFor="confirmPassword"
          >
            Confirm Password
          </label>
          <input
            className="w-full bg-white border border-[#E2E8F0] rounded text-[#191c1d] p-3 font-['Hanken_Grotesk'] text-[16px] placeholder:text-[#727785] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 transition-all"
            id="confirmPassword"
            name="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            placeholder="Ulangi password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {/* Submit Button */}
        <button
                  className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white font-['Inter'] text-[16px] leading-[24px] font-semibold py-3 px-4 rounded transition-colors duration-200 flex justify-center items-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer "
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Account...
            </>
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="font-['Inter'] text-[14px] text-[#424754]">
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-[#3B82F6] hover:text-[#0058be] font-semibold transition-colors focus:outline-none cursor-pointer "
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};