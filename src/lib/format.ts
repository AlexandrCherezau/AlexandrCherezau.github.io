const rub = new Intl.NumberFormat("ru-RU");

/** 1500 -> "1 500 ₽" with a non-breaking space before the currency sign. */
export function formatPrice(value: number): string {
  return `${rub.format(value)} ₽`;
}

/** Russian plural: plural(5, ["день", "дня", "дней"]) -> "дней". */
export function plural(n: number, forms: [string, string, string]): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return forms[1];
  return forms[2];
}

export function formatDays(n: number): string {
  return `${n} ${plural(n, ["день", "дня", "дней"])}`;
}
