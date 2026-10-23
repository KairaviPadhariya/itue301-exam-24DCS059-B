import { formatDate, formatDuration, formatFee } from "../utils/format";

export default function EventCard({ title, date, category, seatsLeft, fee, durationMin }) {
  const isFull = seatsLeft === 0;
  return (
    <div className={`card cat-${category}`}>
      <h3>{title}</h3>
      <span className="chip">{category}</span>
      <p className="meta">{formatDate(date)} · {formatDuration(durationMin)}</p>
      <p className="fee">{formatFee(fee)}</p>
      <p className={`badge ${isFull ? "full" : ""}`}>{isFull ? "Full" : `${seatsLeft} seats left`}</p>
    </div>
  );
}
