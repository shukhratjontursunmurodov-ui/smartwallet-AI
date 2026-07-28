'use client';

import React from 'react';
import { useWallet } from '@/context/WalletContext';
import { useLanguage } from '@/context/LanguageContext';
import { BarChart3 } from 'lucide-react';

export const SparklineChart: React.FC = () => {
  const { expenses, activeCycle } = useWallet();
  const { t, convertAndFormat } = useLanguage();

  const entryCurrency = activeCycle?.currency || 'KRW';

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const today = new Date();
  
  const last7DaysData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - (6 - i));
    const dayName = days[(d.getDay() + 6) % 7];
    const dateStr = d.toISOString().split('T')[0];

    const total = expenses
      .filter((e) => e.created_at.startsWith(dateStr))
      .reduce((sum, e) => sum + e.amount, 0);

    return { dayName, total, dateStr };
  });

  const maxSpend = Math.max(...last7DaysData.map((d) => d.total), 1);

  return (
    <div className="bg-white rounded-[20px] p-5 shadow-sm border border-emerald-950/10 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-[#EAF3DE] text-[#173404]">
            <BarChart3 className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold text-[#173404]">
            {t('analytics.spendingByDay')}
          </h4>
        </div>
        <span className="text-[11px] text-gray-500 font-medium">Last 7 days</span>
      </div>

      <div className="flex items-end justify-between space-x-2 pt-4 pb-1 h-32 border-b border-gray-100">
        {last7DaysData.map((item, idx) => {
          const heightPercent = Math.max(8, Math.round((item.total / maxSpend) * 100));
          const isToday = idx === 6;
          const formatted = convertAndFormat(item.total, entryCurrency).formattedText;

          return (
            <div key={idx} className="flex-1 flex flex-col items-center group relative">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-[#173404] text-[#EAF3DE] text-[10px] py-0.5 px-1.5 rounded whitespace-nowrap pointer-events-none z-20">
                {formatted}
              </div>

              <div
                style={{ height: `${heightPercent}%` }}
                className={`w-full rounded-t-md transition-all duration-300 ${
                  isToday
                    ? 'bg-[#173404] shadow-xs'
                    : 'bg-[#C0DD97] group-hover:bg-[#90C749]'
                }`}
              />
              <span
                className={`text-[10px] mt-1.5 font-medium ${
                  isToday ? 'text-[#173404] font-bold' : 'text-gray-600'
                }`}
              >
                {item.dayName}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
