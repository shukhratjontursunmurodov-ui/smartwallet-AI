'use client';

import React from 'react';
import { useWallet } from '@/context/WalletContext';
import { useLanguage } from '@/context/LanguageContext';
import { Home, BarChart2, Plus, Grid, User, Shield } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { setIsExpenseModalOpen } = useWallet();
  const { t } = useLanguage();

  const navItems = [
    { id: 'home', label: t('nav.home'), icon: <Home className="w-5 h-5" /> },
    { id: 'analytics', label: t('nav.analytics'), icon: <BarChart2 className="w-5 h-5" /> },
    { id: 'categories', label: t('nav.categories'), icon: <Grid className="w-5 h-5" /> },
    { id: 'profile', label: t('nav.profile'), icon: <User className="w-5 h-5" /> },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-[#173404] text-white p-6 justify-between min-h-screen sticky top-0 border-r border-[#265307] shadow-xl shrink-0">
      {/* Brand Header */}
      <div className="space-y-8">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-[#90C749] text-[#173404] flex items-center justify-center font-bold font-display text-lg">
              S
            </div>
            <h1 className="text-xl font-bold tracking-tight font-display text-white">
              SmartWallet <span className="text-xs px-1.5 py-0.5 rounded bg-[#C0DD97] text-[#173404] font-semibold">AI</span>
            </h1>
          </div>
          <p className="text-xs text-[#C0DD97]/80 mt-1 font-normal">
            {t('tagline')}
          </p>
        </div>

        {/* Primary Navigation Links */}
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-[#90C749] text-[#173404] shadow-md font-bold'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Log Expense CTA Button */}
        <button
          onClick={() => setIsExpenseModalOpen(true)}
          className="w-full py-3.5 px-4 bg-[#C0DD97] hover:bg-[#90C749] text-[#173404] font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center space-x-2 text-sm"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>{t('expense.quickAddHeader')}</span>
        </button>
      </div>

      {/* Footer Info / Student Demo Badge */}
      <div className="pt-4 border-t border-[#265307] text-xs text-[#C0DD97]/70 space-y-1">
        <div className="flex items-center space-x-2 text-white font-medium">
          <Shield className="w-4 h-4 text-[#90C749]" />
          <span>Student Demo Active</span>
        </div>
        <p className="text-[11px] text-[#C0DD97]/60">Daily Safe-Spend Limit PWA</p>
      </div>
    </aside>
  );
};
