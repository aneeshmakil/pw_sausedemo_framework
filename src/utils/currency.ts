export function currencyToCents(value: string): number {
  const amount = value.match(/\$(\d+)\.(\d{2})/);
  if (amount?.[1] === undefined || amount[2] === undefined) {
    throw new Error(`Unexpected currency value: ${value}`);
  }
  return Number(amount[1]) * 100 + Number(amount[2]);
}
