'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Avatar from './avatar/Avatar';
import { FiHome, FiPieChart, FiRepeat, FiUser } from 'react-icons/fi';
import { useUserStore } from '@/store';

const Navbar = () => {
  const pathname = usePathname();
  const user = useUserStore((state) => state.user);
  const fetchUser = useUserStore((state) => state.fetchUser);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const username = user?.username || '';

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: FiHome },
    { name: 'Recurring', href: '/recurring', icon: FiRepeat },
    { name: 'Analysis', href: '/analysis', icon: FiPieChart },
    { name: 'Profile', href: '/profile', icon: FiUser },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 shadow-lg transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="relative overflow-hidden rounded-xl ring-1 ring-white/10 shadow-sm group-hover:ring-indigo-500/50 transition-all duration-300">
              <Image
                src="/logo.jpeg"
                width={120}
                height={38}
                alt="Spendlizer Logo"
                className="object-contain h-9 w-auto"
                priority
              />
            </div>
            <span className="hidden sm:inline-block text-xs uppercase tracking-widest font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              PRO
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 ring-1 ring-indigo-400/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <Icon
                    className={`text-base transition-transform duration-200 ${
                      isActive ? 'scale-110 text-white' : 'text-slate-400 group-hover:text-white'
                    }`}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            {/* Profile Avatar Pill */}
            <Link
              href="/profile"
              className="ml-2 pl-2 border-l border-slate-700/60 flex items-center hover:opacity-90 transition-opacity"
              title={username || 'Profile'}
            >
              <Avatar name={username || 'User'} size="sm" />
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
