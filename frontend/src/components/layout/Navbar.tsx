import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, Menu, User, Calendar as CalendarIcon } from 'lucide-react';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { user } = useAuth();
  
  const getTodayDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10">
      {/* Left section: toggler & date */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 md:hidden transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center text-slate-500 text-xs font-semibold space-x-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
          <CalendarIcon className="w-3.5 h-3.5 text-primary-600" />
          <span>{getTodayDate()}</span>
        </div>
      </div>

      {/* Right section: Profile & Notification */}
      <div className="flex items-center space-x-4">
        {/* Notification Bell */}
        <button className="p-2 hover:bg-slate-100 rounded-full text-slate-500 relative transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-600 rounded-full border-2 border-white animate-pulse" />
        </button>

        {/* Vertical divider */}
        <div className="h-6 w-px bg-slate-200" />

        {/* User Card */}
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-full bg-primary-50 text-primary-700 flex items-center justify-center font-bold text-xs border border-primary-200">
            {user?.firstName.charAt(0)}{user?.lastName.charAt(0)}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-slate-800 leading-tight">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-[10px] font-semibold text-slate-500 tracking-wide capitalize">
              {user?.role.toLowerCase()}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
