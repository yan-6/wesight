import React from 'react';

const OpenLuxIcon: React.FC<{ className?: string }> = ({ className = 'h-6 w-6' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M5 3h5v10a3 3 0 0 0 3 3h6v5H8a3 3 0 0 1-3-3V3Z" fill="currentColor" />
    <path d="m18 3 1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3Z" fill="currentColor" opacity=".65" />
  </svg>
);

export default OpenLuxIcon;
