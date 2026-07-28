'use client';

import React from 'react';
import { useWallet } from '@/context/WalletContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  Utensils,
  Bus,
  BookOpen,
  Gamepad2,
  ShoppingBag,
  Receipt,
  Sparkles,
  MoreHorizontal,
  PieChart,
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

export const CategoryBreakdown: React.FC = () => {
  const { expenses, categories, totalSpent, activeCycle } = useWallet();
  const { t, convertAndFormat } = useLanguage();

  const entryCurrency = activeCycle?.currency || 'KRW';

  const categoryTotals = categories.map((cat) => {
    const sum = expenses
      .filter((e) => e.category_id === cat.id)
      .reduce((s, e) => s + e.amount, 0);

    const percentage = totalSpent > 0 ? Math.round((sum / totalSpent) * 100) : 0;
    return { ...cat, total: sum, percentage };
  });

  const activeCategories = categoryTotals
    .filter((c) => c.total > 0)
    .sort((a, b) => b.total - a.total);

  return (
    <div className="bg-white rounded-[20px] p-5 shadow-sm border border-emerald-950/10 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-[#EAF3DE] text-[#173404]">
            <PieChart className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold text-[#173404]">
            {t('analytics.categoryBreakdown')}
          </h4>
        </div>
      </div>

      {activeCategories.length === 0 ? (
        <div className="text-center py-6 text-xs text-gray-600 font-medium">
          {t('analytics.noExpenses')}
        </div>
      ) : (
        <div className="space-y-3.5">
          {activeCategories.map((cat) => {
            const formatted = convertAndFormat(cat.total, entryCurrency).formattedText;
            return (
              <div key={cat.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#EAF3DE] text-[#173404] flex items-center justify-center shrink-0">
                      {ICON_MAP[cat.icon] || <MoreHorizontal className="w-4 h-4" />}
                    </div>
                    <span className="font-semibold text-gray-800">
                      {t(`categories.${cat.icon}`)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-[#173404]">
                      {formatted}
                    </span>
                    <span className="text-[11px] text-gray-600 block">
                      {cat.percentage}%
                    </span>
                  </div>
                </div>

                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${cat.percentage}%` }}
                    className="h-full bg-[#90C749] rounded-full transition-all duration-500"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
