export type Currency = 'KRW' | 'USD';
export type Language = 'en' | 'uz';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  currency: Currency;
  language: Language;
  created_at: string;
}

export interface Cycle {
  id: string;
  user_id: string;
  start_date: string; // YYYY-MM-DD
  cycle_length_days: number;
  total_amount: number;
  currency: Currency;
  is_active: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  user_id?: string | null;
  name: string;
  icon: string;
  is_custom: boolean;
}

export interface Expense {
  id: string;
  cycle_id: string;
  category_id: string;
  amount: number;
  note?: string;
  created_at: string;
}

export interface Streak {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_checked_date: string;
}
