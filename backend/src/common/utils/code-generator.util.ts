export function generateSetorCode(counter: number): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); //untuk memastika 2 digit
  const num = String(counter).padStart(4, '0');
  return `STR-${year}${month}-${num}`;
}

export function generatePenukaranCode(counter: number): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const num = String(counter).padStart(4, '0');
  return `TKR-${year}${month}-${num}`;
}

export function generateVoucherCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let part1 = '';
  let part2 = '';
  for (let i = 0; i < 4; i++) {
    part1 += chars.charAt(Math.floor(Math.random() * chars.length));
    part2 += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `VCR-${part1}-${part2}`;
}
