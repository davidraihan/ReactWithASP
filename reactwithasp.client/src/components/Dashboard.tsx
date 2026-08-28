import React from 'react';
interface DashboardProps {
  sessionData: { accessToken: string; accessExpiresAt: string; refreshToken: string };
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ sessionData, onLogout }) => {
  const handleLogoutClick = async () => {
    try {
      if (sessionData.refreshToken) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionData.accessToken}`
          },
          body: JSON.stringify({ refreshToken: sessionData.refreshToken })
        });
      }
    } catch (e) {
      console.error('Logout error', e);
    } finally {
      localStorage.removeItem('refreshToken');
      onLogout();
    }
  };

    return (
    <div className="bg-white w-full max-w-120 rounded-xl ambient-shadow p-6 sm:p-10 text-center">

      <div className="w-16 h-16 bg-[#3B82F6]/10 text-[#3B82F6] rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="material-symbols-outlined text-[32px]">check_circle</span>
      </div>
      <h2 className="font-['Hanken_Grotesk'] text-[28px] font-bold text-[#191c1d] mb-1">
        Authentication Successful
      </h2>
      <p className="font-['Hanken_Grotesk'] text-[15px] text-[#424754] mb-6">
        Welcome to AeroCorp Dashboard
      </p>

      <div className="bg-[#f8f9fa] p-4 rounded-lg text-left text-xs font-mono mb-6 overflow-x-auto border border-[#E2E8F0] space-y-2">
        <div>
          <span className="font-semibold text-gray-500">Access Expires At:</span>
          <p className="text-gray-800 font-bold">{new Date(sessionData.accessExpiresAt).toLocaleString()}</p>
        </div>
        <div>
          <span className="font-semibold text-gray-500">Access Token (preview):</span>
          <p className="text-blue-600 truncate">{sessionData.accessToken}</p>
        </div>
      </div>

      <button
        onClick={handleLogoutClick}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-['Inter'] text-[16px] font-semibold py-3 px-4 rounded transition-colors duration-200"
      >
        Sign Out
      </button>
    </div>
  );
};
