// Maps the PENTANA API's bill payloads to domain models. The only place that knows the wire format.
import type { ApiClient } from '@/api/client';
import type { Wrapped } from '@/api/types';
import type { Bill, BillStatus, BillSummary } from '@/domain/bill';
import type { BillsRepository } from '@/domain/billsRepository';
import { parseMoney } from '@/domain/money';

export type BillDto = {
  id: number;
  /** `YYYY-MM` */
  month: string;
  amount_due: string;
  amount_paid: string;
  outstanding: string;
  status: string;
};

export type BillSummaryDto = {
  total_outstanding: string;
  available_credit: string;
  unpaid_count: number;
  bill_count: number;
};

const STATUSES: readonly BillStatus[] = ['paid', 'partial', 'unpaid', 'pending'];

export function toBill(dto: BillDto): Bill {
  const [year, month] = dto.month.split('-').map(Number);
  return {
    id: dto.id,
    month: { year, month },
    amountDue: parseMoney(dto.amount_due),
    amountPaid: parseMoney(dto.amount_paid),
    outstanding: parseMoney(dto.outstanding),
    // An unknown status from a newer API is shown as pending rather than crashing the list.
    status: STATUSES.includes(dto.status as BillStatus) ? (dto.status as BillStatus) : 'pending',
  };
}

export function toBillSummary(dto: BillSummaryDto): BillSummary {
  return {
    totalOutstanding: parseMoney(dto.total_outstanding),
    availableCredit: parseMoney(dto.available_credit),
    unpaidCount: dto.unpaid_count,
    billCount: dto.bill_count,
  };
}

export function createApiBillsRepository(api: ApiClient): BillsRepository {
  return {
    list: async () => (await api.get<Wrapped<BillDto[]>>('/bills')).data.map(toBill),
    summary: async () => toBillSummary((await api.get<Wrapped<BillSummaryDto>>('/bills/summary')).data),
  };
}
