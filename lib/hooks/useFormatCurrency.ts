import { useMemo } from "react";

interface FormatCurrencyOptions {
  currency?: string;
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

/**
 * Custom hook to format currency values with memoization
 * Prevents expensive Intl.NumberFormat operations on every render
 */
export function useFormatCurrency(
  amount: number,
  options: FormatCurrencyOptions = {}
): string {
  const {
    currency = "USD",
    locale = "en-US",
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
  } = options;

  return useMemo(() => {
    const formatter = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits,
      maximumFractionDigits,
    });

    return formatter.format(amount);
  }, [amount, currency, locale, minimumFractionDigits, maximumFractionDigits]);
}

/**
 * Format a number as a percentage with memoization
 */
export function useFormatPercentage(
  value: number,
  decimals: number = 1
): string {
  return useMemo(() => {
    return `${value.toFixed(decimals)}%`;
  }, [value, decimals]);
}

/**
 * Format a date string with memoization
 */
export function useFormatDate(
  dateString: string,
  options: Intl.DateTimeFormatOptions = {}
): string {
  return useMemo(() => {
    const date = new Date(dateString);
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      ...options,
    };

    return new Intl.DateTimeFormat("en-US", defaultOptions).format(date);
  }, [dateString, options]);
}
