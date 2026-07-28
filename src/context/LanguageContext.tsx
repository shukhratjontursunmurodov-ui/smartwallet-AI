'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Currency, Language } from '@/lib/types';
import { formatAmount } from '@/lib/formatAmount';
import { getUsdToKrwRate, convertAmount, ExchangeRateData } from '@/lib/exchangeRate';
import enTranslations from '@/locales/en.json';
import uzTranslations from '@/locales/uz.json';

type TranslationsMap = typeof enTranslations;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: Currency;
  setCurrency: (curr: Currency) => void;
  t: (path: string, params?: Record<string, string | number>) => string;
  formatCurrency: (amount: number) => string;
  exchangeRateInfo: ExchangeRateData | null;
  convertAndFormat: (
    amount: number,
    entryCurrency?: Currency
  ) => { formattedText: string; isConverted: boolean; rateNote?: string };
}

const translations: Record<Language, TranslationsMap> = {
  en: enTranslations,
  uz: uzTranslations,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const [currency, setCurrencyState] = useState<Currency>('KRW');
  const [exchangeRateInfo, setExchangeRateInfo] = useState<ExchangeRateData | null>(null);

  useEffect(() => {
    const savedLang = localStorage.getItem('smartwallet_lang') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'uz')) {
      setLanguageState(savedLang);
    }
    const savedCurr = localStorage.getItem('smartwallet_curr') as Currency;
    if (savedCurr && (savedCurr === 'KRW' || savedCurr === 'USD')) {
      setCurrencyState(savedCurr);
    }

    // Fetch exchange rate on mount (cached for 4 hours)
    getUsdToKrwRate().then((data) => {
      setExchangeRateInfo(data);
    });
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('smartwallet_lang', lang);
  };

  const setCurrency = (curr: Currency) => {
    setCurrencyState(curr);
    localStorage.setItem('smartwallet_curr', curr);
  };

  const t = (path: string, params?: Record<string, string | number>): string => {
    const keys = path.split('.');
    let current: any = translations[language] || translations.en;

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        let fallback: any = translations.en;
        for (const k of keys) {
          if (fallback && typeof fallback === 'object' && k in fallback) {
            fallback = fallback[k];
          } else {
            return path;
          }
        }
        current = fallback;
        break;
      }
    }

    if (typeof current !== 'string') return path;

    if (params) {
      Object.entries(params).forEach(([pKey, pVal]) => {
        current = (current as string).replace(new RegExp(`\\{${pKey}\\}`, 'g'), String(pVal));
      });
    }

    return current;
  };

  const formatCurrency = (amount: number): string => {
    return formatAmount(amount, currency);
  };

  // Convert amount for display only if entryCurrency differs from active display currency
  const convertAndFormat = (amount: number, entryCurrency: Currency = 'KRW') => {
    const rate = exchangeRateInfo?.usdToKrw || 1467;
    const { convertedAmount, isConverted } = convertAmount(
      amount,
      entryCurrency,
      currency,
      rate
    );

    const formattedText = formatAmount(convertedAmount, currency);
    
    let rateNote: string | undefined = undefined;
    if (isConverted && exchangeRateInfo) {
      const formattedRate = formatAmount(rate, 'KRW');
      rateNote = `rate as of ${exchangeRateInfo.lastUpdated} (1 USD = ${formattedRate})`;
    }

    return {
      formattedText,
      isConverted,
      rateNote,
    };
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        currency,
        setCurrency,
        t,
        formatCurrency,
        exchangeRateInfo,
        convertAndFormat,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
