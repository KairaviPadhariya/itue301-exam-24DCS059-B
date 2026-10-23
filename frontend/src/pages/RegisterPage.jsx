import { useState } from "react";
import { events } from "../data/events";
import { formatDate, formatMoney } from "../utils/format";

const MAX_PER_EMAIL = 3;
const DISCOUNT_DOMAIN = "@charusat.edu.in";

const feeFor = (email, fee) =>
  email.trim().toLowerCase().endsWith(DISCOUNT_DOMAIN) ? fee * 0.8 : fee;

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [eventId, setEventId] = useState(events[0].id);
  const [regs, setRegs] = useState([]);
  const [message, setMessage] = useState("");

  const eventOf = (id) => events.find((e) => e.id === id);
  const seatsLeftFor = (id) =>
    eventOf(id).seatsLeft - regs.filter((r) => r.eventId === id).length;

  const register = () => {
    const cleanName = name.trim();
    const cleanEmail = email.trim();
    if (!cleanName || !cleanEmail) {
      setMessage("Name and email are required");
      return;
    }
    if (seatsLeftFor(eventId) <= 0) {
      setMessage("Event is full");
      return;
    }
    const used = regs.filter((r) => r.email.toLowerCase() === cleanEmail.toLowerCase()).length;
    if (used >= MAX_PER_EMAIL) {
      setMessage("Limit of 3 registrations reached");
      return;
    }
    const ev = eventOf(eventId);
    setRegs((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), name: cleanName, email: cleanEmail, eventId, payable: feeFor(cleanEmail, ev.fee) },
    ]);
    setName("");
    setEmail("");
    setMessage("");
  };

  const cancel = (id) => setRegs((prev) => prev.filter((r) => r.id !== id));

  const total = regs.reduce((sum, r) => sum + r.payable, 0);

  return (
    <main>
      <h2>Register for an Event</h2>
      <div className="form">
      <input placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
      <input placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <select value={eventId} onChange={(e) => setEventId(Number(e.target.value))}>
        {events.map((e) => (<option key={e.id} value={e.id}>{e.title} ({formatDate(e.date)})</option>))}
      </select>
      <button className="primary" onClick={register}>Register</button>
      </div>

      {message && <p role="alert" className="error">{message}</p>}
      <p className="seats">Seats left: {seatsLeftFor(eventId)}</p>

      <h3>My registrations ({regs.length})</h3>
      <ul>
        {regs.map((r) => (
          <li key={r.id}>
            {r.name} — {eventOf(r.eventId).title} — {formatMoney(r.payable)}{" "}
            <button className="ghost" onClick={() => cancel(r.id)}>Cancel</button>
          </li>
        ))}
      </ul>
      <p className="total">Total payable: {formatMoney(total)}</p>
    </main>
  );
}
