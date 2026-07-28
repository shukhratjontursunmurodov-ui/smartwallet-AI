-- ==========================================
-- SmartWallet AI - Supabase Database Schema
-- Phase 1 MVP SQL Migration Script
-- ==========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  currency TEXT NOT NULL DEFAULT 'KRW' CHECK (currency IN ('KRW', 'USD')),
  language TEXT NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'uz')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CYCLES TABLE
CREATE TABLE IF NOT EXISTS public.cycles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  cycle_length_days INT NOT NULL DEFAULT 30,
  total_amount NUMERIC(15, 2) NOT NULL CHECK (total_amount > 0),
  currency TEXT NOT NULL DEFAULT 'KRW',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE, -- NULL means global preset category
  name TEXT NOT NULL,
  icon TEXT NOT NULL, -- Lucide icon identifier (e.g., 'utensils', 'bus', 'book-open')
  is_custom BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. EXPENSES TABLE
CREATE TABLE IF NOT EXISTS public.expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cycle_id UUID NOT NULL REFERENCES public.cycles(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  amount NUMERIC(15, 2) NOT NULL CHECK (amount > 0),
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. STREAKS TABLE
CREATE TABLE IF NOT EXISTS public.streaks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  current_streak INT NOT NULL DEFAULT 0,
  longest_streak INT NOT NULL DEFAULT 0,
  last_checked_date DATE DEFAULT CURRENT_DATE
);

-- Indexing for performance
CREATE INDEX IF NOT EXISTS idx_cycles_user_active ON public.cycles(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_expenses_cycle ON public.expenses(cycle_id);

-- PRESET GLOBAL CATEGORIES SEED DATA
INSERT INTO public.categories (name, icon, is_custom) VALUES
  ('Food & Dining', 'utensils', false),
  ('Transport', 'bus', false),
  ('Study & Books', 'book-open', false),
  ('Entertainment', 'gamepad-2', false),
  ('Shopping', 'shopping-bag', false),
  ('Bills & Utilities', 'receipt', false),
  ('Personal Care', 'sparkles', false),
  ('Miscellaneous', 'more-horizontal', false)
ON CONFLICT DO NOTHING;

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own record" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own record" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Cycles policies
CREATE POLICY "Users can manage own cycles" ON public.cycles FOR ALL USING (auth.uid() = user_id);

-- Categories policies
CREATE POLICY "Users can read global or own categories" ON public.categories 
  FOR SELECT USING (user_id IS NULL OR user_id = auth.uid());
CREATE POLICY "Users can manage custom categories" ON public.categories 
  FOR ALL USING (user_id = auth.uid());

-- Expenses policies
CREATE POLICY "Users can manage expenses in their active/past cycles" ON public.expenses 
  FOR ALL USING (
    cycle_id IN (SELECT id FROM public.cycles WHERE user_id = auth.uid())
  );

-- Streaks policies
CREATE POLICY "Users can manage own streak" ON public.streaks FOR ALL USING (auth.uid() = user_id);
