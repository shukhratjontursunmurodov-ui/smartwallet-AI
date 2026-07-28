'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Globe } from 'lucide-react';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="inline-flex items-center bg-white/90 backdrop-blur border border-emerald-950/10 shadow-sm rounded-full p-1 transition-all">
      <Globe className="w-4 h-4 text-[#173404] ml-2 mr-1" />
      <button
        onClick={() => setLanguage('en')}
        className={`px-2.5 py-1 text-xs font-semibold rounded-full transition-colors ${
          language === 'en'
            ? 'bg-[#173404] text-[#EAF3DE] shadow-xs'
            : 'text-gray-600 hover:text-[#173404]'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('uz')}
        className={`px-2.5 py-1 text-xs font-semibold rounded-full transition-colors ${
          language === 'uz'
            ? 'bg-[#173404] text-[#EAF3DE] shadow-xs'
            : 'text-gray-600 hover:text-[#173404]'
        }`}
      >
        UZ
      </button>
    </div>
  );
};
