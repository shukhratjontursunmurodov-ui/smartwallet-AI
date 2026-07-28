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
  Plus,
  X,
  Coffee,
  Plane,
  Heart,
  Dumbbell,
  Car,
  Briefcase,
  ArrowLeft,
  Trash2,
  Tag,
  Check,
} from 'lucide-react';

const ICON_COMPONENTS: Record<string, React.ReactNode> = {
  utensils: <Utensils className="w-5 h-5" />,
  bus: <Bus className="w-5 h-5" />,
  'book-open': <BookOpen className="w-5 h-5" />,
  'gamepad-2': <Gamepad2 className="w-5 h-5" />,
  'shopping-bag': <ShoppingBag className="w-5 h-5" />,
  receipt: <Receipt className="w-5 h-5" />,
  sparkles: <Sparkles className="w-5 h-5" />,
  'more-horizontal': <MoreHorizontal className="w-5 h-5" />,
  coffee: <Coffee className="w-5 h-5" />,
  plane: <Plane className="w-5 h-5" />,
  heart: <Heart className="w-5 h-5" />,
  dumbbell: <Dumbbell className="w-5 h-5" />,
  car: <Car className="w-5 h-5" />,
  briefcase: <Briefcase className="w-5 h-5" />,
};

const AVAILABLE_ICONS = [
  'utensils',
  'bus',
  'book-open',
  'gamepad-2',
  'shopping-bag',
  'receipt',
  'sparkles',
  'coffee',
  'plane',
  'heart',
  'dumbbell',
  'car',
  'briefcase',
  'more-horizontal',
];

