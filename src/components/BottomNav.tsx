'use client';

import React from 'react';
import { useWallet } from '@/context/WalletContext';
import { useLanguage } from '@/context/LanguageContext';
import { Home, BarChart2, Plus, Grid, User } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const { setIsExpenseModalOpen } = useWallet();
  const { t } = useLanguage();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto px-4 pb-4 pt-1 pointer-events-none">
      <div className="bg-[#173404] text-white rounded-full shadow-2xl p-2 flex items-center justify-around border border-[#295609] pointer-events-auto backdrop-blur-md">
        {/* Home */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center py-1 px-3 rounded-full transition-colors ${
            activeTab === 'home'
              ? 'text-[#C0DD97] font-semibold'
              : 'text-white/70 hover:text-white'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">{t('nav.home')}</span>
        </button>

        {/* Analytics */}
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex flex-col items-center py-1 px-3 rounded-full transition-colors ${
            activeTab === 'analytics'
              ? 'text-[#C0DD97] font-semibold'
              : 'text-white/70 hover:text-white'
          }`}
        >
          <BarChart2 className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">{t('nav.analytics')}</span>
        </button>

        {/* CENTERED RAISED "+" ADD EXPENSE BUTTON */}
        <div className="relative -top-5">
          <button
            onClick={() => setIsExpenseModalOpen(true)}
            className="w-14 h-14 bg-[#90C749] hover:bg-[#A9D178] text-[#173404] rounded-full shadow-xl flex items-center justify-center border-4 border-[#F7F9F4] active:scale-95 transition-transform"
            aria-label={t('nav.addExpense')}
          >
            <Plus className="w-7 h-7 stroke-[2.5]" />
          </button>
        </div>

        {/* Categories */}
        <button
          onClick={() => setActiveTab('categories')}
          className={`flex flex-col items-center py-1 px-3 rounded-full transition-colors ${
            activeTab === 'categories'
              ? 'text-[#C0DD97] font-semibold'
              : 'text-white/70 hover:text-white'
          }`}
        >
          <Grid className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">{t('nav.categories')}</span>
        </button>

        {/* Profile / Settings */}
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center py-1 px-3 rounded-full transition-colors ${
            activeTab === 'profile'
              ? 'text-[#C0DD97] font-semibold'
              : 'text-white/70 hover:text-white'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">{t('nav.profile')}</span>
        </button>
      </div>
    </div>
  );
};
