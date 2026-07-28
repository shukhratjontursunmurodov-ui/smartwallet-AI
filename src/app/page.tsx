'use client';

import React, { useState } from 'react';
import { useWallet } from '@/context/WalletContext';
import { useLanguage } from '@/context/LanguageContext';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { HeroCard } from '@/components/HeroCard';
import { CycleSetupModal } from '@/components/CycleSetupModal';
import { QuickAddExpenseModal } from '@/components/QuickAddExpenseModal';
import { SparklineChart } from '@/components/SparklineChart';
import { CategoryBreakdown } from '@/components/CategoryBreakdown';
import { BottomNav } from '@/components/BottomNav';
import { AuthModal } from '@/components/AuthModal';

import {
  Utensils,
  Bus,
  BookOpen,
  Gamepad2,
  ShoppingBag,
  Receipt,
  Sparkles,
  MoreHorizontal,
  Trash2,
  ReceiptText,
  User,
  Shield,
  Coins,
  Globe,
  RefreshCw,
  Plus,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ReactNode> = {
  utensils: <Utensils className="w-4 h-4" />,
  bus: <Bus className="w-4 h-4" />,
  'book-open': <BookOpen className="w-4 h-4" />,
  'gamepad-2': <Gamepad2 className="w-4 h-4" />,
  'shopping-bag': <ShoppingBag className="w-4 h-4" />,
  receipt: <Receipt className="w-4 h-4" />,
  sparkles: <Sparkles className="w-4 h-4" />,
  'more-horizontal': <MoreHorizontal className="w-4 h-4" />,
};

export default function DashboardPage() {
  const { expenses, categories, deleteExpense, resetCurrentCycle, setIsExpenseModalOpen } = useWallet();
  const { t, formatCurrency, currency, setCurrency, language, setLanguage } = useLanguage();

  const [activeTab, setActiveTab] = useState<string>('home');
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);

  return (
    <main className="min-h-screen bg-[#F7F9F4] text-gray-900 pb-28">
      {/* Container wrapper for mobile phone view frame on desktop */}
      <div className="max-w-md mx-auto min-h-screen bg-[#F7F9F4] shadow-2xl relative border-x border-emerald-950/5 flex flex-col">
        
        {/* TOP BAR: App Title + Language Switcher (Visible on every screen) */}
        <header className="sticky top-0 z-30 bg-[#F7F9F4]/90 backdrop-blur-md px-5 py-4 flex items-center justify-between border-b border-gray-200/60">
          <div>
            <h1 className="text-lg font-bold text-[#173404] tracking-tight font-display flex items-center space-x-1.5">
              <span>SmartWallet</span>
              <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-[#C0DD97] text-[#173404] font-semibold">
                AI
              </span>
            </h1>
            <p className="text-[11px] text-gray-500 font-medium">
              {t('tagline')}
            </p>
          </div>

          {/* TOP-RIGHT LANGUAGE SWITCHER (EN / UZ) */}
          <LanguageSwitcher />
        </header>

        {/* MAIN BODY CONTENT BASED ON ACTIVE TAB */}
        <div className="p-5 space-y-5 flex-1">
          {activeTab === 'home' && (
            <>
              {/* HERO CARD - Emotional center displaying Daily Safe Spend */}
              <HeroCard />

              {/* Sparkline Quick Overview */}
              <SparklineChart />

              {/* Recent Expenses List */}
              <div className="bg-white rounded-[20px] p-5 shadow-sm border border-emerald-950/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 rounded-lg bg-[#EAF3DE] text-[#173404]">
                      <ReceiptText className="w-4 h-4" />
                    </div>
                    <h4 className="text-sm font-bold text-[#173404]">
                      {t('analytics.recentExpenses')}
                    </h4>
                  </div>
                  <button
                    onClick={() => setIsExpenseModalOpen(true)}
                    className="text-xs font-semibold text-[#173404] hover:underline flex items-center space-x-0.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Log</span>
                  </button>
                </div>

                {expenses.length === 0 ? (
                  <div className="text-center py-6 text-xs text-gray-600 font-medium">
                    {t('analytics.noExpenses')}
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {expenses.slice(0, 5).map((exp) => {
                      const cat = categories.find((c) => c.id === exp.category_id);
                      const timeStr = new Date(exp.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      });

                      return (
                        <div
                          key={exp.id}
                          className="py-3 flex items-center justify-between group"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 rounded-full bg-[#EAF3DE] text-[#173404] flex items-center justify-center shrink-0">
                              {ICON_MAP[cat?.icon || 'more-horizontal']}
                            </div>
                            <div>
                              <div className="text-xs font-semibold text-gray-900">
                                {exp.note || (cat ? t(`categories.${cat.icon}`) : 'Expense')}
                              </div>
                              <div className="text-[10px] text-gray-600">
                                {cat ? t(`categories.${cat.icon}`) : ''} &bull; {timeStr}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold text-[#173404]">
                              -{formatCurrency(exp.amount)}
                            </span>
                            <button
                              onClick={() => deleteExpense(exp.id)}
                              className="text-gray-300 hover:text-red-500 transition-colors p-1"
                              title="Delete expense"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-5 animate-fadeIn">
              <h2 className="text-lg font-bold text-[#173404]">
                {t('analytics.title')}
              </h2>
              <SparklineChart />
              <CategoryBreakdown />
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="space-y-4 animate-fadeIn">
              <h2 className="text-lg font-bold text-[#173404]">
                {t('nav.categories')}
              </h2>
              <CategoryBreakdown />
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-4 animate-fadeIn">
              <h2 className="text-lg font-bold text-[#173404]">
                {t('settings.title')}
              </h2>

              {/* User Demo Card */}
              <div className="bg-white rounded-[20px] p-5 shadow-sm border border-emerald-950/10 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-11 h-11 rounded-full bg-[#173404] text-[#EAF3DE] flex items-center justify-center font-bold text-base">
                    U
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#173404]">
                      {t('settings.demoUser')}
                    </h4>
                    <p className="text-xs text-gray-600">student@university.edu</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAuthOpen(true)}
                  className="px-3 py-1.5 text-xs font-semibold bg-[#EAF3DE] text-[#173404] rounded-xl hover:bg-[#C0DD97] transition-colors"
                >
                  Supabase Auth
                </button>
              </div>

              {/* Preferences Settings */}
              <div className="bg-white rounded-[20px] p-5 shadow-sm border border-emerald-950/10 space-y-4">
                {/* Currency Switcher */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <Coins className="w-4 h-4 text-[#173404]" />
                    <span className="text-xs font-semibold text-gray-800">
                      {t('settings.currencyLabel')}
                    </span>
                  </div>
                  <div className="flex bg-[#F7F9F4] p-1 rounded-xl border border-gray-200">
                    <button
                      onClick={() => setCurrency('KRW')}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                        currency === 'KRW'
                          ? 'bg-[#173404] text-white shadow-xs'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      KRW (₩)
                    </button>
                    <button
                      onClick={() => setCurrency('USD')}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                        currency === 'USD'
                          ? 'bg-[#173404] text-white shadow-xs'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      USD ($)
                    </button>
                  </div>
                </div>

                {/* Language Switcher in settings */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center space-x-2.5">
                    <Globe className="w-4 h-4 text-[#173404]" />
                    <span className="text-xs font-semibold text-gray-800">
                      {t('settings.languageLabel')}
                    </span>
                  </div>
                  <div className="flex bg-[#F7F9F4] p-1 rounded-xl border border-gray-200">
                    <button
                      onClick={() => setLanguage('en')}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                        language === 'en'
                          ? 'bg-[#173404] text-white shadow-xs'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => setLanguage('uz')}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                        language === 'uz'
                          ? 'bg-[#173404] text-white shadow-xs'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Uzbek
                    </button>
                  </div>
                </div>

                {/* Reset Cycle Button */}
                <div className="pt-3 border-t border-gray-100">
                  <button
                    onClick={resetCurrentCycle}
                    className="w-full py-2.5 bg-red-50 text-red-700 hover:bg-red-100 font-semibold rounded-xl text-xs flex items-center justify-center space-x-2 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{t('settings.resetCycle')}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* MODALS */}
        <CycleSetupModal />
        <QuickAddExpenseModal />
        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

        {/* MOBILE BOTTOM NAVIGATION BAR */}
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </main>
  );
}
