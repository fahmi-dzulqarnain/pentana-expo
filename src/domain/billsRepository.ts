import type { Bill, BillSummary } from './bill';

/** The app depends on this interface; the API-backed implementation lives in `data/`. */
export interface BillsRepository {
  list(): Promise<Bill[]>;
  summary(): Promise<BillSummary>;
}
