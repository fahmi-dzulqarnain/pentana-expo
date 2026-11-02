// Money is held as integer sen (1/100 ringgit), so arithmetic never drifts the way floats do.
export type Sen = number;

/** Parses the API's fixed 2-dp string ("1234.50", "-20.00") into sen without going through a float. */
export function parseMoney(amount: string): Sen {
  const negative = amount.trim().startsWith('-');
  const [whole, fraction = ''] = amount.trim().replace(/^-/, '').split('.');
  if (!/^\d+$/.test(whole) || !/^\d{0,2}$/.test(fraction)) throw new Error(`Invalid money amount: "${amount}"`);
  const sen = Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
  return negative ? -sen : sen;
}

/** 123450 -> "RM 1,234.50" */
export function formatMoney(sen: Sen): string {
  const abs = Math.abs(sen);
  const whole = Math.floor(abs / 100)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const fraction = String(abs % 100).padStart(2, '0');
  return `${sen < 0 ? '-' : ''}RM ${whole}.${fraction}`;
}
