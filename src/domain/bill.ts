// Domain models: what the app reasons about, independent of the API's wire format.
import type { Sen } from './money';

export type BillStatus = 'paid' | 'partial' | 'unpaid' | 'pending';

export type BillingMonth = { year: number; month: number };

export type Bill = {
  id: number;
  month: BillingMonth;
  amountDue: Sen;
  amountPaid: Sen;
  outstanding: Sen;
  status: BillStatus;
};

export type BillSummary = {
  totalOutstanding: Sen;
  availableCredit: Sen;
  unpaidCount: number;
  billCount: number;
};

export const isSettled = (bill: Bill) => bill.status === 'paid';

/** What a row shows: the amount still owed, or the full amount once settled. */
export const displayAmount = (bill: Bill): Sen => (isSettled(bill) ? bill.amountDue : bill.outstanding);
