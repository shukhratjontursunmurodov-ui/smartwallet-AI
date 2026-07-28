'use client';

import React, { useState, useEffect } from 'react';
import { useWallet } from '@/context/WalletContext';
import { useLanguage } from '@/context/LanguageContext';
import { Wallet, Calendar, CheckCircle2, AlertCircle, Clock, ArrowRight } from 'lucide-react';

export const CycleSetupModal: React.FC = () => {
  const { isCycleModalOpen, startNewCycle, activeCycle } = useWallet();
  const { t, currency } = useLanguage();

  const [amount, setAmount] = useState<string>('');
  const [startDate, setStartDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  
  // Custom cycle mode: 'endDate' (pick next income date) or 'customDays' (type exact day count)
  const [mode, setMode] = useState<'endDate' | 'customDays'>('endDate');
  
  // Default next income date to +14 days from today for convenient default selection
  const defaultNextIncome = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];
  
  const [nextIncomeDate, setNextIncomeDate] = useState<string>(defaultNextIncome);
  const [customDays, setCustomDays] = useState<string>('12');

  // Compute calculated days based on active mode
  const getCalculatedDays = (): number => {
    if (mode === 'customDays') {
      const parsed = parseInt(customDays, 10);
      return isNaN(parsed) || parsed < 1 ? 1 : parsed;
    } else {
      const start = new Date(startDate);
      const end = new Date(nextIncomeDate);
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return Math.max(1, diffDays);
    }
  };

  const calculatedDays = getCalculatedDays();

  if (!isCycleModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount.replace(/,/g, ''));
    if (!numAmount || numAmount <= 0) return;
    
    startNewCycle(numAmount, calculatedDays, startDate);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-[24px] p-6 shadow-2xl border border-emerald-950/10 space-y-5 animate-slideUp">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#EAF3DE] text-[#173404] mb-1">
            <Wallet className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-[#173404]">
            {t('cycleSetup.title')}
          </h2>
          <p className="text-xs text-gray-600 px-2 leading-relaxed">
            {t('cycleSetup.blockingPrompt')}
          </p>
        </div>

        {activeCycle && (
          <div className="flex items-center space-x-2 bg-amber-50 border border-amber-200 text-amber-800 text-xs p-3 rounded-xl">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
            <span>{t('cycleSetup.activeCycleWarning')}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount Input - Manual entry required every cycle (never auto-filled) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 block">
              {t('cycleSetup.amountLabel')}
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-base">
                {currency === 'KRW' ? '₩' : '$'}
              </span>
              <input
                type="number"
                required
                min="1"
                placeholder={currency === 'KRW' ? 'e.g. 450.000' : 'e.g. 350'}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                autoFocus
                className="w-full pl-9 pr-4 py-3 bg-[#F7F9F4] border border-gray-200 rounded-xl font-semibold text-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#173404]"
              />
            </div>
          </div>

          {/* Flexible Start Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 block">
              {t('cycleSetup.startDateLabel')}
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#F7F9F4] border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#173404]"
              />
            </div>
          </div>

          {/* Fully Custom Cycle Length Setup */}
          <div className="space-y-2 pt-1 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-800">
                Custom Cycle Duration
              </label>
              {/* Mode Switcher Pills */}
              <div className="flex bg-[#F7F9F4] p-1 rounded-xl border border-gray-200 text-[11px]">
                <button
                  type="button"
                  onClick={() => setMode('endDate')}
                  className={`px-2.5 py-1 font-semibold rounded-lg transition-all ${
                    mode === 'endDate'
                      ? 'bg-[#173404] text-white shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Next Income Date
                </button>
                <button
                  type="button"
                  onClick={() => setMode('customDays')}
                  className={`px-2.5 py-1 font-semibold rounded-lg transition-all ${
                    mode === 'customDays'
                      ? 'bg-[#173404] text-white shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Custom Days Count
                </button>
              </div>
            </div>

            {/* MODE A: Pick Next Income Arrival Date */}
            {mode === 'endDate' && (
              <div className="space-y-1.5 bg-[#EAF3DE]/40 p-3 rounded-xl border border-[#C0DD97]">
                <label className="text-[11px] font-semibold text-[#173404] block flex items-center justify-between">
                  <span>When does your next income / allowance arrive?</span>
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-[#173404] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    required
                    min={startDate}
                    value={nextIncomeDate}
                    onChange={(e) => setNextIncomeDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#C0DD97] rounded-lg text-xs font-bold text-[#173404] focus:outline-none focus:ring-2 focus:ring-[#173404]"
                  />
                </div>
              </div>
            )}

            {/* MODE B: Type Exact Custom Number of Days */}
            {mode === 'customDays' && (
              <div className="space-y-1.5 bg-[#EAF3DE]/40 p-3 rounded-xl border border-[#C0DD97]">
                <label className="text-[11px] font-semibold text-[#173404] block">
                  Type exact number of days (e.g. 8, 12, 23):
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-[#173404] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    required
                    min="1"
                    max="365"
                    placeholder="e.g. 9 or 12"
                    value={customDays}
                    onChange={(e) => setCustomDays(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#C0DD97] rounded-lg text-xs font-bold text-[#173404] focus:outline-none focus:ring-2 focus:ring-[#173404]"
                  />
                </div>
              </div>
            )}

            {/* Dynamic Day Count Result Summary */}
            <div className="flex items-center justify-between text-xs px-3 py-2 bg-[#173404] text-[#EAF3DE] rounded-xl font-medium">
              <span className="flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-[#90C749]" />
                <span>Calculated Cycle Length:</span>
              </span>
              <span className="font-bold text-sm text-[#90C749]">
                {calculatedDays} {calculatedDays === 1 ? 'day' : 'days'}
              </span>
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            className="w-full py-3.5 bg-[#173404] hover:bg-[#234a08] text-[#EAF3DE] font-semibold rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 text-sm mt-3"
          >
            <CheckCircle2 className="w-5 h-5 text-[#90C749]" />
            <span>{t('cycleSetup.confirmButton')}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
