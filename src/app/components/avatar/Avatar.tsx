'use client';
import React, { useMemo } from 'react';

interface AvatarProps {
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}

const colorPalettes = [
  'from-blue-500 to-indigo-600',
  'from-violet-500 to-purple-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-600',
  'from-cyan-500 to-blue-600',
  'from-fuchsia-500 to-pink-600',
  'from-teal-500 to-emerald-600',
];

const sizeClasses = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-xs font-medium',
  md: 'w-10 h-10 text-sm font-semibold',
  lg: 'w-14 h-14 text-lg font-bold',
  xl: 'w-20 h-20 text-2xl font-bold',
  '2xl': 'w-28 h-28 text-3xl font-bold',
};

export const getInitials = (name?: string): string => {
  if (!name || !name.trim()) return 'U';
  const cleanName = name.trim();
  const parts = cleanName.split(/[\s._-]+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return cleanName.slice(0, Math.min(2, cleanName.length)).toUpperCase();
};

export const Avatar: React.FC<AvatarProps> = ({
  name = 'User',
  size = 'md',
  className = '',
}) => {
  const initials = useMemo(() => getInitials(name), [name]);

  const gradientClass = useMemo(() => {
    let hash = 0;
    const str = name || 'User';
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colorPalettes.length;
    return colorPalettes[index];
  }, [name]);

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full bg-gradient-to-tr ${gradientClass} text-white shadow-sm ring-2 ring-white/20 select-none ${sizeClasses[size]} ${className}`}
      aria-label={name}
      title={name}
    >
      <span className="leading-none tracking-wider">{initials}</span>
    </div>
  );
};

export default Avatar;
