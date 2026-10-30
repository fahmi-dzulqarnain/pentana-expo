// Shapes returned by the PENTANA API. Money arrives as fixed 2-dp strings to avoid float drift.

export type User = {
  id: number;
  name: string;
  nickname: string | null;
  display_name: string;
  email: string;
  member_category: string | null;
  credit: number;
  is_admin: boolean;
};

export type LoginResponse = { token: string; user: User };

export type BillStatus = 'paid' | 'partial' | 'unpaid' | 'pending';

export type Bill = {
  id: number;
  /** `YYYY-MM` */
  month: string;
  amount_due: string;
  amount_paid: string;
  outstanding: string;
  status: BillStatus;
};

export type BillSummary = {
  total_outstanding: string;
  available_credit: string;
  unpaid_count: number;
  bill_count: number;
};

/** Laravel resource collections wrap their payload in `data`. */
export type Wrapped<T> = { data: T };
