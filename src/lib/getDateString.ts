export function getDateString(date: Date | null) {
  if (!date) return "Never";
  return date.toDateString();
}
