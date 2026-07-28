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
import { CategoriesView } from '@/components/CategoriesView';
import { AnalyticsView } from '@/components/AnalyticsView';
import { BottomNav } from '@/components/BottomNav';
import { Sidebar } from '@/components/Sidebar';
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
  Plus,
  Coins,
  Globe,
  RefreshCw,
  LayoutDashboard,
  RefreshCcw,
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
  const { expenses, categories, deleteExpense, resetCurrentCycle, setIsExpenseModalOpen, activeCycle } = useWallet();
  const { t, convertAndFormat, currency, setCurrency, language, setLanguage, exchangeRateInfo } = useLanguage();

  const [activeTab, setActiveTab] = useState<string>('home');
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);

  const entryCurrency = activeCycle?.currency || 'KRW';

  return (
    <div className="min-h-screen bg-[#F7F9F4] text-gray-900 flex flex-col lg:flex-row antialiased selection:bg-[#C0DD97] selection:text-[#173404]">
      {/* DESKTOP SIDEBAR NAVIGATION */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* MAIN APPLICATION CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 pb-24 lg:pb-12">
        {/* TOP APP BAR */}
        <header className="sticky top-0 z-30 bg-[#F7F9F4]/90 backdrop-blur-md px-4 sm:px-8 py-4 flex items-center justify-between border-b border-gray-200/80">
          <div className="flex items-center space-x-3">
            <div className="lg:hidden">
              <h1 className="text-lg font-bold text-[#173404] tracking-tight font-display flex items-center space-x-1.5">
                <span>SmartWallet</span>
                <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-[#C0DD97] text-[#173404] font-semibold">
                  AI
                </span>
              </h1>
              <p className="text-[11px] text-gray-500 font-medium">{t('tagline')}</p>
            </div>

            <div className="hidden lg:flex items-center space-x-2 text-[#173404]">
              <LayoutDashboard className="w-5 h-5 text-[#90C749]" />
              <h2 className="text-lg font-bold capitalize">
                {activeTab === 'home'
                  ? 'Dashboard Overview'
                  : activeTab === 'analytics'
                  ? t('analytics.title')
                  : activeTab === 'categories'
                  ? t('nav.categories')
                  : t('settings.title')}
              </h2>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center space-x-3">
            {/* Currency Switcher */}
            <button
              onClick={() => setCurrency(currency === 'KRW' ? 'USD' : 'KRW')}
              className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-200 text-xs font-bold text-[#173404] hover:bg-[#EAF3DE] transition-colors shadow-xs"
            >
              <Coins className="w-3.5 h-3.5 text-[#90C749]" />
              <span>{currency === 'KRW' ? 'KRW (₩)' : 'USD ($)'}</span>
            </button>

            {/* TOP-RIGHT LANGUAGE SWITCHER */}
            <LanguageSwitcher />
          </div>
        </header>

        {/* MAIN BODY CONTENT */}
        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6 flex-1">
          {activeTab === 'home' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* LEFT COLUMN: HERO CARD & WEEKLY SPARKLINE CHART */}
              <div className="lg:col-span-6 xl:col-span-7 space-y-6">
                <HeroCard />
                <SparklineChart />
              </div>

              {/* RIGHT COLUMN: RECENT EXPENSES & CATEGORY BREAKDOWN */}
              <div className="lg:col-span-6 xl:col-span-5 space-y-6">
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
                    <div className="divide-y divide-gray-100 max-h-[380px] overflow-y-auto pr-1">
                      {expenses.map((exp) => {
                        const cat = categories.find((c) => c.id === exp.category_id);
                        const timeStr = new Date(exp.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        });

                        const expDisplay = convertAndFormat(exp.amount, entryCurrency);

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
                                -{expDisplay.formattedText}
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

                <CategoryBreakdown />
              </div>
            </div>
          )}

          {activeTab === 'analytics' && <AnalyticsView />}

          {activeTab === 'categories' && <CategoriesView />}

          {activeTab === 'profile' && (
            <div className="max-w-2xl mx-auto space-y-5 animate-fadeIn">
              <h2 className="text-lg font-bold text-[#173404]">
                {t('settings.title')}
              </h2>

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

              <div className="bg-white rounded-[20px] p-5 shadow-sm border border-emerald-950/10 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center space-x-2">
                    <RefreshCcw className="w-4 h-4 text-[#90C749]" />
                    <span className="text-xs font-semibold text-gray-800">
                      Live Exchange Rate API
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-[#173404] block">
                      1 USD = {convertAndFormat(exchangeRateInfo?.usdToKrw || 1467, 'USD').formattedText}
                    </span>
                    <span className="text-[10px] text-gray-500">
                      rate as of {exchangeRateInfo?.lastUpdated || 'recent'}
                    </span>
                  </div>
                </div>

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
                          ? 'bg-[#173404] text-[#173404] shadow-xs bg-[#173404] text-white'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      USD ($)
                    </button>
                  </div>
                </div>

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
        </main>

        <CycleSetupModal />
        <QuickAddExpenseModal />
        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
}
