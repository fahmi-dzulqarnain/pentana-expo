import type { BillingMonth, BillStatus } from '@/domain/bill';

export { formatMoney } from '@/domain/money';

/** { year: 2026, month: 10 } -> "October 2026" */
export function formatMonth({ year, month }: BillingMonth): string {
  return new Date(year, month - 1, 1).toLocaleDateString('en-MY', { month: 'long', year: 'numeric' });
}

export const statusLabel: Record<BillStatus, string> = {
  paid: 'Paid',
  partial: 'Partly paid',
  unpaid: 'Unpaid',
  pending: 'Pending',
};
