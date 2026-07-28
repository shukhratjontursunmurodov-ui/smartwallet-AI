'use client';

import React, { useState } from 'react';
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
  X,
  PlusCircle,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ReactNode> = {
  utensils: <Utensils className="w-5 h-5" />,
  bus: <Bus className="w-5 h-5" />,
  'book-open': <BookOpen className="w-5 h-5" />,
  'gamepad-2': <Gamepad2 className="w-5 h-5" />,
  'shopping-bag': <ShoppingBag className="w-5 h-5" />,
  receipt: <Receipt className="w-5 h-5" />,
  sparkles: <Sparkles className="w-5 h-5" />,
  'more-horizontal': <MoreHorizontal className="w-5 h-5" />,
};

export const QuickAddExpenseModal: React.FC = () => {
  const { isExpenseModalOpen, setIsExpenseModalOpen, categories, addExpense } =
    useWallet();
  const { t, currency } = useLanguage();

  const [amount, setAmount] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0]?.id || '');
  const [note, setNote] = useState<string>('');

  if (!isExpenseModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) return;

    addExpense(numAmount, selectedCategory, note);
    setAmount('');
    setNote('');
    setIsExpenseModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-t-[28px] sm:rounded-[24px] p-6 shadow-2xl border border-emerald-950/10 space-y-5 animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-[#EAF3DE] text-[#173404]">
              <PlusCircle className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#173404]">
              {t('expense.quickAddHeader')}
            </h3>
          </div>
          <button
            onClick={() => setIsExpenseModalOpen(false)}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* TAP 1: Amount */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700 block">
              {t('expense.amountLabel')}
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#173404] font-bold text-xl">
                {currency === 'KRW' ? '₩' : '$'}
              </span>
              <input
                type="number"
                required
                min="1"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                autoFocus
                className="w-full pl-10 pr-4 py-3 bg-[#F7F9F4] border border-gray-200 rounded-xl font-semibold text-2xl text-[#173404] focus:outline-none focus:ring-2 focus:ring-[#173404]"
              />
            </div>
          </div>

          {/* TAP 2: Category Selector (Circular Icon Badges) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 block">
              {t('expense.categoryLabel')}
            </label>
            <div className="grid grid-cols-4 gap-3 py-1">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className="flex flex-col items-center space-y-1 group"
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-[#173404] text-[#EAF3DE] ring-4 ring-[#C0DD97] scale-105 shadow-md'
                          : 'bg-[#EAF3DE] text-[#173404] hover:bg-[#C0DD97]'
                      }`}
                    >
                      {ICON_MAP[cat.icon] || <MoreHorizontal className="w-5 h-5" />}
                    </div>
                    <span
                      className={`text-[10px] font-medium text-center line-clamp-1 truncate w-full ${
                        isSelected ? 'text-[#173404] font-bold' : 'text-gray-600'
                      }`}
                    >
                      {t(`categories.${cat.icon}`)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional Note */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700 block">
              {t('expense.noteLabel')}
            </label>
            <input
              type="text"
              placeholder={t('expense.notePlaceholder')}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#F7F9F4] border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#173404]"
            />
          </div>

          {/* TAP 3: Submit */}
          <button
            type="submit"
            className="w-full py-3.5 bg-[#173404] hover:bg-[#234a08] text-[#EAF3DE] font-semibold rounded-xl shadow-lg transition-all text-sm mt-2"
          >
            {t('expense.saveButton')}
          </button>
        </form>
      </div>
    </div>
  );
};
