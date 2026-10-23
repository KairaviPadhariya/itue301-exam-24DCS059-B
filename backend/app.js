const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());

// Request logger: [METHOD] [PATH] [TIMESTAMP]
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.path} [${new Date().toISOString()}]`);
  next();
});
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ status: "ok" });
});

let events = [
  { id: 1, title: "Hack Night", capacity: 30, fee: 100 },
  { id: 2, title: "Open Mic", capacity: 50, fee: 0 },
  { id: 3, title: "Robotics Expo", capacity: 80, fee: 250 },
];
let nextId = 4;

const findIndexById = (raw) => {
  const id = Number(raw);
  return events.findIndex((e) => e.id === id);
};

app.get("/api/v1/events", (req, res) => {
  const { maxFee } = req.query;
  if (maxFee === undefined) return res.status(200).json(events);
  const limit = Number(maxFee);
  if (maxFee === "" || Number.isNaN(limit)) {
    return res.status(400).json({ error: "maxFee must be a number" });
  }
  res.status(200).json(events.filter((e) => e.fee <= limit));
});

app.get("/api/v1/events/:id", (req, res) => {
  const i = findIndexById(req.params.id);
  if (i === -1) return res.status(404).json({ error: "Event not found" });
  res.status(200).json(events[i]);
});

app.post("/api/v1/events", (req, res) => {
  const body = req.body || {};
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const { capacity } = body;
  const fee = body.fee === undefined ? 0 : body.fee;

  if (title.length < 1 || title.length > 80) {
    return res.status(400).json({ error: "title is required (1 to 80 characters)" });
  }
  if (typeof capacity !== "number" || !Number.isInteger(capacity) || capacity < 1 || capacity > 500) {
    return res.status(400).json({ error: "capacity must be a whole number from 1 to 500" });
  }
  if (typeof fee !== "number" || !Number.isFinite(fee) || fee < 0) {
    return res.status(400).json({ error: "fee must be a number, 0 or more" });
  }

  const event = { id: nextId++, title, capacity, fee };
  events.push(event);
  res.status(201).json(event);
});

app.delete("/api/v1/events/:id", (req, res) => {
  const i = findIndexById(req.params.id);
  if (i === -1) return res.status(404).json({ error: "Event not found" });
  const [removed] = events.splice(i, 1);
  res.status(200).json(removed);
});

// Diagnostic route used to test the error handler. Leave it in place.
app.get("/api/v1/boom", () => {
  throw new Error("Stage collapsed");
});

// Global error handler - must be registered AFTER all routes
app.use((err, req, res, next) => {
  if (err && err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Invalid JSON body" });
  }
  console.error(err.message);
  res.status(500).json({ error: "Something went wrong" });
});

module.exports = app;
