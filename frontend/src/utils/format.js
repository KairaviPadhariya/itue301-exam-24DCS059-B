const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// "2026-11-05" -> "05 Nov 2026" (parsed from the string, so no timezone shift)
export function formatDate(value) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(value));
  if (m) return `${m[3]} ${MONTHS[Number(m[2]) - 1]} ${m[1]}`;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return `${String(d.getDate()).padStart(2, "0")} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

// 90 -> "1 h 30 min", 45 -> "45 min", 120 -> "2 h"
export function formatDuration(minutes) {
  const total = Number(minutes);
  const h = Math.floor(total / 60);
  const m = total % 60;
  const parts = [];
  if (h > 0) parts.push(`${h} h`);
  if (m > 0) parts.push(`${m} min`);
  return parts.length ? parts.join(" ") : "0 min";
}

// 100 -> "₹100.00", 0 -> "Free"
export function formatFee(fee) {
  return Number(fee) === 0 ? "Free" : `₹${Number(fee).toFixed(2)}`;
}

// always ₹ with two decimals (used for payable amounts)
export function formatMoney(amount) {
  return `₹${Number(amount).toFixed(2)}`;
}
