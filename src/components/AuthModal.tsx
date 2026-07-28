'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useLanguage } from '@/context/LanguageContext';
import { Lock, Mail, UserCheck, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSupabaseAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!supabase) {
      setMessage('Supabase environment variables not configured yet. Operating in Demo Mode!');
      setLoading(false);
      setTimeout(() => onClose(), 1200);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        // Try sign up if user does not exist
        const { error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) throw signUpError;
        setMessage('Account created! Please check your email.');
      } else {
        setMessage('Successfully signed in!');
        setTimeout(() => onClose(), 1000);
      }
    } catch (err: any) {
      setMessage(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-[24px] p-6 shadow-2xl border border-emerald-950/10 space-y-5">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#EAF3DE] text-[#173404] mb-1">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-[#173404]">
            {t('auth.signInTitle')}
          </h3>
        </div>

        {message && (
          <div className="p-3 bg-[#EAF3DE] text-[#173404] text-xs font-semibold rounded-xl text-center">
            {message}
          </div>
        )}

        <form onSubmit={handleSupabaseAuth} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700 block">
              {t('auth.emailLabel')}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="student@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#F7F9F4] border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#173404]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700 block">
              {t('auth.passwordLabel')}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#F7F9F4] border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#173404]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#173404] text-[#EAF3DE] font-semibold rounded-xl hover:bg-[#234a08] transition-colors text-sm"
          >
            {loading ? 'Authenticating...' : t('auth.signInButton')}
          </button>
        </form>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="flex-shrink mx-3 text-xs text-gray-400 uppercase font-medium">
            {t('auth.or')}
          </span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-[#EAF3DE] text-[#173404] font-semibold rounded-xl hover:bg-[#C0DD97] transition-colors text-xs flex items-center justify-center space-x-2"
        >
          <UserCheck className="w-4 h-4" />
          <span>{t('auth.demoButton')}</span>
        </button>
      </div>
    </div>
  );
};
