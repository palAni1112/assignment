export function formatDate(value: string): string {
  const [year, month, day] = value.slice(0, 10).split("-");

  return `${day}/${month}/${year}`;
}

export function formatTime(value: string): string {
  return value.slice(11, 16);
}
