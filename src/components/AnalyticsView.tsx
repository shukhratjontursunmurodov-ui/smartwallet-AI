'use client';

import React, { useState } from 'react';
import { useWallet } from '@/context/WalletContext';
import { useLanguage } from '@/context/LanguageContext';
import { SparklineChart } from '@/components/SparklineChart';
import { CategoryBreakdown } from '@/components/CategoryBreakdown';

import {
  BarChart3,
  Calendar,
  Wallet,
  TrendingUp,
  Lightbulb,
  Clock,
  PieChart,
  Flame,
  ChevronDown,
  Info,
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { activeCycle, cycleHistory, expenses, categories, streak } = useWallet();
  const { t, convertAndFormat } = useLanguage();

  const [selectedCycleId, setSelectedCycleId] = useState<string>('current');

  const selectedCycle =
    selectedCycleId === 'current'
      ? activeCycle
      : cycleHistory.find((c) => c.id === selectedCycleId) || activeCycle;

  const entryCurrency = selectedCycle?.currency || 'KRW';

  // Filter expenses for selected cycle
  const cycleExpenses = expenses.filter(
    (e) => e.cycle_id === selectedCycle?.id || selectedCycle?.id === 'demo-cycle'
  );

  const totalSpent = cycleExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Calculate elapsed days for average daily spend
  const startDate = selectedCycle ? new Date(selectedCycle.start_date) : new Date();
  const today = new Date();
  const startMid = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const todayMid = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const elapsedDays = Math.max(
    1,
    Math.floor((todayMid.getTime() - startMid.getTime()) / (1000 * 60 * 60 * 24)) + 1
  );

  const avgDailySpend = Math.round(totalSpent / elapsedDays);
  const daysRemaining = selectedCycle
    ? Math.max(1, selectedCycle.cycle_length_days - elapsedDays + 1)
    : 30;

  // Generate Rule-based Smart Insights (Phase 2)
  const getRuleBasedInsights = () => {
    const insights: string[] = [];

    // Category percentage insights
    const foodCat = categories.find((c) => c.icon === 'utensils');
    if (foodCat && totalSpent > 0) {
      const foodSpent = cycleExpenses
        .filter((e) => e.category_id === foodCat.id)
        .reduce((sum, e) => sum + e.amount, 0);
      const foodPct = Math.round((foodSpent / totalSpent) * 100);

      if (foodPct >= 35) {
        insights.push(
          `Food & Dining accounts for ${foodPct}% of your spend this cycle. Preparing meals at home could extend your budget by several days!`
        );
      }
    }

    // Streak insight
    if (streak.current_streak > 0) {
      insights.push(
        `Great job! You are on a ${streak.current_streak}-day limit streak 🔥. Staying within your daily safe limit keeps you stress-free.`
      );
    } else {
      insights.push(
        `Focus on staying under your daily safe-spend limit today to rebuild your streak!`
      );
    }

    return insights;
  };

  const insights = getRuleBasedInsights();

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* TOP HEADER & CYCLE SELECTOR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-[#173404]">
            {t('analytics.title')}
          </h2>
          <p className="text-xs text-gray-500 font-medium">
            Analyze spending patterns and safe-spend performance
          </p>
        </div>

        {/* Cycle Selector Dropdown */}
        <div className="relative">
          <select
            value={selectedCycleId}
            onChange={(e) => setSelectedCycleId(e.target.value)}
            className="w-full sm:w-auto appearance-none bg-white border border-gray-200 shadow-xs px-4 py-2 pr-8 rounded-xl text-xs font-semibold text-[#173404] focus:outline-none focus:ring-2 focus:ring-[#173404]"
          >
            <option value="current">Current Active Cycle</option>
            {cycleHistory.map((c, idx) => (
              <option key={c.id} value={c.id}>
                Cycle #{cycleHistory.length - idx} ({c.start_date})
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-[#173404] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* SUMMARY STATS ROW (3 Metric Cards matching dashboard design) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Spent */}
        <div className="bg-white rounded-[20px] p-4 shadow-sm border border-emerald-950/10 flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-[#EAF3DE] text-[#173404] shrink-0">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold">
              Total Spent
            </div>
            <div className="text-base font-bold text-[#173404]">
              {convertAndFormat(totalSpent, entryCurrency).formattedText}
            </div>
          </div>
        </div>

        {/* Average Daily Spend */}
        <div className="bg-white rounded-[20px] p-4 shadow-sm border border-emerald-950/10 flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-[#EAF3DE] text-[#173404] shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold">
              Avg. Daily Spend
            </div>
            <div className="text-base font-bold text-[#173404]">
              {convertAndFormat(avgDailySpend, entryCurrency).formattedText} / day
            </div>
          </div>
        </div>

        {/* Days Remaining */}
        <div className="bg-white rounded-[20px] p-4 shadow-sm border border-emerald-950/10 flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-[#EAF3DE] text-[#173404] shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold">
              Days Remaining
            </div>
            <div className="text-base font-bold text-[#173404]">
              {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'}
            </div>
          </div>
        </div>
      </div>

      {/* RULE-BASED SMART INSIGHTS CALLOUT CARDS (Phase 2) */}
      {insights.length > 0 && (
        <div className="space-y-2.5">
          {insights.map((insight, idx) => (
            <div
              key={idx}
              className="bg-[#EAF3DE] border border-[#C0DD97] rounded-[18px] p-3.5 flex items-start space-x-3 text-xs text-[#173404] shadow-xs"
            >
              <Lightbulb className="w-4 h-4 text-[#173404] shrink-0 mt-0.5" />
              <div className="font-medium leading-relaxed">{insight}</div>
            </div>
          ))}
        </div>
      )}

      {/* EMPTY STATE OR FULL ANALYTICS CONTENT */}
      {cycleExpenses.length === 0 ? (
        <div className="bg-white rounded-[20px] p-8 shadow-sm border border-emerald-950/10 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#EAF3DE] text-[#173404] inline-flex items-center justify-center">
            <Info className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-[#173404]">No Spending Data Yet</h4>
          <p className="text-xs text-gray-500 font-medium max-w-sm mx-auto">
            Log a few expenses to see your spending patterns, daily sparklines, and category breakdowns here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Full-width Weekly Sparkline Chart */}
          <SparklineChart />

          {/* Sorted Category Breakdown */}
          <CategoryBreakdown />
        </div>
      )}
    </div>
  );
};
