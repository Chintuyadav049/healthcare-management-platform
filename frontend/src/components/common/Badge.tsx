import React from 'react';

interface BadgeProps {
  status: string;
}

const Badge: React.FC<BadgeProps> = ({ status }) => {
  const getColors = (s: string) => {
    switch (s.toUpperCase()) {
      // Appointment statuses
      case 'BOOKED':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'CONFIRMED':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'COMPLETED':
      case 'DISCHARGED':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'CANCELLED':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'RESCHEDULED':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'NO_SHOW':
        return 'bg-slate-100 text-slate-700 border-slate-300';
      
      // Clinical Operations Queue statuses
      case 'WAITING':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'CHECKED_IN':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      case 'WITH_DOCTOR':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'UNDER_TREATMENT':
        return 'bg-orange-50 text-orange-700 border-orange-200';

      // General Statuses
      case 'ACTIVE':
      case 'AVAILABLE':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'INACTIVE':
      case 'UNAVAILABLE':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'ON_LEAVE':
        return 'bg-slate-100 text-slate-600 border-slate-200';
        
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getColors(status)}`}>
      {status.replace('_', ' ')}
    </span>
  );
};

export default Badge;
