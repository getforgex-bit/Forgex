import React, { useId } from 'react';

interface ForgeXLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
}

export const ForgeXLogo: React.FC<ForgeXLogoProps> = ({
  className = '',
  size = 'md',
  showWordmark = true,
}) => {
  const gradientId = `forgex-isotype-grad-${useId()}`;

  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-sm tracking-[0.2em]',
    md: 'text-base tracking-[0.24em]',
    lg: 'text-xl tracking-[0.28em]',
  };

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Jeweler Gradient Isotype. viewBox recortado y centrado sobre el arte real
          (antes 0 0 1000 1000 dejaba el trazo ~14% desplazado hacia arriba del centro). */}
      <svg
        aria-hidden="true"
        className={`${iconSizes[size]} shrink-0`}
        viewBox="225 80 550 550"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={gradientId} gradientUnits="userSpaceOnUse" x1="500" y1="205" x2="500" y2="505">
            <stop offset="0" stopColor="#F6EFE4" />
            <stop offset="0.20" stopColor="#D6C6B0" />
            <stop offset="0.46" stopColor="#9B8770" />
            <stop offset="0.56" stopColor="#C4B29A" />
            <stop offset="0.78" stopColor="#F1E8DA" />
            <stop offset="1" stopColor="#BFAC93" />
          </linearGradient>
        </defs>
        <g fill={`url(#${gradientId})`} transform="translate(282.5 205) scale(0.75)">
          <g transform="translate(0 0) scale(1 1)">
            <path d="M0 0H275V121Q275 161 213 181Q109 87.5 0 0Z" />
          </g>
          <g transform="translate(580 0) scale(-1 1)">
            <path d="M0 0H275V121Q275 161 213 181Q109 87.5 0 0Z" />
          </g>
          <g transform="translate(0 400) scale(1 -1)">
            <path d="M0 0H275V121Q275 161 213 181Q109 87.5 0 0Z" />
          </g>
          <g transform="translate(580 400) scale(-1 -1)">
            <path d="M0 0H275V121Q275 161 213 181Q109 87.5 0 0Z" />
          </g>
          <path d="M290 160Q302 188 330 200Q302 212 290 240Q278 212 250 200Q278 188 290 160Z" />
        </g>
      </svg>

      {showWordmark && (
        <div className="flex flex-col">
          <span className={`font-wordmark font-bold text-ink leading-none ${textSizes[size]}`}>
            FORGEX
          </span>
        </div>
      )}
    </div>
  );
};
