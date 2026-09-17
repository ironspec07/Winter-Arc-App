import React from 'react';

interface HabitatLogoProps {
  className?: string;
  size?: number;
}

export const HabitatLogo: React.FC<HabitatLogoProps> = ({ className = 'w-7 h-7', size = 28 }) => {
  return (
    <div className={`relative flex items-center justify-center shrink-0 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 p-1.5 shadow-xs transition-colors ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Architectural Habitat geometric dome + mountain peak */}
        <path
          d="M3 20L12 4L21 20H3Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Inner geometric habitat structural rafters */}
        <path
          d="M12 4V20"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
        <path
          d="M7.5 12H16.5"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
        <path
          d="M5.5 16H18.5"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
        {/* Core focus beacon (emerald accent) */}
        <circle
          cx="12"
          cy="12"
          r="1.8"
          fill="#10b981"
        />
      </svg>
    </div>
  );
};
