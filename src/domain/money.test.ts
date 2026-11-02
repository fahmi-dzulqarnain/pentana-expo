import { formatMoney, parseMoney } from './money';

describe('parseMoney', () => {
  it.each([
    ['0.00', 0],
    ['35.50', 3550],
    ['1234.5', 123450],
    ['1234567.89', 123456789],
    ['-20.00', -2000],
    ['7', 700],
  ])('parses %s as %i sen', (input, sen) => {
    expect(parseMoney(input)).toBe(sen);
  });

  it('keeps amounts exact where floats drift', () => {
    // 0.1 + 0.2 !== 0.3 in floating point; in sen it adds up.
    expect(parseMoney('0.10') + parseMoney('0.20')).toBe(parseMoney('0.30'));
  });

  it.each(['abc', '1.234', '', '1,000.00'])('rejects %p', input => {
    expect(() => parseMoney(input)).toThrow('Invalid money amount');
  });
});

describe('formatMoney', () => {
  it.each([
    [0, 'RM 0.00'],
    [3550, 'RM 35.50'],
    [123456789, 'RM 1,234,567.89'],
    [-2000, '-RM 20.00'],
  ])('formats %i sen as %s', (sen, expected) => {
    expect(formatMoney(sen)).toBe(expected);
  });
});
