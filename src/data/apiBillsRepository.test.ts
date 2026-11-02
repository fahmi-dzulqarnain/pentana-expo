import type { ApiClient } from '@/api/client';

import { type BillDto, createApiBillsRepository, toBill } from './apiBillsRepository';

const dto: BillDto = {
  id: 2,
  month: '2026-09',
  amount_due: '50.00',
  amount_paid: '20.00',
  outstanding: '30.00',
  status: 'partial',
};

describe('toBill', () => {
  it('maps the API payload to the domain model', () => {
    expect(toBill(dto)).toEqual({
      id: 2,
      month: { year: 2026, month: 9 },
      amountDue: 5000,
      amountPaid: 2000,
      outstanding: 3000,
      status: 'partial',
    });
  });

  it('treats an unknown status as pending instead of crashing', () => {
    expect(toBill({ ...dto, status: 'refunded' }).status).toBe('pending');
  });
});

describe('createApiBillsRepository', () => {
  it('reads both endpoints and unwraps Laravel’s data envelope', async () => {
    const get = jest.fn(async (path: string) =>
      path === '/bills'
        ? { data: [dto] }
        : { data: { total_outstanding: '80.00', available_credit: '10.00', unpaid_count: 2, bill_count: 4 } },
    );
    const repo = createApiBillsRepository({ get, post: jest.fn() } as unknown as ApiClient);

    await expect(repo.list()).resolves.toHaveLength(1);
    await expect(repo.summary()).resolves.toEqual({ totalOutstanding: 8000, availableCredit: 1000, unpaidCount: 2, billCount: 4 });
    expect(get).toHaveBeenCalledWith('/bills');
    expect(get).toHaveBeenCalledWith('/bills/summary');
  });
});
