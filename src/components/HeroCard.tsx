'use client';

import React from 'react';
import { useWallet } from '@/context/WalletContext';
import { useLanguage } from '@/context/LanguageContext';
import { Flame, Calendar, Wallet, RefreshCw, RefreshCcw } from 'lucide-react';

export const HeroCard: React.FC = () => {
  const {
    dailySafeLimit,
    balanceRemaining,
    daysRemaining,
    streak,
    activeCycle,
    resetCurrentCycle,
  } = useWallet();
  
  const { t, convertAndFormat, currency } = useLanguage();

  const entryCurrency = activeCycle?.currency || 'KRW';

  // Convert for display only if display currency differs from entry currency
  const dailyLimitDisplay = convertAndFormat(dailySafeLimit, entryCurrency);
  const balanceDisplay = convertAndFormat(balanceRemaining, entryCurrency);

  return (
    <div className="relative overflow-hidden bg-[#173404] text-white rounded-[20px] p-6 shadow-xl border border-[#265307]">
      {/* Background ambient lighting */}
      <div className="absolute -top-12 -right-12 w-44 h-44 bg-[#C0DD97]/15 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-[#90C749]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top row: Header label & Streak Pill Badge */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#90C749] animate-pulse" />
          <span className="text-xs uppercase tracking-wider font-medium text-[#C0DD97]">
            {t('hero.dailySafeSpend')}
          </span>
        </div>

        {/* Streak Pill Badge */}
        <div className="inline-flex items-center space-x-1.5 bg-[#EAF3DE] text-[#173404] px-3 py-1 rounded-full shadow-xs">
          <Flame className="w-4 h-4 text-orange-600 fill-orange-500 animate-bounce" />
          <span className="text-xs font-semibold">
            {t('hero.streakDays', { count: streak.current_streak })}
          </span>
        </div>
      </div>

      {/* HERO NUMBER - Displaying converted or native limit */}
      <div className="mb-4 relative z-10">
        <div className="text-[34px] sm:text-[42px] font-medium leading-none tracking-tight text-white font-display">
          {dailyLimitDisplay.formattedText}
        </div>

        <div className="flex items-center space-x-2 text-xs text-[#C0DD97]/90 mt-1.5 font-normal">
          <span>{t('hero.todayLabel')} &bull; {t('hero.withinBudget')}</span>
        </div>

        {/* Live Exchange Rate Conversion Note when display currency != entry currency */}
        {dailyLimitDisplay.isConverted && (
          <div className="mt-2.5 inline-flex items-center space-x-1.5 bg-[#C0DD97]/20 text-[#C0DD97] text-[11px] px-2.5 py-1 rounded-lg border border-[#C0DD97]/30">
            <RefreshCcw className="w-3 h-3 text-[#90C749] shrink-0" />
            <span>Converted ({dailyLimitDisplay.rateNote})</span>
          </div>
        )}
      </div>

      {/* Secondary Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#2a5509] relative z-10">
        {/* Days Remaining */}
        <div className="flex items-center space-x-3 bg-white/5 rounded-xl p-2.5 backdrop-blur-xs">
          <div className="p-2 rounded-lg bg-[#C0DD97]/20 text-[#C0DD97]">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-[#C0DD97]/80">
              {daysRemaining === 1 ? t('hero.dayLeft') : t('hero.daysLeft')}
            </div>
            <div className="text-base font-semibold text-white">
              {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'}
            </div>
          </div>
        </div>

        {/* Balance Remaining */}
        <div className="flex items-center space-x-3 bg-white/5 rounded-xl p-2.5 backdrop-blur-xs">
          <div className="p-2 rounded-lg bg-[#C0DD97]/20 text-[#C0DD97]">
            <Wallet className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-[#C0DD97]/80">
              {t('hero.totalBalance')}
            </div>
            <div className="text-base font-semibold text-white">
              {balanceDisplay.formattedText}
            </div>
          </div>
        </div>
      </div>

      {/* Reset Cycle quick trigger */}
      {activeCycle && (
        <button
          onClick={resetCurrentCycle}
          className="mt-4 w-full flex items-center justify-center space-x-1.5 text-xs text-[#C0DD97]/70 hover:text-[#C0DD97] transition-colors py-1"
        >
          <RefreshCw className="w-3 h-3" />
          <span>{t('settings.resetCycle')}</span>
        </button>
      )}
    </div>
  );
};
