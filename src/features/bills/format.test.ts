import { formatMoney, formatMonth } from './format';

describe('formatMoney', () => {
  it.each([
    ['0.00', 'RM 0.00'],
    ['35.50', 'RM 35.50'],
    ['1234.5', 'RM 1,234.50'],
    ['1234567.89', 'RM 1,234,567.89'],
    ['-20.00', '-RM 20.00'],
  ])('formats %s as %s', (input, expected) => {
    expect(formatMoney(input)).toBe(expected);
  });
});

describe('formatMonth', () => {
  it('turns YYYY-MM into a month name and year', () => {
    expect(formatMonth('2026-10')).toMatch(/October 2026/);
  });
});
