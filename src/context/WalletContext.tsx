'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Category, Cycle, Expense, Streak } from '@/lib/types';
import { supabase } from '@/lib/supabaseClient';

const PRESET_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Food & Dining', icon: 'utensils', is_custom: false },
  { id: 'cat-2', name: 'Transport', icon: 'bus', is_custom: false },
  { id: 'cat-3', name: 'Study & Books', icon: 'book-open', is_custom: false },
  { id: 'cat-4', name: 'Entertainment', icon: 'gamepad-2', is_custom: false },
  { id: 'cat-5', name: 'Shopping', icon: 'shopping-bag', is_custom: false },
  { id: 'cat-6', name: 'Bills & Utilities', icon: 'receipt', is_custom: false },
  { id: 'cat-7', name: 'Personal Care', icon: 'sparkles', is_custom: false },
  { id: 'cat-8', name: 'Miscellaneous', icon: 'more-horizontal', is_custom: false },
];

interface WalletContextType {
  activeCycle: Cycle | null;
  expenses: Expense[];
  categories: Category[];
  streak: Streak;
  dailySafeLimit: number;
  daysRemaining: number;
  totalSpent: number;
  balanceRemaining: number;
  isCycleModalOpen: boolean;
  setIsCycleModalOpen: (open: boolean) => void;
  isExpenseModalOpen: boolean;
  setIsExpenseModalOpen: (open: boolean) => void;
  startNewCycle: (totalAmount: number, lengthDays: number, startDate?: string) => Promise<void>;
  addExpense: (amount: number, categoryId: string, note?: string) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  resetCurrentCycle: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeCycle, setActiveCycle] = useState<Cycle | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories] = useState<Category[]>(PRESET_CATEGORIES);
  const [streak, setStreak] = useState<Streak>({
    id: 'streak-1',
    user_id: 'user-demo',
    current_streak: 5,
    longest_streak: 12,
    last_checked_date: new Date().toISOString().split('T')[0],
  });

  const [isCycleModalOpen, setIsCycleModalOpen] = useState<boolean>(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState<boolean>(false);

  // Load initial state from LocalStorage or Supabase
  useEffect(() => {
    const savedCycle = localStorage.getItem('smartwallet_active_cycle');
    if (savedCycle) {
      try {
        const parsed = JSON.parse(savedCycle);
        // Check if cycle has expired
        const startDate = new Date(parsed.start_date);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - startDate.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays >= parsed.cycle_length_days) {
          // Cycle finished! Needs new cycle input
          setActiveCycle(null);
          setIsCycleModalOpen(true);
        } else {
          setActiveCycle(parsed);
        }
      } catch (e) {
        setActiveCycle(null);
      }
    } else {
      // First time or no active cycle -> Show blocking prompt
      setIsCycleModalOpen(true);
    }

    const savedExpenses = localStorage.getItem('smartwallet_expenses');
    if (savedExpenses) {
      try {
        setExpenses(JSON.parse(savedExpenses));
      } catch (e) {
        setExpenses([]);
      }
    } else {
      // Seed initial demo expenses if desired
      const demoExpenses: Expense[] = [
        {
          id: 'exp-1',
          cycle_id: 'demo-cycle',
          category_id: 'cat-1',
          amount: 8500,
          note: 'Campus Cafeteria Lunch',
          created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
        },
        {
          id: 'exp-2',
          cycle_id: 'demo-cycle',
          category_id: 'cat-2',
          amount: 1400,
          note: 'Subway fare',
          created_at: new Date(Date.now() - 3600000 * 6).toISOString(),
        },
      ];
      setExpenses(demoExpenses);
      localStorage.setItem('smartwallet_expenses', JSON.stringify(demoExpenses));
    }

    const savedStreak = localStorage.getItem('smartwallet_streak');
    if (savedStreak) {
      try {
        setStreak(JSON.parse(savedStreak));
      } catch (e) {}
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (activeCycle) {
      localStorage.setItem('smartwallet_active_cycle', JSON.stringify(activeCycle));
    } else {
      localStorage.removeItem('smartwallet_active_cycle');
    }
  }, [activeCycle]);

  useEffect(() => {
    localStorage.setItem('smartwallet_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('smartwallet_streak', JSON.stringify(streak));
  }, [streak]);

  // Derived Safe-Spend Formula Calculations
  const calculateMetrics = () => {
    if (!activeCycle) {
      return {
        totalSpent: 0,
        balanceRemaining: 0,
        daysRemaining: 1,
        dailySafeLimit: 0,
      };
    }

    // Filter expenses for current cycle
    const currentCycleExpenses = expenses.filter(
      (e) => e.cycle_id === activeCycle.id || activeCycle.id === 'demo-cycle'
    );

    const totalSpent = currentCycleExpenses.reduce((sum, e) => sum + e.amount, 0);
    const balanceRemaining = activeCycle.total_amount - totalSpent;

    // Calculate days remaining
    const start = new Date(activeCycle.start_date);
    const today = new Date();
    // Normalize dates to midnight for clean day diff
    const startMid = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const todayMid = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const elapsedDays = Math.max(
      0,
      Math.floor((todayMid.getTime() - startMid.getTime()) / (1000 * 60 * 60 * 24))
    );

    const daysRemaining = Math.max(1, activeCycle.cycle_length_days - elapsedDays);

    // Dynamic formula: daily_limit = (cycle_total_amount - amount_spent_so_far) / days_remaining_in_cycle
    const dailySafeLimit = Math.max(0, balanceRemaining / daysRemaining);

    return {
      totalSpent,
      balanceRemaining,
      daysRemaining,
      dailySafeLimit,
    };
  };

  const { totalSpent, balanceRemaining, daysRemaining, dailySafeLimit } = calculateMetrics();

  const startNewCycle = async (totalAmount: number, lengthDays: number, startDateStr?: string) => {
    const newCycle: Cycle = {
      id: `cycle-${Date.now()}`,
      user_id: 'user-demo',
      start_date: startDateStr || new Date().toISOString().split('T')[0],
      cycle_length_days: lengthDays,
      total_amount: totalAmount,
      currency: 'KRW',
      is_active: true,
      created_at: new Date().toISOString(),
    };

    setActiveCycle(newCycle);
    setExpenses([]); // Clear expenses for the new fresh cycle
    setIsCycleModalOpen(false);
  };

  const addExpense = async (amount: number, categoryId: string, note?: string) => {
    if (!activeCycle) {
      setIsCycleModalOpen(true);
      return;
    }

    const newExpense: Expense = {
      id: `exp-${Date.now()}`,
      cycle_id: activeCycle.id,
      category_id: categoryId,
      amount,
      note,
      created_at: new Date().toISOString(),
    };

    const updatedExpenses = [newExpense, ...expenses];
    setExpenses(updatedExpenses);

    // Update streak if spent within today's daily limit
    const todaySpent = updatedExpenses
      .filter((e) => {
        const eDate = new Date(e.created_at).toISOString().split('T')[0];
        const todayDate = new Date().toISOString().split('T')[0];
        return eDate === todayDate;
      })
      .reduce((sum, e) => sum + e.amount, 0);

    if (todaySpent <= dailySafeLimit) {
      const newStreakCount = streak.current_streak + 1;
      setStreak((prev) => ({
        ...prev,
        current_streak: newStreakCount,
        longest_streak: Math.max(prev.longest_streak, newStreakCount),
        last_checked_date: new Date().toISOString().split('T')[0],
      }));
    }
  };

  const deleteExpense = async (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const resetCurrentCycle = () => {
    setActiveCycle(null);
    setIsCycleModalOpen(true);
  };

  return (
    <WalletContext.Provider
      value={{
        activeCycle,
        expenses,
        categories,
        streak,
        dailySafeLimit,
        daysRemaining,
        totalSpent,
        balanceRemaining,
        isCycleModalOpen,
        setIsCycleModalOpen,
        isExpenseModalOpen,
        setIsExpenseModalOpen,
        startNewCycle,
        addExpense,
        deleteExpense,
        resetCurrentCycle,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
