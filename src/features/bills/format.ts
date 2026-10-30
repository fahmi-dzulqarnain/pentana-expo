import type { BillStatus } from '@/api/types';

/** "1234.50" -> "RM 1,234.50". Works on the API's decimal string, so no float rounding. */
export function formatMoney(amount: string): string {
  const [whole, fraction = '00'] = amount.split('.');
  const negative = whole.startsWith('-');
  const digits = negative ? whole.slice(1) : whole;
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${negative ? '-' : ''}RM ${grouped}.${fraction.padEnd(2, '0').slice(0, 2)}`;
}

/** "2026-10" -> "October 2026" */
export function formatMonth(month: string): string {
  const [year, m] = month.split('-').map(Number);
  return new Date(year, m - 1, 1).toLocaleDateString('en-MY', { month: 'long', year: 'numeric' });
}

export const statusLabel: Record<BillStatus, string> = {
  paid: 'Paid',
  partial: 'Partly paid',
  unpaid: 'Unpaid',
  pending: 'Pending',
};
