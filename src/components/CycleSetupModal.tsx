'use client';

import React, { useState } from 'react';
import { useWallet } from '@/context/WalletContext';
import { useLanguage } from '@/context/LanguageContext';
import { Wallet, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';

export const CycleSetupModal: React.FC = () => {
  const { isCycleModalOpen, startNewCycle, activeCycle } = useWallet();
  const { t, currency } = useLanguage();

  const [amount, setAmount] = useState<string>('');
  const [duration, setDuration] = useState<number>(30);
  const [startDate, setStartDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  if (!isCycleModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount.replace(/,/g, ''));
    if (!numAmount || numAmount <= 0) return;
    startNewCycle(numAmount, duration, startDate);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-[24px] p-6 shadow-2xl border border-emerald-950/10 space-y-5">
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
          {/* Amount Input */}
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
                placeholder={currency === 'KRW' ? '600000' : '500'}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-9 pr-4 py-3 bg-[#F7F9F4] border border-gray-200 rounded-xl font-medium text-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#173404]"
              />
            </div>
          </div>

          {/* Quick preset buttons */}
          <div className="flex space-x-2">
            {[
              { label: currency === 'KRW' ? '₩300k' : '$250', val: currency === 'KRW' ? '300000' : '250' },
              { label: currency === 'KRW' ? '₩500k' : '$500', val: currency === 'KRW' ? '500000' : '500' },
              { label: currency === 'KRW' ? '₩1M' : '$1,000', val: currency === 'KRW' ? '1000000' : '1000' },
            ].map((p, idx) => (
              <button
                type="button"
                key={idx}
                onClick={() => setAmount(p.val)}
                className="flex-1 py-1.5 text-xs font-medium bg-[#EAF3DE] text-[#173404] rounded-lg hover:bg-[#C0DD97] transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Duration Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 block">
              {t('cycleSetup.durationLabel')}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { days: 7, label: '1 Week (7d)' },
                { days: 14, label: '2 Weeks (14d)' },
                { days: 30, label: '1 Month (30d)' },
              ].map((d) => (
                <button
                  type="button"
                  key={d.days}
                  onClick={() => setDuration(d.days)}
                  className={`py-2.5 px-2 text-xs font-semibold rounded-xl border transition-all ${
                    duration === d.days
                      ? 'bg-[#173404] text-white border-[#173404] shadow-xs'
                      : 'bg-[#F7F9F4] text-gray-700 border-gray-200 hover:border-[#173404]'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Start Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 block flex items-center justify-between">
              <span>{t('cycleSetup.startDateLabel')}</span>
              <span className="text-[10px] text-gray-500 font-normal">
                {t('cycleSetup.startDateDesc')}
              </span>
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#F7F9F4] border border-gray-200 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#173404]"
              />
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            className="w-full py-3.5 bg-[#173404] hover:bg-[#234a08] text-[#EAF3DE] font-semibold rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 text-sm"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>{t('cycleSetup.confirmButton')}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
