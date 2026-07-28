import { Currency } from './types';

/**
 * Formats monetary amounts with a dot (.) as the thousands separator.
 * Used everywhere across the app to ensure consistent formatting.
 * Examples:
 *   10000    -> ₩10.000 or $10.000
 *   1250000  -> ₩1.250.000 or $1.250.000
 */
export function formatAmount(amount: number, currency: Currency = 'KRW'): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    amount = 0;
  }

  const rounded = Math.round(amount);
  const formattedNumber = rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  if (currency === 'KRW') {
    return `₩${formattedNumber}`;
  } else {
    return `$${formattedNumber}`;
  }
}
