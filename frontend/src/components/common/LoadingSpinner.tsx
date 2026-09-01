import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white' | 'slate';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', color = 'primary' }) => {
  // Enforce absolute sizes in pixels using inline styles to override any browser flex stretch glitches
  const sizeMap = {
    sm: { width: '20px', height: '20px', borderWidth: '2px' },
    md: { width: '32px', height: '32px', borderWidth: '3px' },
    lg: { width: '48px', height: '48px', borderWidth: '4px' },
  };

  const colorClasses = {
    primary: 'border-primary-600 border-t-transparent',
    white: 'border-white border-t-transparent',
    slate: 'border-slate-300 border-t-transparent',
  };

  return (
    <div className="flex justify-center items-center py-4 w-full">
      <div
        className={`animate-spin rounded-full ${colorClasses[color]}`}
        style={sizeMap[size]}
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
