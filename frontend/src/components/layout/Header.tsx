import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Bell, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Header: React.FC = React.memo(() => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="border-b border-gray-800 bg-[#0F1626] px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-md">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-[#F97316] flex items-center justify-center font-extrabold text-white text-lg tracking-tight shadow-md shadow-blue-500/20">
            A
          </div>
          <span className="font-extrabold text-lg text-white tracking-wider">
            AbuseIPDB{' '}
            <span className="text-xs bg-gray-800 text-gray-300 font-normal px-2 py-0.5 rounded ml-1">
              v2.5
            </span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-1 text-sm font-semibold text-gray-400">
          <div className="px-4 py-2 rounded-lg text-blue-400 bg-blue-500/10 border-b-2 border-blue-500 flex items-center gap-2 select-none">
            <Activity className="w-4 h-4 animate-pulse" /> 실시간 IP 신속 스캔
          </div>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-400 hover:text-white rounded-lg bg-gray-800/40 hover:bg-gray-800 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-gray-900" />
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          title="로그아웃"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">로그아웃</span>
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-gray-800">
          <div className="w-9 h-9 rounded-full bg-blue-600 border border-blue-400/20 flex items-center justify-center font-bold text-sm text-white">
            {user?.userName?.slice(0, 2).toUpperCase() || (
              <User className="w-4 h-4" />
            )}
          </div>
          <div className="hidden sm:block text-left">
            <span className="block text-xs text-gray-400">
              {user?.userName || '사용자'}
            </span>
            <span className="block text-sm font-bold text-gray-200">
              {user?.userId || 'unknown'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
});
