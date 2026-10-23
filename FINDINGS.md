# FINDINGS

## T1 – Event Listing
- **What was wrong:** `EventsPage` passed `seats=` but `EventCard` reads `seatsLeft`, so seat status was always undefined. `EventCard` had `seatsLeft = 0` (assignment, not `===`), which overwrote the prop and made every card "Full". Date and duration used the unimplemented `format.js` stubs / raw "min". Cards were keyed by `title`, and two events are both called "Workshop" (duplicate-key React warning).
- **Why it mattered:** Wrong seat text on every card, dates not in `DD Mon YYYY`, durations like "90 min" instead of "1 h 30 min", and console warnings.
- **How I fixed it:** `EventsPage.jsx` now passes `seatsLeft` and uses `key={e.id}`. `EventCard.jsx` uses `seatsLeft === 0`. Implemented `formatDate`, `formatDuration`, `formatFee` in `utils/format.js` and used them in the card.

## T2 – Registration
- **What was wrong:** `NavBar` linked to `/registration` but the route is `/register`. `register()` mutated state with `regs.push` then `setRegs(regs)` (same reference, no re-render). No validation, seat, or limit checks; select value became a string so `find` by number id failed; no fee, discount, seats left, total, or cancel; list keyed by index.
- **Why it mattered:** The Register link showed nothing, registrations didn't appear reliably, and none of the rules (full event, 3 per email, 20% discount) were enforced.
- **How I fixed it:** Fixed the link to `/register`. Rewrote `RegisterPage.jsx` with immutable state updates, `Number()` on the select value, validation messages, seats-left = event seats minus this page's registrations, 3-per-email limit (case-insensitive), 80% fee for `@charusat.edu.in`, per-registration payable, "Seats left", "Total payable" and a Cancel button using stable ids.

## T3 – Organisers
- **What was wrong:** `fetch` ran in the component body on every render (infinite request loop). The first `.then` didn't `return res.json()`, so data was undefined. Errors were stored but never displayed, no Retry, no sort, no count.
- **Why it mattered:** Repeated network calls, a crash on `data.map`, and no error handling.
- **How I fixed it:** Moved the request into `useEffect` (runs once, with abort cleanup) via a `load` function using async/await with try/catch and a `res.ok` check. Added the error message + Retry button, case-insensitive A–Z sort, and the "<n> organisers" count.

## T4 – Events Service
- **What was wrong:** The error handler was registered before the routes so it never caught their errors (the `/boom` route fell to Express's default HTML/stack response). GET by id compared a number to a string param. POST rejected when a title *was* present (inverted check) and had no title/capacity/fee validation. `maxFee` filter and DELETE were missing.
- **Why it mattered:** Wrong status codes, leaked stack traces, invalid data accepted, and missing endpoints.
- **How I fixed it:** Moved the error handler after all routes (plus a 400 for malformed JSON). Parsed ids with `Number`. Added proper POST validation (trimmed title 1–80, integer capacity 1–500, fee ≥ 0 default 0), `?maxFee` filtering, and DELETE with 404s — all in `backend/app.js`.

## T5 – Event Data
- **What was wrong:** `Event.js` had `require` instead of `required` on title, `date` typed as String (so "banana" was accepted), and `createdAt: Date.now()` (called once at startup so all events shared one timestamp). `formatValidationError` returned the raw error, and `seed.js` was a TODO.
- **Why it mattered:** Blank titles and fake dates saved, wrong timestamps, internal Mongoose error leaked to clients, no seed evidence.
- **How I fixed it:** Fixed `required`, set `date` to type `Date`, used `default: Date.now` (function reference). `formatValidationError` in `utils/formatError.js` maps `err.errors` to `{ error: "Validation failed", details: [{ field, message }] }`. `seed.js` saves one valid event and prints the formatted error for an invalid one. Screenshot saved as `evidence/db.png`.

## Backend startup and seed
- I found that `server.js` did not load `backend/.env`, so the server ignored its configured port. I now load it directly, listen on port 5001 by default, log port conflicts, expose `GET /`, and enable CORS.
- I found that the seed only showed the inserted object without reading it back. I now print its database, collection, and id, then fetch it again. `db.js` loads the backend environment file from any working directory, selects `eventhub` when the URI has no database, and explains common connection failures.
