export interface ExchangeRateData {
  usdToKrw: number;
  lastUpdated: string; // ISO String or human readable timestamp
  timestampMs: number;
  isFallback?: boolean;
}

const CACHE_KEY = 'smartwallet_exchange_rate_cache';
const CACHE_TTL_MS = 4 * 60 * 60 * 1000; // 4 Hours cache TTL
const FALLBACK_RATE = 1467; // Default fallback rate (1 USD = ~1,467 KRW)

/**
 * Fetches USD to KRW exchange rate from exchangerate API with 4-hour caching.
 * Falls back safely to last cached rate or fallback constant if unreachable.
 */
export async function getUsdToKrwRate(): Promise<ExchangeRateData> {
  // Check localStorage cache first
  if (typeof window !== 'undefined') {
    const cachedStr = localStorage.getItem(CACHE_KEY);
    if (cachedStr) {
      try {
        const cached: ExchangeRateData = JSON.parse(cachedStr);
        const age = Date.now() - cached.timestampMs;
        if (age < CACHE_TTL_MS && cached.usdToKrw > 0) {
          return cached;
        }
      } catch (e) {
        // Continue to fetch fresh rate
      }
    }
  }

  // Fetch fresh rate from public open exchange rate API
  try {
    const response = await fetch('https://open.er-api.com/v6/latest/USD');
    if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
    
    const data = await response.json();
    if (data && data.rates && data.rates.KRW) {
      const rate = data.rates.KRW;
      const rateData: ExchangeRateData = {
        usdToKrw: rate,
        lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestampMs: Date.now(),
        isFallback: false,
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem(CACHE_KEY, JSON.stringify(rateData));
      }
      return rateData;
    }
  } catch (error) {
    console.warn('Exchange rate API unreachable, using cached/fallback rate:', error);
  }

  // Fallback to previous cache if available
  if (typeof window !== 'undefined') {
    const cachedStr = localStorage.getItem(CACHE_KEY);
    if (cachedStr) {
      try {
        const cached: ExchangeRateData = JSON.parse(cachedStr);
        return { ...cached, isFallback: true };
      } catch (e) {}
    }
  }

  // Final emergency fallback
  return {
    usdToKrw: FALLBACK_RATE,
    lastUpdated: 'Fallback Rate',
    timestampMs: Date.now(),
    isFallback: true,
  };
}

/**
 * Converts an amount between currencies.
 * - entryCurrency: Currency in which the amount was originally stored
 * - displayCurrency: User's chosen UI display currency
 * - usdToKrwRate: Current exchange rate
 */
export function convertAmount(
  amount: number,
  entryCurrency: 'KRW' | 'USD',
  displayCurrency: 'KRW' | 'USD',
  usdToKrwRate: number
): { convertedAmount: number; isConverted: boolean } {
  if (entryCurrency === displayCurrency) {
    return { convertedAmount: amount, isConverted: false };
  }

  if (entryCurrency === 'USD' && displayCurrency === 'KRW') {
    return { convertedAmount: amount * usdToKrwRate, isConverted: true };
  }

  if (entryCurrency === 'KRW' && displayCurrency === 'USD') {
    return { convertedAmount: amount / usdToKrwRate, isConverted: true };
  }

  return { convertedAmount: amount, isConverted: false };
}