export const CategoriesView: React.FC = () => {
  const { categories, expenses, totalSpent, activeCycle, addCustomCategory, deleteExpense } = useWallet();
  const { t, convertAndFormat } = useLanguage();

  const [selectedCatId, setSelectedCatId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newCatName, setNewCatName] = useState<string>('');
  const [selectedIcon, setSelectedIcon] = useState<string>('coffee');

  const entryCurrency = activeCycle?.currency || 'KRW';

  // Calculate totals per category
  const categoryStats = categories.map((cat) => {
    const catExpenses = expenses.filter((e) => e.category_id === cat.id);
    const sum = catExpenses.reduce((s, e) => s + e.amount, 0);
    const percentage = totalSpent > 0 ? Math.round((sum / totalSpent) * 100) : 0;
    return { ...cat, total: sum, percentage, count: catExpenses.length, expensesList: catExpenses };
  });

  const selectedCategoryData = categoryStats.find((c) => c.id === selectedCatId);

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    addCustomCategory(newCatName.trim(), selectedIcon);
    setNewCatName('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* FILTERED CATEGORY EXPENSE DETAIL VIEW */}
      {selectedCategoryData ? (
        <div className="space-y-4">
          <button
            onClick={() => setSelectedCatId(null)}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#173404] hover:underline bg-white px-3 py-1.5 rounded-xl border border-gray-200 shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Categories</span>
          </button>

          {/* Category Header Card */}
          <div className="bg-white rounded-[20px] p-5 shadow-sm border border-emerald-950/10 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-[#EAF3DE] text-[#173404] flex items-center justify-center">
                {ICON_COMPONENTS[selectedCategoryData.icon] || <Tag className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#173404]">
                  {selectedCategoryData.is_custom
                    ? selectedCategoryData.name
                    : t(`categories.${selectedCategoryData.icon}`)}
                </h3>
                <p className="text-xs text-gray-500 font-medium">
                  {selectedCategoryData.count} {selectedCategoryData.count === 1 ? 'expense' : 'expenses'} logged
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-base font-bold text-[#173404] block">
                {selectedCategoryData.total > 0
                  ? convertAndFormat(selectedCategoryData.total, entryCurrency).formattedText
                  : 'No expenses yet'}
              </span>
              <span className="text-xs text-gray-500">
                {selectedCategoryData.percentage}% of cycle spend
              </span>
            </div>
          </div>

          {/* Filtered Expenses List */}
          <div className="bg-white rounded-[20px] p-5 shadow-sm border border-emerald-950/10 space-y-3">
            <h4 className="text-sm font-bold text-[#173404]">Expenses in this Category</h4>
            {selectedCategoryData.expensesList.length === 0 ? (
              <div className="text-center py-8 text-xs text-gray-400 font-medium">
                No expenses logged in this category yet.
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {selectedCategoryData.expensesList.map((exp) => (
                  <div key={exp.id} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-gray-900">
                        {exp.note || selectedCategoryData.name}
                      </div>
                      <div className="text-[10px] text-gray-500">
                        {new Date(exp.created_at).toLocaleDateString()} &bull;{' '}
                        {new Date(exp.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-[#173404]">
                        -{convertAndFormat(exp.amount, entryCurrency).formattedText}
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
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ALL CATEGORIES GRID (2 Cols Desktop, 1 Col Mobile) */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#173404]">
              {t('nav.categories')}
            </h2>
            <span className="text-xs text-gray-500 font-medium">
              {categories.length} Categories
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categoryStats.map((cat) => {
              const displayName = cat.is_custom ? cat.name : t(`categories.${cat.icon}`);
              const hasSpent = cat.total > 0;
              const formattedAmt = convertAndFormat(cat.total, entryCurrency).formattedText;

              return (
                <div
                  key={cat.id}
                  onClick={() => setSelectedCatId(cat.id)}
                  className="bg-white rounded-[20px] p-4 shadow-sm border border-emerald-950/10 hover:border-[#90C749] transition-all cursor-pointer space-y-3 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {/* Circular Light-Green Badge */}
                      <div className="w-11 h-11 rounded-full bg-[#EAF3DE] text-[#173404] group-hover:bg-[#C0DD97] flex items-center justify-center shrink-0 transition-colors">
                        {ICON_COMPONENTS[cat.icon] || <Tag className="w-5 h-5" />}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#173404] transition-colors">
                          {displayName}
                        </h4>
                        {cat.is_custom && (
                          <span className="text-[10px] bg-emerald-100 text-[#173404] px-1.5 py-0.2 rounded font-semibold">
                            Custom
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      {hasSpent ? (
                        <>
                          <span className="text-sm font-bold text-[#173404] block">
                            {formattedAmt}
                          </span>
                          <span className="text-[11px] text-gray-500 font-medium">
                            {cat.percentage}% of cycle
                          </span>
                        </>
                      ) : (
                        <span className="text-xs text-gray-400 font-medium italic">
                          No expenses yet
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${hasSpent ? cat.percentage : 0}%` }}
                      className="h-full bg-[#90C749] rounded-full transition-all duration-500"
                    />
                  </div>
                </div>
              );
            })}

            {/* DISTINCT "+ ADD CATEGORY" CARD */}
            <div
              onClick={() => setIsAddModalOpen(true)}
              className="bg-[#EAF3DE]/30 border-2 border-dashed border-[#C0DD97] hover:border-[#173404] hover:bg-[#EAF3DE]/60 rounded-[20px] p-4 flex items-center justify-center space-x-2 text-[#173404] font-semibold cursor-pointer transition-all min-h-[96px] group"
            >
              <div className="w-9 h-9 rounded-full bg-[#173404] text-[#EAF3DE] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <Plus className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="text-sm font-bold">+ Add category</span>
            </div>
          </div>
        </div>
      )}

      {/* CREATE CUSTOM CATEGORY MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-[24px] p-6 shadow-2xl border border-emerald-950/10 space-y-5 animate-slideUp">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-bold text-[#173404]">Create Custom Category</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700 block">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gym & Fitness, Subscriptions..."
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  autoFocus
                  className="w-full px-4 py-2.5 bg-[#F7F9F4] border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#173404]"
                />
              </div>

              {/* Icon Picker */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-700 block">
                  Select Category Icon
                </label>
                <div className="grid grid-cols-7 gap-2">
                  {AVAILABLE_ICONS.map((iconKey) => {
                    const isSelected = selectedIcon === iconKey;
                    return (
                      <button
                        type="button"
                        key={iconKey}
                        onClick={() => setSelectedIcon(iconKey)}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-[#173404] text-[#EAF3DE] ring-2 ring-[#90C749] scale-110'
                            : 'bg-[#EAF3DE] text-[#173404] hover:bg-[#C0DD97]'
                        }`}
                      >
                        {ICON_COMPONENTS[iconKey]}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#173404] hover:bg-[#234a08] text-[#EAF3DE] font-bold rounded-xl shadow-lg transition-all text-sm mt-2"
              >
                Save Category
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
